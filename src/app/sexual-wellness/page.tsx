"use client";

import { useState } from "react";
import type { Metadata } from "next";

const services = [
  {
    icon: "🩺",
    title: "Sexual Health Consultations",
    desc: "Confidential, non-judgmental consultations for ED, PE, low libido, and other concerns.",
  },
  {
    icon: "💊",
    title: "Prescription Treatments",
    desc: "Evidence-based pharmacological treatments tailored to your needs — PDE5 inhibitors, topicals, and more.",
  },
  {
    icon: "🛡️",
    title: "Contraceptive Services",
    desc: "Full range of contraceptive options with personalised guidance on what suits you best.",
  },
];

const maleConditions = [
  { name: "Erectile Dysfunction", prev: "40–70%", icon: "📊" },
  { name: "Premature Ejaculation", prev: "20–30%", icon: "⏱️" },
  { name: "Low Testosterone", prev: "2–6%", icon: "📉" },
  { name: "Delayed Ejaculation", prev: "1–4%", icon: "⏳" },
  { name: "Peyronie's Disease", prev: "3–9%", icon: "📐" },
  { name: "Phimosis & Balanitis", prev: "~1%", icon: "🔴" },
];

const femaleConditions = [
  { name: "Hypoactive Sexual Desire", prev: "~10%", icon: "💜" },
  { name: "Arousal Disorder", prev: "5–10%", icon: "🟠" },
  { name: "Genito-Pelvic Pain", prev: "~15%", icon: "❤️‍🩹" },
  { name: "Orgasmic Disorder", prev: "10–15%", icon: "🩵" },
  { name: "Genitourinary Syndrome", prev: "~50% post-meno", icon: "💙" },
];

const stats = [
  { value: "40%+", label: "of men over 40 experience ED" },
  { value: "45%", label: "of women report sexual dysfunction" },
  { value: "70%", label: "success rate, first-line treatments" },
  { value: "<25%", label: "of those affected seek help" },
];

const approachSteps = [
  {
    n: "01",
    t: "Confidential consultation",
    d: "Share concerns in a private, judgement-free setting.",
    color: "border-blue-500",
  },
  {
    n: "02",
    t: "Clinical assessment",
    d: "Targeted questionnaires, tests, and exams to find root causes.",
    color: "border-green-500",
  },
  {
    n: "03",
    t: "Treatment plan",
    d: "Evidence-based options tailored to your condition and goals.",
    color: "border-purple-500",
  },
  {
    n: "04",
    t: "Ongoing support",
    d: "Follow-ups, adjustments, and specialist referrals as needed.",
    color: "border-orange-500",
  },
];

const guideTags = [
  "Firmness Scale",
  "PE Calculator",
  "ED Treatments",
  "Female Quiz",
  "Contraceptives SG",
];

export default function SexualWellnessPage() {
  return (
    <div className="pt-[72px]">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-[#1a3a5c] via-[#2471a3] to-[#8e44ad] text-white py-16 md:py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-[11px] tracking-[2px] uppercase opacity-60 mb-4 font-semibold">
            Evidence-based · Confidential · Compassionate
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold leading-tight mb-4">
            Your sexual health deserves expert care
          </h1>
          <p className="text-[15px] opacity-90 leading-relaxed mb-8 max-w-xl mx-auto">
            Personalised, judgement-free consultations and treatments for men and
            women in Singapore. From ED and PE to contraceptive guidance — we're
            here for you.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="#guide"
              className="inline-flex items-center gap-1.5 px-6 py-3 rounded-lg font-bold text-sm bg-white text-[#1a3a5c] shadow-md hover:bg-gray-100 transition-colors"
            >
              Interactive Guide →
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 px-6 py-3 rounded-lg font-bold text-sm bg-white/[0.15] text-white border border-white/20 hover:bg-white/25 transition-colors"
            >
              Book Consultation
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-navy-light border-b border-gold/[0.12]">
        <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-2xl font-extrabold text-gold">{s.value}</div>
              <div className="text-[11px] text-slate-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="inline-block bg-purple-500/20 text-purple-300 rounded-full px-3 py-0.5 text-[11px] font-semibold">
            Services
          </span>
        </div>
        <h2 className="font-display text-2xl font-extrabold text-gold mb-2">
          What we offer
        </h2>
        <p className="text-sm text-slate-muted leading-relaxed mb-6 max-w-xl">
          We combine clinical expertise with a warm, patient-centred approach —
          helping you understand your body and take control of your sexual
          wellbeing.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((s, i) => (
            <div
              key={i}
              className="bg-navy-card border border-gold/[0.12] rounded-xl p-6 hover:border-gold/30 transition-colors"
            >
              <div className="text-2xl mb-3">{s.icon}</div>
              <div className="font-bold text-sm text-gold mb-2">{s.title}</div>
              <div className="text-[13px] text-slate-muted leading-relaxed">
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONDITIONS */}
      <section className="bg-navy-light py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="inline-block bg-blue-500/20 text-blue-300 rounded-full px-3 py-0.5 text-[11px] font-semibold">
            Conditions
          </span>
          <h2 className="font-display text-2xl font-extrabold text-gold mt-2 mb-1">
            Common conditions, effective solutions
          </h2>
          <p className="text-sm text-slate-muted leading-relaxed mb-6 max-w-xl">
            Far more prevalent than most realise — and all treatable.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Male */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm">
                  ♂
                </div>
                <span className="font-bold text-[15px] text-gold">Male</span>
              </div>
              <div className="space-y-1.5">
                {maleConditions.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-navy-card border border-gold/[0.08]"
                  >
                    <span className="text-base">{c.icon}</span>
                    <span className="flex-1 font-semibold text-[13px] text-foreground">
                      {c.name}
                    </span>
                    <span className="text-[11px] text-slate-muted">
                      {c.prev}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Female */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white font-extrabold text-sm">
                  ♀
                </div>
                <span className="font-bold text-[15px] text-gold">Female</span>
              </div>
              <div className="space-y-1.5">
                {femaleConditions.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-navy-card border border-gold/[0.08]"
                  >
                    <span className="text-base">{c.icon}</span>
                    <span className="flex-1 font-semibold text-[13px] text-foreground">
                      {c.name}
                    </span>
                    <span className="text-[11px] text-slate-muted">
                      {c.prev}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <a
              href="#guide"
              className="inline-flex items-center gap-1.5 px-6 py-3 rounded-lg font-bold text-sm bg-gradient-to-br from-[#1a3a5c] via-[#2471a3] to-[#8e44ad] text-white shadow-md hover:opacity-90 transition-opacity"
            >
              Explore All in the Interactive Guide →
            </a>
          </div>
        </div>
      </section>

      {/* INTERACTIVE GUIDE CTA */}
      <section
        id="guide"
        className="bg-gradient-to-br from-[#1a3a5c] via-[#2471a3] to-[#8e44ad] py-16 px-6 text-center text-white"
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-4xl mb-3">📖</div>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold mb-3">
            Sexual Health Interactive Guide
          </h2>
          <p className="text-sm opacity-90 leading-relaxed mb-4">
            Clinician-reviewed educational resource — Erection Hardness Scale,
            IELT calculator, female symptom quiz, Singapore contraceptive
            options, and treatment overviews.
          </p>
          <div className="flex gap-2 justify-center flex-wrap mb-8">
            {guideTags.map((t) => (
              <span
                key={t}
                className="bg-white/[0.15] rounded-full px-3 py-1 text-[11px] font-semibold"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="bg-white/[0.08] rounded-2xl p-8 border border-white/[0.15]">
            <p className="text-[13px] opacity-80 mb-6 leading-relaxed">
              Detailed clinical information, self-assessment tools, and
              treatment comparisons — all in one place.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 px-8 py-4 rounded-lg font-bold text-[15px] bg-white text-[#1a3a5c] shadow-md hover:bg-gray-100 transition-colors"
            >
              Book a Consultation →
            </a>
            <p className="text-[11px] opacity-50 mt-3">
              Free · No sign-up · Educational only
            </p>
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <span className="inline-block bg-emerald-500/20 text-emerald-300 rounded-full px-3 py-0.5 text-[11px] font-semibold">
          Our approach
        </span>
        <h2 className="font-display text-2xl font-extrabold text-gold mt-2 mb-5">
          How we care for you
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {approachSteps.map((s, i) => (
            <div
              key={i}
              className={`bg-navy-card border border-gold/[0.12] rounded-xl p-5 border-t-[3px] ${s.color} hover:border-gold/30 transition-colors`}
            >
              <div className="text-xl font-extrabold text-gold mb-1">
                {s.n}
              </div>
              <div className="font-bold text-[13px] text-foreground mb-1">
                {s.t}
              </div>
              <div className="text-xs text-slate-muted leading-relaxed">
                {s.d}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="px-6 pb-16">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#1a3a5c] via-[#2471a3] to-[#8e44ad] rounded-2xl p-8 md:p-10 text-white grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold mb-3">
              Take the first step
            </h2>
            <p className="text-sm opacity-90 leading-relaxed mb-6">
              Have a concern or want to learn more? Our team is here. All
              consultations are completely confidential.
            </p>
            {[
              ["📍", "Singapore"],
              ["📞", "Contact Salus Medical"],
              ["🕐", "Mon – Sat"],
              ["🔒", "Strictly confidential"],
            ].map(([ic, tx], i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-sm mb-2"
              >
                <span className="text-base">{ic}</span>
                <span className="opacity-95">{tx}</span>
              </div>
            ))}
          </div>

          <div className="bg-white/[0.08] rounded-xl p-6 border border-white/[0.15]">
            <div className="font-bold text-base mb-4">
              Request a consultation
            </div>
            {[
              ["Full name", "text"],
              ["Email", "email"],
              ["Phone", "tel"],
            ].map(([l, t], i) => (
              <div key={i} className="mb-3">
                <label className="text-xs opacity-70 block mb-1">{l}</label>
                <input
                  type={t}
                  className="w-full px-3 py-2 rounded-lg border border-white/25 bg-white/[0.08] text-white text-[13px] outline-none focus:border-gold transition-colors placeholder-white/30"
                  placeholder={l as string}
                />
              </div>
            ))}
            <button className="w-full py-3 rounded-lg font-bold text-sm bg-white text-[#1a3a5c] mt-1 hover:bg-gray-100 transition-colors">
              Submit Enquiry
            </button>
            <p className="text-[10px] opacity-45 mt-2 text-center">
              Encrypted · Used only to contact you
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
