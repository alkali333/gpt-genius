"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useUserData } from "/app/contexts/useDataContext";
import AudioPlayer from "./AudioPlayer";
import { generateMeditation } from "/app/utils/about-me-actions";
import { MissingDetails } from "./MissingDetails";

const Meditation = () => {
  const { userData } = useUserData();
  const [meditation, setMeditation] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: async (userInfo) => {
      const meditationResponse = await generateMeditation(
        "spiritual life coach",
        userInfo,
        "a meditation / visualisation"
      );
      if (!meditationResponse) {
        toast.error("Error generating meditation");
        return;
      }
      setMeditation(meditationResponse);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(JSON.stringify(userData));
  };

  if (!userData) {
    return (
      <MissingDetails>
        You need to complete the journaling exercises before you can access the
        meditations.
      </MissingDetails>
    );
  }

  return (
    <div className="flex max-w-4xl">
      <div className="flex flex-col sm:flex-row max-w-4xl pt-12 gap-4 items-center">
        <div className="card bg-neutral text-neutral-content w-96">
          <div className="card-body items-center text-center">
            <h2 className="card-title">Morning Meditation</h2>
            <p>Do this short meditation first thing in the morning</p>
            <div className="card-actions justify-end">
              {!meditation && !isPending ? (
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Load Meditation
                </button>
              ) : isPending ? (
                <span className="loading loading-spinner loading-lg text-primary"></span>
              ) : (
                <AudioPlayer audioSrc="/ave-maria.mp3" />
              )}
            </div>
          </div>
        </div>
      </div>
      <p>
        {isPending ? (
          <span className="loading loading-spinner loading-lg text-primary"></span>
        ) : (
          meditation
        )}
      </p>
    </div>
  );
};

export default Meditation;
