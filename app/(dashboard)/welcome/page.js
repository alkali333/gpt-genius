import { useEffect, useState } from "react"; // Import useEffect and useState
import { useUserData } from "/app/contexts/useDataContext";
import { useRouter } from "next/router"; // Use useRouter for redirects
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import WelcomeMessage from "/app/components/WelcomeMessage";
import { QueryClient } from "@tanstack/react-query";

const WelcomePage = () => {
  const { userData } = useUserData();
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const router = useRouter(); // Use useRouter for redirects
  const queryClient = new QueryClient();

  useEffect(() => {
    if (userData) {
      setIsLoading(false); // Data is loaded, set loading to false
    } else if (userData === null) {
      router.push("/about-me"); // Redirect if userData is explicitly null
    }
    // This effect should run only once on component mount, hence the empty dependency array
  }, [userData, router]);

  if (isLoading) {
    return <div>Loading...</div>; // Show loading state or a spinner
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WelcomeMessage />
    </HydrationBoundary>
  );
};

export default WelcomePage;
