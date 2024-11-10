import { collect } from './../node_modules/effect/src/Channel';
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// const INACTIVITY_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds
const INACTIVITY_THRESHOLD = 5 * 1000; // 10 seconds

export function middleware(request: NextRequest) {

  console.log("middleware working");

  const url = request.nextUrl.clone();
  const currentTime = Date.now();

  // Retrieve the cookies for last activity, userType, and username
  let lastActivity = request.cookies.get("lastActivity")?.value;
  let usernameCookie = request.cookies.get("userType");
  let username = request.cookies.get("username");

  // Redirect to login if userType cookie is missing
  if (!usernameCookie || !username) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Check inactivity timeout
  if (!lastActivity) {
    lastActivity = currentTime.toString();
  } else {
    const timeSinceLastActivity = currentTime - parseInt(lastActivity, 10);

    // If inactivity threshold is exceeded, clear user cookies and redirect to login
    if (timeSinceLastActivity > INACTIVITY_THRESHOLD) {
      url.pathname = "/"; // Inactivity threshold exceeded, redirect to login

      // Delete the cookies
      const response = NextResponse.redirect(url);
      response.cookies.delete("lastActivity");
      response.cookies.delete("userType");
      response.cookies.delete("username");

      return response;
    }
  }

  // Role-based route handling (this part is unchanged)
  if (usernameCookie.value === "Student") {
    if (
      request.url.includes("/dashboard") ||
      request.url.includes("/teacher-portal")
    ) {
      return NextResponse.redirect(new URL("/student-portal", request.url));
    }
  }

  if (usernameCookie.value === "Teacher") {
    if (
      request.url.includes("/student-portal") ||
      request.url.includes("/dashboard")
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (usernameCookie.value === "Discipline Officer") {
    if (
      request.url.includes("/student-portal") ||
      request.url.includes("/teacher-portal")
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (usernameCookie.value === "Guidance Associate") {
    if (
      request.url.includes("/student-portal") ||
      request.url.includes("/teacher-portal")
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (usernameCookie.value === "System Admin") {
    if (!request.url.includes("/admin")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Update or set the lastActivity cookie with the current timestamp
  const response = NextResponse.next();
  response.cookies.set("lastActivity", currentTime.toString(), {
    path: "/",
    maxAge: INACTIVITY_THRESHOLD / 1000, // Cookie expires in 5 minutes
  });

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/student-portal/:path*",
    "/teacher-portal/:path*",
    "/admin/:path*",
  ],
};