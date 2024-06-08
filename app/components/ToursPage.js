"use client";

import { getTours } from "../utils/actions";
import { useQuery } from "@tanstack/react-query";
import ToursList from "./ToursList";
import { useState } from "react";
import { FaArrowUp } from "react-icons/fa";

const ToursPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const { data, isPending } = useQuery({
    queryKey: ["gettours", searchValue],
    queryFn: () => getTours(searchValue),
  });
  return (
    <>
      <form className="max-w-lg mb-12">
        <div className="join w-full">
          <input
            type="text"
            placeholder="enter city or country here..."
            className="input input-bordered join-item w-full"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary join-item">
            {isPending ? (
              <span className="loading"></span>
            ) : (
              <FaArrowUp className="mr-2 w-5 h-5" />
            )}
          </button>
        </div>
      </form>
      {isPending ? (
        <span className="loading"></span>
      ) : (
        <ToursList data={data} />
      )}
    </>
  );
};
export default ToursPage;
