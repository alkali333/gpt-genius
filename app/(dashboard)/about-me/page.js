import AboutMe from "/app/components/pages/AboutMe";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const AboutMePage = () => {
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AboutMe />
    </HydrationBoundary>
  );
};

export default AboutMePage;
