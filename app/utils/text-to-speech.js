"use server";

const {
  PollyClient,
  SynthesizeSpeechCommand,
} = require("@aws-sdk/client-polly");
const { writeFile } = require("fs/promises");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

export async function textToSpeech(text) {
  const polly = new PollyClient({
    region: "us-west-2", // Replace with your preferred region
  });

  const params = {
    OutputFormat: "mp3",
    Text: text,
    VoiceId: "Joanna", // Replace with your preferred voice
    Engine: "neural",
  };

  try {
    const command = new SynthesizeSpeechCommand(params);
    const { AudioStream } = await polly.send(command);

    if (!AudioStream) {
      throw new Error("No audio stream returned from Polly");
    }

    const fileName = `${uuidv4()}.mp3`;
    const filePath = path.join(process.cwd(), "public", fileName);

    await writeFile(filePath, AudioStream);

    return `/${fileName}`;
  } catch (error) {
    console.error("Error in text-to-speech conversion:", error);
    throw error;
  }
}
