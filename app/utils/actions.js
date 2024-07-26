"use server";

import OpenAI from "openai";

import prisma from "./db";
import axios from "axios";
import fs from "fs";
import path from "path";
import stream from "stream";
import { promisify } from "util";
import { revalidatePath } from "next/cache";

const pipeline = promisify(stream.pipeline);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateChatResponse = async (systemMessage, chatMessages) => {
  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "system", content: systemMessage }, ...chatMessages],
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      max_tokens: 200,
    });

    const message = response.choices[0].message;
    const tokens = response.usage.total_tokens;

    return { message: message, tokens: tokens };
  } catch (error) {
    console.error("Error generating chat response:", error);
    return null;
  }
};

export const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const fetchUserTokensById = async (clerkId) => {
  const result = await prisma.token.findUnique({
    where: {
      clerkId,
    },
  });
  return result?.tokens;
};

export const generateUserTokensForId = async (clerkId) => {
  const result = await prisma.token.create({
    data: {
      clerkId,
    },
  });
  return result?.tokens;
};

export const fetchOrGenerateTokens = async (clerkId) => {
  const result = await fetchUserTokensById(clerkId);
  if (result) {
    return result.tokens;
  }

  return (await generateUserTokensForId(clerkId)).tokens;
};

export const subtractTokens = async (clerkId, tokens) => {
  const result = await prisma.token.update({
    where: {
      clerkId,
    },
    data: {
      tokens: {
        decrement: tokens,
      },
    },
  });
  // keep profile page up to date when revalidating tokens
  revalidatePath("/profile");
  return result.tokens;
};
