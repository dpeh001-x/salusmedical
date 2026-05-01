"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Baby,
  Stethoscope,
  HeartPulse,
  Sparkles,
  ScrollText,
  type LucideIcon,
} from "lucide-react";
import { CustomSelect, CustomDatePicker, type SelectOption } from "@/components/CustomFormElements";
import CinematicVideoBackground from "@/components/CinematicVideoBackground";

/* ── service card data ── */
type Service = {
  name: string;
  subdomain: string;
  desc: string;
  url: string;
  external?: boolean;
  Icon: LucideIcon;
};

const services: Service[] = [
  {
    name: "Child",
    subdomain: "salusmedical.co/child",
    desc: "Home vaccination and growth review from newborn through adolescence.",
    url: "/child",
    Icon: Baby,
  },
  {
    name: "General Health",
    subdomain: "salusmedical.co/health",
    desc: "Primary care, cancer screenings, and travel medicine — available via telemedicine.",
    url: "/health",
    Icon: Stethoscope,
  },
  {
    name: "Sexual Wellness",
    subdomain: "salusmedical.co/sexual-wellness",
    desc: "Confidential, evidence-based treatments and personalised wellness plans.",
    url: "/sexual-wellness",
    Icon: HeartPulse,
  },
];

const servicesRow2: Service[] = [
  {
    name: "Skin",
    subdomain: "salusmedical.co/skin",
    desc: "Diagnosis, lifestyle management, and medications — no invasive procedures.",
    url: "/skin",
    Icon: Sparkles,
  },
  {
    name: "Legacy",
    subdomain: "salusmedical.co/legacy",
    desc: "Wills, LPA, AMD, and ACP — planning for the future with peace of mind.",
    url: "https://salus-legacy-app.vercel.app/",
    external: true,
    Icon: ScrollText,
  },
];

const timeSlots = [
  "9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
  "12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM",
  "3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM",
];

const serviceOptions = [
  "Child — Paediatrics",
  "General Health — Primary Care",
  "Sexual Wellness — Intimate Health",
  "Legacy — Planning for the Future",
  "Skin — Dermatology",
];

/* ── corner decoration ── */
function Corners() {
  return (
    <>
      <div className="absolute top-14 left-6 w-[70px] h-[70px] border-t border-l border-gold/[0.08] pointer-events-none max-md:hidden" />
      <div className="absolute bottom-6 right-6 w-[70px] h-[70px] border-b border-r border-gold/[0.08] pointer-events-none max-md:hidden" />
    </>
  );
}

/* ── service card ── */
function ServiceCard({ s }: { s: Service }) {
  const linkProps = s.external
    ? { href: s.url, target: "_blank" as const, rel: "noopener noreferrer" }
    : { href: s.url };
  const { Icon } = s;
  return (
    <Link
      {...linkProps}
      className="group bg-white/[0.04] border border-gold/[0.1] rounded-[5px] p-3.5 flex flex-col relative overflow-hidden transition-all duration-400 hover:-translate-y-[2px] hover:border-gold/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
    >
      <div className="absolute top-0 left-0 w-full h-[2.5px] bg-gold opacity-30 group-hover:opacity-100 transition-opacity duration-400" />
      {/* Header row — icon chip + name/subdomain */}
      <div className="flex items-center gap-2.5 mb-1.5">
        <span
          aria-hidden="true"
          className="flex-shrink-0 w-9 h-9 rounded-[6px] flex items-center justify-center border border-white/15 bg-gradient-to-br from-[#001845] to-[#000B22] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.4)] group-hover:border-gold/40 transition-colors"
        >
          <Icon className="w-[18px] h-[18px] text-white" strokeWidth={1.6} />
        </span>
        <div className="min-w-0">
          <div className="text-[14px] font-semibold text-white leading-tight truncate">
            {s.name}
          </div>
          <div className="text-[9.5px] text-gold/55 font-body truncate">
            {s.subdomain}
          </div>
        </div>
      </div>
      <p className="text-[10.5px] text-slate-muted leading-[1.55] font-light flex-1">
        {s.desc}
      </p>
      <span className="text-[9px] tracking-[1.5px] uppercase text-gold inline-flex items-center gap-1 mt-2 font-medium group-hover:gap-2 transition-all">
        View more &rarr;
      </span>
    </Link>
  );
}

/* ── input class ── */
const inputCls =
  "bg-white/[0.08] border border-gold/[0.1] rounded-[3px] px-2.5 py-[6px] text-[11px] text-[#F5F3ED] font-body outline-none w-full transition-colors focus:border-gold placeholder:text-slate-muted/50";
const selectCls = `${inputCls} appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%2210%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%238A9BB5%22%20stroke-width%3D%222.5%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_10px_center] pr-7`;
const labelCls = "text-[10px] text-slate-muted tracking-[0.5px] font-body";

/* ════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const TOTAL = 4;
  const [cur, setCur] = useState(0);
  const moving = useRef(false);
  const touchStart = useRef({ x: 0, y: 0 });
  const touchDelta = useRef({ x: 0, y: 0 });

  /* form state */
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formService, setFormService] = useState("");

  const timeOptions: SelectOption[] = [
    { value: "", label: "Select a time" },
    ...timeSlots.map((t) => ({ value: t, label: t })),
  ];
  const svcOptions: SelectOption[] = [
    { value: "", label: "Select a service" },
    ...serviceOptions.map((o) => ({ value: o, label: o })),
  ];

  const goTo = useCallback(
    (i: number) => {
      if (i < 0 || i >= TOTAL || moving.current) return;
      moving.current = true;
      setCur(i);
      setTimeout(() => {
        moving.current = false;
      }, 700);
    },
    [],
  );

  /* hide footer & lock body scroll on homepage */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "none";
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      if (footer) footer.style.display = "";
    };
  }, []);

  /* wheel navigation */
  useEffect(() => {
    const wrapper = document.getElementById("home-wrapper");
    if (!wrapper) return;
    const handle = (e: WheelEvent) => {
      const panels = wrapper.querySelectorAll<HTMLElement>(".panel");
      const panel = panels[cur];
      if (!panel) return;
      const atTop = panel.scrollTop <= 0;
      const atBot =
        panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 2;

      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        if (e.deltaX > 20) goTo(cur + 1);
        else if (e.deltaX < -20) goTo(cur - 1);
      } else if (Math.abs(e.deltaY) > 30) {
        if (e.deltaY > 0 && atBot) {
          e.preventDefault();
          goTo(cur + 1);
        } else if (e.deltaY < 0 && atTop) {
          e.preventDefault();
          goTo(cur - 1);
        }
      }
    };
    wrapper.addEventListener("wheel", handle, { passive: false });
    return () => wrapper.removeEventListener("wheel", handle);
  }, [cur, goTo]);

  /* keyboard */
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(cur + 1);
      if (e.key === "ArrowLeft") goTo(cur - 1);
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [cur, goTo]);

  /* touch */
  useEffect(() => {
    const wrapper = document.getElementById("home-wrapper");
    if (!wrapper) return;
    const onStart = (e: TouchEvent) => {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      touchDelta.current = { x: 0, y: 0 };
    };
    const onMove = (e: TouchEvent) => {
      touchDelta.current = {
        x: e.touches[0].clientX - touchStart.current.x,
        y: e.touches[0].clientY - touchStart.current.y,
      };
    };
    const onEnd = () => {
      const { x, y } = touchDelta.current;
      if (Math.abs(x) > Math.abs(y) && Math.abs(x) > 40) {
        if (x < 0) goTo(cur + 1);
        else goTo(cur - 1);
      }
    };
    wrapper.addEventListener("touchstart", onStart, { passive: true });
    wrapper.addEventListener("touchmove", onMove, { passive: true });
    wrapper.addEventListener("touchend", onEnd);
    return () => {
      wrapper.removeEventListener("touchstart", onStart);
      wrapper.removeEventListener("touchmove", onMove);
      wrapper.removeEventListener("touchend", onEnd);
    };
  }, [cur, goTo]);

  /* hash-based navigation (header integration) */
  useEffect(() => {
    const handle = () => {
      const h = window.location.hash;
      if (h === "#services") goTo(1);
      else if (h === "#philosophy" || h === "#mission") goTo(2);
      else if (h === "#contact") goTo(3);
    };
    window.addEventListener("hashchange", handle);
    handle();
    return () => window.removeEventListener("hashchange", handle);
  }, [goTo]);

  // Panel 0 is fully transparent so the cinematic video bg is the hero;
  // panels 1-3 keep a translucent gradient so the video subtly bleeds
  // through while content stays readable.
  const panelBg = [
    "bg-transparent",
    "bg-[linear-gradient(160deg,rgba(0,24,69,0.88),rgba(0,16,51,0.92))]",
    "bg-[radial-gradient(ellipse_at_30%_60%,rgba(201,168,76,0.05),transparent_55%),linear-gradient(160deg,rgba(0,16,51,0.9),rgba(0,24,69,0.92))]",
    "bg-[linear-gradient(160deg,rgba(0,24,69,0.92),rgba(0,16,51,0.94))]",
  ];

  return (
    <div
      id="home-wrapper"
      className="relative w-screen h-screen overflow-hidden"
    >
      {/* ── full-page scrub-on-scroll cinematic video ── */}
      <CinematicVideoBackground
        src="/videos/seed-cinematic.mp4"
        sensitivity={0.0065}
        smoothing={0.1}
      />

      {/* ── dots ── */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[150] flex flex-col gap-3 max-md:right-2.5 max-md:gap-2">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-[9px] h-[9px] rounded-full border-[1.5px] transition-all max-md:w-[7px] max-md:h-[7px] ${
              cur === i
                ? "bg-gold border-gold shadow-[0_0_8px_rgba(201,168,76,0.3)]"
                : "bg-transparent border-gold/30"
            }`}
          />
        ))}
      </div>

      {/* ── track ── */}
      <div
        className="flex h-screen transition-transform duration-[600ms] ease-[cubic-bezier(0.25,0.8,0.25,1)]"
        style={{ transform: `translateX(-${cur * 100}vw)` }}
      >
        {/* ════ Panel 0 — Hero ════ */}
        <div
          className={`panel w-screen h-screen flex-shrink-0 relative overflow-y-auto flex items-center justify-center ${panelBg[0]}`}
        >
          {/* Hero panel is transparent — the page-wide CinematicVideoBackground
              is the hero backdrop. */}
          {/* Top navy scrim — 50% navy at the top, fades to transparent
              past the hero copy. Sits below content (z-0). */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[60%] pointer-events-none z-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,11,34,0.5) 0%, rgba(0,16,51,0.35) 35%, rgba(0,16,51,0.12) 70%, transparent 100%)",
            }}
          />
          <Corners />
          <div className="relative z-10 text-center max-w-[680px] px-5 font-body">
            {/* Hero scrim — keeps the title legible over the cinematic video */}
            <div
              aria-hidden="true"
              className="absolute -inset-x-10 -inset-y-12 -z-[1] rounded-[40px] pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,16,51,0.55), rgba(0,16,51,0.25) 55%, transparent 80%)",
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(2px)",
              }}
            />

            <Image
              src="/images/salus-shield.webp"
              alt="Salus Medical"
              width={140}
              height={166}
              className="mx-auto mb-7"
              style={{
                filter:
                  "drop-shadow(0 0 3px rgba(255,255,255,0.95)) drop-shadow(0 0 3px rgba(255,255,255,0.7)) drop-shadow(0 0 42px rgba(201,168,76,0.35))",
              }}
              priority
              unoptimized
            />

            {/* Eyebrow with hairline rules */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="hidden sm:block h-px w-10 bg-gradient-to-r from-transparent to-gold/70" />
              <span
                className="block text-[clamp(10px,1.1vw,12px)] tracking-[7px] uppercase text-[#E8D48B] font-medium"
                style={{
                  textShadow:
                    "0 0 18px rgba(201,168,76,0.45), 0 1px 2px rgba(0,0,0,0.6)",
                }}
              >
                Where healing meets excellence
              </span>
              <span className="hidden sm:block h-px w-10 bg-gradient-to-l from-transparent to-gold/70" />
            </div>

            <h1
              className="font-display text-[clamp(44px,6vw,78px)] font-semibold tracking-[6px] leading-[1.05] mb-1"
            >
              {/* "Salus" — warm cream #FBF7E8 with subtle bevel */}
              <span
                className="inline-block text-[#FBF7E8]"
                style={{
                  // Bevel = bright top edge + dark bottom inset, plus a soft outer halo
                  textShadow: [
                    "0 1px 0 rgba(255,255,255,0.35)",
                    "0 -1px 0 rgba(0,0,0,0.45)",
                    "0 2px 1px rgba(0,0,0,0.55)",
                    "0 0 1px rgba(255,255,255,0.6)",
                    "0 6px 32px rgba(0,16,51,0.65)",
                  ].join(", "),
                }}
              >
                Salus
              </span>{" "}
              {/* "Medical" — vertical gold gradient clipped to the text + halo */}
              <em
                className="not-italic inline-block bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, #F4DC8B 0%, #E8D48B 50%, #B5912E 100%)",
                  WebkitBackgroundClip: "text",
                  filter: [
                    "drop-shadow(0 0 28px rgba(232,212,139,0.55))",
                    "drop-shadow(0 0 60px rgba(201,168,76,0.35))",
                    "drop-shadow(0 2px 4px rgba(0,0,0,0.55))",
                  ].join(" "),
                }}
              >
                Medical
              </em>
            </h1>

            {/* Decorative gold rule under the title */}
            <div className="flex items-center justify-center gap-2 mt-4 mb-5">
              <span className="block h-px w-8 bg-gold/40" />
              <span className="block h-[5px] w-[5px] rotate-45 bg-gold/80" />
              <span className="block h-px w-8 bg-gold/40" />
            </div>

            <p
              className="text-[clamp(13px,1.3vw,15.5px)] text-[#E2E7F0] leading-[1.85] font-light mx-auto max-w-[540px] mt-3 mb-9"
              style={{
                textShadow: "0 1px 2px rgba(0,0,0,0.55)",
              }}
            >
              Comprehensive medical care across specialized disciplines, guided
              by precision, compassion, and an unwavering commitment to your
              well-being.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => goTo(1)}
                className="inline-block bg-gold text-[#001033] font-semibold text-[11px] tracking-[2px] uppercase px-7 py-3 rounded-[3px] border-[1.5px] border-gold hover:bg-transparent hover:text-gold transition-all"
              >
                Explore Services
              </button>
              <button
                onClick={() => goTo(3)}
                className="inline-block bg-transparent text-white font-semibold text-[11px] tracking-[2px] uppercase px-7 py-3 rounded-[3px] border-[1.5px] border-white/20 hover:border-gold hover:text-gold transition-all"
              >
                Schedule Consultation
              </button>
            </div>
          </div>

          {/* swipe hint */}
          <button
            onClick={() => goTo(1)}
            className="absolute bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-40 text-[9px] tracking-[3px] uppercase text-white/50 font-body z-10"
          >
            <span>Swipe</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.5"
              className="w-3.5 stroke-gold animate-[bounceRight_2s_ease-in-out_infinite]"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* ════ Panel 1 — Services ════ */}
        <div
          className={`panel w-screen h-screen flex-shrink-0 relative overflow-y-auto flex items-center justify-center ${panelBg[1]}`}
        >
          <Corners />
          <div className="max-w-[920px] w-full px-5 pt-[80px] pb-4 font-body">
            <p className="text-[10px] tracking-[5px] uppercase text-gold text-center mb-1.5 font-medium">
              Our specialties
            </p>
            <h2 className="font-display text-[clamp(22px,3vw,32px)] text-center mb-2 font-semibold text-white tracking-[2px]">
              Pillars of Care
            </h2>
            <p className="text-center text-slate-muted max-w-[440px] mx-auto text-[12px] leading-[1.7] font-light">
              Dedicated disciplines, united by a singular mission — to safeguard
              what matters most.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mt-5">
              {services.map((s) => (
                <ServiceCard key={s.name} s={s} />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-w-[610px] mx-auto mt-2.5">
              {servicesRow2.map((s) => (
                <ServiceCard key={s.name} s={s} />
              ))}
            </div>
          </div>
        </div>

        {/* ════ Panel 2 — About ════ */}
        <div
          className={`panel w-screen h-screen flex-shrink-0 relative overflow-y-auto flex items-center justify-center ${panelBg[2]}`}
        >
          <Corners />
          <div className="max-w-[640px] w-full px-5 pt-[70px] pb-5 text-center font-body">
            <p className="text-[11px] tracking-[5px] uppercase text-gold text-center mb-2 font-medium">
              Our mission
            </p>
            <h2 className="font-display text-[clamp(24px,3.5vw,38px)] text-center mb-3 font-semibold text-white">
              Your Health, Our Passion
            </h2>
            <div className="w-[50px] h-[2px] bg-gold mx-auto mb-6 rounded-sm" />
            <div className="space-y-3.5">
              <p className="text-slate-muted text-[13px] leading-[1.85] font-light">
                From life&apos;s earliest moments to its most meaningful
                milestones, we are here to care for you — holistically and
                compassionately.
              </p>
              <p className="text-slate-muted text-[13px] leading-[1.85] font-light">
                Our commitment is to deliver personalised healthcare shaped
                around your needs, so you can feel confident in the efficiency,
                convenience, comfort, and trust that comes with every visit.
              </p>
            </div>
            <div className="mt-6 text-[clamp(13px,1.6vw,18px)] text-gold font-semibold font-display px-[22px] py-3.5 border border-gold/20 rounded bg-gold/[0.06] inline-block">
              Take Control of Your Health — Simple, Affordable, Yours.
            </div>

            {/* philosophy quote — opacity 70%, body font, smaller */}
            <div className="mt-8 max-w-[500px] mx-auto relative px-3.5 opacity-70">
              <span className="absolute top-[-12px] left-[-4px] text-[42px] text-gold/20 font-display leading-none">
                &ldquo;
              </span>
              <p className="font-body text-[clamp(11px,1.3vw,13.5px)] leading-[1.75] italic font-light text-[#F5F3ED]">
                Salus, the Roman goddess of health and safety, lends us more
                than a name. She represents the standard we hold ourselves to —
                thoughtful, dedicated care that puts your wellbeing first.
              </p>
              <p className="font-body text-[9.5px] text-gold tracking-[2.5px] uppercase mt-2.5 font-medium">
                The Salus Medical Team
              </p>
            </div>
          </div>
        </div>

        {/* ════ Panel 3 — Contact ════ */}
        <div
          className={`panel w-screen h-screen flex-shrink-0 relative overflow-y-auto flex items-center justify-center ${panelBg[3]}`}
        >
          <Corners />
          <div className="max-w-[540px] w-full px-5 pt-[78px] pb-2 font-body">
            <p className="text-[10px] tracking-[5px] uppercase text-gold text-center mb-1 font-medium">
              Get in touch
            </p>
            <h2 className="font-display text-[clamp(18px,2.4vw,26px)] text-center mb-2 font-semibold text-white tracking-[2px]">
              Book a Consultation
            </h2>

            <div className="relative bg-[#001A3D]/90 border border-gold/[0.12] rounded-[5px] p-3 overflow-hidden backdrop-blur-sm shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
              <div className="absolute top-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-gold/20 via-gold to-gold/20" />
              <form
                onSubmit={(e) => e.preventDefault()}
                className="space-y-1.5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                  <div className="flex flex-col gap-[3px]">
                    <label className={labelCls}>
                      First Name{" "}
                      <b className="text-gold font-normal ml-0.5 text-[9px]">
                        *
                      </b>
                    </label>
                    <input
                      type="text"
                      placeholder="First name"
                      className={inputCls}
                    />
                  </div>
                  <div className="flex flex-col gap-[3px]">
                    <label className={labelCls}>
                      Last Name{" "}
                      <b className="text-gold font-normal ml-0.5 text-[9px]">
                        *
                      </b>
                    </label>
                    <input
                      type="text"
                      placeholder="Last name"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                  <div className="flex flex-col gap-[3px]">
                    <label className={labelCls}>
                      Email{" "}
                      <b className="text-gold font-normal ml-0.5 text-[9px]">
                        *
                      </b>
                    </label>
                    <input
                      type="email"
                      placeholder="you@email.com"
                      className={inputCls}
                    />
                  </div>
                  <div className="flex flex-col gap-[3px]">
                    <label className={labelCls}>
                      Phone{" "}
                      <b className="text-gold font-normal ml-0.5 text-[9px]">
                        *
                      </b>
                    </label>
                    <input
                      type="tel"
                      placeholder="+65"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                  <div className="flex flex-col gap-[3px]">
                    <label className={labelCls}>
                      Preferred Date{" "}
                      <b className="text-gold font-normal ml-0.5 text-[9px]">
                        *
                      </b>
                    </label>
                    <CustomDatePicker
                      value={formDate}
                      onChange={setFormDate}
                    />
                  </div>
                  <div className="flex flex-col gap-[3px]">
                    <label className={labelCls}>
                      Preferred Time{" "}
                      <b className="text-gold font-normal ml-0.5 text-[9px]">
                        *
                      </b>
                    </label>
                    <CustomSelect
                      value={formTime}
                      onChange={setFormTime}
                      options={timeOptions}
                      placeholder="Select a time"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                  <div className="flex flex-col gap-[3px]">
                    <label className={labelCls}>Service</label>
                    <CustomSelect
                      value={formService}
                      onChange={setFormService}
                      options={svcOptions}
                      placeholder="Select a service"
                    />
                  </div>
                  <div className="flex flex-col gap-[3px]">
                    <label className={labelCls}>Message</label>
                    <input
                      type="text"
                      placeholder="Any details we should know..."
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="mt-1.5 text-center">
                  <button
                    type="submit"
                    className="bg-gold text-[#001033] font-semibold text-[10px] tracking-[2px] uppercase px-6 py-1.5 rounded-[3px] border-[1.5px] border-gold hover:bg-transparent hover:text-gold transition-all w-full max-w-[220px]"
                  >
                    Confirm Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
