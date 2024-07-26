"use client";

import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";

export const FormContainer = ({ action, children, onComplete, className }) => {
  const initialState = {
    message: null,
    data: null,
  };

  const [state, formAction] = useFormState(action, initialState);

  useEffect(() => {
    if (state.message) {
      toast(state.message);
    }
    if (state.data) {
      onComplete(true);
    }
  }, [state, onComplete]);

  return (
    <form action={formAction} className={className}>
      {children}
    </form>
  );
};
