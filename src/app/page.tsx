"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { CustomSelect, CustomDatePicker, type SelectOption } from "@/components/CustomFormElements";

/* ── service card data ── */
const services = [
  {
    name: "Child",
    subdomain: "salusmedical.co/child",
    desc: "Home vaccination and growth review from newborn through adolescence.",
    url: "/child",
  },
  {
    name: "General Health",
    subdomain: "salusmedical.co/health",
    desc: "Primary care, cancer screenings, and travel medicine — available via telemedicine.",
    url: "/health",
  },
  {
    name: "Sexual Wellness",
    subdomain: "salusmedical.co/sexual-wellness",
    desc: "Confidential, evidence-based treatments and personalised wellness plans.",
    url: "/sexual-wellness",
  },
];

const servicesRow2 = [
  {
    name: "Skin",
    subdomain: "salusmedical.co/skin",
    desc: "Diagnosis, lifestyle management, and medications — no invasive procedures.",
    url: "/skin",
  },
  {
    name: "Legacy",
    subdomain: "salusmedical.co/legacy",
    desc: "Wills, LPA, AMD, and ACP — planning for the future with peace of mind.",
    url: "/legacy",
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
function ServiceCard({ s }: { s: (typeof services)[0] }) {
  return (
    <Link
      href={s.url}
      className="group bg-white/[0.04] border border-gold/[0.1] rounded-[5px] p-5 flex flex-col relative overflow-hidden transition-all duration-400 hover:-translate-y-[2px] hover:border-gold/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
    >
      <div className="absolute top-0 left-0 w-full h-[2.5px] bg-gold opacity-30 group-hover:opacity-100 transition-opacity duration-400" />
      <div className="text-base font-bold text-white mb-0.5">{s.name}</div>
      <div className="text-[10px] text-gold/50 mb-1.5 font-body">{s.subdomain}</div>
      <p className="text-[11px] text-slate-muted leading-[1.6] font-light flex-1">
        {s.desc}
      </p>
      <span className="text-[10px] tracking-[1.5px] uppercase text-gold inline-flex items-center gap-1 mt-2.5 font-medium group-hover:gap-2 transition-all">
        View more &rarr;
      </span>
    </Link>
  );
}

/* ── input class ── */
const inputCls =
  "bg-white/[0.08] border border-gold/[0.1] rounded-[3px] px-3 py-[9px] text-xs text-[#F5F3ED] font-body outline-none w-full transition-colors focus:border-gold placeholder:text-slate-muted/50";
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

  const panelBg = [
    "bg-[radial-gradient(ellipse_at_50%_40%,rgba(201,168,76,0.05),transparent_65%),linear-gradient(160deg,#001033,#001845,#001033)]",
    "bg-[linear-gradient(160deg,#001845,#001033)]",
    "bg-[radial-gradient(ellipse_at_30%_60%,rgba(201,168,76,0.04),transparent_50%),linear-gradient(160deg,#001033,#001845)]",
    "bg-[linear-gradient(160deg,#001845,#001033)]",
  ];

  return (
    <div
      id="home-wrapper"
      className="relative w-screen h-screen overflow-hidden"
    >
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
          {/* Background banner image */}
          <Image
            src="/images/banner.png"
            alt=""
            fill
            className="object-contain object-top md:object-cover md:object-center"
            priority
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-navy/85" />
          {/* Subtle gold radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(201,168,76,0.06),transparent_60%)]" />
          <Corners />
          <div className="relative z-10 text-center max-w-[660px] px-5 font-body">
            <Image
              src="/images/Salus Medical Logo1 png.png"
              alt="Salus Medical"
              width={120}
              height={155}
              className="mx-auto mb-6 drop-shadow-[0_0_30px_rgba(201,168,76,0.08)]"
              priority
            />
            <span className="block text-[clamp(11px,1.3vw,13px)] tracking-[6px] uppercase text-gold mb-4 font-normal">
              Where healing meets excellence
            </span>
            <h1 className="font-display text-[clamp(36px,5vw,64px)] font-bold text-white tracking-[3px] leading-[1.1] mb-2">
              Salus <em className="not-italic text-gold">Medical</em>
            </h1>
            <p className="text-[clamp(13px,1.3vw,15px)] text-slate-muted leading-[1.8] font-light mx-auto max-w-[520px] mt-3 mb-8">
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
          <div className="max-w-[940px] w-full px-5 pt-[70px] pb-5 font-body">
            <p className="text-[11px] tracking-[5px] uppercase text-gold text-center mb-2 font-medium">
              Our specialties
            </p>
            <h2 className="font-display text-[clamp(24px,3.5vw,38px)] text-center mb-3 font-semibold text-white">
              Pillars of Care
            </h2>
            <p className="text-center text-slate-muted max-w-[460px] mx-auto text-[13px] leading-[1.8] font-light">
              Dedicated disciplines, united by a singular mission — to safeguard
              what matters most.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8">
              {services.map((s) => (
                <ServiceCard key={s.name} s={s} />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-[620px] mx-auto mt-3">
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

            {/* philosophy quote */}
            <div className="mt-8 max-w-[540px] mx-auto relative px-3.5">
              <span className="absolute top-[-16px] left-[-4px] text-[56px] text-gold/20 font-display leading-none">
                &ldquo;
              </span>
              <p className="font-display text-[clamp(15px,2vw,21px)] leading-[1.7] italic text-[#F5F3ED]">
                Salus, the Roman goddess of health and safety, lends us more
                than a name. She represents the standard we hold ourselves to —
                thoughtful, dedicated care that puts your wellbeing first.
              </p>
              <p className="text-[11px] text-gold tracking-[3px] uppercase mt-3">
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
          <div className="max-w-[540px] w-full px-5 pt-[70px] pb-5 font-body">
            <p className="text-[11px] tracking-[5px] uppercase text-gold text-center mb-2 font-medium">
              Get in touch
            </p>
            <h2 className="font-display text-[clamp(24px,3.5vw,38px)] text-center mb-3 font-semibold text-white">
              Book a Consultation
            </h2>
            <p className="text-center text-slate-muted max-w-[460px] mx-auto text-[13px] leading-[1.8] font-light">
              For service details, partnership enquiries, or scheduling — fill
              in the form below and our team will be in touch shortly.
            </p>

            <div className="relative bg-[#003267] border border-gold/[0.12] rounded-[5px] p-6 overflow-hidden mt-7">
              <div className="absolute top-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-gold/20 via-gold to-gold/20" />
              <form
                onSubmit={(e) => e.preventDefault()}
                className="space-y-2.5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div className="flex flex-col gap-1">
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
                  <div className="flex flex-col gap-1">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div className="flex flex-col gap-1">
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
                  <div className="flex flex-col gap-1">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div className="flex flex-col gap-1">
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
                  <div className="flex flex-col gap-1">
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

                <div className="flex flex-col gap-1">
                  <label className={labelCls}>Service</label>
                  <CustomSelect
                    value={formService}
                    onChange={setFormService}
                    options={svcOptions}
                    placeholder="Select a service"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className={labelCls}>Message</label>
                  <textarea
                    placeholder="Any details you'd like us to know..."
                    className={`${inputCls} resize-y min-h-[70px]`}
                  />
                </div>

                <div className="mt-4 text-center">
                  <button
                    type="submit"
                    className="bg-gold text-[#001033] font-semibold text-[11px] tracking-[2px] uppercase px-7 py-3 rounded-[3px] border-[1.5px] border-gold hover:bg-transparent hover:text-gold transition-all w-full max-w-[220px]"
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
