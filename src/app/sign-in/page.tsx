"use client";

import Login from "@/components/login";
import React, { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthService from "@/utils/authService";
import Loader from "@/components/loader";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const usernameCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("username="));

    AuthService.removeSession();
    router.refresh();
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <div className="bg-sti-yellow w-100 h-3"></div>
      <div className="bg-sti-blue w-100 h-[60px] flex items-center">
        <h1 className="m-auto text-center text-white text-xl font-bold">
          Guidance Office Management System
        </h1>
      </div>
      <div className="md:flex mt-10 items-center justify-center h-[80vh]">
        <div className="md:w-[30em] m-auto justify-center align-middle">
          <Login />
        </div>
      </div>
    </Suspense>
  );
}
