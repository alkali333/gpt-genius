"use client";
import { useQuery } from "@tanstack/react-query";
import { useUserData } from "/app/contexts/useDataContext";
import { getDailyMessage } from "/app/queries/dailyMessageQuery";
import { MissingDetails } from "/app/components/messages/MissingDetails";
import React from "react";

const DailyMessage = () => {
  const { userData, isLoading: dataIsLoading } = useUserData();

  const {
    data: message,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dailyMessage", userData],
    queryFn: getDailyMessage,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  if (isLoading || dataIsLoading)
    return <span className="loading loading-spinner loading-lg"></span>;

  if (!userData) {
    return (
      <MissingDetails>
        You need to complete the journaling exercises before accessing your
        info.
      </MissingDetails>
    );
  }

  if (error) return <div>Error loading message: {error.message}</div>;

  return (
    <div className="max-w-2xl">
      <p className="text-xl text-primary">{message}</p>
    </div>
  );
};

export default DailyMessage;
