import React from "react";
import { BsSignTurnLeftFill } from "react-icons/bs";

const SingleTourPage = ({ params }) => {
  return <div>Id selected {params.id}</div>;
};

export default SingleTourPage;

// Create a SingleTour component and wrap in the hydration
// create an action to get a single tour from an id
// use the TourInfo component to display the tour on SingleTour
