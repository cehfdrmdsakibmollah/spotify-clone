import React, { useState, useEffect } from "react";
import { initAuth, getTopTracks } from "./utils/spotify";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    if (!token) return;
    getTopTracks().then(setTracks);
  }, [token]);

  const handleLogin = async () => {
    await initAuth();
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <button
          onClick={handleLogin}
          className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-full font-semibold"
        >
          Login with Spotify
        </button>
      </div>
    );
  }

  return (
    <div className="text-white p-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Your Top Tracks 🎵</h1>
      <ul>
        {tracks.map((track) => (
          <li key={track.id}>
            {track.name} — {track.artists.map((a) => a.name).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}
