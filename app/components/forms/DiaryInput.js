"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { FaArrowUp } from "react-icons/fa";

export const DiaryInput = ({ words }) => {
  const [text, setText] = React.useState("");
  const { pending } = useFormStatus();

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const remainingWords = Math.max(words - wordCount, 0);

  return (
    <>
      <textarea
        type="text"
        name="entry"
        placeholder="Send message"
        className="textarea-xl textarea-primary no-scrollbar w-full rounded-lg pl-3 pr-10 pt-5"
        required
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={pending}
      />
      <div
        className="tooltip tooltip-open tooltip-top tooltip-secondary  mr-8"
        data-tip={`${remainingWords} words left`}
      >
        <button
          className={`btn btn-circle btn-s btn-primary w-25 -ml-14 ${
            pending ? "opacity-50" : ""
          }`}
          type="submit"
          disabled={pending}
        >
          {pending ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <FaArrowUp />
          )}
        </button>
      </div>
    </>
  );
};
