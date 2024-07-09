"use client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  summarizeHopesAndDreams,
  updateHopesAndDreams,
} from "/app/utils/about-me-actions";
import toast from "react-hot-toast";

import { useAuth } from "@clerk/nextjs";

import ChatForm from "/app/components/ChatForm";
import { questions } from "../utils/questions";

const AboutMe = () => {
  const { userId } = useAuth();

  const [step, setStep] = useState(1);

  const [text, setText] = useState("");
  const [response, setResponse] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: async (query) => {
      if (text.length < 250) {
        toast.error("Please write at least 250 characters");
        return;
      }

      const summary = await summarizeHopesAndDreams(query);
      if (!summary) {
        toast.error("Error generating chat response");
        return;
      }
      return summary;
    },
    onError: (error) => {
      toast.error("Error generating chat response");
      console.log(error);
    },
    onSuccess: async (data) => {
      console.log(data);
      updateHopesAndDreams(userId, data);
      setResponse("Thankyou, I have noted your hopes and dreams. 🧠");
    },
  });

  const currentQuestion = questions[step - 1];

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = { role: "user", content: text };
    mutate(query);
    setText("");
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] grid grid-rows-[auto,1fr,auto]">
      <div className="max-w-4xl pt-12">
        <div className="w-full flex items-center">
          <ul className="steps">
            {questions.map((question) => (
              <li
                key={question.step}
                className={`step ${
                  question.step === step && "step-primary"
                } font-bold`}
              >
                {question.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <div className="flex justify-start py-6 leading-loose max-w-4xl">
          <p className="max-w-3xl bg-base-100">{currentQuestion.content}</p>
        </div>
        {response && (
          <div className="flex justify-start py-6 px-8 leading-loose max-w-4xl">
            <span className="mr-4">🧠</span>
            <p className="max-w-3xl bg-base-100">{response}</p>
          </div>
        )}
      </div>
      <div className="max-w-4xl pt-12">
        <div className="w-full flex items-center">
          <ChatForm
            handleSubmit={handleSubmit}
            text={text}
            setText={setText}
            isPending={isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
