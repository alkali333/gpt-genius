"use client";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { generateChatResponse } from "../utils/actions";
import toast from "react-hot-toast";

import { FaArrowUp } from "react-icons/fa";
import sanitizeHtml from "sanitize-html";
import Settings from "./Settings";

// I will add the option to change the system message,
// it will stick replace the first message in the array

const Chat = () => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (messages.length > 0) {
      console.log("First message:", messages[0]);
    }
  }, [messages]); // Dependency array ensures this runs every time `messages` changes

  const { mutate, isPending } = useMutation({
    // sends messages plus latest query to generateChatResponse
    mutationFn: (query) => generateChatResponse([...messages, query]),
    onSuccess: (data) => {
      if (!data) {
        toast.error("Error generating chat response");
      }
      // sticks the answer in the messages array
      setMessages((prev) => [...prev, data]);
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && e.target.value.trim() !== "") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

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
      <form onSubmit={handleSubmit} className="max-w-4xl pt-12">
        <div className="w-full flex items-center">
          <textarea
            type="text"
            placeholder="Message Genius GPT"
            className="textarea-md textarea-primary no-scrollbar w-full rounded-lg pl-3 pr-10 pt-5"
            value={text}
            required
            autoFocus
            disabled={isPending}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            className="btn btn-circle btn-s btn-primary w-25 -ml-14"
            type="submit"
          >
            {isPending ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <FaArrowUp />
            )}
          </button>
          <div className="ml-5">
            <Settings setMessages={setMessages} messages={messages} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Chat;
