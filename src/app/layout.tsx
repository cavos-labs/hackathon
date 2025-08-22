import type { Metadata } from "next";
import { romaGothic, jetbrainsMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aegis-v1 Minihackathon",
  description: "Build the next big app on Starknet using Aegis-v1. Win $1000!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${romaGothic.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
