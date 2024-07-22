"use client";
import { FaArrowUp } from "react-icons/fa";
import { FormContainer } from "../../components/forms/FormContainer";
import { DiaryInput } from "../../components/forms/DiaryInput";
import useUserData from "../../contexts/useUserData";
import { insertDiaryEntry } from "../../utils/about-me-actions";
import { useState } from "react";

const EveningPractice = () => {
  const { fetchUserData } = useUserData();

  return (
    <div className="min-h-[calc(100vh-6rem)] grid grid-rows-1fr,auto] max-2xl:">
      <div>
        <p>User info goes here</p>
      </div>
      <div>
        <FormContainer
          action={insertDiaryEntry}
          className="flex w-full items-center"
        >
          <DiaryInput />
        </FormContainer>
      </div>
    </div>
  );
};

export default EveningPractice;
