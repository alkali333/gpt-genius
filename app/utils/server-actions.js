"use server";
import prisma from "./db";
import OpenAI from "openai";

import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { ZodError } from "zod";
import { revalidatePath } from "next/cache";
import { marked } from "marked";

import {
  gratitudeSchema,
  todoSchema,
  aboutMeSchema,
  eveningJournalSchema,
  diarySchema,
  meditationDiarySchema,
} from "/app/utils/schemas";

import { synthesizeSpeech } from "./text-to-speech";
import { clerkClient } from "@clerk/nextjs/server";
import {
  getRandomExercise,
  getRandomMorningExercise,
} from "/app/utils/exercises";
import { allowedUsers } from "/app/utils/allowed-users";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const fetchAuthUser = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  // if (!allowedUsers.includes(user.email)) {
  //   redirect("/request-permission");
  // }

  return { firstName: user.firstName, id: user.id };
};

const revalidateAllUserPaths = () => {
  const staticPaths = ["/welcome", "/morning-practice", "/evening-practice"];

  const dynamicPaths = [{ path: "/my-info/[details]", type: "page" }];

  staticPaths.forEach((path) => revalidatePath(path));
  dynamicPaths.forEach(({ path, type }) => revalidatePath(path, type));
};

export const fetchUserJson = async () => {
  const user = await fetchAuthUser();

  const details = await prisma.mindState.findUnique({
    where: { clerkId: user.id },
    select: {
      hopes_and_dreams: true,
      skills_and_achievements: true,
      obstacles_and_challenges: true,
    },
  });

  // Fetch only the latest diary entry text
  const latestDiaryEntry = await prisma.diary.findFirst({
    where: { clerkId: user.id },
    orderBy: { date: "desc" },
    select: { entry: true },
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

    // Add the simplified latest diary entry to the combined data
    combinedData.latest_diary_entry = latestDiaryEntry
      ? latestDiaryEntry.entry
      : "none available";

    const userInfo = { [user.firstName]: combinedData };
    //   console.log("User Info:", userInfo);
    return userInfo;
  }

  // If no user is found or any of the required fields are missing, return null
  return null;
};

export const updateMindState = async (column, data) => {
  try {
    const user = await fetchAuthUser();
    console.log("User:", user);

    if (!user || !user.id) {
      console.error("No user found or user has no id");
      return { message: "User not authenticated", data: null };
    }

    console.log(`Updating column: ${column}`);
    console.log("Data to update:", JSON.stringify(data, null, 2));

    const existingUser = await prisma.mindState.findUnique({
      where: { clerkId: user.id },
    });

    console.log("Existing user:", existingUser);

    let returnData;
    if (existingUser) {
      returnData = await prisma.mindState.update({
        where: { clerkId: user.id },
        data: { [column]: data },
      });
    } else {
      returnData = await prisma.mindState.create({
        data: { clerkId: user.id, [column]: data },
      });
    }

    console.log("Return data:", returnData);

    if (returnData) {
      revalidateAllUserPaths();

      // Update Clerk metadata
      await clerkClient.users.updateUserMetadata(user.id, {
        publicMetadata: { [`has_${column}`]: true },
      });
    }

    return { message: "Mind state updated", data: returnData };
  } catch (error) {
    console.error("Error in updateMindState:", error);
    return { message: error.message, data: null };
  }
};

export const getMindStateColumn = async (column) => {
  const user = await fetchAuthUser();

  const data = await prisma.mindState.findUnique({
    where: { clerkId: user.id },
    select: { [column]: true },
  });

  if (data && data[column] !== undefined) {
    return {
      message: `Mind state retrieved for ${user.firstName}, column: ${column}`,
      data: data[column],
    };
  } else {
    return {
      message: `Cannot find data for ${user.firstName}, column: ${column}`,
      data: null,
    };
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

export async function insertDiaryEntry(prevState, formData) {
  console.log("Insert Diary Entry Triggered");
  const user = await fetchAuthUser();
  const rawData = Object.fromEntries(formData);

  // Debugging: Log the raw data received
  console.log("Raw Data:", rawData);

  try {
    const validatedFields = diarySchema.parse(rawData);

    // Debugging: Log the validated fields
    console.log("Validated Fields:", validatedFields);

    const newEntry = await prisma.diary.create({
      data: {
        clerkId: user.id,
        ...validatedFields,
      },
    });

    // Debugging: Log the new entry created
    console.log("New Entry:", newEntry);
    revalidatePath("/evening-practice");

    return { message: "Diary entry successfully created", data: newEntry };
  } catch (error) {
    return handleError(error);
  }
}

const handleError = (error) => {
  if (error instanceof ZodError) {
    const errorMessage = error.errors[0]?.message || "Validation error";

    console.log("Validation Error:", errorMessage);

    return { message: errorMessage, data: null };
  }

  // Debugging: Log any unexpected errors
  console.log("Unexpected Error:", error);

  return { message: "An unexpected error occurred", data: null };
};

export const getLatestDiaryEntry = async () => {
  const user = fetchAuthUser();

  console.log("Fetching latest diary entry");
  const latestEntry = await prisma.diary.findFirst({
    where: { clerkId: user.id },
    orderBy: { date: "desc" },
    select: { entry: true },
  });

  if (latestEntry) {
    console.log("Diary entry found");
    return { message: "Diary entry retrieved", data: latestEntry.entry };
  } else {
    console.log("No Diary entry found");
    return { message: "No diary entry found", data: null };
  }
};

export const updateMeditationDiary = async (prevState, formData) => {
  const user = await fetchAuthUser();
  const rawData = Object.fromEntries(formData);
  try {
    const validatedFields = meditationDiarySchema.parse(rawData);
    const newEntry = await prisma.meditationDiary.create({
      data: {
        clerkId: user.id,
        ...validatedFields,
      },
    });

    return { message: "Meditation diary updated", data: newEntry };
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessage = error.errors[0]?.message || "Validation error";

      return { message: errorMessage, data: null };
    }
  }
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
      max_tokens: 750,
    });

    const reply = response.choices[0].message.content;

    return { message: "Received OpenAI response", data: reply };
  } catch (error) {
    console.error("Error generating chat response:", error);
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

export const fetchCoachingContent = async (prompt, htmlMode = true) => {
  console.log("Fetching coaching content");
  const userJson = await fetchUserJson();

  // if there is no userData, it must be a new user
  if (!userJson) redirect("/about-me");

  const userStr = JSON.stringify(userJson);

  const systemMessage = `You are Attenshun, a powerful AI wellness app, your job is to make sure the user focuses their attention on what is important. Use the user
    information below to generate personalised messages and exercises addressing the user by name. Encourage and empower the user. You are optimistic and passionately 
    believe in their abilities. \n\n
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
      data: htmlMode ? marked(openAIResponse.data) : openAIResponse.data,
    };
  } else {
    return { message: "Error retrieving welcome message", data: null };
  }
};

export const generateEveningPracticeMessage = async () => {
  console.log("Generating evening practice message");
  const diaryEntry = await getLatestDiaryEntry();

  if (!diaryEntry.data) {
    return {
      message: "User has no diary yet, returning default message",
      data: `Write at least 150 words about what you did today in relation
    to your hopes and dreams. Did you make progress towards all or
    some of them? Or did you procrastinate? Is there anything you
    could have done differently?`,
    };
  }

  const prompt = `Analyze the users last diary entry in relation to the 
  users goals and other info. Comment on how they are doing based on the 
  user information. Offer encouragement and suggestions for improvement 
  and task ideas. Invite them to write their next diary entry, reflecting
   on how they did today in relation to their goals. 
  150 words max. \n\n
  Diary Entry: ${diaryEntry.data}`;

  console.log("Prompt for evening practice:", prompt);

  const response = await fetchCoachingContent(prompt);
  if (!response.data) {
    return {
      message: `Error generating evening practice message. ${
        response.message || "An unexpected error occurred"
      }`,
      data: null,
    };
  }

  return { message: "Evening Practice Generated", data: response.data };
};

export const generateMorningPracticeMessage = async () => {
  const prompt = getRandomMorningExercise();

  const response = await fetchCoachingContent(prompt);
  if (!response.data) {
    return {
      message: `Error generating morning practice message. ${
        response.message || "An unexpected error occurred"
      }`,
      data: null,
    };
  }

  return { message: "Morning Practice Generated", data: response.data };
};

export const generateChatResponse = async (systemMessage, chatMessages) => {
  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "system", content: systemMessage }, ...chatMessages],
      model: "gpt-4o",
      temperature: 0.8,
    });

    const reply = response.choices[0].message.content;

    return marked(reply);
  } catch (error) {
    console.error("Error generating chat response:", error);
    return null;
  }
};

export const summarizeAndUpdateMindState = async (type, userInput) => {
  try {
    // Convert type to column name by replacing spaces with underscores
    const column = type.replace(/ /g, "_").toLowerCase();

    console.log("Summarizing user info for:", type);
    const summaryResult = await summarizeInfo(userInput, type);

    if (!summaryResult.data) {
      return {
        message: `Error summarizing ${type}: ${summaryResult.message}`,
        data: null,
      };
    }

    console.log("Updating mind state for:", type);
    const updateResult = await updateMindState(column, summaryResult.data);

    if (!updateResult.data) {
      return {
        message: `Error updating ${type}: ${updateResult.message}`,
        data: null,
      };
    }

    return {
      message: `Successfully summarized and updated ${type}`,
      data: updateResult.data,
    };
  } catch (error) {
    console.error(`Error in summarizeAndUpdateMindState for ${type}:`, error);
    return { message: `Unexpected error: ${error.message}`, data: null };
  }
};

export const generateMeditation = async (
  useDiary = false,
  type = null,
  custom_exercise = null
) => {
  try {
    let exercise = custom_exercise || getRandomExercise();

    if (useDiary) {
      const diaryEntry = await getLatestDiaryEntry();
      if (diaryEntry.data) {
        exercise += ` \n Also use on their latest diary entry: \n\n
      DIARY ENTRY: ${diaryEntry.data}`;
      }
    }

    if (type) {
      exercise += ` \n\n ${type}`;
    }

    const meditation = await fetchCoachingContent(exercise, false);

    if (!meditation || !meditation.data) {
      throw new Error("Failed to fetch coaching content");
    }

    console.log(`Meditation content: ${meditation.data}`);

    const audioResult = await synthesizeSpeech(meditation.data);

    if (!audioResult || !audioResult.data) {
      throw new Error(
        audioResult.message || "Failed to synthesize speech for meditation"
      );
    }

    return {
      message: "Meditation generated successfully",
      data: audioResult.data,
    };
  } catch (error) {
    console.error("Error in generateMeditation:", error);
    return {
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while generating meditation",
      data: null,
    };
  }
};

// Seperate functions to avoid the timeouts that can happen on free hosting

export const generateMeditationText = async (
  useDiary = false,
  type = null,
  custom_exercise = null
) => {
  try {
    let exercise = custom_exercise || getRandomExercise();

    if (useDiary) {
      const diaryEntry = await getLatestDiaryEntry();
      if (diaryEntry.data) {
        exercise += ` \n Also use on their latest diary entry: \n\n
      DIARY ENTRY: ${diaryEntry.data}`;
      }
    }

    if (type) {
      exercise += ` \n\n ${type}`;
    }

    const meditation = await fetchCoachingContent(exercise, false);

    if (!meditation || !meditation.data) {
      throw new Error("Failed to fetch coaching content");
    }

    console.log(`Meditation content: ${meditation.data}`);

    return {
      message: "Meditation generated successfully",
      data: meditation.data,
    };
  } catch (error) {
    console.error("Error in generateMeditationText:", error);
    return {
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while generating meditation",
      data: null,
    };
  }
};
