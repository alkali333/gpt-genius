import MorningPractice from "/app/components/pages/MorningPractice";

import { fetchCoachingContent } from "/app/utils/server-actions";
import { marked } from "marked";
import { currentUser } from "@clerk/nextjs/server";

const MorningPracticePage = async () => {
  const user = await currentUser();

  const morningMessageContent = !user?.publicMetadata.hasMorningJournals
    ? await fetchCoachingContent(`Based on the USER INFO. Write a short message 
    (100 words) reminding them of their goals, things they are grateful for,
    and tasks. Invite them to record their daily gratitude and task list.`)
    : `The morning practice is to fill out the two forms. List five things you
  are grateful for, and five tasks that can bring you closer to your goals`;

  const htmlMessage = marked(morningMessageContent.data);

  return <MorningPractice morningMessage={htmlMessage} />;
};

export default MorningPracticePage;
