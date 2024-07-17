// DailyMessage.jsx
"use client";
import { useQuery } from "@tanstack/react-query";
import { useUserData } from "/app/contexts/useDataContext";
import { getDailyMessage } from "../queries/dailyMessageQuery";
import { MissingDetails } from "/app/components/MissingDetails";
import React from "react";

const DailyMessage = () => {
  const { userData } = useUserData();
  const userName = userData ? Object.keys(userData)[0] : null;

  const {
    data: message,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dailyMessage", userName, userData],
    queryFn: getDailyMessage,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  if (!userData) {
    return (
      <MissingDetails>
        You need to complete the journaling exercises before accessing your
        info.
      </MissingDetails>
    );
  }
  if (isLoading) return <div>Loading daily message...</div>;
  if (error) return <div>Error loading message: {error.message}</div>;

  return (
    <div>
      <h2>Your Daily Message</h2>
      <p>{message}</p>
    </div>
  );
};

export default DailyMessage;
