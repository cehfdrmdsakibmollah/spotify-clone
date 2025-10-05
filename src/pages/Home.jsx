import React from "react";
import Topbar from "../components/Topbar";
import PlaylistCard from "../components/PlaylistCard";
import TrackCard from "../components/TrackCard";
import { playlists, songs } from "../data/mock";

export default function Home({ onPlay }) {
  return (
    <div className="p-6">
      <Topbar title="Home" />
      <section className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Made For You</h2>
        <div className="grid grid-cols-3 gap-4">
          {playlists.map(p => <PlaylistCard key={p.id} p={p} />)}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Trending</h2>
        <div className="space-y-3">
          {songs.map(s => <TrackCard key={s.id} track={s} onPlay={onPlay} />)}
        </div>
      </section>
    </div>
  );
}
