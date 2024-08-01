"use client";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { useUserData } from "/app/contexts/useDataContext";
import MyInfo from "/app/components/pages/MyInfo";
import MissingDetails from "/app/components/messages/MissingDetails";

const MyInfoPage = ({ params }) => {
  const router = useRouter(); //
  const { userData, isLoading } = useUserData();

  useEffect(() => {
    if (!isLoading && userData === null) {
      router.push("/about-me");
    }
  }, [userData, isLoading, router]);

  if (isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>; // Show loading state or a spinner
  }

  const validPaths = [
    "hopes-and-dreams",
    "skills-and-achievements",
    "obstacles-and-challenges",
  ];

  // Check if the current path is valid
  if (!validPaths.includes(params.details)) {
    notFound();
  }

  if (!userData) {
    return (
      <MissingDetails>Please complete the journalling exercise.</MissingDetails>
    );
  }

  return <MyInfo userData={userData} details={params.details} />;
};

export default MyInfoPage;
