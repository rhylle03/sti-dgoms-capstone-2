"use client";

import { checkUserCredentials } from "@/utils/checkUserCredentials";
import AuthService from "../utils/authService";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserType } from "@/hooks/userTypeContext";

export default function Login() {
  const errorRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const { userType, setUserType } = useUserType();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const userCredentials = await checkUserCredentials(
        username,
        password,
        userType
      );

      if (userCredentials && userCredentials.userType !== null) {
        // Correctly use setUserType from the useUserType hook
        setUserType(userCredentials.userType || "defaultUserType");
        AuthService.setSession(username, userCredentials.userType);

        if (userCredentials && userCredentials.userType === "Student") {
          router.push("/student-portal");
        }
        if (userCredentials && userCredentials.userType === "Teacher") {
          router.push("/teacher-portal");
        }
        if (
          userCredentials &&
          userCredentials.userType === "Discipline Officer"
        ) {
          router.push("/admin");
        }
        if (
          userCredentials &&
          userCredentials.userType === "School Administrator"
        ) {
          router.push("/dashboard");
        }
        if (
          userCredentials &&
          userCredentials.userType === "Guidance Associate"
        ) {
          router.push("/dashboard");
        }
        if (userCredentials && userCredentials.userType === "System Admin") {
          router.push("/admin");
        }
        console.log(userCredentials.userType);
        console.log("Logged in successfully");
      }
    } catch (error) {
      setIsLoading(false);
      setErrorMessage("username or password is incorrect");
    }
  };

  const handleForgot = async (event: any) => {
    setErrorMessage("Please contact your account administrator");
  };

  return (
    <div className="border rounded p-10">
      <form className="flex flex-col md:flex-col" onSubmit={handleSubmit}>
        <p className="font-bold text-center text-2xl mb-10"> Log in</p>
        <input
          className="m-2 p-2 border border-gray-300 rounded-md"
          name="username"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="m-2 p-2 border border-gray-300 rounded-md"
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className={`m-2 p-2 bg-sti-blue hover:bg-sti-yellow duration-75 text-white font-bold py-2 px-4 rounded-full mt-8 ${
            isLoading ? "disabled bg-sti-yellow" : ""
          }`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Logging In..." : "Log In"}
        </button>
        <div ref={errorRef} className="text-red-500 m-auto mt-5">
          {errorMessage}
        </div>
        <div className="flex justify-center mt-10">
          <p className="text-center text-gray-500 pr-1">Problems Logging In?</p>
          <a
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={handleForgot}
          >
            Click Here.
          </a>
        </div>
      </form>
    </div>
  );
}
