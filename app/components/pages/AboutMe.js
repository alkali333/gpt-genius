"use client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { updateMindState, summarizeInfo } from "/app/utils/about-me-actions";
import toast from "react-hot-toast";
import Link from "next/link";

import ChatForm from "/app/components/forms/ChatForm";
import { questions } from "../../utils/questions";
import TextSkeleton from "../TextSkeleton";
import { useUserData } from "/app/contexts/useDataContext";

const AboutMe = () => {
  const [step, setStep] = useState(1);
  const [text, setText] = useState("");

  const { userData, fetchUserData } = useUserData();

  const currentQuestion = questions[step - 1];

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ query, type, column }) => {
      const summaryResponse = await summarizeInfo(query, type);
      if (!summaryResponse.data && summaryResponse.message) {
        toast.error(summaryResponse.message);
        return;
      }
      // console.log(`Info recieved from LLM: ${summaryResponse.data}`);
      const update = await updateMindState(column, summaryResponse.data);
      if (!update) {
        toast.error("Error updating mind state");
        return;
      }

      setStep(step + 1);

      return summary;
    },
    onSuccess: () => {
      fetchUserData(); // Refresh the user data after successful update
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = text;
    if (query.trim().split(/\s+/).length < 250) {
      toast.error("Please write at least 250 words");
      return;
    }
    mutate({
      query,
      type: currentQuestion.title,
      column: currentQuestion.column,
    });
    setText("");
  };

  if (isPending || dataIsLoading) {
    return <span className="loading loading-spinner loading-md"></span>;
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] grid grid-rows-[auto,1fr,auto]">
      <div className="max-w-4xl pt-12">
        <div className="w-full flex items-center">
          <ul className="steps w-full">
            {questions.slice(0, 3).map((question) => (
              <li
                key={question.step}
                className={`step ${
                  question.step <= step && "step-primary"
                } text-sm`}
              >
                {question.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex items-center">
        {isPending ? (
          <TextSkeleton />
        ) : (
          <div className="flex flex-col justify-start py-6 leading-loose max-w-4xl">
            {step === 1 && (
              <p className="max-w-4xl bg-base-100 text-m lg:text-xl mb-4">
                {userData
                  ? "Completing this exercise again will result in your goals, skills, and obstacles being updated. I recommend to do this at least once a month  "
                  : "Welcome to Attenshun! Completing this exercise will help me understand your goals, skills, and obstacles. "}
              </p>
            )}
            <p className="max-w-4xl bg-base-100 text-m lg:text-xl">
              {currentQuestion.content}
            </p>
          </div>
        )}
      </div>

      <div className="max-w-4xl pt-12">
        <div className="w-full flex items-center">
          {step < 4 ? (
            <ChatForm
              handleSubmit={handleSubmit}
              text={text}
              setText={setText}
              isPending={isPending}
            />
          ) : (
            <>
              <p className="text-xl font-semibold">
                You have completed the journalling exercise. Return to this page
                frequently and repeat the process.
              </p>
              <Link href="/about-me/details" className="btn btn-primary">
                See my Details
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
