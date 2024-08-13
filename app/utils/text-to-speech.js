// app/actions.js
"use server";

import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Readable } from "stream";

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

    const fileName = `${uuidv4()}.mp3`;
    const filePath = path.join(process.cwd(), "public", fileName);

    fs.writeFileSync(filePath, audioBuffer);
    console.log("Audio file written to:", filePath);

    return `/${fileName}`;
  } catch (error) {
    console.error("Error synthesizing speech:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    throw new Error("Failed to synthesize speech");
  }
}
