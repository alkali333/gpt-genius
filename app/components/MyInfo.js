import { notFound } from "next/navigation";
import { IoIosRocket } from "react-icons/io";
import MissingDetails from "./MissingDetails";
import { pages } from "/app/utils/pages";

const MyInfo = ({ userData, details }) => {
  const firstName = Object.keys(userData)[0];
  const userDataJson = userData[firstName];
  const type = details.replace(/-/g, " ");

  if (!pages.includes(details)) {
    notFound();
  }

  if (!userDataJson[type] || !Array.isArray(userDataJson[type])) {
    return <p>No data found for {type}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your {type}</h2>
      <div className="space-y-4">
        {userDataJson[type].map((item, index) => (
          <div
            key={index}
            className="p-4 max-w-3xl first:bg-base-100 rounded-xl shadow-md space-y-2"
          >
            <div className="text-xl font-medium text-secondary">
              {item.name}
            </div>
            <p className="text-gray-500">{item.description}</p>
            <div className="flex items-center">
              <IoIosRocket className="text-primary mr-2 text-2xl" />
              <p className="text-primary">{item.outcome || item.benefit}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyInfo;
