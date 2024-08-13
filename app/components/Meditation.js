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
        toast.error("Failed to load meditation");
        return;
      }
      setMeditation(meditation.data);
    };

    loadMeditation();
  }, []);

  if (!userData) {
    return (
      <MissingDetails>
        You need to complete the journaling exercises before you can access the
        meditations.
      </MissingDetails>
    );
  }

  if (meditation == null) {
    return (
      <span className="loading loading-spinner loading-lg text-primary"></span>
    );
  }

  return <AudioPlayer audioSrc={meditation} />;
};

export default Meditation;
