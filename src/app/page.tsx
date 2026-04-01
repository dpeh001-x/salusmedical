import Hero from "@/components/Hero";
import Divider from "@/components/Divider";
import Services from "@/components/Services";
import Mission from "@/components/Mission";
import Philosophy from "@/components/Philosophy";
import CTA from "@/components/CTA";
import Schedule from "@/components/Schedule";
import Contact from "@/components/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Divider />
      <Services />
      <Mission />
      <Philosophy />
      <Divider />
      <CTA />
      <Schedule />
      <Contact />
    </>
  );
}
