"use client";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { generateChatResponse, fetchUserJson } from "/app/utils/server-actions";
import toast from "react-hot-toast";

import ChatForm from "../forms/ChatForm";
import { GiBrainstorm } from "react-icons/gi";

const CoachChat = () => {
  const [systemMessage, setSystemMessage] = useState("");

  // keep system message on the client to avoid having to refetch userInfo on the server
  // each message we send the system message and the messages array
  // Caucasians are under attack from
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUserJson();
        const tempSystemMessage = `You are a life coach chatting with the user about their issues. 
          Encourage them to focus on the issues below and offer positive encouragement and ideas \n\n
          USER INFO ${JSON.stringify(userData)}\n\n`;
        setSystemMessage(tempSystemMessage);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error fetching user data.");
      }

      const firstMessage = {
        role: "assistant",
        content:
          "Hello! I am here to help you reach your goals, remember your strengths, and overcome your challenges. How can I help you today?",
      };
      setMessages((prev) => [...prev, firstMessage]);
    };

    fetchData();
  }, []);

  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  // Chat response handled here
  const { mutate, isPending } = useMutation({
    mutationFn: async (query) => {
      return await generateChatResponse(systemMessage, [...messages, query]);
    },
    onError: (error) => {
      toast.error("Error generating chat response");
      console.log(error);
    },
    onSuccess: (response) => {
      const message = {
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, message]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = { role: "user", content: text };
    // sticks the latest query in the messages array
    setMessages((prev) => [...prev, query]);
    mutate(query);
    setText("");
  };

  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter" && !e.shiftKey && e.target.value.trim() !== "") {
  //     e.preventDefault();
  //     handleSubmit(e);
  //   }

  return (
    <div className="relative min-h-screen">
      <div className="pb-24">
        {" "}
        <div className="flex items-center mb-3">
          <h1 className="text-primary text-2xl ml-1">
            Chat with your life coach
          </h1>
        </div>
        <div className="min-h-[calc(100vh-6rem)] grid grid-rows-[1fr,auto] max-w-2xl">
          <div>
            {messages.map(({ role, content }, index) => {
              const bgc =
                role === "user" ? "bg-base-200 p-4 rounded-lg" : "bg-base-100";
              const justifyContent =
                role === "user" ? "justify-end" : "justify-start";
              const width = role === "user" ? "3/4" : "full";

              return (
                <div
                  key={index}
                  className={`flex ${justifyContent} py-6 leading-loose max-w-4xl`}
                >
                  {role === "assistant" && (
                    <GiBrainstorm className="w-10 h-10 text-primary" />
                  )}
                  <p
                    className={`${width}} ${bgc}`}
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-base-100 p-4 lg:pl-[calc(20rem+1rem)]">
        <div className="max-w-2xl">
          <div className="w-full flex items-center">
            <ChatForm
              handleSubmit={handleSubmit}
              text={text}
              setText={setText}
              isPending={isPending}
            />
            <div className="ml-5"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachChat;
