"use client";
import { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import {
  updateMorningJournal,
  getLatestDiaryEntry,
  fetchCoachingContent,
} from "../../utils/server-actions";
import FormContainer from "/app/components/forms/FormContainer";
import DailyInputForm from "/app/components/forms/DailyInputForm";
import { FaSun } from "react-icons/fa";
import toast from "react-hot-toast";

const MorningPractice = () => {
  const gratitudeItems = [
    { name: "gratitude1", placeholder: "One" },
    { name: "gratitude2", placeholder: "Two" },
    { name: "gratitude3", placeholder: "Three" },
    { name: "gratitude4", placeholder: "Four" },
    { name: "gratitude5", placeholder: "Five" },
  ];

  const toDoItems = [
    { name: "todo1", placeholder: "One" },
    { name: "todo2", placeholder: "Two" },
    { name: "todo3", placeholder: "Three" },
    { name: "todo4", placeholder: "Four" },
    { name: "todo5", placeholder: "Five" },
  ];

  const [gratitudeComplete, setGratitudeComplete] = useState(false);
  const [toDoComplete, setToDoComplete] = useState(false);
  const [encouragementMessage, setEncouragementMessage] = useState(null);

  const formsComplete = gratitudeComplete && toDoComplete;

  useEffect(() => {
    const getEncouragementMessage = async () => {
      const tempEncouragementMessage =
        await fetchCoachingContent(`Based on the USER INFO. Write a short message
      (100 words) reminding them of their goals and the importance of their morning practice.
      Invite them to record their daily gratitude and task list. ONLY If there are existing task
      lists invite them to remember these and ask if they are still relevant.`);

      if (!tempEncouragementMessage.data && tempEncouragementMessage.message) {
        console.error(tempEncouragementMessage.message);
        toast.error(
          "Failed to load encouragement message: " +
            tempEncouragementMessage.message
        );
      } else {
        setEncouragementMessage(tempEncouragementMessage.data);
      }
    };
    getEncouragementMessage();
  }, []);

  return (
    <div className="grid grid-rows-[auto,1fr,auto] items-center">
      <div className="max-w-2xl">
        <div className="flex items-center mb-3">
          <FaSun className="text-yellow-500 text-2xl" />
          <h1 className="text-primary text-2xl ml-1">Morning Practice</h1>
        </div>
        {encouragementMessage === null ? (
          <span className="loading loading-spinner loading-lg"></span>
        ) : (
          <div
            className="my-8 text-secondary prose prose-slate max-w-none text-sm"
            dangerouslySetInnerHTML={{ __html: encouragementMessage }}
          />
        )}
      </div>
      <div className="max-w-2xl flex gap-5 mt-8">
        <div className="w-1/2">
          <h1 className="text-secondary text-xl mb-3">
            Things I&apos;m grateful for...{" "}
          </h1>
          <FormContainer
            action={updateMorningJournal}
            onComplete={setGratitudeComplete}
          >
            <DailyInputForm title="grateful for" inputs={gratitudeItems} />
          </FormContainer>
          {gratitudeComplete && (
            <FaCheckCircle className="text-green-500 text-2xl" />
          )}
        </div>
        <div className="w-1/2">
          <h1 className="text-secondary text-xl mb-3">Things to do ...</h1>
          <FormContainer
            action={updateMorningJournal}
            onComplete={setToDoComplete}
          >
            <DailyInputForm inputs={toDoItems} />
          </FormContainer>
          {toDoComplete && (
            <FaCheckCircle className="text-green-500 text-2xl" />
          )}
        </div>
      </div>
    </div>
  );
};
export default MorningPractice;
