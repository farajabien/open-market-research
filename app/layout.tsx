import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GitHubStar from "@/components/github-star";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Open Market Research - Start With Evidence, Not Guesswork",
  description:
    "Free, open-source hub for structured startup market research. Browse studies, share your findings, and build smarter from day one.",
  keywords: [
    "market research",
    "startup",
    "founders",
    "open source",
    "evidence-based",
    "user research",
  ],
  authors: [{ name: "Open Market Research Community" }],
  openGraph: {
    title: "Open Market Research - Start With Evidence, Not Guesswork",
    description:
      "Free, open-source hub for structured startup market research. Browse studies, share your findings, and build smarter from day one.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Market Research - Start With Evidence, Not Guesswork",
    description:
      "Free, open-source hub for structured startup market research. Browse studies, share your findings, and build smarter from day one.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <GitHubStar />
      </body>
    </html>
  );
}
