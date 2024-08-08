import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import DailyDiary from "../../components/pages/DailyDiary";

const DailyDiaryPage = () => {
  const queryClient = new QueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DailyDiary />
    </HydrationBoundary>
  );
};

export default DailyDiaryPage;
