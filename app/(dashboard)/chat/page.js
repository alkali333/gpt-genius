import CoachChat from "/app/components/pages/CoachChat";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const ChatPage = () => {
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CoachChat />
    </HydrationBoundary>
  );
};

export default ChatPage;
