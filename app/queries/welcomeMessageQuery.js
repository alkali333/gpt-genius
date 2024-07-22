// queries/welcomeMessageQuery.js
import { fetchWelcomeMessage } from "/app/utils/about-me-actions";

export const getWelcomeMessage = async ({ queryKey }) => {
  const [_, userInfo] = queryKey;

  if (!userInfo) {
    return "Please complete your profile to receive a personalized welcome message.";
  }

  return await fetchWelcomeMessage(userInfo);
};
