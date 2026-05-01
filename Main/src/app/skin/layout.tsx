import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skin & Dermatology",
  description:
    "Evidence-based skincare and dermatology in Singapore. Expert treatment for acne, eczema, rosacea, and hyperpigmentation with personalised routines backed by peer-reviewed research.",
  openGraph: {
    title: "Skin & Dermatology | Salus Medical",
    description:
      "Where science meets beautiful skin. Evidence-based dermatology treatments and personalised skincare routines for acne, eczema, rosacea, and pigmentation.",
  },
};

export default function SkinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
