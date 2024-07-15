import { getMindStateField } from "../../../utils/about-me-actions";
import { pages } from "../../../utils/pages";

import MissingDetails from "../../../components/MissingDetails";

import { auth, currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { IoIosRocket } from "react-icons/io";

const DetailsPage = async ({ params }) => {
  const { details } = params;

  if (!pages.includes(details)) {
    notFound();
  }

  const { userId } = auth();
  console.log(`userId: ${userId} details: ${details}`);

  const userDetails = await getMindStateField(
    userId,
    details.replace(/-/g, "_")
  );
  const jsonDataName = details.replace(/-/g, " ");

  if (!userDetails) {
    return (
      <MissingDetails>
        You need to complete the journaling exercises before accessing your
        info.
      </MissingDetails>
    );
  }

  return (
    <div className="space-y-4">
      {userDetails[jsonDataName].map((item, index) => (
        <div
          key={index}
          className="p-4 max-w-3xl first:bg-base-100  rounded-xl shadow-md space-y-2"
        >
          <div className="text-xl font-medium text-secondary"> {item.name}</div>
          <p className="text-gray-500">{item.description}</p>
          <div className="flex space-y-2 items-center">
            <IoIosRocket className="text-primary mr-2 text-2xl" />
            <p className="text-primary">{item.outcome}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetailsPage;
