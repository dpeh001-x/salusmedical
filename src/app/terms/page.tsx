import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Salus Medical Singapore",
  description: "Terms and conditions for Salus Medical Singapore services.",
};

export default function TermsPage() {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container-main max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-8">
          Terms &amp; Conditions
        </h1>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-600 leading-relaxed">
          <p>
            Welcome to Salus Medical Singapore Pte. Ltd. By accessing and using
            our website and services, you agree to be bound by the following
            terms and conditions. Please read them carefully.
          </p>

          <h2 className="text-xl font-heading font-bold text-gray-900 mt-8">
            1. Services
          </h2>
          <p>
            Salus Medical provides home-based healthcare services in Singapore,
            including but not limited to childhood vaccinations, senior
            vaccinations, and Lasting Power of Attorney (LPA) services. All
            services are delivered by certified, licensed healthcare
            professionals.
          </p>

          <h2 className="text-xl font-heading font-bold text-gray-900 mt-8">
            2. Eligibility
          </h2>
          <p>
            Our services are available to residents of Singapore. By using our
            services, you confirm that the information provided is accurate and
            complete.
          </p>

          <h2 className="text-xl font-heading font-bold text-gray-900 mt-8">
            3. Appointments &amp; Cancellations
          </h2>
          <p>
            Appointments are subject to availability. We request that
            cancellations be made at least 24 hours in advance. Late
            cancellations may be subject to a cancellation fee.
          </p>

          <h2 className="text-xl font-heading font-bold text-gray-900 mt-8">
            4. Privacy
          </h2>
          <p>
            We are committed to protecting your personal data in accordance with
            Singapore&apos;s Personal Data Protection Act (PDPA). Your information
            will only be used for the purposes of providing our services and
            will not be shared with third parties without your consent.
          </p>

          <h2 className="text-xl font-heading font-bold text-gray-900 mt-8">
            5. Limitation of Liability
          </h2>
          <p>
            While we strive to provide the highest standard of care, Salus
            Medical shall not be liable for any indirect, incidental, or
            consequential damages arising from the use of our services.
          </p>

          <h2 className="text-xl font-heading font-bold text-gray-900 mt-8">
            6. Changes to Terms
          </h2>
          <p>
            We reserve the right to update these terms at any time. Continued
            use of our services constitutes acceptance of the revised terms.
          </p>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Last updated: January 2024
              <br />
              &copy; 2023&ndash;{new Date().getFullYear()} Salus Medical
              Singapore Pte. Ltd.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
