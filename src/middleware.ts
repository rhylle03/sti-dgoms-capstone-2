import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  let usernameCookie = request.cookies.get("userType");
  if (!usernameCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (usernameCookie && usernameCookie.value === "Student") {
    if (
      request.url.includes("/dashboard") ||
      request.url.includes("/teacher-portal")
    ) {
      return NextResponse.redirect(new URL("/student-portal", request.url));
    }
  }

  if (usernameCookie && usernameCookie.value === "Teacher") {
    if (
      request.url.includes("/student-portal") ||
      request.url.includes("/dashboard")
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (usernameCookie && usernameCookie.value === "Discipline Officer") {
    if (
      request.url.includes("/student-portal") ||
      request.url.includes("/teacher-portal")
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  if (usernameCookie && usernameCookie.value === "Guidance Associate") {
    if (
      request.url.includes("/student-portal") ||
      request.url.includes("/teacher-portal")
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  if (usernameCookie && usernameCookie.value === "System Admin") {
    if (!request.url.includes("/admin")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/student-portal/:path*",
    "/teacher-portal/:path*",
  ],
};
