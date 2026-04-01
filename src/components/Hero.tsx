import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-5 pt-[120px] pb-20 bg-[radial-gradient(ellipse_at_50%_30%,rgba(201,168,76,0.04),transparent_60%),linear-gradient(180deg,#0B1A33,#122647)]">
      <Image
        src="/images/Salus Medical Logo1.png"
        alt="Salus Medical"
        width={180}
        height={220}
        className="mb-8"
        priority
      />
      <h1 className="font-display text-[clamp(34px,5vw,62px)] font-bold text-white tracking-[2px] leading-[1.15] mb-2.5">
        Salus Medical
        <span className="block font-body text-[clamp(12px,1.5vw,15px)] text-gold tracking-[6px] uppercase font-normal mt-3.5">
          Where healing meets excellence
        </span>
      </h1>
      <p className="font-body text-[clamp(14px,1.5vw,16px)] text-slate-muted max-w-[540px] leading-[1.8] mt-3.5 mb-10 font-light">
        Comprehensive medical care across five specialized disciplines, guided by
        precision, compassion, and an unwavering commitment to your well-being.
      </p>
      <div className="flex gap-3.5 flex-wrap justify-center">
        <Link
          href="#services"
          className="inline-block bg-gold text-[#0B1A33] font-semibold text-xs tracking-[1.8px] uppercase px-[30px] py-3 rounded-[3px] border-[1.5px] border-gold hover:bg-gold-light hover:border-gold-light transition-all"
        >
          Explore Services
        </Link>
        <Link
          href="#schedule"
          className="inline-block bg-transparent text-white font-semibold text-xs tracking-[1.8px] uppercase px-[30px] py-3 rounded-[3px] border-[1.5px] border-white/20 hover:border-gold hover:text-gold transition-all"
        >
          Schedule Consultation
        </Link>
      </div>
    </section>
  );
}
