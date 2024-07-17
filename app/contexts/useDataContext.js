"use client";
import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { getMindStateFieldsWithUsername } from "../utils/about-me-actions";
import { useUser } from "@clerk/nextjs";

const UserDataContext = createContext();

export default function UserDataProvider({ children, initialData }) {
  const [userData, setUserData] = useState(initialData);
  const { user, isLoaded } = useUser();

  // for debugging
  const prevUserDataRef = useRef();

  const fetchUserData = useCallback(async () => {
    if (isLoaded && user) {
      try {
        const data = await getMindStateFieldsWithUsername(
          user.id,
          user.firstName
        );
        setUserData(data);
      } catch (error) {
        console.error(`No data for user: ${user.id} error: ${error}`);
      }
    }
  }, [isLoaded, user]);

  useEffect(() => {
    if (!initialData) {
      fetchUserData();
    }
  }, [fetchUserData, initialData]);

  // Debug logging
  useEffect(() => {
    if (userData !== prevUserDataRef.current) {
      console.log("UserDataContext updated:");
      console.log(JSON.stringify(userData, null, 2));
      prevUserDataRef.current = userData;
    }
  }, [userData]);

  return (
    <UserDataContext.Provider value={{ userData, fetchUserData }}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  return useContext(UserDataContext);
}
