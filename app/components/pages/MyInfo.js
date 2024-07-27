import { notFound } from "next/navigation";
import { IoIosRocket } from "react-icons/io";

const MyInfo = ({ userData, details, compact = false }) => {
  const firstName = Object.keys(userData)[0];
  const userDataJson = userData[firstName];
  const type = details.replace(/-/g, " ");

  if (!userDataJson[type] || !Array.isArray(userDataJson[type])) {
    return <p>No data found for {type}</p>;
  }

  return (
    <div>
      {!compact && (
        // if we are displaying an info page, include the title
        <h2 className="text-2xl font-bold mb-4">Your {type}</h2>
      )}
      <div className="space-y-4">
        {userDataJson[type].map((item, index) => (
          <div
            key={index}
            className="p-4 max-w-3xl first:bg-base-100 rounded-xl shadow-md space-y-2"
          >
            <div className="text-xl font-medium text-accent">{item.name}</div>
            {!compact && (
              <>
                <p className="text-secondary text-lg">{item.description}</p>
                <div className="flex items-center">
                  <IoIosRocket className="text-primary mr-2 text-2xl" />
                  <p className="text-primary">
                    {item.outcome || item.benefit || item.result}
                  </p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyInfo;
