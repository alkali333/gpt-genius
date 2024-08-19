// app/actions.js
"use server";

import {
  PollyClient,
  SynthesizeSpeechCommand,
  TextType,
} from "@aws-sdk/client-polly";
import fs from "fs";
import path from "path";
import { fetchAuthUser } from "./server-actions";

const client = new PollyClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function synthesizeSpeech(text) {
  const user = await fetchAuthUser();

  if (!user.id) {
    throw new Error("User not authenticated");
  }

  const params = {
    Text: `<speak><prosody rate='80%'>${text}</prosody></speak>`,
    OutputFormat: "mp3",
    VoiceId: "Emma",
    Engine: "neural",
    LanguageCode: "en-GB",
    TextType: "ssml",
  };

  try {
    console.log("Sending request to Amazon Polly...");
    const command = new SynthesizeSpeechCommand(params);
    const data = await client.send(command);

    console.log("Response received from Amazon Polly");

    // Convert the readable stream to a buffer
    const chunks = [];
    for await (const chunk of data.AudioStream) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    console.log("AudioStream converted to buffer");
    console.log("Buffer length:", audioBuffer.length);

    // Create user-audio directory in the public folder if it doesn't exist
    const publicDir = path.join(process.cwd(), "public");
    const userAudioDir = path.join(publicDir, "user-audio");
    if (!fs.existsSync(userAudioDir)) {
      fs.mkdirSync(userAudioDir, { recursive: true });
    }

    // Create user directory within user-audio if it doesn't exist
    const userDir = path.join(userAudioDir, user.id);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    // Delete existing files in the user's directory
    const existingFiles = fs.readdirSync(userDir);
    for (const file of existingFiles) {
      fs.unlinkSync(path.join(userDir, file));
    }
    console.log("Existing files deleted from user directory");

    const fileName = `meditation_${Date.now()}.mp3`;
    const filePath = path.join(userDir, fileName);

    fs.writeFileSync(filePath, audioBuffer);
    console.log("Audio file written to:", filePath);

    // Use my API rather than the file path
    const relativePath = `/api/audio/${user.id}/${fileName}`;
    console.log(`Returning path: ${relativePath}`);

    return {
      message: "Speech synthesized successfully",
      data: relativePath,
    };
  } catch (error) {
    console.error("Error synthesizing speech:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return { message: "Failed to synthesize speech", data: null };
  }
}
