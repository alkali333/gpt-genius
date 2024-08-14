import {
  clerkMiddleware,
  createRouteMatcher,
  clerkClient,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
    const { userId } = auth();
    const user = await clerkClient.users.getUser(userId);

    // if the user does not have a profile, send them to the about-me page
    if (
      !user?.publicMetadata.has_hopes_and_dreams &&
      !user?.publicMetadata.has_skills_and_achievements &&
      !user?.publicMetadata.has_obstacles_and_challenges &&
      req.nextUrl.pathname !== "/about-me"
    ) {
      return NextResponse.redirect(new URL("/about-me", req.url));
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
