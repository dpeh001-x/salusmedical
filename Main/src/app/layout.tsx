import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = "https://salusmedical.co";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Salus Medical | Where Healing Meets Excellence",
    template: "%s | Salus Medical",
  },
  description:
    "Comprehensive medical care across five specialized disciplines — Paediatrics, Primary Care, Sexual Wellness, Legacy Planning, and Dermatology. Guided by precision, compassion, and commitment to your well-being.",
  keywords: [
    "Salus Medical",
    "home healthcare Singapore",
    "paediatrics",
    "childhood vaccination",
    "primary care",
    "sexual wellness",
    "dermatology",
    "legacy planning",
    "LPA Singapore",
    "telemedicine Singapore",
    "home doctor Singapore",
    "medical consultation",
  ],
  authors: [{ name: "Salus Medical" }],
  creator: "Salus Medical",
  publisher: "Salus Medical",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_SG",
    url: siteUrl,
    siteName: "Salus Medical",
    title: "Salus Medical | Where Healing Meets Excellence",
    description:
      "Comprehensive medical care across five specialized disciplines. Home healthcare, paediatrics, primary care, sexual wellness, legacy planning, and dermatology in Singapore.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Salus Medical — Where Healing Meets Excellence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Salus Medical | Where Healing Meets Excellence",
    description:
      "Comprehensive medical care across five specialized disciplines. Home healthcare guided by precision, compassion, and commitment to your well-being.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-navy">
        <StructuredData />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
