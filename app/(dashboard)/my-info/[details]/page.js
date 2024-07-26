"use client";
import { useUserData } from "/app/contexts/useDataContext";
import MyInfo from "../../../components/pages/MyInfo";
import MissingDetails from "../../../components/messages/MissingDetails";
import pages from "/app/utils/pages";

const MyInfoPage = ({ params }) => {
  if (!pages.includes(details)) {
    notFound();
  }

  const { userData } = useUserData();

  if (!userData) {
    return (
      <MissingDetails>Please complete the journalling exercise.</MissingDetails>
    ); // Or any loading state you prefer
  }

  return <MyInfo userData={userData} details={params.details} />;
};

export default MyInfoPage;
