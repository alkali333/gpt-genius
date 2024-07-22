"use client";
import { useEffect, useState } from "react";
import { useUserData } from "/app/contexts/useDataContext";
import { useRouter } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import WelcomeMessage from "/app/components/messages/WelcomeMessage";
import { QueryClient } from "@tanstack/react-query";

const WelcomePage = () => {
  const { userData } = useUserData();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); //
  const queryClient = new QueryClient();

  useEffect(() => {
    if (userData) {
      setIsLoading(false);
    } else if (userData === null) {
      router.push("/about-me");
    }
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
