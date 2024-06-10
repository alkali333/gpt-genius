"use client";
import React from "react";
import TourInfo from "./TourInfo";
import { FaArrowUp } from "react-icons/fa";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getExistingTour,
  generateTourResponse,
  createNewTour,
  generateTourImage,
  generateTourImageDummy,
} from "../utils/actions";

const NewTour = () => {
  const queryClient = useQueryClient();

  const {
    mutate,
    isPending,
    data: tour,
  } = useMutation({
    // all the stuff called from the front end to prevent timeouts
    // on free version of vercell
    mutationFn: async (destination) => {
      const existingTour = await getExistingTour(destination);

      if (existingTour) return existingTour;

      const newTour = await generateTourResponse(destination);

      if (newTour) {
        const tourImagePath = await generateTourImage(
          newTour.city,
          newTour.country
        );
        console.log(`Tour image path should be here: ${tourImagePath}`);
        if (tourImagePath) {
          newTour.image = tourImagePath;
        }

        await createNewTour(newTour);

        // invalidate so we get the latest data
        queryClient.invalidateQueries({ queryKey: ["gettours"] });
        return newTour;
      }
      toast.error("No matching city found...");
      return null;
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const destination = Object.fromEntries(formData.entries());
    mutate(destination);
  };

  if (isPending) {
    return <span className="loading loading-lg"></span>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <h2 className="mb-4">Select Your Dream Location</h2>
        <div className="join w-full">
          <input
            type="text"
            className="input input-bordered join-item w-full"
            name="city"
            placeholder="city"
            required
          />
          <input
            type="text"
            className="input input-bordered join-item w-full"
            name="country"
            placeholder="country"
          />
          <button type="submit" className="btn btn-primary join-item">
            <FaArrowUp className="mr-2 w-5 h-5" />
          </button>
        </div>
      </form>
      {/* tour is the data returned from the useMutation hook called when form submitted */}
      <div className="mt-16">{tour ? <TourInfo tour={tour} /> : null}</div>
    </>
  );
};

export default NewTour;
