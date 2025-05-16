import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/chat(.*)",
  "/profile(.*)",
  "/about-me(.*)",
  "/meditation(.*)",
  "/morning-practice(.*)",
  "/welcome(.*)",
  "/welcome-v2(.*)",
  "/my-info-v2(.*)",
  "/evening-practice(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
    // User data and profile validation moved to fetchAuthUser
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
