"use server";
import prisma from "./db";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const summarizeHopesAndDreams = async (userMessage) => {
  const systemMessage = `You are a life coach summarzing the users hopes and dreams. You will respond in json format, with 
    three hopes and dreams. Each hope and dream should have a name, description, and outcome (how they will feel when completed).
    {"hopes and dreams" {"name": "name goes here", "description": "description goes here", "outcome": "outcome goes here"}`;

  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "system", content: systemMessage }, userMessage],
      model: "gpt-4o",
      temperature: 0.8,
      max_tokens: 200,
    });

    const summary = response.choices[0].message;
    console.log(summary);

    try {
      tourData = JSON.parse(summary);
      return tourData;
    } catch (error) {
      console.error("Data not in valid JSON format:", error);
    }
  } catch (error) {
    console.error("Error generating chat response:", error);
    return null;
  }
};

export const updateHopesAndDreams = async (clerkId, hopesAndDreams) => {
  const existingUser = await prisma.mindState.findUnique({
    where: { clerkId: clerkId },
  });
  if (existingUser) {
    return prisma.mindState.update({
      where: { clerkId: clerkId },
      data: { hopes_and_dreams: hopesAndDreams },
    });
  } else {
    return prisma.mindState.create({
      data: { clerkId: clerkId, hopes_and_dreams: hopesAndDreams },
    });
  }
};
