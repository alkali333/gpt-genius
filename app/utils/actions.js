"use server";

import OpenAI from "openai";

import prisma from "./db";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateChatResponse = async (chatMessages) => {
  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "you are a helpful assistant" },
        ...chatMessages,
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      max_tokens: 100,
    });

    const message = response.choices[0].message;
    return message;
  } catch (error) {
    console.error("Error generating chat response:", error);
    return null;
  }
};

export const generateTourResponse = async ({
  city,
  country = "(unspecified)",
}) => {
  const query = `Find a ${city} in this ${country}. If country is unspecified, do not included it in response,
  and choose the mostlikely country based on the city name.
  If ${city} in this ${country} exists, create a list of things families can do in this ${city},${country}.
  Once you have a list, create a one-day tour. Response should be in the following JSON format. 
  {
    "tour": {
      "city": "${city}",
      "country": "${country}",
      "title": "title of the tour",
      "description": "description of the city and tour",
      "stops": ["short paragraph on the stop 1", "short paragraph on the stop 2","short paragraph on the stop 3"]
    }
  }
  If you can't find info on exact ${city}, or ${city} does not exist, or its population is less than 1, or it is not located in the following ${country}
  return {"tour": null }, with no additional characters.`;

  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a tour guide who always includes jokes in their tours. You return responses only in JSON format",
        },
      ],
      messages: [
        {
          role: "user",
          content: query,
        },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.5,
    });

    const message = response.choices[0].message.content;
    // console.log("Response from OpenAI:", message);

    try {
      const tourData = JSON.parse(message);
      if (!tourData.tour) {
        console.error("Data recieved does not include a tour");
        return null;
      }
      return tourData.tour;
    } catch (error) {
      console.error("Error parsing tour data:", error);
      return null;
    }

    return message;
  } catch (error) {
    console.error("Error generating tour response:", error);
    return null;
  }
};

export const getExistingTour = async ({ city, country = "not supplied" }) => {
  return prisma.tour.findUnique({
    where: {
      city_country: {
        city,
        country,
      },
    },
  });
};

export const createNewTour = async (tour) => {
  // retuns a promise
  return prisma.tour.create({
    data: tour,
  });
};

export const getTours = async () => {
  try {
    const tours = await prisma.tour.findMany();
    return tours;
  } catch (error) {
    console.error("Error retrieving tours:", error);
    return null;
  }
};
