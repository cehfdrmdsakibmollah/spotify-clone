import React from "react";
import Topbar from "../components/Topbar";
import { useParams } from "react-router-dom";
import { playlists, songs } from "../data/mock";
import TrackCard from "../components/TrackCard";

export default function PlaylistPage({ onPlay }) {
  const { id } = useParams();
  const p = playlists.find(x => x.id === id);
  if (!p) return <div className="p-6">Playlist not found</div>;
  const tracks = p.tracks.map(tid => songs.find(s => s.id === tid));

  return (
    <div className="p-6">
      <Topbar title={p.name} />
      <div className="mt-6 flex gap-6 items-center">
        <img src={p.cover} alt="" className="w-44 h-44 object-cover rounded" />
        <div>
          <h1 className="text-3xl font-bold">{p.name}</h1>
          <p className="text-gray-400 mt-2">{p.description}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {tracks.map(t => <TrackCard key={t.id} track={t} onPlay={onPlay} />)}
      </div>
    </div>
  );
}
