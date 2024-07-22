import Meditation from "../../components/pages/Meditation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const MeditationPage = () => {
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Meditation />
    </HydrationBoundary>
  );
};

export default MeditationPage;
