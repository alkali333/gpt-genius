import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";

import Providers from "./providers";

const space_grotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata = {
  title: "The Yoga Palace Journalling App",
  description: "Control your mind to manifest your dreams.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearence={{ baseTheme: neobrutalism }}>
      <html data-theme="lofi" lang="en">
        <body className={space_grotesk.className}>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
