"use server";
import prisma from "./db";
import OpenAI from "openai";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { eveningJournalSchema, aboutMeSchema } from "/app/utils/schemas";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const summarizeInfo = async (query, type) => {
  // Validate input
  const result = aboutMeSchema.shape.message.safeParse(query);
  if (!result.success) {
    return { message: result.error.message, data: null };
  }

  const validatedQuery = result.data;

  const systemMessage = `You are a life coach summarizing the user's ${type}. You will respond in JSON format, with maxiumum 8 ${type}. Each ${type} should have a name, description, and ${
    type === "skills and achievements"
      ? "result (the benefits it gives them)"
      : "result (e.g.  'Solving this will mean...')"
  }.
  Give each one a default rating of 3. Respond purely with correctly formatted JSON, no commentary or code.`;

  const responseJson = {
    [type]: [
      {
        name: "name goes here",
        description: "description goes here",
        result: "value goes here",
        rating: 3,
      },
    ],
  };

  const responseString = JSON.stringify(responseJson);
  const systemMessageWithResponse = `${systemMessage}\n${responseString}`;

  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemMessageWithResponse },
        { role: "user", content: validatedQuery },
      ],
      model: "gpt-4o-mini",
      temperature: 0.8,
    });

    const summary = response.choices[0].message.content;

    // Clean and parse the response
    const cleanedSummary = summary
      .replace(/^```json\n?/, "")
      .replace(/```$/, "")
      .trim();
    console.log("Summary from LLM:", cleanedSummary);

    const userData = JSON.parse(cleanedSummary);
    return { message: "User data created", data: userData };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      message: `Error processing request: ${errorMessage}`,
      data: null,
    };
  }
};

export const updateMindState = async (column, data) => {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not found, please log in to create a profile");
  }
  console.log(`Updating mind state for user:${user.firstName}`);
  const existingUser = await prisma.mindState.findUnique({
    where: { clerkId: user.id },
  });
  if (existingUser) {
    return prisma.mindState.update({
      where: { clerkId: user.id },
      data: { [column]: data },
    });
  } else {
    return prisma.mindState.create({
      data: { clerkId: user.id, [column]: data },
    });
  }
};

// export const summarizeAndUpdate = async (
//   query,
//   type,
//   clerkId,
//   column,
//   data
// ) => {
//   const summary = await summarizeInfo(query, type);
//   const result = updateMindState(clerkId, column, summary);
// };

// export const getMindStateField = async (clerkId, column) => {
//   console.log(`Retrieving ${column} from MindState for user:${clerkId}`);
//   const existingUser = await prisma.mindState.findUnique({
//     where: { clerkId: clerkId },
//   });
//   if (existingUser) {
//     const details = await prisma.mindState.findUnique({
//       where: {
//         clerkId,
//       },
//       select: {
//         [column]: true,
//       },
//     });
//     return details[column];
//   }
//   return null;
// };

// export const getMindStateFields = async (clerkId) => {
//   console.log(`Retrieving mind state fields for user:${clerkId}`);
//   const existingUser = await prisma.mindState.findUnique({
//     where: { clerkId: clerkId },
//   });
//   if (existingUser) {
//     const details = await prisma.mindState.findUnique({
//       where: {
//         clerkId,
//       },
//       select: {
//         hopes_and_dreams: true,
//         skills_and_achievements: true,
//         obstacles_and_challenges: true,
//       },
//     });
//     return {
//       hopes_and_dreams: details.hopes_and_dreams,
//       skills_and_achievements: details.skills_and_achievements,
//       obstacles_and_challenges: details.obstacles_and_challenges,
//     };
//   }
//   return null;
// };

export const getMindStateFieldsWithUsername = async () => {
  const user = await currentUser();

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

export const generateMeditation = async (
  coachStyle = "spiritual life coach",
  userInfo,
  exerciseType = "a meditation / visualisation"
) => {
  const systemMessage = `You are a ${coachStyle}, creating a 500 word medition for the user to help them with the issues identifed below. Use the user information to customize the meditation
  based on their details \n\n
  USER INFO: ${userInfo}\n\n`;

  const userMessage = `Create the following exercise: ${exerciseType}`;

  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
      model: "gpt-4o",
      temperature: 0.8,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating chat response:", error);
    return null;
  }
};

export const generateMeditationDummy = async (
  coachStyle = "spiritual life coach",
  userInfo = null,
  exerciseType = "a meditation / visualisation"
) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 3000));

  if (userInfo) {
    console.log(
      `User info received by server to send to LLM ${JSON.stringify(userInfo)}`
    );
  }
  return `I am a ${coachStyle}, creating ${exerciseType} user to help them with the issues identified below\n\n
  The meditation will go here.`;
};

export const fetchWelcomeMessage = async (userInfo) => {
  const systemMessage = `You are Attenshun, a powerful AI wellness app, your job is to make sure the user focuses their attention on what is important. Use the user
  information below to generate messags for the user. \n\n
  USER INFO: ${userInfo}\n\n`;

  const userMessage = `Write an empowering statement for the user and give them some tips based on their user info. 350 words and include a famous quote. `;

  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
      model: "gpt-4o-mini",
      temperature: 0.8,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw error;
  }
};

export const fetchDailySummary = async (userInfo) => {
  const systemMessage = `You are Attenshun, a powerful AI wellness app, your job is to make sure the user focuses their attention on what is important. Use the user
  information below to generate messags for the user. \n\n
  USER INFO: ${userInfo}\n\n`;

  console.log(`System message: ${systemMessage}`);

  const userMessage = `Based on the USER INFO. Write a short message (100 words) reminding them of their goals, things they are grateful for, and tasks. Invite them to record their daily gratitude and task list. `;

  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
      model: "gpt-4o",
      temperature: 0.8,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw error;
  }
};

export async function insertDiaryEntry(prevState, formData) {
  const { userId } = auth();
  const rawData = Object.fromEntries(formData);

  try {
    const validatedFields = eveningJournalSchema.parse(rawData);
    const newEntry = await prisma.diary.create({
      data: {
        clerkId: userId,
        ...validatedFields,
      },
    });
    return { message: "Diary entry successfully created", data: newEntry };
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessage = error.errors[0]?.message || "Validation error";
      return { message: errorMessage };
    }
  }
}

// export const generateChatResponse = async (systemMessage, chatMessages) => {
//   try {
//     const response = await openai.chat.completions.create({
//       messages: [{ role: "system", content: systemMessage }, ...chatMessages],
//       model: "gpt-4o-mini",
//       temperature: 0.8,
//       max_tokens: 200,
//     });

//     const message = response.choices[0].message;
//     const tokens = response.usage.total_tokens;

//     return { message: message, tokens: tokens };
//   } catch (error) {
//     console.error("Error generating chat response:", error);
//     return null;
//   }
// };
