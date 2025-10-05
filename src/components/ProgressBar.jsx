import React from "react";

const ProgressBar = ({ currentTime, duration, onSeek }) => {
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleChange = (e) => {
    onSeek(Number(e.target.value));
  };

  return (
    <div className="mt-4">
      <input
        type="range"
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={handleChange}
        className="w-full accent-indigo-500 cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
