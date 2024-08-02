"use client";
import { useState } from "react";
import { revalidatePath } from "next/cache";
import { useUserData } from "/app/contexts/useDataContext"; // Adjust the import path as needed
import { updateMindState } from "/app/utils/about-me-actions";
import toast from "react-hot-toast";

const HopesAndDreamsRating = () => {
  const { fetchUserData, userData, isLoading: dataIsLoading } = useUserData();
  const [ratings, setRatings] = useState({});

  if (dataIsLoading) {
    return <div>Loading...</div>;
  }

  const username = Object.keys(userData)[0]; // Assuming there's only one user in the object
  const hopesAndDreams = userData[username]["hopes and dreams"];

  const handleRatingChange = (index, rating) => {
    setRatings({ ...ratings, [index]: rating });
  };

  const handleSubmit = async () => {
    const updatedHopesAndDreams = {
      "hopes and dreams": hopesAndDreams.map((item, index) => ({
        ...item,
        rating: ratings[index] || 3,
      })),
    };

    const update = await updateMindState(
      "hopes_and_dreams",
      updatedHopesAndDreams
    );
    if (update) {
      toast.success("Ratings updated successfully", { icon: "🚀" });
      fetchUserData();
    } else {
      toast.error("Failed to update ratings");
    }

    console.log(JSON.stringify(updatedHopesAndDreams, null, 2));
  };

  return (
    <div className="max-w-2xl flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Hopes and Dreams</h2>
      {hopesAndDreams.map((item, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-lg font-bold">{item.name}</h3>
          <div className="rating gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <input
                key={rating}
                type="radio"
                name={`rating-${index}`}
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
