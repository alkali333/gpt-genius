"use client";

import { FormContainer } from "../../components/forms/FormContainer";
import { DiaryInput } from "../../components/forms/DiaryInput";
import { insertDiaryEntry } from "../../utils/about-me-actions";

const EveningPractice = () => {
  return (
    <div className="min-h-[calc(100vh-6rem)] grid grid-rows-1fr,auto] max-w-2xl">
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
