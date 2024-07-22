"use client";

import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";

const FormContainer = ({ action, children, className }) => {
  const { clerkId } = useAuth();
  const [state, formAction] = useFormState(action, { message: null });

  React.useEffect(() => {
    if (state.message) {
      toast(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className={className}>
      <input type="hidden" name="clerkId" value={clerkId} />
      {children}
    </form>
  );
};

export default FormContainer;

// Helper component to access form status
export const FormStatus = ({ children }) => {
  const status = useFormStatus();
  return children(status);
};
