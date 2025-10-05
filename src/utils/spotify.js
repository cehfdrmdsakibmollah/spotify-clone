// src/utils/spotify.js
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || window.location.origin + '/';
const scope = "user-top-read user-library-read playlist-read-private";
// DEBUG: show everything import.meta.env exposes (remove after debugging)
console.info("import.meta.env keys:", Object.keys(import.meta.env || {}));
console.info("import.meta.env (sample):", {
    VITE_SPOTIFY_CLIENT_ID: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    VITE_SPOTIFY_REDIRECT_URI: import.meta.env.VITE_SPOTIFY_REDIRECT_URI
});
if (!clientId) {
    console.error(
        "VITE_SPOTIFY_CLIENT_ID is not set. Ensure .env.local exists at project root, contains VITE_SPOTIFY_CLIENT_ID and restart the dev server."
    );
    // do not throw here so you can inspect import.meta.env in the console;
    // initAuth will still fail later if clientId is missing.
}

function generateRandomString(length = 128) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

export async function initAuth() {
    const stored = localStorage.getItem("spotify_access_token");
    if (stored) {
        return stored;
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
        // start auth
        const verifier = generateRandomString(128);
        const challenge = await generateCodeChallenge(verifier);
        localStorage.setItem("spotify_code_verifier", verifier);

        const authUrl = new URL("https://accounts.spotify.com/authorize");
        authUrl.searchParams.append("client_id", clientId);
        authUrl.searchParams.append("response_type", "code");
        authUrl.searchParams.append("redirect_uri", redirectUri);
        authUrl.searchParams.append("scope", scope);
        authUrl.searchParams.append("code_challenge_method", "S256");
        authUrl.searchParams.append("code_challenge", challenge);

        window.location.href = authUrl.toString();
        return;
    }

    const verifier = localStorage.getItem("spotify_code_verifier");
    const body = new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        code_verifier: verifier,
    });

    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
    });
    if (!res.ok) {
        throw new Error("Token exchange failed");
    }
    const data = await res.json();
    localStorage.setItem("spotify_access_token", data.access_token);
    if (data.expires_in) {
        const expiry = Date.now() + data.expires_in * 1000;
        localStorage.setItem("spotify_token_expires_at", expiry.toString());
    }
    window.history.replaceState({}, document.title, "/");
    return data.access_token;
}

function isTokenExpired() {
    const exp = localStorage.getItem("spotify_token_expires_at");
    if (!exp) return true;
    return Date.now() > Number(exp);
}

export async function fetchWebApi(endpoint, method = "GET", body) {
    const token = localStorage.getItem("spotify_access_token");
    if (!token || isTokenExpired()) {
        localStorage.removeItem("spotify_access_token");
        localStorage.removeItem("spotify_code_verifier");
        localStorage.removeItem("spotify_token_expires_at");
        throw new Error("No valid token, re-authenticate");
    }

    const headers = { Authorization: `Bearer ${token}` };
    if (body && method !== "GET") {
        headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
        method,
        headers,
        body: body && method !== "GET" ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Spotify API error ${res.status}: ${txt}`);
    }
    return res.json();
}

export async function getTopTracks({ limit = 5 } = {}) {
    const data = await fetchWebApi(`me/top/tracks?limit=${limit}`, "GET");
    return data.items || [];
}
