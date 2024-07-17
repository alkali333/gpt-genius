// queries/dailyMessageQuery.js
import { fetchDailySummary } from "/app/utils/about-me-actions";

export const getDailyMessage = async ({ queryKey }) => {
  const [_, userName, userData] = queryKey;
  const { "grateful for": grateful_for, "current tasks": current_tasks } =
    userData[userName];

  if (
    !grateful_for ||
    !current_tasks ||
    (Array.isArray(grateful_for) && grateful_for.length === 0) ||
    (Array.isArray(current_tasks) && current_tasks.length === 0)
  ) {
    return "Please fill out your daily diary to receive a personalized message.";
  }

  const combinedData = {
    [userName]: { grateful_for, current_tasks },
  };

  return await fetchDailySummary(userName, JSON.stringify(combinedData));
};
