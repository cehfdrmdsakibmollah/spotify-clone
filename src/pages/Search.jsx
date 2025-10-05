import React, { useState } from "react";
import Topbar from "../components/Topbar";
import TrackCard from "../components/TrackCard";
import { songs } from "../data/mock";

export default function Search({ onPlay }) {
  const [q, setQ] = useState("");
  const results = songs.filter(s => s.title.toLowerCase().includes(q.toLowerCase()) || s.artist.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="p-6">
      <Topbar title="Search" />
      <div className="mt-4">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search for songs, artists..." className="w-full p-3 rounded-md bg-[#0b0b0b] border border-white/6" />
      </div>

      <div className="mt-6 space-y-3">
        {results.map(s => <TrackCard key={s.id} track={s} onPlay={onPlay} />)}
      </div>
    </div>
  );
}
