"use server";

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, BaseMessage } from "@langchain/core/prompts";

export const getLatestResponse = async (previousMessages) => {
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Convert previousMessages to a nested list
  const messagesList = previousMessages.map((message) => [
    message.role,
    message.content,
  ]);

  // Create a new array with the system message and concatenate messagesList to it
  const finalMessagesList = [
    ["system", "You are a world class technical documentation writer."],
    ...messagesList,
  ];

  const prompt = ChatPromptTemplate.fromMessages(finalMessagesList);
  const chain = prompt.pipe(model);
  const result = await chain.invoke();
  return { role: "assistant", content: result.content };
};
