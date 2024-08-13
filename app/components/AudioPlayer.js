"use client";

import { useState, useRef } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { VscDebugRestart } from "react-icons/vsc";

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

  const toggleReset = () => {
    audioRef.current.toggleReset();
  };

  return (
    <div className="card bg-neutral text-neutral-content w-96 my-5">
      <div className="card-body items-center text-center">
        <h2 className="card-title">Time To Meditate</h2>
        <p>Find a comfortable, quiet place to sit and begin your meditation.</p>
        <div className="card-actions justify-end">
          <div>
            <audio ref={audioRef} src={audioSrc} />
            <button
              onClick={togglePlayPause}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center focus:outline-none"
            >
              {isPlaying ? (
                <FaPause className="text-gray-800 " />
              ) : (
                <FaPlay className="text-gray-800 ml-0.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
