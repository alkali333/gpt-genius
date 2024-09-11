"use client";
import { useState, useEffect } from "react";
import { FaMoon } from "react-icons/fa";
import { FormContainer } from "/app/components/forms/FormContainer";
import { fetchUserJson } from "../../utils/server-actions";
import DiaryInputV2 from "/app/components/forms/DiaryInputV2";
import DetailDisplay from "../../components/DetailsDisplay";

import {
  insertDiaryEntry,
  generateMorningPracticeMessage,
} from "/app/utils/server-actions";

import Meditation from "/app/components/Meditation";

const EveningPracticePage = () => {
  const [journalComplete, setJournalComplete] = useState(false);
  const [userJson, setUserJson] = useState(null);
  const [encouragementMessage, setEncouragementMessage] = useState(null);

  const formsComplete = journalComplete;

  useEffect(() => {
    const getUserJson = async () => {
      const userJson = await fetchUserJson();
      setUserJson(userJson);
    };

    const getEncouragementMessage = async () => {
      //const message = await generateMorningPracticeMessage();
      const message = { data: "Message will go here... " };
      if (message.data) {
        setEncouragementMessage(message.data);
      } else {
        console.log("Error fetching encouragement message");
        setEncouragementMessage("");
      }
    };
    getEncouragementMessage();
    getUserJson();
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
          <h1 className="text-primary text-2xl ml-1">Morning Practice</h1>
        </div>
        <p className="text-secondary text-xl my-8">
          {userJson === null ? (
            <span className="loading loading-spinner loading-lg my-8"></span>
          ) : (
            <DetailDisplay type={type} data={typeJson["hopes and dreams"]} />
          )}
        </p>
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
        <FormContainer
          action={insertDiaryEntry}
          className="flex w-full items-center"
          onComplete={setJournalComplete}
        >
          <DiaryInputV2 words={100} type="morning" />
        </FormContainer>
      </div>
    </div>
  );
};

export default EveningPracticePage;
