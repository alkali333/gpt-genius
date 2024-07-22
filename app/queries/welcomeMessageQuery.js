// queries/welcomeMessageQuery.js
import { fetchWelcomeMessage } from "/app/utils/about-me-actions";

export const getWelcomeMessage = async ({ queryKey }) => {
  const [_, userData] = queryKey;

  if (!userData) {
    return "Please complete your profile to receive a personalized welcome message.";
  }

  const stringifiedData = JSON.stringify(userData);

  return await fetchWelcomeMessage(stringifiedData);
};
