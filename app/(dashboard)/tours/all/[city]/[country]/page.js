import React from "react";
import TourInfo from "/app/components/TourInfo";
import { getExistingTour } from "/app/utils/actions";
import Link from "next/link";
import { notFound } from "next/navigation";

const TourByDestination = async ({ params }) => {
  const existingTour = await getExistingTour({
    city: params.city,
    country: params.country,
  });
  if (!existingTour) {
    return notFound();
  }

  return (
    <>
      {existingTour ? (
        <div>
          <TourInfo tour={existingTour} />
        </div>
      ) : (
        <div class="text-primary">No tour found.</div>
      )}
      <div className="max-w-2xl flex items-justify mt-4 gap-S4">
        <Link href="/tours" className="btn btn-primary">
          See All Tours
        </Link>
      </div>
    </>
  );
};

export default TourByDestination;
