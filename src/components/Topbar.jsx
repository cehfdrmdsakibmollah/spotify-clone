import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Topbar({ title="Browse" }) {
  return (
    <motion.header initial={{ y:-10, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ duration:0.4 }} className="flex items-center justify-between p-4 bg-transparent border-b border-white/6">
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="flex items-center gap-3">
        <button className="px-3 py-1 rounded-full bg-white text-black text-sm font-semibold">Upgrade</button>
        <FaUserCircle className="text-3xl text-gray-300" />
      </div>
    </motion.header>
  );
}
