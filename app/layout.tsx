import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CS2 Stats Hub | AI-Powered Counter-Strike Analytics",
  description: "Track your Counter-Strike 2 stats, analyze your performance, and get personalized AI-powered insights. Master your game with real-time data from Steam API and Google Gemini AI.",
  keywords: ["Counter-Strike 2", "CS2", "stats", "analytics", "AI", "Steam", "gaming", "esports"],
  authors: [{ name: "CS2 Stats Hub" }],
  metadataBase: new URL("https://cs-stats-hub.vercel.app"),
  openGraph: {
    title: "CS2 Stats Hub | AI-Powered Counter-Strike Analytics",
    description: "Track your Counter-Strike 2 stats and get AI-powered insights to improve your gameplay.",
    type: "website",
    locale: "en_US",
    url: "https://cs-stats-hub.vercel.app",
    siteName: "CS2 Stats Hub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CS2 Stats Hub - Track Your Performance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CS2 Stats Hub | AI-Powered Counter-Strike Analytics",
    description: "Track your Counter-Strike 2 stats and get AI-powered insights to improve your gameplay.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
