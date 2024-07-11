import { getMindStateField } from "../../../utils/about-me-actions";
import { auth, currentUser } from "@clerk/nextjs/server";
import { IoIosRocket } from "react-icons/io";

const Details = async () => {
  const { userId } = auth();
  const hopesAndDreams = await getMindStateField(userId, "hopes_and_dreams");
  console.log(hopesAndDreams);

  return (
    <div className="space-y-4">
      {hopesAndDreams["hopes and dreams"].map((item, index) => (
        <div
          key={index}
          className="p-4 max-w-3xl first:bg-base-100  rounded-xl shadow-md space-y-2"
        >
          <div className="text-xl font-medium text-black"> {item.name}</div>
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

export default Details;
