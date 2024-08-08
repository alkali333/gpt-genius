"use client";
import { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { updateMorningJournal } from "../../utils/server-actions";
import FormContainer from "/app/components/forms/FormContainer";
import DailyInputFormV2 from "/app/components/forms/DailyInputFormV2";
import { FaSun } from "react-icons/fa";
import { useUser } from "@clerk/nextjs";

const MorningPractice = ({ morningMessage = "" }) => {
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

  const { user } = useUser();
  const formsComplete = gratitudeComplete && toDoComplete;

  useEffect(() => {
    if (user && toDoComplete && gratitudeComplete) {
      const updateMetadata = async () => {
        try {
          await clerkClient.users.updateUserMetadata(user.id, {
            publicMetadata: { hasProfile: true },
          });
          // Handle success
        } catch (error) {
          console.error("Failed to update metadata:", error);
        }
      };

      updateMetadata();
    }
  }, [user, toDoComplete, gratitudeComplete]);

  return (
    <div className="grid grid-rows-[auto,1fr,auto] items-center">
      <div className="max-w-2xl">
        <div className="flex">
          <FaSun className="text-yellow-500 text-2xl" />
          <h1 className="text-primary text-2xl mb-3">Morning Practice</h1>
        </div>
        {morningMessage ? (
          <div
            className="text-secondary prose prose-slate max-w-none text-sm"
            dangerouslySetInnerHTML={{ __html: morningMessage }}
          />
        ) : (
          <p>
            The morning practice is to fill out the two forms. List five things
            you are grateful for, and five tasks that will help you move towards
            your goas
          </p>
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
            <DailyInputFormV2 title="grateful for" inputs={gratitudeItems} />
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
            <DailyInputFormV2 inputs={toDoItems} />
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
