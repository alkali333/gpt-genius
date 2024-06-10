"use server";

import OpenAI from "openai";

import prisma from "./db";
import axios from "axios";
import fs from "fs";
import path from "path";
import stream from "stream";
import { promisify } from "util";

const pipeline = promisify(stream.pipeline);

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
  const newTour = prisma.tour.create({
    data: tour,
  });

  return newTour;
};

export const getTours = async (searchTerm) => {
  if (!searchTerm) {
    const tours = await prisma.tour.findMany({
      orderBy: {
        city: "asc",
      },
    });
    return tours;
  }
  const tours = await prisma.tour.findMany({
    where: {
      OR: [
        {
          city: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          country: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: {
      city: "asc",
    },
  });

  return tours;
};

export const generateTourImage = async (city, country = "") => {
  try {
    console.log("Making API request for tour image");
    const tourImage = await openai.images.generate({
      prompt: `a panoramic view of ${city}, ${country}`,
      n: 1,
      size: "512x512",
    });

    console.log("Image object received from api:", tourImage);
    const imageUrl = tourImage?.data[0]?.url;
    if (!imageUrl) {
      console.error("No image data received");
      return null;
    }

    const imageName = `${city.toLowerCase()}-${country.toLowerCase()}.png`;
    const imagePath = path.join(
      process.cwd(),
      "public",
      "tour-images",
      imageName
    );

    console.log("Downloading image");
    const response = await axios({
      url: imageUrl,
      responseType: "stream",
    });

    console.log("Writing image to server");
    await pipeline(response.data, fs.createWriteStream(imagePath));

    console.log("Image written to server. Path:", imagePath);

    return `/tour-images/${imageName}`;
  } catch (error) {
    console.error("Error generating tour image:", error);
    return null;
  }
};

export const generateTourImageDummy = async (city, country = "") => {
  console.log("Generating dummy tour image");

  const tourImage = {
    created: 1717941922,
    data: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/7/70/Example.png",
      },
    ],
  };

  const imageUrl = tourImage?.data[0]?.url;
  if (!imageUrl) {
    console.error("No image data received");
    return null;
  }

  const imageName = `${city.toLowerCase()}-${country.toLowerCase()}.png`;
  const imagePath = path.join(
    process.cwd(),
    "public",
    "tour-images",
    imageName
  );

  try {
    console.log("Downloading image");
    const response = await axios({
      url: imageUrl,
      responseType: "stream",
    });

    console.log("Writing image to server");
    await pipeline(response.data, fs.createWriteStream(imagePath));

    console.log("Image written to server. Path:", imagePath);

    return `/${imageName}`;
  } catch (error) {
    console.error("Error generating tour image:", error);
    return null;
  }
};
export const getTourById = async (id) => {
  try {
    const tour = await prisma.tour.findUnique({
      where: {
        id,
      },
    });
    return tour;
  } catch (error) {
    console.error("Error retrieving tour by id:", error);
    return null;
  }
};

export const deleteTourById = async (id) => {
  try {
    const deletedTour = await prisma.tour.delete({
      where: {
        id,
      },
    });
    return deletedTour;
  } catch (error) {
    console.error("Error deleting tour by id:", error);
    return null;
  }
};
