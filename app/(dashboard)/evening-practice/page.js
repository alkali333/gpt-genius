"use client";
import { useEffect, useState } from "react";

import { useUserData } from "/app/contexts/useDataContext";
import { FormContainer } from "../../components/forms/FormContainer";
import { DiaryInput } from "../../components/forms/DiaryInput";
import MyInfo from "../../components/pages/MyInfo";
import { insertDiaryEntry } from "../../utils/about-me-actions";

import MissingDetails from "../../components/messages/MissingDetails";

const EveningPractice = () => {
  const { userData } = useUserData();

  // used to make sure userData is fully loaded
  const [isLoading, setIsLoading] = useState(true);

  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (userData) {
      setIsLoading(false);
    }
  }, [userData]);

  return (
    <div className="min-h-[calc(100vh-6rem)] grid grid-rows-[1fr,auto] max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-primary">
          Evening practice: hopes and dreams journalling
        </h2>
        {isLoading ? (
          <span className="loading loading-spinner loading-lg"></span>
        ) : (
          <MyInfo
            userData={userData}
            details={"hopes and dreams"}
            compact={true}
          />
        )}
        <p className="text-lg mt-8 text-secondary">
          Write at least 150 words about what you did today in relation to your
          hopes and dreams. Did you make progress towards all or some of them?
          Or did you procrastinate? Is there anything you could have done
          differently?
        </p>
      </div>
      <div>
        {!isComplete ? (
          <FormContainer
            action={insertDiaryEntry}
            className="flex w-full items-center"
            onComplete={setIsComplete}
          >
            <DiaryInput words={150} />
          </FormContainer>
        ) : (
          <p>Meditation unlocked! (meditation will appear here)</p>
        )}
      </div>
    </div>
  );
};

export default EveningPractice;
