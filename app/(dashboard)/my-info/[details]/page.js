import { notFound } from "next/navigation";
import { fetchUserJson } from "../../../utils/server-actions";
import DetailDisplay from "../../../components/DetailDisplay";
const MyInfoPage = async ({ params }) => {
  const validPaths = [
    "hopes-and-dreams",
    "skills-and-achievements",
    "obstacles-and-challenges",
  ];

  // Check if the current path is valid
  if (!validPaths.includes(params.details)) {
    notFound();
  }

  const userJson = await fetchUserJson();
  const firstName = Object.keys(userJson)[0];
  const typeJson = userJson[firstName];
  const type = params.details.replace(/-/g, " ");

  return <DetailDisplay type={type} data={typeJson[type]} />;
};

export default MyInfoPage;
