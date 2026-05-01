import Image from "next/image";

const footerLinks = [
  { label: "Child", href: "https://salusmedical.co/child" },
  { label: "Health", href: "https://salusmedical.co/health" },
  { label: "Sexual Wellness", href: "https://salusmedical.co/sexual-wellness" },
  { label: "Legacy", href: "https://salusmedical.co/legacy" },
  { label: "Skin", href: "https://salusmedical.co/skin" },
];

export default function Footer() {
  return (
    <footer className="pt-[46px] pb-8 px-5 bg-navy border-t border-white/[0.06] text-center">
      <div className="flex items-center justify-center gap-2.5 mb-5">
        <Image
          src="/images/salus-shield.webp"
          alt="Salus Medical"
          width={28}
          height={33}
          className="h-8 w-auto"
          style={{
            filter:
              "drop-shadow(0 0 3px rgba(255,255,255,0.85)) drop-shadow(0 0 3px rgba(255,255,255,0.5))",
          }}
          unoptimized
        />
        <span className="font-display text-[14px] font-medium tracking-[3px] text-[#F4DC8B]">SALUS MEDICAL</span>
      </div>
      <div className="flex justify-center gap-[22px] mb-6 flex-wrap">
        {footerLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-slate-muted text-[11px] tracking-[1px] uppercase hover:text-gold transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
      <p className="font-body text-[11px] text-white/[0.15]">
        &copy; {new Date().getFullYear()} Salus Medical. All rights reserved.
      </p>
    </footer>
  );
}
