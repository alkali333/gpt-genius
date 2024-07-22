"use client";

import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";

export const FormContainer = ({ action, children, className }) => {
  const initialState = {
    message: null,
    data: null,
  };

  const [state, formAction] = useFormState(action, initialState);

  useEffect(() => {
    if (state.message) {
      toast(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className={className}>
      {children}
    </form>
  );
};
