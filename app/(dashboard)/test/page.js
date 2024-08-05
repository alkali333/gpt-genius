import { fetchDiaryEncouragementMessage } from "/app/utils/about-me-actions";

const DiaryMessage = async () => {
  const message = await fetchDiaryEncouragementMessage();

  return <div>{message}</div>;
};

export default DiaryMessage;
