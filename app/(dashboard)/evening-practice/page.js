"use client";
import { useState, useEffect } from "react";
import { FaMoon } from "react-icons/fa";
import { FormContainer } from "/app/components/forms/FormContainer";
import DiaryInputV2 from "/app/components/forms/DiaryInputV2";
import HopesAndDreamsRating from "/app/components/forms/HopesAndDreamsRating";
import {
  insertDiaryEntry,
  generateEveningPracticeMessage,
} from "/app/utils/server-actions";

import Meditation from "/app/components/Meditation";

const EveningPracticePage = () => {
  const [journalComplete, setJournalComplete] = useState(false);
  const [ratingComplete, setRatingComplete] = useState(false);
  const [encouragementMessage, setEncouragementMessage] = useState(null);

  const formsComplete = journalComplete && ratingComplete;

  useEffect(() => {
    const getEncouragementMessage = async () => {
      const message = await generateEveningPracticeMessage();
      if (message.data) {
        setEncouragementMessage(message.data);
      } else {
        console.log("Error fetching encouragement message");
        setEncouragementMessage("");
      }
    };
    getEncouragementMessage();
  }, []);

  if (formsComplete) {
    return (
      <>
        <h1 className="text-primary text-2xl mb-7">
          Evening meditation unlocked!
        </h1>
        <Meditation type="This is a meditation done in the evening, to wind down with optimism" />
      </>
    );
  }

  return (
    <div className="grid grid-rows-[1fr,auto] max-w-2xl">
      <div>
        <div className="flex items-center mb-3">
          <FaMoon className="text-white-500 text-2xl" />
          <h1 className="text-primary text-2xl ml-1">
            Evening Practice: Complete To Unlock Meditation
          </h1>
        </div>
        <p className="text-secondary text-xl my-8">
          Rate how well you progressed towards each of your hopes and dreams
          today.
        </p>
        <HopesAndDreamsRating setIsFinished={setRatingComplete} />
      </div>
      <div>
        {encouragementMessage === null ? (
          <span className="loading loading-spinner loading-lg my-8"></span>
        ) : (
          <div
            className="my-8 text-secondary prose prose-slate max-w-none text-xl"
            dangerouslySetInnerHTML={{ __html: encouragementMessage }}
          />
        )}
        <p className="text-secondary text-xl my-8">
          Write at least 100 words about your day, in relation to your above
          goals. What went well? What didn&apos;t go well? What can you do
          better tomorrow?
        </p>
        <FormContainer
          action={insertDiaryEntry}
          className="flex w-full items-center"
          onComplete={setJournalComplete}
        >
          <DiaryInputV2 words={100} />
        </FormContainer>
      </div>
    </div>
  );
};

export default EveningPracticePage;
