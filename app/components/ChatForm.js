import React from "react";
import { FaArrowUp } from "react-icons/fa";

const ChatForm = ({ handleSubmit, text, setText, isPending }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const remainingWords = Math.max(250 - wordCount, 0);

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center">
      <textarea
        type="text"
        placeholder="Message Genius GPT"
        className="textarea-xl textarea-primary no-scrollbar w-full rounded-lg pl-3 pr-10 pt-5"
        value={text}
        required
        autoFocus
        disabled={isPending}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div
        className="tooltip tooltip-open tooltip-secondary"
        data-tip={`${remainingWords} words Remaining`}
      >
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
      </div>
    </form>
  );
};

export default ChatForm;
