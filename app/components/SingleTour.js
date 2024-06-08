"use client";

import React from "react";
import { getTourById, deleteTourById } from "../utils/actions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TourInfo from "./TourInfo";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const SingleTour = ({ id }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    isPending,
    isError,
    data: tour,
    error,
  } = useQuery({
    queryKey: ["getTourById", id],
    queryFn: () => getTourById(id),
  });

  const {
    mutate,
    isPending: isDeleting,
    data: deletedTour,
  } = useMutation({
    mutationFn: deleteTourById,
    onSuccess: (deletedTour) => {
      toast.success("Tour deleted");
      queryClient.invalidateQueries({ queryKey: ["gettours", "getTourById"] });
      router.push("/tours");
    },
    onError: () => {
      toast.error("Error deleting tour");
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this tour?")) {
      mutate(id);
    }
  };

  if (isPending) {
    return <span className="loading"></span>;
  }

  if (isError) {
    toast.error("Error loading tours");
    return <div>Error: {error.message}</div>;
  }

  return (
    tour && (
      <div>
        <TourInfo tour={tour} />

        <div className="max-w-2xl flex items-justify mt-4 gap-4">
          <a href="/tours" className="btn btn-primary">
            Back
          </a>
          <button
            onClick={() => handleDelete(tour.id)}
            className="btn btn-warning ml-auto"
          >
            Delete Tour
          </button>
        </div>
      </div>
    )
  );
};

export default SingleTour;
