import SingleTour from "/app/components/SingleTour";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const SingleTourPage = ({ params }) => {
  const queryClient = new QueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SingleTour id={params.id} />
    </HydrationBoundary>
  );
};

export default SingleTourPage;

// Create a SingleTour component and wrap in the hydration
// create an action to get a single tour from an id
// use the TourInfo component to display the tour on SingleTour
