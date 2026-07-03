import type { Metadata } from "next";
import { Fraunces, Inter_Tight } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import { clerkEnabled } from "@/lib/clerk";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://glory.example.com"),
  title: "GLORY — The last real arbitrage in distribution.",
  description:
    "GLORY is the distribution engine behind the world's biggest brands and names. Where elite creators and the brands that need them meet, deal, and get paid.",
  openGraph: {
    title: "GLORY — Behind the world's biggest brands and names.",
    description: "The last real arbitrage in distribution.",
    images: ["/art/hero-glory.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const tree = (
    <html lang="en" className={`${fraunces.variable} ${interTight.variable}`}>
      <body>
        <div className="grain" aria-hidden />
        <Cursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );

  // Only mount ClerkProvider when configured — otherwise it throws
  // "Missing publishableKey" and 500s the whole site.
  if (!clerkEnabled()) return tree;

  return (
    <ClerkProvider
      appearance={{
        variables: { colorPrimary: "#c8a24a", colorBackground: "#12100b" },
      }}
    >
      {tree}
    </ClerkProvider>
  );
}
