"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateChapters = async (
  chatMessage,
  model = "gpt-3.5-turbo",
  number = 3,
  title
) => {
  const system_message = `
    Create a list of ${number} chapters for an ebook, include introductory 
    and concluding chapters and create interesting names for the introduction and 
    conclusion chapter. Respond only with the chapter names separated by commas.
    Don't include the number or the word 'chapter'.
    The book has a title and optional description
    OUTPUT: Chapter 1 Name, Chapter 2 Name, ...
    `;

  const user_message = `Book Title: ${title}, Book Description: ${description}`;

  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: system_message },
        { role: "user", content: user_message },
      ],
      model,
      temperature: 0,
      max_tokens: 100,
    });

    if (!response || !response.choices) {
      console.error("Unexpected response format:", response);
      return null;
    }

    const message = response.choices[0].message;
    return message;
  } catch (error) {
    console.error("Error generating chat response:", error);
    return null;
  }
};
