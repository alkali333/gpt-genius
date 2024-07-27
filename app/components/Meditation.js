"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { marked } from "marked";

import { useUserData } from "/app/contexts/useDataContext";
import { generateMeditationDummy } from "/app/utils/about-me-actions";
import { MissingDetails } from "./messages/MissingDetails";

const Meditation = () => {
  const { userData } = useUserData();
  const [meditation, setMeditation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadMeditation = async () => {
      if (userData) {
        setIsLoading(true);
        try {
          const meditationResponse = await generateMeditationDummy(
            "spiritual life coach",
            JSON.stringify(userData),
            "a meditation / visualisation"
          );
          if (!meditationResponse) {
            toast.error("Error generating meditation");
            return;
          }
          setMeditation(meditationResponse);
        } catch (error) {
          toast.error("Error generating meditation");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadMeditation();
  }, [userData]);

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
      {isLoading ? (
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
