"use server";
import prisma from "./db";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const summarizeInfo = async (query, type) => {
  console.log(`Query sent to openai: ${query}`);
  console.log(`Type of information: ${type}`);

  const systemMessage = `You are a life coach summarizing the user's ${type}. You will respond in JSON format, with three ${type}. Each ${type} should have a name, description, and ${
    type === "skills and achievements"
      ? "beneficial result of having this skill or achievement"
      : "result (how it will be when the issue is resolved)"
  }.
  Respond purely with correctly formatted JSON, no commentary or code.`;

  const responseJson = {
    [type]: [
      {
        name: "name goes here",
        description: "description goes here",
        result: "value goes here",
      },
    ],
  };

  const responseString = JSON.stringify(responseJson);

  const systemMessageWithResponse = `${systemMessage}\n${responseString}`;

  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemMessageWithResponse },
        { role: "user", content: query },
      ],
      model: "gpt-4o",
      temperature: 0.8,
    });

    const summary = response.choices[0].message.content;

    const cleanedSummary = summary
      .replace(/^```json\n?/, "")
      .replace(/```$/, "")
      .trim();
    console.log("Summary from LLM:", cleanedSummary);
    try {
      const userData = JSON.parse(cleanedSummary);
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

export const getMindStateField = async (clerkId, column) => {
  console.log(`Retrieving ${column} from MindState for user:${clerkId}`);
  const existingUser = await prisma.mindState.findUnique({
    where: { clerkId: clerkId },
  });
  if (existingUser) {
    const details = await prisma.mindState.findUnique({
      where: {
        clerkId,
      },
      select: {
        [column]: true,
      },
    });
    return details[column];
  }
  return null;
};

export const getMindStateFields = async (clerkId) => {
  console.log(`Retrieving mind state fields for user:${clerkId}`);
  const existingUser = await prisma.mindState.findUnique({
    where: { clerkId: clerkId },
  });
  if (existingUser) {
    const details = await prisma.mindState.findUnique({
      where: {
        clerkId,
      },
      select: {
        hopes_and_dreams: true,
        skills_and_achievements: true,
        obstacles_and_challenges: true,
      },
    });
    return {
      hopes_and_dreams: details.hopes_and_dreams,
      skills_and_achievements: details.skills_and_achievements,
      obstacles_and_challenges: details.obstacles_and_challenges,
    };
  }
  return null;
};

export const getMindStateFieldsWithUsername = async (clerkId, username) => {
  console.log(`Retrieving mind state fields for user:${clerkId}`);

  const existingUser = await prisma.mindState.findUnique({
    where: { clerkId: clerkId },
  });

  if (existingUser) {
    const details = await prisma.mindState.findUnique({
      where: { clerkId },
      select: {
        hopes_and_dreams: true,
        skills_and_achievements: true,
        obstacles_and_challenges: true,
      },
    });

    // Wrap the details in an object with the username as the key
    return {
      [username]: {
        hopes_and_dreams: details.hopes_and_dreams,
        skills_and_achievements: details.skills_and_achievements,
        obstacles_and_challenges: details.obstacles_and_challenges,
      },
    };
  }

  // If no user is found, return null or an empty object with the username
  return { [username]: null };
};

export const generateMeditation = async (
  coachStyle = "spiritual life coach",
  userInfo,
  exerciseType = ""
) => {
  const systemMessage = `You are a ${coachStyle}, creating a medition for the user to help them with the issues identifed below\n\n
  USER INFO: ${userInfo}\n\n`;

  const userMessage = `Create the following exercise: ${
    exerciseType ? exerciseType : " a meditation / visualisation"
  }`;

  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemMessageWithResponse },
        { role: "user", content: query },
      ],
      model: "gpt-4o",
      temperature: 0.8,
    });

    return (exercise = response.choices[0].message.content);
  } catch (error) {
    console.error("Error generating chat response:", error);
    return null;
  }
};
