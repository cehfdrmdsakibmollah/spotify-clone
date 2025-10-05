import React from "react";
import Topbar from "../components/Topbar";
import PlaylistCard from "../components/PlaylistCard";
import { playlists } from "../data/mock";

export default function Library() {
  return (
    <div className="p-6">
      <Topbar title="Your Library" />
      <div className="mt-6 grid grid-cols-3 gap-4">
        {playlists.map(p => <PlaylistCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}
