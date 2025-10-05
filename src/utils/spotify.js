const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || window.location.origin;
const SCOPES = "user-top-read";

function randomString(len = 64) {
    const arr = new Uint8Array(len);
    crypto.getRandomValues(arr);
    return Array.from(arr, b => ("00" + b.toString(16)).slice(-2)).join("");
}

async function sha256(text) {
    const data = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return new Uint8Array(hash);
}

function base64UrlEncode(bytes) {
    let s = btoa(String.fromCharCode(...bytes));
    return s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function createCodeChallenge(verifier) {
    const hashed = await sha256(verifier);
    return base64UrlEncode(hashed);
}

export async function redirectToAuth() {
    if (!CLIENT_ID) throw new Error("VITE_SPOTIFY_CLIENT_ID not set");
    const verifier = randomString(64);
    const challenge = await createCodeChallenge(verifier);
    sessionStorage.setItem("spotify_code_verifier", verifier);
    const state = randomString(16);
    const params = new URLSearchParams({
        response_type: "code",
        client_id: CLIENT_ID,
        scope: SCOPES,
        redirect_uri: REDIRECT_URI,
        state,
        code_challenge_method: "S256",
        code_challenge: challenge
    });
    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

async function exchangeCodeForToken(code, code_verifier) {
    const body = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        code_verifier
    });
    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString()
    });
    if (!res.ok) throw new Error("Token exchange failed");
    const data = await res.json();
    const expiry = Date.now() + (data.expires_in || 3600) * 1000;
    sessionStorage.setItem("spotify_token", JSON.stringify({ ...data, expiry }));
    return data;
}

async function refreshToken(refresh_token) {
    const body = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token,
        client_id: CLIENT_ID
    });
    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString()
    });
    if (!res.ok) throw new Error("Refresh token failed");
    const data = await res.json();
    const stored = JSON.parse(sessionStorage.getItem("spotify_token") || "{}");
    const expiry = Date.now() + (data.expires_in || 3600) * 1000;
    const merged = { ...stored, ...data, expiry };
    sessionStorage.setItem("spotify_token", JSON.stringify(merged));
    return merged;
}

export async function handleRedirectCallback() {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (!code) return null;
    const verifier = sessionStorage.getItem("spotify_code_verifier");
    if (!verifier) throw new Error("Missing code verifier");
    const tokenData = await exchangeCodeForToken(code, verifier);
    url.searchParams.delete("code");
    url.searchParams.delete("state");
    window.history.replaceState({}, "", url.pathname + url.search);
    return tokenData;
}

function getStoredToken() {
    const raw = sessionStorage.getItem("spotify_token");
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
}

export async function getAccessToken() {
    const t = getStoredToken();
    if (!t) return null;
    if (t.expiry && Date.now() > t.expiry - 60000) {
        if (t.refresh_token) {
            const refreshed = await refreshToken(t.refresh_token);
            return refreshed.access_token;
        }
        return null;
    }
    return t.access_token;
}

export async function initAuth() {
    await handleRedirectCallback().catch(() => { });
    const token = await getAccessToken();
    if (!token) await redirectToAuth();
    return token;
}

export async function fetchWebApi(endpoint, method = "GET", body = null) {
    const token = await getAccessToken();
    if (!token) throw new Error("No Spotify token, call initAuth() first");
    const res = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": body ? "application/json" : undefined
        },
        body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Spotify API error");
    }
    return res.json();
}

export async function getTopTracks({ time_range = "long_term", limit = 5 } = {}) {
    const data = await fetchWebApi(`me/top/tracks?time_range=${time_range}&limit=${limit}`);
    return data.items || [];
}