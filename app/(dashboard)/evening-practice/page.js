"use client";
import { useState } from "react";

import { useUserData } from "/app/contexts/useDataContext";
import { FormContainer } from "/app/components/forms/FormContainer";
import { DiaryInput } from "/app/components/forms/DiaryInput";
import HopesAndDreamsRatingV2 from "/app/components/forms/HopesAndDreamsRatingV2";
import { insertDiaryEntry } from "/app/utils/server-actions";
import { MissingDetails } from "/app/components/messages/MissingDetails";
import Meditation from "/app/components/Meditation"; // Make sure this import is correct

const EveningPracticePage = () => {
  const { isLoading, userData } = useUserData();

  const [journalComplete, setJournalComplete] = useState(false);
  const [ratingComplete, setRatingComplete] = useState(false);

  const formsComplete = journalComplete && ratingComplete;

  if (isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  if (!userData) {
    return (
      <MissingDetails>
        You must complete the journalling exercise before you can do the evening
        practice
      </MissingDetails>
    );
  }

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
          <>
            <p className="text-lg mt-8 mb-8 text-secondary">
              Write at least 150 words about what you did today in relation to
              your hopes and dreams. Did you make progress towards all or some
              of them? Or did you procrastinate? Is there anything you could
              have done differently?
            </p>
            <FormContainer
              action={insertDiaryEntry}
              className="flex w-full items-center"
              onComplete={setJournalComplete}
            >
              <DiaryInput words={150} />
            </FormContainer>
          </>
        ) : (
          <Meditation /> // Replace with Meditation component
        )}
      </div>
    </div>
  );
};

export default EveningPracticePage;
