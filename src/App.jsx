import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import PlayerBar from "./components/PlayerBar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Library from "./pages/Library";
import PlaylistPage from "./pages/PlaylistPage";
import { songs } from "./data/mock";

import { initAuth, getTopTracks } from "./utils/spotify";

export default function App() {
  const [currentTrack, setCurrentTrack] = useState(songs[0]);

  useEffect(() => {
    (async () => {
      try {
        await initAuth(); // will redirect to Spotify if no token; after authorize it returns here
        const top = await getTopTracks({ limit: 5 });
        console.log("Top tracks:", top.map(t => `${t.name} — ${t.artists.map(a => a.name).join(", ")}`));
      } catch (err) {
        console.error("Spotify init error:", err);
      }
    })();
  }, []);

  const onPlay = (track) => setCurrentTrack(track);
  const onNext = () => {
    const idx = songs.findIndex(s => s.id === currentTrack.id);
    setCurrentTrack(songs[(idx + 1) % songs.length]);
  };
  const onPrev = () => {
    const idx = songs.findIndex(s => s.id === currentTrack.id);
    setCurrentTrack(songs[(idx - 1 + songs.length) % songs.length]);
  };

  return (
    <BrowserRouter>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Home onPlay={onPlay} />} />
            <Route path="/search" element={<Search onPlay={onPlay} />} />
            <Route path="/library" element={<Library />} />
            <Route path="/playlist/:id" element={<PlaylistPage onPlay={onPlay} />} />
          </Routes>
        </main>
        <PlayerBar track={currentTrack} onNext={onNext} onPrev={onPrev} />
      </div>
    </BrowserRouter>
  );
}

// Remove these lines from your JSX file.
// Set environment variables in a .env file at your project root.
