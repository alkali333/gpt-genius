"use client";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

import { updateMorningJournal } from "../../utils/server-actions";
import FormContainer from "../../components/forms/FormContainer";
import DailyInputFormV2 from "../../components/forms/DailyInputFormV2";

const MorningPracticePage = () => {
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

  const formsComplete = gratitudeComplete && toDoComplete;

  return (
    <div className=" grid grid-rows-[auto,1fr,auto] items-center">
      <div className="max-w-2xl">
        <h1 className="text-secondary text-2xl mb-3">Morning Practice</h1>
        <p>Daily Message Goes Here</p>
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
        </div>
      </div>
      <div className="mt-8">
        {formsComplete ? (
          <p>Meditation will go here</p>
        ) : (
          <p>Complete forms to access meditation</p>
        )}
      </div>
    </div>
  );
};

export default MorningPracticePage;
