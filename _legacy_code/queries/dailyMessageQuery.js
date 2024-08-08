// queries/dailyMessageQuery.js
import { fetchDailySummary } from "/app/utils/about-me-actions";

function checkFields(data) {
  for (const user in data) {
    if (
      data[user].hasOwnProperty("grateful for") &&
      data[user].hasOwnProperty("current tasks")
    ) {
      return true;
    }
  }
  return false;
}

export const getDailyMessage = async ({ queryKey }) => {
  const [_, userData] = queryKey;
  console.log(`User Data ${JSON.stringify(userData)}`);
  if (!checkFields(userData)) {
    return "Your morning practice is to fill out the two forms below, think of five things to be grateful for (achievements, situations, places, people, etc.) and positive things you can do today to help you move towards your goals.";
  }

  return await fetchDailySummary(JSON.stringify(userData));
};
