"use client";
import { useState, useEffect } from "react";

import { generateMeditation } from "../utils/server-actions";

import AudioPlayer from "./AudioPlayer";

const Meditation = () => {
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    const loadMeditation = async () => {
      const meditation = await generateMeditation();

      if (!meditation || !meditation.data) {
        return;
      }
      setAudioUrl(meditation.data);
    };

    loadMeditation();
  }, []);

  if (audioUrl == null) {
    return (
      <span className="loading loading-spinner loading-lg text-primary my-5"></span>
    );
  }

  return (
    <AudioPlayer
      meditationAudio={audioUrl}
      backgroundAudio={"/user-audio/background.mp3"}
    />
  );
};

export default Meditation;
