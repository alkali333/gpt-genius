// DiaryMessage.js
import { fetchDiaryEncouragementMessage } from "/app/utils/about-me-actions";

const DiaryMessage = ({ userInfo, latestEntry }) => {
  const latestDiaryMessage = getDiaryMessage(userInfo);

  return <div>{latestDiaryMessage}</div>;
};

export default DiaryMessage;
