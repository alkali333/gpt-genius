"use client";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { generateChatResponse } from "../../utils/actions";
import toast from "react-hot-toast";
import { fetchUserTokensById, subtractTokens } from "../../utils/actions";
import { useAuth } from "@clerk/nextjs";

import sanitizeHtml from "sanitize-html";
import { useUserData } from "/app/contexts/useDataContext";
import ChatForm from "../forms/ChatForm";

const CoachChat = () => {
  const { userId } = useAuth();
  const { userData } = useUserData();
  const [systemMessage, setSystemMessage] = useState("");

  // once the userData is ready, we use it to set the system message
  useEffect(() => {
    if (userData) {
      const tempSystemMessage = `You are a life coach chatting with the user about their issues. 
        Encourage them to focus on the issues below and offer positive encouragement and ideas \n\n
        USER INFO ${JSON.stringify(userData)}`;
      console.log(`Setting system message to: ${tempSystemMessage}`);
      setSystemMessage(tempSystemMessage);
    }
  }, [userData]);

  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  // Chat response handled here
  const { mutate, isPending } = useMutation({
    mutationFn: async (query) => {
      const currentTokens = await fetchUserTokensById(userId);
      if (currentTokens < 55) {
        toast.error("Token balance too low...");
        return;
      }
      return await generateChatResponse(systemMessage, [...messages, query]);
    },
    onError: (error) => {
      toast.error("Error generating chat response");
      console.log(error);
    },
    onSuccess: async (data) => {
      try {
        const newTokens = await subtractTokens(userId, data.tokens);
        toast.success(`${newTokens} tokens left`);
        setMessages((prev) => [...prev, data.message]);
      } catch (error) {
        toast.error("Error updating token balance");
        console.error(error);
      }
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
