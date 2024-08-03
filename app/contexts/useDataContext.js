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
  const [userData, setUserData] = useState(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const { user, isLoaded } = useUser();

  // for debugging
  const prevUserDataRef = useRef();

  const fetchUserData = useCallback(async () => {
    if (isLoaded && user) {
      setIsLoading(true);
      try {
        const data = await getMindStateFieldsWithUsername();
        setUserData(data || null);
      } catch (error) {
        console.error(`No data for user: ${user.id} error: ${error}`);
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isLoaded, user]);

  useEffect(() => {
    if (!initialData && isLoaded && user) {
      fetchUserData();
    }
  }, [fetchUserData, initialData, isLoaded, user]);

  // debugging
  useEffect(() => {
    if (userData !== prevUserDataRef.current) {
      console.log("UserDataContext updated:");
      console.log(JSON.stringify(userData, null, 2));
      prevUserDataRef.current = userData;
    }
  }, [userData]);

  return (
    <UserDataContext.Provider value={{ userData, isLoading, fetchUserData }}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  return useContext(UserDataContext);
}
