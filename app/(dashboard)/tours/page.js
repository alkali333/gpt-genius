import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import ListTours from "../../components/ListTours";

const Tours = () => {
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListTours />
    </HydrationBoundary>
  );
};

export default Tours;
