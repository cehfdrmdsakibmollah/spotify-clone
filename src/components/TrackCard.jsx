import React from "react";
import { motion } from "framer-motion";

export default function TrackCard({ track, onPlay }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-4 p-3 rounded-lg card-glass cursor-pointer" onClick={()=>onPlay(track)}>
      <img src={track.cover} alt="" className="w-14 h-14 rounded object-cover" />
      <div className="flex-1">
        <div className="font-medium">{track.title}</div>
        <div className="text-sm text-gray-300">{track.artist}</div>
      </div>
      <div className="text-sm text-gray-300">▶</div>
    </motion.div>
  );
}
