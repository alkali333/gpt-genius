import * as z from "zod";

export const eveningJournalSchema = z.object({
  message: z.string().min(150).max(1000),
});

export const aboutMeSchema = z.object({
  message: z.string().min(250).max(1500),
});

export const morningJournalSchema = z.object({
  gratitude1: z.string().min(10).max(100),
  gratitude2: z.string().min(10).max(100),
  gratitude3: z.string().min(10).max(100),
  gratitude4: z.string().min(10).max(100),
  gratitude5: z.string().min(10).max(100),
});
