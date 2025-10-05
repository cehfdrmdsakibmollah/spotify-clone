import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function PlaylistCard({ p }) {
  return (
    <Link to={`/playlist/${p.id}`}>
      <motion.div whileHover={{ y:-6 }} className="p-4 rounded-lg card-glass">
        <img src={p.cover} alt={p.name} className="w-full h-36 object-cover rounded mb-3" />
        <div className="font-semibold">{p.name}</div>
        <div className="text-sm text-gray-400">{p.description}</div>
      </motion.div>
    </Link>
  );
}
