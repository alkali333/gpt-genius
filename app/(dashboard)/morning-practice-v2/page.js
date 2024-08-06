import MorningPractice from "/app/components/pages/MorningPractice";

import { fetchCoachingContent } from "/app/utils/server-actions";
import { marked } from "marked";

const MorningPracticePage = async () => {
  const morningMessage =
    await fetchCoachingContent(`Based on the USER INFO. Write a short message 
      (100 words) reminding them of their goals, things they are grateful for,
      and tasks. Invite them to record their daily gratitude and task list.`);

  const htmlMessage = marked(morningMessage.data);

  return <MorningPractice morningMessage={htmlMessage} />;
};

export default MorningPracticePage;
