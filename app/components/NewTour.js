"use client";
import React from "react";
import TourInfo from "./TourInfo";
import { FaArrowUp } from "react-icons/fa";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import {
  getExistingTour,
  generateTourResponse,
  createNewTour,
  generateTourImage,
} from "../utils/actions";

import { fetchUserTokensById, subtractTokens } from "../utils/actions";
import toast from "react-hot-toast";

const NewTour = () => {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

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

      const currentTokens = await fetchUserTokensById(userId);
      if (currentTokens < 300) {
        toast.error("Token balance too low...");
        return;
      }

      const newTour = await generateTourResponse(destination);

      if (!newTour) {
        toast.error("No matching city found...");
        return null;
      }

      const tourImagePath = await generateTourImage(
        newTour.tour.city,
        newTour.tour.country
      );

      if (tourImagePath) {
        newTour.tour.image = tourImagePath;
      }

      const response = await createNewTour(newTour.tour);

      // invalidate so we get the latest data
      queryClient.invalidateQueries({ queryKey: ["gettours"] });
      const newTokens = await subtractTokens(userId, newTour.tokens);
      toast.success(`${newTokens} tokens left`);
      return newTour.tour;
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
