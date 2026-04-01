export default function StructuredData() {
  const medicalBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "Salus Medical",
    url: "https://salusmedical.co",
    logo: "https://salusmedical.co/og-image.png",
    description:
      "Comprehensive medical care across five specialized disciplines — Paediatrics, Primary Care, Sexual Wellness, Legacy Planning, and Dermatology.",
    medicalSpecialty: [
      "Pediatrics",
      "PrimaryCare",
      "Dermatology",
    ],
    availableService: [
      {
        "@type": "MedicalProcedure",
        name: "Child — Paediatrics",
        description:
          "Home vaccination and growth review — nurturing care from newborn through adolescence in the comfort of your home.",
        url: "https://salusmedical.co/child",
      },
      {
        "@type": "MedicalProcedure",
        name: "General Health — Primary Care",
        description:
          "Holistic primary care, preventive screenings, and chronic disease management — available via telemedicine.",
        url: "https://salusmedical.co/health",
      },
      {
        "@type": "MedicalProcedure",
        name: "Sexual Wellness — Intimate Health",
        description:
          "Confidential, evidence-based treatments and personalised wellness plans for intimate health needs.",
        url: "https://salusmedical.co/sexual-wellness",
      },
      {
        "@type": "MedicalProcedure",
        name: "Legacy — Longevity",
        description:
          "LPA, AMD, ACP, and will writing — safeguarding your legacy with comprehensive long-term planning.",
        url: "https://salusmedical.co/legacy",
      },
      {
        "@type": "MedicalProcedure",
        name: "Skin — Dermatology",
        description:
          "Skin diagnosis, lifestyle management, and medications — expert dermatological care without invasive procedures.",
        url: "https://salusmedical.co/skin",
      },
    ],
    areaServed: {
      "@type": "Country",
      name: "Singapore",
    },
    sameAs: [],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Salus Medical",
    url: "https://salusmedical.co",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://salusmedical.co/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(medicalBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}
