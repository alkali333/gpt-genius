"use client";
import { useEffect } from "react";
import { useUserData } from "/app/contexts/useDataContext";
import { useRouter } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import WelcomeMessage from "/app/components/messages/WelcomeMessage";
import { QueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const WelcomePage = () => {
  const { userData, isLoading } = useUserData();
  const router = useRouter();
  const queryClient = new QueryClient();

  useEffect(() => {
    if (!isLoading && userData === null) {
      toast("Please complete the journalling exercises first.");
      router.push("/about-me");
    }
  }, [userData, isLoading, router]);

  if (isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  if (!userData) {
    return null; // This prevents flash of content before redirect
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WelcomeMessage />
    </HydrationBoundary>
  );
};

export default WelcomePage;
