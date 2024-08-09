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
      !user?.publicMetadata.hasProfile &&
      req.nextUrl.pathname !== "/about-me"
    ) {
      console.log("User does not have profile, redirecting to /about-me");
      return NextResponse.redirect("/about-me");
    }
  }
  console.log("User has profile, continuing to page");
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
