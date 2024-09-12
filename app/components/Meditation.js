"use client";
import { useState, useEffect } from "react";

import { generateMeditationText } from "../utils/server-actions";
import { synthesizeSpeech } from "../utils/text-to-speech";
import toast from "react-hot-toast";
import { updateMeditationDiary } from "../utils/server-actions";
import { FormContainer } from "/app/components/forms/FormContainer";
import { DiaryInput } from "/app/components/forms/DiaryInput";
import AudioPlayer from "./AudioPlayer";

const Meditation = ({ useDiary = false, type = null }) => {
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    const loadMeditation = async () => {
      const meditationText = await generateMeditationText(useDiary, type);

      if (!meditationText || !meditationText.data) {
        console.log("Error generating meditation text");
        return;
      }
      toast.success("Just a moment, I am preparing your meditation");
      const meditationAudio = await synthesizeSpeech(meditationText.data);
      if (!meditationAudio || !meditationAudio.data) {
        console.log("Error generating meditation audio");
        if (meditationAudio.message) {
          console.error(meditationAudio.message);
          toast.error(meditationAudio.message);
        }
        return;
      }
      setAudioUrl(meditationAudio.data);
    };

    loadMeditation();
  }, [type, useDiary]);

  if (audioUrl == null) {
    return (
      <span className="loading loading-spinner loading-lg text-primary my-5"></span>
    );
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] grid grid-rows-[1fr,auto] max-w-2xl">
      <div>
        <AudioPlayer
          meditationAudio={audioUrl}
          backgroundAudio={"/user-audio/background.mp3"}
        />
      </div>
      <div className="max-w-2xl">
        <h2 className="text-primary text-xl mb-7">
          If you like, record any insights from your meditation here
        </h2>

        <FormContainer
          action={updateMeditationDiary}
          className="flex w-full items-center"
        >
          <DiaryInput words={20} />
        </FormContainer>
      </div>
    </div>
  );
};

export default Meditation;
