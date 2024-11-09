"use client";

import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

// Define the shape of the context value
interface UserTypeContextType {
  userType: string;
  setUserType: Dispatch<SetStateAction<string>>;
}

// Create a context with an initial value that matches the UserTypeContextType interface
const UserTypeContext = createContext<UserTypeContextType>({
  userType: "",
  setUserType: () => {},
});

export const useUserType = () => {
  return useContext(UserTypeContext);
};

export const UserTypeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userType, setUserType] = useState<string>("");

  // Return the actual setUserType function along with the current userType
  return (
    <UserTypeContext.Provider value={{ userType, setUserType }}>
      {children}
    </UserTypeContext.Provider>
  );
};
