// app/actions.js
"use server";

import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const polly = new AWS.Polly();

export async function synthesizeSpeech(text) {
  const params = {
    Text: text,
    OutputFormat: "mp3",
    VoiceId: "Emma",
  };

  try {
    const data = await polly.synthesizeSpeech(params).promise();
    const fileName = `${uuidv4()}.mp3`;
    const filePath = path.join(process.cwd(), "public", fileName);

    fs.writeFileSync(filePath, data.AudioStream);

    return `/${fileName}`;
  } catch (error) {
    console.error("Error synthesizing speech:", error);
    throw new Error("Failed to synthesize speech");
  }
}
