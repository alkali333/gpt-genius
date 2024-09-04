import { useEffect, useRef } from "react";
import { FaArrowUp, FaDivide } from "react-icons/fa";

const ChatForm = ({
  handleSubmit,
  text,
  setText,
  isPending,
  minWords = null,
}) => {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const remainingWords = minWords ? Math.max(minWords - wordCount, 0) : null;
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center">
      <div className="relative w-full">
        <textarea
          ref={textareaRef}
          className="textarea  text-lg lg:text-xl textarea-bordered w-full h-auto min-h-[6rem] focus:outline-none focus:ring-2 focus:ring-primary pr-9 resize-none no-scrollbar"
          placeholder="Write your entry here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isPending}
          name="message"
        />
        <button
          className="btn btn-sm btn-primary btn-circle absolute top-2 right-2"
          disabled={isPending}
        >
          {isPending ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <FaArrowUp />
          )}
        </button>
        <div className="text-right text-sm text-gray-500">
          {remainingWords} words remaining
        </div>
      </div>
    </form>
  );
};

export default ChatForm;
