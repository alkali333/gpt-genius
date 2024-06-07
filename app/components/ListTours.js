"use client";

import { getTours } from "../utils/actions";
import { useQuery } from "@tanstack/react-query";

import Link from "next/link";

const ListTours = () => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["gettours"],
    queryFn: () => getTours(),
  });
  console.log(`data: ${data}`);

  if (isPending) {
    return <span className="loading"></span>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <h1 className="text-primary text-4xl mb-8">Available Tours</h1>
      <div className="max-w-2xl grid grid-cols-2 md:grid-cols-4 gap-4 justify-center">
        {data.map((tour) => (
          <div key={tour.id}>
            <Link className="btn btn-primary mb-6" href={`/tours/${tour.id}`}>
              {tour.city}, {tour.country}
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default ListTours;
