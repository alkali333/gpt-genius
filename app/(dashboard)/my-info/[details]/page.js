"use client";
import { useUserData } from "/app/contexts/useDataContext";
import MyInfo from "../../../components/MyInfo";
import MissingDetails from "../../../components/MissingDetails";

const MyInfoPage = ({ params }) => {
  const { userData } = useUserData();

  if (!userData) {
    return (
      <MissingDetails>Please complete the journalling exercise.</MissingDetails>
    ); // Or any loading state you prefer
  }

  return <MyInfo userData={userData} details={params.details} />;
};

export default MyInfoPage;
