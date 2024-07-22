"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { FaArrowUp } from "react-icons/fa";

const DiaryInput = () => {
  const [text, setText] = React.useState("");
  const { pending } = useFormStatus();

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
    </>
  );
};

export default DiaryInput;
