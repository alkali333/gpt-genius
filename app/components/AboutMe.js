"use client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { updateMindState, summarizeInfo } from "/app/utils/about-me-actions";
import toast from "react-hot-toast";
import Link from "next/link";

import { useAuth } from "@clerk/nextjs";

import ChatForm from "/app/components/ChatForm";
import { questions } from "../utils/questions";
import TextSkeleton from "./TextSkeleton";

const AboutMe = () => {
  const { userId } = useAuth();
  const [step, setStep] = useState(1);
  const [text, setText] = useState("");

  const currentQuestion = questions[step - 1];

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ query, type, column }) => {
      const summary = await summarizeInfo(query, type);
      if (!summary) {
        toast.error("Error generating chat response");
        return;
      }
      console.log(`Info recieved from LLM: ${summary}`);
      const update = await updateMindState(userId, column, summary);
      if (!update) {
        toast.error("Error updating mind state");
        return;
      }

      setStep(step + 1);
      return summary;
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

  return (
    <div className="min-h-[calc(100vh-6rem)] grid grid-rows-[auto,1fr,auto]">
      <div className="max-w-4xl pt-12">
        <div className="w-full flex items-center">
          <ul className="steps">
            {questions.slice(0, 3).map((question) => (
              <li
                key={question.step}
                className={`step ${
                  question.step <= step && "step-primary"
                } font-bold`}
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
          <div className="flex justify-start py-6 leading-loose max-w-4xl">
            <p className="max-w-3xl bg-base-100">{currentQuestion.content}</p>
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
