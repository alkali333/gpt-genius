"use client";
import { useState, useEffect } from "react";

import { FormContainer } from "/app/components/forms/FormContainer";
import { DiaryInput } from "/app/components/forms/DiaryInput";
import HopesAndDreamsRatingV2 from "/app/components/forms/HopesAndDreamsRatingV2";
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

  return (
    <div className="grid grid-rows-[1fr,auto] max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-primary">
          Rate how well you progressed towards each one today.
        </h2>
        <HopesAndDreamsRatingV2 setIsFinished={setRatingComplete} />
      </div>
      <div>
        {!formsComplete ? (
          <div className="my-8">
            {encouragementMessage === null ? (
              <span className="loading loading-spinner loading-lg"></span>
            ) : (
              <div
                className="text-secondary prose prose-slate max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: encouragementMessage }}
              />
            )}
            <FormContainer
              action={insertDiaryEntry}
              className="flex w-full items-center"
              onComplete={setJournalComplete}
            >
              <DiaryInput words={150} />
            </FormContainer>
          </div>
        ) : (
          <Meditation /> // Replace with Meditation component
        )}
      </div>
    </div>
  );
};

export default EveningPracticePage;
