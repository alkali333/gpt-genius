"use client";
import { useUserData } from "/app/contexts/useDataContext";
import { getWelcomeMessage } from "../queries/welcomeMessageQuery";
import MissingDetails from "/app/components/MissingDetails";
import { useQuery } from "@tanstack/react-query";

const WelcomeMessage = () => {
  const userData = useUserData();
  const {
    data: message,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["welcomeMessage", userData],
    queryFn: getWelcomeMessage,
    staleTime: 1000 * 60 * 60,
    enabled: !!userData, // Only run the query if userData exists
  });

  if (!userData) {
    return (
      <MissingDetails>
        You need to complete the journalling exercises before doing anything
        else.
      </MissingDetails>
    );
  }

  if (isLoading) {
    return <span className="loading loading-spinner loading-md"></span>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="max-w-2xl text-lg leading-loose">
      <h2 className="text-primary">Welcome To Attenshun</h2>
      <p className="text-secondary">{message}</p>
      <p>Use the daily diary, meditations and journalling exercises.</p>
    </div>
  );
};

export default WelcomeMessage;
