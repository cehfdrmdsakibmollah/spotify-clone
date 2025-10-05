import React from "react";

const Playlist = ({ songs, current, onSelect }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-4 w-full md:w-1/3 h-[500px] overflow-y-auto shadow-xl">
      <h2 className="text-xl font-semibold mb-4 text-center">🎶 Playlist</h2>

      {songs.map((song, index) => (
        <div
          key={song.id}
          onClick={() => onSelect(index)}
          className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all ${
            index === current
              ? "bg-indigo-600 text-white"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          <img
            src={song.cover}
            alt={song.title}
            className="w-14 h-14 rounded-md object-cover"
          />
          <div>
            <p className="font-medium">{song.title}</p>
            <p className="text-sm text-gray-300">{song.artist}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Playlist;
