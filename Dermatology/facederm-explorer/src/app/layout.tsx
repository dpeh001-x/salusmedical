import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FaceDerm Explorer",
  description: "AI-Powered Dermatology Reference - Educational Guide to Facial Skin Conditions, Treatments & Evidence-Based Care",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
