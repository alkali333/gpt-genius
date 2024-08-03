"use client";
import { useState, useEffect } from "react";
import { useUserData } from "/app/contexts/useDataContext"; // Adjust the import path as needed
import { updateMindState } from "/app/utils/about-me-actions";
import toast from "react-hot-toast";

const HopesAndDreamsRating = ({ setIsFinished = () => {} }) => {
  const { fetchUserData, userData, isLoading: dataIsLoading } = useUserData();
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    if (!dataIsLoading && userData) {
      const username = Object.keys(userData)[0];
      const hopesAndDreams = userData[username]["hopes and dreams"];
      setRatings(
        Object.fromEntries(
          hopesAndDreams.map((item, index) => [index, item.rating])
        )
      );
    }
  }, [userData, dataIsLoading]);

  if (dataIsLoading) {
    return <div>Loading...</div>;
  }

  const username = Object.keys(userData)[0];
  const hopesAndDreams = userData[username]["hopes and dreams"];

  const handleRatingChange = (index, rating) => {
    setRatings((prevRatings) => {
      if (prevRatings[index] === rating) {
        const { [index]: _, ...rest } = prevRatings;
        return rest;
      }
      return { ...prevRatings, [index]: rating };
    });
  };

  const handleSubmit = async () => {
    const updatedHopesAndDreams = {
      "hopes and dreams": hopesAndDreams.map((item, index) => {
        if (ratings.hasOwnProperty(index)) {
          return { ...item, rating: ratings[index] };
        }
        return item;
      }),
    };

    const update = await updateMindState(
      "hopes_and_dreams",
      updatedHopesAndDreams
    );
    if (update) {
      toast.success("Ratings updated successfully", { icon: "🚀" });
      fetchUserData();
      setIsFinished(true);
    } else {
      toast.error("Failed to update ratings");
    }

    console.log(JSON.stringify(updatedHopesAndDreams, null, 2));
  };

  return (
    <div className="max-w-2xl">
      {hopesAndDreams.map((item, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-lg font-bold">{item.name}</h3>
          <div className="rating gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <input
                key={rating}
                type="radio"
                name={`rating-${index}`}
                value={rating}
                className="mask mask-star bg-orange-400"
                onChange={() => handleRatingChange(index, rating)}
                checked={ratings[index] === rating}
              />
            ))}
          </div>
        </div>
      ))}
      <button className="mt-4 px-4 py-2 btn btn-primary" onClick={handleSubmit}>
        Submit Ratings
      </button>
    </div>
  );
};

export default HopesAndDreamsRating;
