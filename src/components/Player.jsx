import React, { useRef, useState, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaList,
  FaRandom,
  FaRedo,
} from "react-icons/fa";
import { songs } from "../data/songs";
import Playlist from "./Playlist";
import ProgressBar from "./ProgressBar";

const Player = () => {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const audioRef = useRef(null);

  // play/pause
  const handlePlayPause = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  // next/prev
  const handleNext = () => {
    if (shuffle) {
      setCurrent(Math.floor(Math.random() * songs.length));
    } else {
      setCurrent((prev) => (prev + 1) % songs.length);
    }
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? songs.length - 1 : prev - 1));
    setIsPlaying(true);
  };

  // seek
  const handleSeek = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // song selection
  const handleSelectSong = (index) => {
    setCurrent(index);
    setIsPlaying(true);
  };

  // audio events
  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration);
    const handleEnd = () => {
      if (repeat) audio.play();
      else handleNext();
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setAudioDuration);
    audio.addEventListener("ended", handleEnd);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
      audio.removeEventListener("ended", handleEnd);
    };
  }, [repeat]);

  useEffect(() => {
    audioRef.current.load();
    if (isPlaying) audioRef.current.play();
  }, [current]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-white">
      {/* Main Player */}
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center relative">
        <img
          src={songs[current].cover}
          alt={songs[current].title}
          className={`rounded-xl w-full h-64 object-cover shadow-lg transition-transform duration-500 ${
            isPlaying ? "animate-spin-slow" : ""
          }`}
        />
        <h2 className="text-xl font-semibold mt-4">{songs[current].title}</h2>
        <p className="text-gray-400">{songs[current].artist}</p>

        <audio ref={audioRef} src={songs[current].src}></audio>

        {/* Progress Bar */}
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
        />

        <div className="flex justify-center items-center gap-6 mt-6">
          <button
            onClick={() => setShuffle(!shuffle)}
            className={`text-xl ${shuffle ? "text-indigo-500" : "text-gray-400"} hover:text-white`}
          >
            <FaRandom />
          </button>
          <button
            onClick={handlePrev}
            className="text-gray-400 hover:text-white text-2xl"
          >
            <FaStepBackward />
          </button>
          <button
            onClick={handlePlayPause}
            className="bg-indigo-500 hover:bg-indigo-600 text-white p-4 rounded-full text-2xl shadow-lg"
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button
            onClick={handleNext}
            className="text-gray-400 hover:text-white text-2xl"
          >
            <FaStepForward />
          </button>
          <button
            onClick={() => setRepeat(!repeat)}
            className={`text-xl ${repeat ? "text-indigo-500" : "text-gray-400"} hover:text-white`}
          >
            <FaRedo />
          </button>
        </div>

        {/* Playlist Toggle */}
        <button
          onClick={() => setShowPlaylist(!showPlaylist)}
          className="mt-6 flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium mx-auto transition-all"
        >
          <FaList />
          {showPlaylist ? "Hide Playlist" : "Show Playlist"}
        </button>
      </div>

      {/* Playlist (Toggle Show/Hide) */}
      {showPlaylist && (
        <div className="mt-8 w-full max-w-md transition-all duration-500">
          <Playlist songs={songs} current={current} onSelect={handleSelectSong} />
        </div>
      )}
    </div>
  );
};

export default Player;
