"use client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { summarizeAndUpdateMindState } from "/app/utils/server-actions";
import toast from "react-hot-toast";
import Link from "next/link";

import ChatForm from "/app/components/forms/ChatForm";
import { questions } from "../../utils/questions";
import TextSkeleton from "../TextSkeleton";

const AboutMe = () => {
  const [step, setStep] = useState(1);
  const [text, setText] = useState("");

  const currentQuestion = questions[step - 1];

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ query, type }) => {
      const result = await summarizeAndUpdateMindState(type, query);
      if (!result.data && result.message) {
        toast.error(result.message);
        return;
      }
      setStep((prevStep) => prevStep + 1);
      return result;
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = text;
    if (query.trim().split(/\s+/).length < 150) {
      toast.error("Please write at least 150 words");
      return;
    }
    mutate({
      query,
      type: currentQuestion.title,
    });
    setText("");
  };

  if (isPending) {
    return <span className="loading loading-spinner loading-md"></span>;
  }

  return (
    <div className="min-h-[calc(100vh-9rem)] grid grid-rows-[auto,1fr,auto] max-w-2xl">
      <div className=" pt-12">
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
                Completing this exercise will help me understand your goals,
                skills, and obstacles. You can do it as often as you like, we
                recommend once a month at least. Each time you complete this
                exercise, your goals, skills, and obstacles will be reset.
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
              minWords={150}
            />
          ) : (
            <>
              <p className="text-secondary">
                You have completed the journalling exercise. Return to this page
                frequently and repeat the process.
              </p>
              <Link
                href="/my-info/hopes-and-dreams"
                className="btn btn-primary ml-2"
              >
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
