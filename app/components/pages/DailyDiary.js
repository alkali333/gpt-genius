"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";

import { useUserData } from "/app/contexts/useDataContext"; // Adjust the import path as necessary

import DailyMessage from "/app/components/messages/DailyMessage";
import DailyInputForm from "/app/components/forms/DailyInputForm";

import { updateMindState } from "../../utils/about-me-actions";

const DailyDiary = () => {
  const [formsCompleted, setFormsCompleted] = useState(0);

  const queryClient = useQueryClient();

  const { fetchUserData } = useUserData();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ data, column }) => {
      const update = await updateMindState(column, data);
      if (!update) {
        toast.error("Error generating chat response");
        return;
      } else {
        toast.success("Diary updated successfully");
      }

      return update;
    },
    onSuccess: () => {
      fetchUserData();
      queryClient.invalidateQueries({ queryKey: ["dailyMessage"] });
      setFormsCompleted((prevFormsCompleted) => prevFormsCompleted + 1);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const gratitudeItems = [
    { name: "gratitude1", placeholder: "One" },
    { name: "gratitude2", placeholder: "Two" },
    { name: "gratitude3", placeholder: "Three" },
    { name: "gratitude4", placeholder: "Four" },
    { name: "gratitude5", placeholder: "Five" },
  ];

  const toDoItems = [
    { name: "gratitude1", placeholder: "One" },
    { name: "gratitude2", placeholder: "Two" },
    { name: "gratitude3", placeholder: "Three" },
    { name: "gratitude4", placeholder: "Four" },
    { name: "gratitude5", placeholder: "Five" },
  ];

  const handleSubmitGratitude = (jsonData) => {
    mutate({ data: jsonData, column: "grateful_for" });
  };

  const handleSubmitToDo = (jsonData) => {
    mutate({ data: jsonData, column: "current_tasks" });
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] grid grid-rows-[auto,1fr,auto] items-center">
      <div className="max-w-2xl">
        <h1 className="text-secondary text-2xl mb-3">Morning Practice</h1>
        {formsCompleted < 2 ? (
          <DailyMessage />
        ) : (
          <p>Thanks for recording your gratitude and task lists</p>
        )}
      </div>
      <div className="max-w-2xl flex gap-5">
        <div className="w-1/2">
          <h1 className="text-secondary text-xl mb-3">
            Things I&apos;m grateful for...{" "}
          </h1>
          <DailyInputForm
            title="grateful for"
            inputs={gratitudeItems}
            onSubmit={handleSubmitGratitude}
          />
        </div>
        <div className="w-1/2">
          <h1 className="text-secondary text-xl mb-3">Things to do ...</h1>
          <DailyInputForm
            inputs={toDoItems}
            onSubmit={handleSubmitToDo}
            title="current tasks"
          />
        </div>
      </div>
      <div>
        {formsCompleted >= 2 ? (
          <p>Meditation will go here</p>
        ) : (
          <p>Please complete the forms to unlock your morning meditation.</p>
        )}
      </div>
    </div>
  );
};

export default DailyDiary;
