"use server";
import prisma from "./db";
import OpenAI from "openai";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const fetchAuthUser = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return { firstName: user.firstName, id: user.id };
};

export const fetchUserJson = async () => {
  const user = await fetchAuthUser();

  const details = await prisma.mindState.findUnique({
    where: { clerkId: user.id },
    select: {
      hopes_and_dreams: true,
      skills_and_achievements: true,
      obstacles_and_challenges: true,
      grateful_for: true,
      current_tasks: true,
    },
  });

  if (
    details &&
    details.hopes_and_dreams &&
    details.skills_and_achievements &&
    details.obstacles_and_challenges
  ) {
    const combinedData = Object.entries(details).reduce((acc, [key, value]) => {
      if (value && typeof value === "object") {
        return { ...acc, ...value };
      }
      return acc;
    }, {});

    return { [user.firstName]: combinedData };
  }

  // If no user is found or any of the required fields are missing, return null
  return null;
};

const fetchOpenAiResponse = async (model, systemMessage, userMessage) => {
  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
      model: model,
      temperature: 0.8,
    });

    const reply = response.choices[0].message.content;

    return { message: "Received OpenAI response", data: reply };
  } catch (error) {
    return { message: `Error generating chat response: ${error}`, data: null };
  }
};

export const fetchWelcomeMessage = async () => {
  const userJson = await fetchUserJson();

  // if there is no userData, it must be a new user
  if (!userJson) redirect("/about-me");

  const userStr = JSON.stringify(userJson);

  const systemMessage = `You are Attenshun, a powerful AI wellness app, your job is to make sure the user focuses their attention on what is important. Use the user
    information below to generate messags for the user. \n\n
    USER INFO: ${userStr}\n\n`;

  const userMessage = `Write an empowering statement for the user and give them some tips based on their user info. 350 words and include a famous quote. `;

  const openAIResponse = await fetchOpenAiResponse(
    "gpt-4o",
    systemMessage,
    userMessage
  );

  if (openAIResponse.data) {
    return {
      message: "Successfully retrieved welcome message",
      data: openAIResponse.data,
    };
  } else {
    return { message: "Error retrieving welcome message", data: null };
  }
};
