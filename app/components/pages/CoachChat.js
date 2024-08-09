"use client";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  generateChatResponse,
  fetchUserJson,
} from "../../utils/server-actions";
import toast from "react-hot-toast";

import sanitizeHtml from "sanitize-html";

import ChatForm from "../forms/ChatForm";

const CoachChat = () => {
  const [systemMessage, setSystemMessage] = useState("");

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
  // };

  return (
    <div className="min-h-[calc(100vh-6rem)] grid grid-rows-[1fr,auto]">
      <div>
        {messages.map(({ role, content }, index) => {
          const bgc =
            role === "user" ? "bg-base-200 p-4 rounded-lg" : "bg-base-100";
          const justifyContent =
            role === "user" ? "justify-end" : "justify-start";
          const width = role === "user" ? "3/4" : "full";

          const formattedContent = sanitizeHtml(
            content
              .replace(/\n/g, "<br />")
              .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"),
            { allowedTags: ["br", "strong"] }
          );

          return (
            <div
              key={index}
              className={`flex ${justifyContent} py-6 px-8 leading-loose max-w-4xl`}
            >
              {role === "assistant" && <span className="mr-4">🤖</span>}
              <p
                className={`max-w-3xl ${bgc}`}
                dangerouslySetInnerHTML={{ __html: formattedContent }}
              />
            </div>
          );
        })}
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

export default CoachChat;
