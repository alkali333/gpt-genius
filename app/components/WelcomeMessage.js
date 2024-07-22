"use client";
import { useUserData } from "/app/contexts/useDataContext";
import { getWelcomeMessage } from "../queries/welcomeMessageQuery";
import MissingDetails from "/app/components/MissingDetails";
import { useQuery } from "@tanstack/react-query";
import { marked } from "marked";

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

  const htmlMessage = marked(message);

  return (
    <div className="max-w-2xl text-sm leading-loose">
      <h2 className="text-primary text-xl mb-7">Welcome To Attenshun</h2>
      <p className="text-secondary">
        <div
          className="prose prose-slate max-w-none text-sm"
          dangerouslySetInnerHTML={{ __html: htmlMessage }}
        />
        ;
      </p>
      <p>Use the daily diary, meditations and journalling exercises.</p>
    </div>
  );
};

export default WelcomeMessage;
