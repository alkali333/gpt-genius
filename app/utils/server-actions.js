"use server";
import prisma from "./db";
import OpenAI from "openai";

import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { gratitudeSchema, todoSchema } from "/app/utils/schemas";
import { ZodError } from "zod";

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

export const fetchCoachingContent = async (prompt) => {
  const userJson = await fetchUserJson();

  // if there is no userData, it must be a new user
  if (!userJson) redirect("/about-me");

  const userStr = JSON.stringify(userJson);

  const systemMessage = `You are Attenshun, a powerful AI wellness app, your job is to make sure the user focuses their attention on what is important. Use the user
    information below to generate personalised messages and exercises addressing the user by name. Encourage and power the user. \n\n
    USER INFO: ${userStr}\n\n`;

  const userMessage = prompt;

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

export const updateMorningJournal = async (prevState, formData) => {
  const user = await fetchAuthUser();
  const rawData = Object.fromEntries(formData);

  try {
    const isGratitudeForm = "gratitude1" in rawData;
    const isTodoForm = "todo1" in rawData;

    let validatedFields, updateObject, columnName;

    if (isGratitudeForm) {
      validatedFields = gratitudeSchema.parse(rawData);
      updateObject = {
        "grateful for": {
          1: validatedFields.gratitude1,
          2: validatedFields.gratitude2,
          3: validatedFields.gratitude3,
          4: validatedFields.gratitude4,
          5: validatedFields.gratitude5,
        },
      };
      columnName = "grateful_for";
    } else if (isTodoForm) {
      validatedFields = todoSchema.parse(rawData);
      updateObject = {
        "current tasks": {
          1: validatedFields.todo1,
          2: validatedFields.todo2,
          3: validatedFields.todo3,
          4: validatedFields.todo4,
          5: validatedFields.todo5,
        },
      };
      columnName = "current_tasks";
    }

    await prisma.mindState.update({
      where: { clerkId: user.id },
      data: { [columnName]: updateObject },
    });

    return {
      message: `${isGratitudeForm ? "Gratitude" : "Todo"} updated`,
      data: updateObject,
    };
  } catch (error) {
    console.error("Error in updateMindState:", error);
    if (error instanceof ZodError) {
      const errorMessage = error.errors[0]?.message || "Validation error";
      return { message: errorMessage, data: null };
    } else {
      return {
        message: error.message || "An unexpected error occurred",
        data: null,
      };
    }
  }
};
