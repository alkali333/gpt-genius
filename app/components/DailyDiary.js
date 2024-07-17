"use client";
import DailyInputForm from "./DailyInputForm";

import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateMindState } from "../utils/about-me-actions";
import { useAuth } from "@clerk/nextjs";
import React, { useContext } from "react";
import { useUserData } from "/app/contexts/useDataContext"; // Adjust the import path as necessary

const DailyDiary = () => {
  const { userId, useUser } = useAuth();
  const { fetchUserData } = useUserData();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ clerkId, data, column }) => {
      const update = await updateMindState(clerkId, column, data);
      if (!update) {
        toast.error("Error generating chat response");
        return;
      } else {
        toast.success("Diary updated successfully");
      }

      return update;
    },
    onSuccess: () => {
      fetchUserData(); // Refresh the user data after successful update
    },
  });

  // const {data: dailySummary, error, isFetching} = useQuery({ queryKey: ['posts'],
  //   queryFn: async ({firstName, diaryInfo}) => {
  //     await fetchDailySummary(firstName, diaryInfo);
  //   }
  // });

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
    console.log("Submitted gratitude:", jsonData);
    mutate({ clerkId: userId, data: jsonData, column: "grateful_for" });
    // Do something with the input values
  };

  const handleSubmitToDo = (jsonData) => {
    console.log("Submitted to do:", jsonData);
    mutate({ clerkId: userId, data: jsonData, column: "current_tasks" });
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] grid grid-rows-[auto,1fr,auto] items-center">
      <div max-w-2xl>
        <p className="textPrimary">Daily message will go here</p>
      </div>
      <div className="max-w-2xl flex gap-5">
        <div className="w-1/2">
          <h1 className="text-primary text-2xl mb-3">
            Things I&apos;m grateful for...{" "}
          </h1>
          <DailyInputForm
            title="grateful for"
            inputs={gratitudeItems}
            onSubmit={handleSubmitGratitude}
          />
        </div>
        <div className="w-1/2">
          <h1 className="text-primary text-2xl mb-3">Things to do ...</h1>
          <DailyInputForm
            inputs={toDoItems}
            onSubmit={handleSubmitToDo}
            title="current tasks"
          />
        </div>
      </div>
      <div className="max-w-2xl">
        <p>Text here</p>
      </div>
    </div>
  );
};

export default DailyDiary;
