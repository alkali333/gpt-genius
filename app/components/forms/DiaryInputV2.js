import React, { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { FaArrowUp } from "react-icons/fa";

const DiaryInputV2 = ({ words, type = "unspecified" }) => {
  const [text, setText] = React.useState("");
  const { pending } = useFormStatus();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const remainingWords = Math.max(words - wordCount, 0);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  return (
    <div className="relative w-full">
      <textarea
        ref={textareaRef}
        className="textarea text-lg lg:text-xl textarea-bordered w-full h-auto min-h-[6rem] focus:outline-none focus:ring-2 focus:ring-primary pr-9 resize-none no-scrollbar"
        placeholder="Write your entry here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={pending}
        name="entry"
      />
      <input type="hidden" name="type" value={type} />
      <button
        className="btn btn-sm btn-circle btn-primary rounded-full absolute top-2 right-2"
        disabled={pending}
      >
        {pending ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          <FaArrowUp />
        )}
      </button>
      <div className="text-right text-sm text-gray-500">
        {remainingWords} words remaining
      </div>
    </div>
  );
};

export default DiaryInputV2;
