// app/actions.js
"use server";

import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import fs from "fs";
import path from "path";
import { fetchAuthUser } from "./server-actions";

console.log("AWS Region:", process.env.AWS_REGION);
console.log("AWS Access Key ID:", process.env.AWS_ACCESS_KEY_ID);
console.log("AWS Secret Access Key:", process.env.AWS_SECRET_ACCESS_KEY);

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
    Text: text,
    OutputFormat: "mp3",
    VoiceId: "Emma",
  };

  // Debug logging for Polly parameters
  console.log("Polly parameters:", JSON.stringify(params, null, 2));

  try {
    console.log("Sending request to Amazon Polly...");
    const command = new SynthesizeSpeechCommand(params);
    const data = await client.send(command);

    console.log("Response received from Amazon Polly");
    console.log("AudioStream type:", typeof data.AudioStream);

    // Convert the readable stream to a buffer
    const chunks = [];
    for await (const chunk of data.AudioStream) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    console.log("AudioStream converted to buffer");
    console.log("Buffer length:", audioBuffer.length);

    // Create user directory if it doesn't exist
    const userDir = path.join(process.cwd(), "public", user.id);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    const fileName = "meditation.mp3";
    const filePath = path.join(userDir, fileName);

    fs.writeFileSync(filePath, audioBuffer);
    console.log("Audio file written to:", filePath);

    return {
      message: "Speech synthesized succesfully",
      data: `/${user.id}/${fileName}`,
    };
  } catch (error) {
    console.error("Error synthesizing speech:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    throw new Error("Failed to synthesize speech");
    return { message: "Failed to synthesize speech", data: null };
  }
}
