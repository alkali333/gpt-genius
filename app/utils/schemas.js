import * as z from "zod";

export const eveningJournalSchema = z.object({
  message: z.string().min(150).max(1000),
});

export const aboutMeSchema = z.object({
  message: z.string().min(250).max(1500),
});
