import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sexual Wellness",
  description:
    "Confidential, evidence-based sexual health consultations and treatments for men and women in Singapore. ED, PE, low libido, contraceptive guidance, and more.",
  openGraph: {
    title: "Sexual Wellness | Salus Medical",
    description:
      "Personalised, judgement-free sexual health consultations and treatments. From ED and PE to contraceptive guidance — expert care in Singapore.",
  },
};

export default function SexualWellnessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
