"use client";
import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { getMindStateFieldsWithUsername } from "../utils/about-me-actions";
import { useUser } from "@clerk/nextjs";

const UserDataContext = createContext();

export default function UserDataProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const { user, isLoaded } = useUser();

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
    fetchUserData();
  }, [fetchUserData]);

  return (
    <UserDataContext.Provider value={{ userData, fetchUserData }}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  return useContext(UserDataContext);
}
