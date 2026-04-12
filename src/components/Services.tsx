import Link from "next/link";

const services = [
  {
    tag: "Paediatrics",
    tagIcon: (
      <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-gold fill-none stroke-[1.8]">
        <circle cx="12" cy="8" r="5" />
        <path d="M3 21v-1a7 7 0 0114 0v1" />
      </svg>
    ),
    name: "Child",
    subdomain: "salusmedical.co/child",
    desc: "Home vaccination and growth review from newborn through adolescence.",
    url: "/child",
  },
  {
    tag: "Primary care",
    tagIcon: (
      <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-gold fill-none stroke-[1.8]">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    name: "General Health",
    subdomain: "salusmedical.co/health",
    desc: "Primary care, cancer screenings, and travel medicine — available via telemedicine.",
    url: "/health",
  },
  {
    tag: "Intimate health",
    tagIcon: (
      <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-gold fill-none stroke-[1.8]">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
    name: "Sexual Wellness",
    subdomain: "salusmedical.co/sexual-wellness",
    desc: "Confidential, evidence-based treatments and personalised wellness plans.",
    url: "/sexual-wellness",
  },
];

const servicesRow2 = [
  {
    tag: "Longevity",
    tagIcon: (
      <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-gold fill-none stroke-[1.8]">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    name: "Legacy",
    subdomain: "salusmedical.co/legacy",
    desc: "Wills, LPA, AMD, and ACP — planning for the future with peace of mind.",
    url: "/legacy",
  },
  {
    tag: "Dermatology",
    tagIcon: (
      <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-gold fill-none stroke-[1.8]">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 14c1-1 2.5-1.5 4-1.5s3 .5 4 1.5" />
      </svg>
    ),
    name: "Skin",
    subdomain: "salusmedical.co/skin",
    desc: "Diagnosis, lifestyle management, and medications — no invasive procedures.",
    url: "/skin",
  },
];

function ServiceCard({
  service,
}: {
  service: (typeof services)[0];
}) {
  return (
    <Link
      href={service.url}
      className="group bg-navy-card border border-gold/[0.12] rounded-md p-6 flex flex-col relative overflow-hidden transition-all duration-400 hover:-translate-y-[3px] hover:border-gold/30 hover:shadow-[0_6px_28px_rgba(0,0,0,0.2)]"
    >
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gold opacity-40 group-hover:opacity-100 transition-opacity duration-400" />
      <div className="inline-flex items-center gap-[5px] bg-gold/[0.08] border border-gold/[0.15] rounded-full px-[11px] py-1 text-[10px] tracking-[1px] uppercase text-gold font-semibold mb-3 w-fit">
        {service.tagIcon}
        {service.tag}
      </div>
      <div className="text-lg font-bold text-white mb-0.5 font-display">
        {service.name}
      </div>
      <div className="text-[10px] text-gold/50 mb-1.5 font-body">
        {service.subdomain}
      </div>
      <p className="text-[13px] text-slate-muted leading-[1.65] font-light flex-1">
        {service.desc}
      </p>
      <span className="text-[11px] tracking-[1.5px] uppercase text-gold inline-flex items-center gap-1.5 mt-3.5 font-medium group-hover:gap-2.5 transition-all">
        View more &rarr;
      </span>
    </Link>
  );
}

export default function Services() {
  return (
    <section id="services" className="py-20 px-5 bg-navy-light">
      <p className="font-body text-[11px] tracking-[5px] uppercase text-gold text-center mb-2.5 font-medium">
        Our specialties
      </p>
      <h2 className="font-display text-[clamp(24px,3.5vw,38px)] text-center mb-3 font-semibold text-white">
        Pillars of Care
      </h2>
      <p className="text-center text-slate-muted max-w-[500px] mx-auto mb-[46px] font-body text-sm leading-[1.8] font-light">
        Dedicated disciplines, united by a singular mission — to safeguard
        what matters most.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 max-w-[920px] mx-auto">
        {services.map((s) => (
          <ServiceCard key={s.name} service={s} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-w-[612px] mx-auto mt-3.5">
        {servicesRow2.map((s) => (
          <ServiceCard key={s.name} service={s} />
        ))}
      </div>
    </section>
  );
}
