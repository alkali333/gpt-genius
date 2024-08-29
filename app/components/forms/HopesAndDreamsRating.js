"use client";
import { useState, useEffect } from "react";
import { updateMindState, getMindStateColumn } from "/app/utils/server-actions";
import toast from "react-hot-toast";

const HopesAndDreamsRating = ({ setIsFinished = () => {} }) => {
  const [ratings, setRatings] = useState({});
  const [hopesAndDreams, setHopesAndDreams] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userHopesAndDreams = await getMindStateColumn("hopes_and_dreams");

      if (
        userHopesAndDreams.data &&
        userHopesAndDreams.data["hopes and dreams"]
      ) {
        setHopesAndDreams(userHopesAndDreams.data["hopes and dreams"]);
        setRatings(
          Object.fromEntries(
            userHopesAndDreams.data["hopes and dreams"].map((item, index) => [
              index,
              item.rating,
            ])
          )
        );
      } else {
        toast.error(
          "Could not fetch hopes and dreams. Error: ",
          userHopesAndDreams.message
        );
      }
    };
    fetchUserData();
  }, []);

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

    try {
      const response = await updateMindState(
        "hopes_and_dreams",
        updatedHopesAndDreams
      );

      if (response.data) {
        toast.success("Ratings updated successfully", { icon: "🚀" });
        setIsFinished(true);
      } else {
        toast.error(`Failed to update ratings: ${response.message}`);
      }
    } catch (error) {
      toast.error(`Failed to update ratings: ${error.message}`);
    }
  };

  if (hopesAndDreams == null) {
    return;
  }

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
      <button
        className="mt-4 px-4 py-2 btn btn-primary rounded-xl"
        onClick={handleSubmit}
      >
        Submit Ratings
      </button>
    </div>
  );
};

export default HopesAndDreamsRating;
