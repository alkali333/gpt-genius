"use server";
import prisma from "./db";
import OpenAI from "openai";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { ZodError } from "zod";
import { eveningJournalSchema, aboutMeSchema } from "/app/utils/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

export const summarizeInfo = async (query, type) => {
  // Validate input
  const result = aboutMeSchema.shape.message.safeParse(query);
  if (!result.success) {
    if (result.error instanceof ZodError) {
      const errorMessage = error.errors[0]?.message || "Validation error";
      return { message: errorMessage };
    }
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

  const openAiResponse = await fetchOpenAiResponse(
    "gpt-4o",
    systemMessageWithResponse,
    validatedQuery
  );

  if (openAiResponse.data) {
    const summary = openAiResponse.data;

    // Clean and parse the response
    const cleanedSummary = summary
      .replace(/^```json\n?/, "")
      .replace(/```$/, "")
      .trim();
    //  console.log("Summary from LLM:", cleanedSummary);

    const userData = JSON.parse(cleanedSummary);
    return { message: "User data created", data: userData };
  } else {
    return {
      message: "Error generating user data: " + openAiResponse.message,
      data: null,
    };
  }
};

// add path revalidation here
export const updateMindState = async (column, data) => {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not found, please log in to create a profile");
  }
  console.log(
    `Updating mind state for user:${
      user.firstName
    } \n${column}: ${JSON.stringify(data)}`
  );
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

export const getMindStateFieldsWithUsername = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

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

  const constOpenAiResponse = await fetchOpenAiResponse(
    "gpt-4o",
    systemMessage,
    userMessage
  );
  if (openAIResponse.data) {
    return openAIResponse.data;
  } else {
    return "Error generating welcome message: " + openAIResponse.message;
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

  const openAIResponse = await fetchOpenAiResponse(
    "gpt-4o",
    systemMessage,
    userMessage
  );

  if (openAIResponse.data) {
    return openAIResponse.data;
  } else {
    return "Error generating welcome message: " + openAIResponse.message;
  }
};

export const fetchDailySummary = async (userInfo) => {
  const systemMessage = `You are Attenshun, a powerful AI wellness app, your job is to make sure the user focuses their attention on what is important. Use the user
  information below to generate messags for the user. \n\n
  USER INFO: ${userInfo}\n\n`;

  console.log(`System message: ${systemMessage}`);

  const userMessage = `Based on the USER INFO. Write a short message (100 words) reminding them of their goals, things they are grateful for, and tasks. Invite them to record their daily gratitude and task list. `;

  const openAIResponse = await fetchOpenAiResponse(
    "gpt-4o",
    systemMessage,
    userMessage
  );

  if (openAIResponse.data) {
    return openAIResponse.data;
  } else {
    return "Error generating welcome message: " + openAIResponse.message;
  }
};

export const getLatestDiaryEntry = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const latestDiary = await prisma.diary.findFirst({
    where: {
      clerkId: user.id,
    },
    orderBy: {
      date: "desc",
    },
  });

  if (!latestDiary) return null;

  return latestDiary.entry;
};

export const fetchDiaryEncouragementMessage = async () => {
  const userInfo = JSON.stringify(getMindStateFieldsWithUsername());
  const latestDiaryEntry = await getLatestDiaryEntry();

  if (!latestDiaryEntry || !userInfo)
    return "Please complete the journalling exercise and your evening practice.";

  const systemMessage = `You are Attenshun, a powerful AI wellness app, your job is to compare the user's latest diary entry with their existing information and let them know how they are doing, offering tips and suggestions \n\n
  USER INFO: ${userInfo}\n\n`;

  const userMessage = `Diary Entry: ${latestDiaryEntry} `;

  const openAIResponse = await fetchOpenAiResponse(
    "gpt-4o",
    systemMessage,
    userMessage
  );

  if (openAIResponse.data) {
    return openAIResponse.data;
  } else {
    return "Error generating welcome message: " + openAIResponse.message;
  }
};

export async function insertDiaryEntry(prevState, formData) {
  console.log("Insert Diary Entry Triggered");
  const { userId } = auth();
  const rawData = Object.fromEntries(formData);

  // Debugging: Log the raw data received
  console.log("Raw Data:", rawData);

  try {
    const validatedFields = eveningJournalSchema.parse(rawData);

    // Debugging: Log the validated fields
    console.log("Validated Fields:", validatedFields);

    const newEntry = await prisma.diary.create({
      data: {
        clerkId: userId,
        ...validatedFields,
      },
    });

    // Debugging: Log the new entry created
    console.log("New Entry:", newEntry);

    return { message: "Diary entry successfully created", data: newEntry };
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessage = error.errors[0]?.message || "Validation error";

      // Debugging: Log the validation error
      console.log("Validation Error:", errorMessage);

      return { message: errorMessage, data: null };
    }

    // Debugging: Log any unexpected errors
    console.log("Unexpected Error:", error);

    return { message: "An unexpected error occurred", data: null };
  }
}

export const generateChatResponse = async (systemMessage, chatMessages) => {
  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "system", content: systemMessage }, ...chatMessages],
      model: "gpt-4o-mini",
      temperature: 0.8,
    });

    const message = response.choices[0].message;
    const tokens = response.usage.total_tokens;

    return { message: message, tokens: tokens };
  } catch (error) {
    console.error("Error generating chat response:", error);
    return null;
  }
};
