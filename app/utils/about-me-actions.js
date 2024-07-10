"use server";
import prisma from "./db";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const summarizeInfo = async (query, type) => {
  console.log(`Query sent to openai: ${query}`);
  console.log(`Type of information: ${type}`);

  const systemMessage = `You are a life coach summarzing the users ${type}. You will respond in json format, with 
    three ${type}. Each ${type} should have a name, description, and outcome (how they will feel when resolved).
    Respond purely with the json, no commentary or code.
    {"${type}" {"name": "name goes here", "description": "description goes here", "outcome": "outcome goes here"}`;

  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: query },
      ],
      model: "gpt-4o",
      temperature: 0.8,
    });

    const summary = response.choices[0].message.content;
    console.log("Summary from LLM:", summary);
    const cleanedSummary = summary
      .replace(/^```json\n?/, "")
      .replace(/```$/, "")
      .trim();

    try {
      userData = JSON.parse(cleanedSummary);
      return userData;
    } catch (error) {
      console.error("Data not in valid JSON format:", error);
    }
  } catch (error) {
    console.error("Error generating chat response:", error);
    return null;
  }
};

export const updateMindState = async (clerkId, column, data) => {
  console.log(`Updating mind state for user:${clerkId}`);
  const existingUser = await prisma.mindState.findUnique({
    where: { clerkId: clerkId },
  });
  if (existingUser) {
    return prisma.mindState.update({
      where: { clerkId: clerkId },
      data: { [column]: data },
    });
  } else {
    return prisma.mindState.create({
      data: { clerkId: clerkId, [column]: data },
    });
  }
};

export const summarizeAndUpdate = async (
  query,
  type,
  clerkId,
  column,
  data
) => {
  const summary = await summarizeInfo(query, type);
  const result = updateMindState(clerkId, column, summary);
};
