"use client";
import React, { useState, useEffect } from "react";
import { FaGrinStars, FaCheckCircle } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";

const DailyInputForm = ({ inputs, onSubmit, title }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const allFieldsFilled = inputs.every(
      (input) => formValues[input.name]?.trim() !== ""
    );
    setIsFormValid(allFieldsFilled);
  }, [formValues, inputs]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const entries = {};
    inputs.forEach((input, index) => {
      entries[index + 1] = formValues[input.name].trim();
    });

    const jsonData = {
      [title]: entries,
    };

    onSubmit(jsonData);
    setIsSubmitted(true);
  };

  return (
    <form className="max-w-m" onSubmit={handleSubmit}>
      {inputs.map((input, index) => (
        <label
          key={index}
          className="input input-bordered mb-3 bg-base-300 disabled:bg-base-300 focus:bg-base-300 active:bg-base-300 flex items-center gap-2"
        >
          <FaGrinStars />
          <input
            type="text"
            name={input.name}
            className="grow bg-base-300 focus:bg-base-300 active:bg-base-300 disabled:bg-base-300 disabled:text-base-content disabled:placeholder-base-content/50"
            placeholder={input.placeholder}
            disabled={isSubmitted}
            value={formValues[input.name] || ""}
            onChange={handleInputChange}
          />
        </label>
      ))}
      <div className="flex justify-center items-center h-10">
        {isSubmitted ? (
          <FaCheckCircle className="text-green-500 text-2xl" />
        ) : (
          <button
            type="submit"
            className={`btn btn-active btn-primary mx-auto ${
              !isFormValid ? "btn-disabled" : ""
            }`}
            disabled={!isFormValid}
          >
            Submit
          </button>
        )}
      </div>
    </form>
  );
};

export default DailyInputForm;
