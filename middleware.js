import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/chat(.*)",
  "/profile(.*)",
  "/chat(.*)",
  "/about-me(.*)",
  "/meditation(.*)",
  "/morning-practice(.*)",
  "/welcome(.*)",
  "/welcome-v2(.*)",
  "/my-info-v2(.*)",
  "/evening-practice(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
