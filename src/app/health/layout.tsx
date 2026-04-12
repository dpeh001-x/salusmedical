import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health & Prevention",
  description:
    "Preventive health intelligence by Salus Medical. Track blood tests, monitor chronic conditions, access vaccination schedules, and get AI-powered health insights — all in one place.",
  openGraph: {
    title: "Health & Prevention | Salus Medical",
    description:
      "Comprehensive preventive health tracking. Blood test dashboard, chronic disease management, cancer screening guidelines, and telemedicine continuity.",
  },
};

export default function HealthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
