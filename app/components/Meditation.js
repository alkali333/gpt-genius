"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { marked } from "marked";

import { generateMeditation } from "../utils/server-actions";

import MissingDetails from "./messages/MissingDetails";
import AudioPlayer from "./AudioPlayer";

const Meditation = () => {
  const [meditation, setMeditation] = useState(null);

  useEffect(() => {
    const loadMeditation = async () => {
      const meditation = await generateMeditation();

      if (!meditation || !meditation.data) {
        return;
      }
      setMeditation(meditation.data);
    };

    loadMeditation();
  }, []);

  if (meditation == null) {
    return (
      <span className="loading loading-spinner loading-lg text-primary my-5"></span>
    );
  }

  return <AudioPlayer audioSrc={meditation} />;
};

export default Meditation;
