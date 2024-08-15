"use client";

import { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { VscDebugRestart } from "react-icons/vsc";

const AudioPlayer = ({ meditationAudio, backgroundAudio }) => {
  const meditationRef = useRef(null);
  const backgroundRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (backgroundRef.current) {
      backgroundRef.current.volume = 0.8;
      backgroundRef.current.loop = true;
    }
  }, []);

  const togglePlayPause = () => {
    if (isPlaying) {
      meditationRef.current.pause();
      backgroundRef.current.pause();
    } else {
      meditationRef.current.play();
      backgroundRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMeditationEnded = () => {
    fadeOutBackground();
    setIsPlaying(false);
  };

  const fadeOutBackground = () => {
    const fadeInterval = setInterval(() => {
      if (backgroundRef.current.volume > 0.02) {
        backgroundRef.current.volume -= 0.02;
      } else {
        clearInterval(fadeInterval);
        backgroundRef.current.pause();
        backgroundRef.current.currentTime = 0;
        backgroundRef.current.volume = 0.8;
      }
    }, 200);
  };

  const handleReset = () => {
    meditationRef.current.currentTime = 0;
    backgroundRef.current.currentTime = 0;
    backgroundRef.current.volume = 0.5;
    if (isPlaying) {
      meditationRef.current.play();
      backgroundRef.current.play();
    }
  };

  return (
    <div className="card bg-neutral text-neutral-content w-96 my-5">
      <div className="card-body items-center text-center">
        <h2 className="card-title">Time To Meditate</h2>
        <p>Find a comfortable, quiet place to sit and begin your meditation.</p>
        <div className="card-actions justify-end">
          <audio
            ref={meditationRef}
            src={meditationAudio}
            onEnded={handleMeditationEnded}
          />
          <audio ref={backgroundRef} src={backgroundAudio} loop />
          <button
            onClick={handleReset}
            className="btn btn-primary btn-circle btn-outline mr-2"
          >
            <VscDebugRestart className="text-xl" />
          </button>
          <button
            onClick={togglePlayPause}
            className="btn btn-circle btn-primary"
          >
            {isPlaying ? (
              <FaPause className="text-xl" />
            ) : (
              <FaPlay className="text-xl ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
