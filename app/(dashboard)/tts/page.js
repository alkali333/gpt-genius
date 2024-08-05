// app/page.js
"use client";

import { useState } from "react";
import { synthesizeSpeech } from "/app/utils/text-to-speech";

export default function Home() {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await synthesizeSpeech(text);
    setAudioUrl(result);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Text-to-Speech with Amazon Polly
      </h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border rounded"
          rows="4"
          placeholder="Enter text to convert to speech"
        ></textarea>
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Convert to Speech
        </button>
      </form>
      {audioUrl && (
        <audio controls src={audioUrl} className="w-full">
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}
