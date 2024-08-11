"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { marked } from "marked";

import { fetchCoachingContent } from "../utils/server-actions";

import MissingDetails from "./messages/MissingDetails";
import { getRandomExercise } from "../utils/exercises";

const Meditation = () => {
  const [meditation, setMeditation] = useState(null);

  useEffect(() => {
    const loadMeditation = async () => {
      const meditation = await fetchCoachingContent(getRandomExercise());

      setMeditation(meditation.data);
      setIsLoading(false);
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

  const htmlMessage = marked(meditation);

  return (
    <p>
      {meditation == null ? (
        <span className="loading loading-spinner loading-lg text-primary"></span>
      ) : (
        <div
          className="prose prose-slate max-w-none text-sm"
          dangerouslySetInnerHTML={{ __html: htmlMessage }}
        />
      )}
    </p>
  );
};

export default Meditation;
