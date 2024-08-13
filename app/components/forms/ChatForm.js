import React from "react";
import { FaArrowUp } from "react-icons/fa";

const ChatForm = ({ handleSubmit, text, setText, isPending }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center">
      <textarea
        type="text"
        name="message"
        placeholder="Send message"
        className="textarea-xl textarea-primary no-scrollbar w-full rounded-lg pt-5 px-2"
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
    </form>
  );
};

export default ChatForm;
