import React from "react";
import { getExistingTour } from "/app/utils/actions";
import TourInfo from "/app/components/TourInfo";
import DeleteTour from "/app/components/DeleteTour";
import Link from "next/link";
import { notFound } from "next/navigation";

import { capitalizeFirstLetter } from "/app/utils/actions";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export async function generateMetadata({ params }) {
  const formattedCity = await capitalizeFirstLetter(params.city);
  const formattedCountry = await capitalizeFirstLetter(params.country);
  return {
    title: `Tour of ${formattedCity}, ${formattedCountry}`,
    description: `Enjoy a tour of ${formattedCity}, ${formattedCountry} and learn about all the best landmarks`,
  };
}
const TourByDestination = async ({ params }) => {
  const queryClient = new QueryClient();
  const existingTour = await getExistingTour({
    city: params.city.replace(/-/g, " "),
    country: params.country.replace(/-/g, " "),
  });
  if (!existingTour) {
    return notFound();
  }

  return (
    <>
      <div>
        <TourInfo tour={existingTour} />
      </div>
      <div className="max-w-2xl flex items-justify mt-4 gap-S4">
        <Link href="/tours" className="btn btn-primary">
          See All Tours
        </Link>
        <div className="ml-auto">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <DeleteTour tour={existingTour} />
          </HydrationBoundary>
        </div>
      </div>
    </>
  );
};

export default TourByDestination;
