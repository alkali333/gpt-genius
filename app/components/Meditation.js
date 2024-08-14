"use client";
import { useState, useEffect } from "react";

import { generateMeditation } from "../utils/server-actions";

import { updateMeditationDiary } from "../utils/server-actions";
import { FormContainer } from "/app/components/forms/FormContainer";
import { DiaryInput } from "/app/components/forms/DiaryInput";
import AudioPlayer from "./AudioPlayer";

const Meditation = ({ useDiary = false, type = "" }) => {
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    const loadMeditation = async () => {
      const meditation = await generateMeditation(useDiary, type);

      if (!meditation || !meditation.data) {
        return;
      }
      setAudioUrl(meditation.data);
    };

    loadMeditation();
  }, [type, useDiary]);

  if (audioUrl == null) {
    return (
      <span className="loading loading-spinner loading-lg text-primary my-5"></span>
    );
  }

  return (
    <>
      <AudioPlayer
        meditationAudio={audioUrl}
        backgroundAudio={"/user-audio/background.mp3"}
      />
      <h2 className="text-primary text-2xl mb-7">
        If you like, record any insights from your meditation here
      </h2>
      <FormContainer
        action={updateMeditationDiary}
        className="flex w-full items-center"
        onComplete={setJournalComplete}
      >
        <DiaryInput words={100} />
      </FormContainer>
    </>
  );
};

export default Meditation;
