import { useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { FaArrowUp } from 'react-icons/fa'

const DiaryInputV2 = ({ words, type = 'unspecified' }) => {
  const [text, setText] = useState('')
  const { pending } = useFormStatus()
  const wordCount = text.split(/\s+/).filter(Boolean).length
  const remainingWords = Math.max(words - wordCount, 0)
  const textareaRef = useRef(null)
  const containerRef = useRef(null)

  // Handle text area resize and ensure it stays in view
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to recalculate properly
      textareaRef.current.style.height = 'auto'

      // Set new height based on content (with a max-height)
      const newHeight = Math.min(
        textareaRef.current.scrollHeight + 20,
        window.innerHeight * 0.6
      )
      textareaRef.current.style.height = `${newHeight}px`

      // Scroll the textarea into view if cursor is at the end
      const cursorAtEnd =
        textareaRef.current.selectionStart === textareaRef.current.value.length

      if (cursorAtEnd) {
        // Use scrollIntoView on the textarea element instead of window.scrollTo
        textareaRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        })
      }
    }
  }, [text])

  return (
    <div className="w-full mb-16 flex flex-col" ref={containerRef}>
      <div className="text-sm text-gray-500 mb-2 text-right">
        {remainingWords} words remaining
      </div>
      <div className="relative w-full">
        <textarea
          ref={textareaRef}
          className="textarea text-lg lg:text-xl textarea-bordered w-full min-h-[6rem] pb-8 focus:outline-none focus:ring-2 focus:ring-primary pr-9 resize-none"
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
      </div>
    </div>
  )
}

export default DiaryInputV2
