"use client";
import React, { useState } from "react";
import { useFormStatus } from "react-dom";

import { FaGrinStars } from "react-icons/fa";

const DailyInputFormV2 = ({ inputs, onComplete = () => {} }) => {
  const [formValues, setFormValues] = useState({});
  const { pending } = useFormStatus();

  const handleInputChange = (e, inputName) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [inputName]: e.target.value,
    }));
  };

  return (
    <>
      {inputs.map((input, index) => (
        <>
          <label
            key={index}
            className="input input-bordered mb-3 bg-base-300 flex items-center gap-2"
          >
            <FaGrinStars />
            <input
              type="text"
              name={input.name}
              className="grow bg-base-300 focus:bg-base-300 active:bg-base-300"
              value={formValues[input.name] || ""}
              onChange={(e) => handleInputChange(e, input.name)}
            />
          </label>
        </>
      ))}
      <div className="flex h-10">
        <button
          type="submit"
          className="btn btn-active btn-primary"
          disabled={pending}
        >
          Submit
        </button>
      </div>
    </>
  );
};

export default DailyInputFormV2;
