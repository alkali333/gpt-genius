import React from "react";
import { FaStar } from "react-icons/fa";
import { IoIosRocket } from "react-icons/io";

const DetailDisplay = ({ type, data, basic = false }) => {
  if (!data || !Array.isArray(data)) {
    return <p>No data found for {type}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your {type}</h2>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div
            key={index}
            className={`p-4 max-w-3xl ${
              basic ? "bg-base-200" : "first:bg-base-100"
            } rounded-xl shadow-md space-y-2`}
          >
            <div className="text-xl font-medium text-accent">{item.name}</div>
            {!basic && (
              <>
                <p className="text-secondary text-lg">{item.description}</p>
                <div className="flex items-center">
                  <IoIosRocket className="text-primary mr-2 text-2xl" />
                  <p className="text-primary">
                    {item.outcome || item.benefit || item.result}
                  </p>
                </div>
                {item.rating && (
                  <div className="flex">
                    {Array(item.rating)
                      .fill(null)
                      .map((_, index) => (
                        <FaStar key={index} className="text-yellow-500 mr-1" />
                      ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailDisplay;
