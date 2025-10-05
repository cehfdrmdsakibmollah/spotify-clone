import React, { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp } from "react-icons/fa";

export default function PlayerBar({ track, onNext, onPrev }) {
  const audioRef = useRef(new Audio(track?.src));
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(track?.duration || 0);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    const audio = audioRef.current;
    audio.src = track?.src || "";
    audio.volume = volume;
    const onLoaded = () => setDuration(Math.floor(audio.duration) || track?.duration || 0);
    const timeUpdate = () => setTime(Math.floor(audio.currentTime));
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", timeUpdate);
    audio.addEventListener("ended", onNext);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", timeUpdate);
      audio.removeEventListener("ended", onNext);
    };
  }, [track, volume, onNext]);

  useEffect(() => {
    const audio = audioRef.current;
    if (isPlaying) audio.play().catch(()=>{});
    else audio.pause();
  }, [isPlaying]);

  useEffect(() => {
    // when track changes, auto play
    setTime(0);
    setIsPlaying(true);
  }, [track]);

  const format = (s=0) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

  const handleSeek = (e) => {
    const val = Number(e.target.value);
    audioRef.current.currentTime = val;
    setTime(val);
  };

  return (
    <div className="fixed bottom-0 left-64 right-0 bg-[#071214]/80 backdrop-blur-md border-t border-white/6 p-3 flex items-center gap-4">
      <audio ref={audioRef} />
      <div className="flex items-center gap-3 w-1/3">
        <img src={track.cover} alt="" className="w-12 h-12 rounded object-cover" />
        <div>
          <div className="font-medium">{track.title}</div>
          <div className="text-sm text-gray-400">{track.artist}</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center">
        <div className="flex items-center gap-6">
          <button onClick={onPrev} className="text-gray-300 hover:text-white"><FaStepBackward/></button>
          <button onClick={()=>setIsPlaying(!isPlaying)} className="bg-white text-black rounded-full p-2 shadow">
            {isPlaying ? <FaPause/> : <FaPlay/>}
          </button>
          <button onClick={onNext} className="text-gray-300 hover:text-white"><FaStepForward/></button>
        </div>

        <div className="w-full max-w-2xl mt-2">
          <input type="range" min="0" max={duration || 0} value={time} onChange={handleSeek} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{format(time)}</span>
            <span>{format(duration)}</span>
          </div>
        </div>
      </div>

      <div className="w-1/4 flex items-center justify-end gap-4">
        <FaVolumeUp className="text-gray-300" />
        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e)=>{setVolume(Number(e.target.value)); audioRef.current.volume = Number(e.target.value);}} className="w-24"/>
      </div>
    </div>
  );
}
