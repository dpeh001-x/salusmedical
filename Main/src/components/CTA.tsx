import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-20 px-5 text-center bg-navy-light">
      <p className="font-body text-[11px] tracking-[5px] uppercase text-gold mb-2.5 font-medium">
        Begin your journey
      </p>
      <h2 className="font-display text-[clamp(24px,3.5vw,38px)] text-center mb-3 font-semibold text-white">
        Your health deserves more
      </h2>
      <p className="text-center text-slate-muted max-w-[500px] mx-auto mb-[46px] font-body text-sm leading-[1.8] font-light">
        Whether you seek preventive care, specialised treatment, or a trusted
        partner for your family&apos;s health — Salus Medical is ready.
      </p>
      <Link
        href="#schedule"
        className="inline-block bg-gold text-[#0B1A33] font-semibold text-xs tracking-[1.8px] uppercase px-[30px] py-3 rounded-[3px] border-[1.5px] border-gold hover:bg-gold-light hover:border-gold-light transition-all"
      >
        Book a Consultation
      </Link>
    </section>
  );
}
