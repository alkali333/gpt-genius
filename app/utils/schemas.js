import * as z from "zod";

const countWords = (str) => str.trim().split(/\s+/).length;

const wordCountSchema = (minWords, maxWords) =>
  z.string().refine(
    (value) => {
      const wordCount = countWords(value);
      return wordCount >= minWords && wordCount <= maxWords;
    },
    {
      message: `String must be between ${minWords} and ${maxWords} words.`,
    }
  );

export const eveningJournalSchema = z.object({
  message: wordCountSchema(150, 1000),
});

export const aboutMeSchema = z.object({
  message: wordCountSchema(250, 1500),
});

export const morningJournalSchema = z.object({
  gratitude1: z.string().min(10).max(100),
  gratitude2: z.string().min(10).max(100),
  gratitude3: z.string().min(10).max(100),
  gratitude4: z.string().min(10).max(100),
  gratitude5: z.string().min(10).max(100),
});
