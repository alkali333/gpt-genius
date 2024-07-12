"use client";

import { useState, useRef } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

const AudioPlayer = ({ audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <audio ref={audioRef} src={audioSrc} />
      <button
        onClick={togglePlayPause}
        className="w-10 h-10 rounded-full bg-primary flex items-center justify-center focus:outline-none"
      >
        {isPlaying ? (
          <FaPause className="text-gray-800" />
        ) : (
          <FaPlay className="text-gray-800 ml-0.5" />
        )}
      </button>
    </div>
  );
};

export default AudioPlayer;
