"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/* ── Questionnaire Data ───────────────────────────────────────── */

const QS = [
  { id: "age", q: "What is your age range?", opts: ["Under 20", "20–29", "30–39", "40–49", "50+"] },
  { id: "sex", q: "Biological sex (for hormonal assessment)", opts: ["Female", "Male", "Prefer not to say"] },
  { id: "fitzpatrick", q: "How does your skin respond to sun exposure?", opts: ["Always burns, never tans (Type I–II)", "Burns then tans (Type III)", "Rarely burns, tans easily (Type IV)", "Never burns, deeply pigmented (Type V–VI)"] },
  { id: "concern", q: "Primary skin concern?", opts: ["Acne / Breakouts", "Eczema / Dryness", "Rosacea / Redness", "Pigmentation / Dark spots", "General maintenance"] },
  { id: "severity", q: "How would you rate your concern severity?", opts: ["Mild — occasional", "Moderate — regular", "Severe — persistent", "Very severe — daily distress"] },
  { id: "type", q: "Your skin type feels like…", opts: ["Oily (shiny by midday)", "Dry (tight, flaky)", "Combination (T-zone oily)", "Normal (balanced)", "Sensitive (reacts easily)"] },
  { id: "climate", q: "Your primary climate?", opts: ["Hot & humid (SE Asia, tropics)", "Hot & dry (desert)", "Temperate (mild seasons)", "Cold & dry (winters)"] },
  { id: "sunscreen", q: "How consistently do you wear SPF?", opts: ["Every day, rain or shine", "Most days", "Occasionally", "Rarely / Never"] },
  { id: "diet", q: "How would you describe your diet?", opts: ["High dairy & refined sugar", "Balanced, whole foods", "High in antioxidants / plant-based", "Mostly processed / fast food"] },
  { id: "sleep", q: "Average sleep per night?", opts: ["Less than 5 hours", "5–6 hours", "7–8 hours", "More than 8 hours"] },
  { id: "stress", q: "Stress levels?", opts: ["Low — rarely stressed", "Moderate — manageable", "High — frequent", "Very high — chronic"] },
  { id: "water", q: "Daily water intake?", opts: ["Less than 1 litre", "1–1.5 litres", "1.5–2 litres", "More than 2 litres"] },
  { id: "current", q: "Current skincare routine complexity?", opts: ["None — bare minimum", "Basic (cleanse + moisturise)", "Moderate (3–5 steps)", "Advanced (actives, serums, etc.)"] },
  { id: "retinoid", q: "Have you used a retinoid before?", opts: ["Yes, well-tolerated", "Yes, but caused irritation", "No, never", "Not sure"] },
  { id: "allergy", q: "Any known skin allergies or sensitivities?", opts: ["Fragrance", "Sunscreen chemicals", "Nickel / metals", "None known", "Multiple / unsure"] },
  { id: "goal", q: "3-month treatment goal?", opts: ["Clear active breakouts", "Improve skin texture", "Even out skin tone", "Calm redness / sensitivity", "Build a solid preventive routine"] },
];

/* ── Shared Components ────────────────────────────────────────── */

function GoldDivider() {
  return (
    <div className="relative mx-auto my-5 w-[60%] max-w-[300px] h-[1px]">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="absolute left-1/2 -top-[2.5px] -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold opacity-40" />
    </div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 justify-center mb-3">
      <div className="w-8 h-[0.5px] bg-gold" />
      <span className="text-[9px] tracking-[5px] uppercase text-gold font-display">{text}</span>
      <div className="w-8 h-[0.5px] bg-gold" />
    </div>
  );
}

/* ── Report Type ──────────────────────────────────────────────── */

interface RoutineStep {
  step: string;
  product: string;
  why: string;
}

interface RoadmapMonth {
  month: string;
  focus: string;
  actions: string[];
}

interface Report {
  fitzpatrick: string;
  skinProfile: string;
  primaryDiagnosis: string;
  keyFindings: string[];
  morningRoutine: RoutineStep[];
  eveningRoutine: RoutineStep[];
  avoid: string[];
  roadmap: RoadmapMonth[];
  evidenceBase: string;
  error?: boolean;
}

/* ── Page Component ───────────────────────────────────────────── */

export default function AnalyserPage() {
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const iv = setInterval(() => setDots((d) => (d + 1) % 4), 500);
    return () => clearInterval(iv);
  }, [loading]);

  const pick = (val: string) => {
    const q = QS[step];
    const next = { ...answers, [q.id]: val };
    setAnswers(next);
    if (step < QS.length - 1) {
      setStep(step + 1);
    } else {
      runAnalysis(next);
    }
  };

  const runAnalysis = async (ans: Record<string, string>) => {
    setLoading(true);
    setReport(null);
    const prompt = `You are a clinical dermatology AI. Based on the patient profile below, produce a structured skin analysis report in JSON only (no markdown, no preamble).

Patient profile:
${Object.entries(ans)
  .map(([k, v]) => `${k}: ${v}`)
  .join("\n")}

Return this exact JSON shape:
{
  "fitzpatrick": "Type X – short description",
  "skinProfile": "2-sentence profile summary",
  "primaryDiagnosis": "condition name",
  "keyFindings": ["finding 1","finding 2","finding 3"],
  "morningRoutine": [
    {"step":"Step name","product":"product recommendation","why":"clinical rationale"}
  ],
  "eveningRoutine": [
    {"step":"Step name","product":"product recommendation","why":"clinical rationale"}
  ],
  "avoid": ["ingredient or habit to avoid"],
  "roadmap": [
    {"month":"Month 1","focus":"focus area","actions":["action 1","action 2"]},
    {"month":"Month 2","focus":"focus area","actions":["action 1","action 2"]},
    {"month":"Month 3","focus":"focus area","actions":["action 1","action 2"]}
  ],
  "evidenceBase": "AAD · NICE · JAAD (list relevant guidelines)"
}`;

    try {
      const res = await fetch("/api/skin-analyser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setReport(data);
    } catch {
      setReport({ error: true } as Report);
    }
    setLoading(false);
  };

  const progress = step >= 0 ? Math.round((step / QS.length) * 100) : 0;

  const resetAll = () => {
    setStep(-1);
    setAnswers({});
    setReport(null);
  };

  return (
    <div className="pt-[72px] min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <SectionLabel text="AI-Powered Assessment" />
          <h2 className="font-display text-3xl font-normal text-foreground mb-2">
            Skin <em className="text-gold">Analyser</em>
          </h2>
          <GoldDivider />
        </div>

        {/* INTRO */}
        {step === -1 && !loading && !report && (
          <div className="bg-navy-card border border-gold/[0.15] p-10 text-center">
            <p className="text-[13px] text-slate-muted leading-loose mb-7 font-display">
              Complete 16 questions about your skin, health, and lifestyle. Our
              AI will generate a personalised clinical routine and 3-month
              treatment roadmap — every recommendation backed by evidence.
            </p>
            <div className="flex gap-5 justify-center mb-8 flex-wrap">
              {[
                { n: "16", l: "Questions" },
                { n: "12", l: "Routine Types" },
                { n: "10", l: "Conditions" },
                { n: "3", l: "Month Roadmap" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-light text-gold font-display">
                    {s.n}
                  </div>
                  <div className="text-[9px] tracking-[2px] text-slate-muted/60 uppercase">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep(0)}
              className="inline-block bg-gradient-to-br from-gold to-gold-dark text-navy font-display text-[11px] tracking-[3px] uppercase px-10 py-4 border border-gold hover:from-gold-light hover:to-gold transition-all"
            >
              Begin Assessment →
            </button>
            <p className="text-[10px] text-slate-muted/50 mt-4 tracking-wide font-display">
              For educational purposes only · Not a substitute for professional
              medical advice
            </p>
          </div>
        )}

        {/* QUESTION */}
        {step >= 0 && !loading && !report && (
          <div key={step} className="animate-fade-in">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-[9px] tracking-[3px] text-gold uppercase font-display">
                  Question {step + 1} of {QS.length}
                </span>
                <span className="text-[9px] tracking-[2px] text-slate-muted/60">
                  {progress}% complete
                </span>
              </div>
              <div className="h-[2px] bg-gold/[0.12] rounded-sm">
                <div
                  className="h-full bg-gradient-to-r from-gold to-gold-dark rounded-sm transition-all duration-400"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="bg-navy-card border border-gold/[0.15] p-8 relative">
              <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-gold via-gold-light/60 to-transparent" />
              <h3 className="font-display text-xl font-normal text-foreground mb-7 leading-relaxed">
                {QS[step].q}
              </h3>
              <div className="flex flex-col gap-2.5">
                {QS[step].opts.map((o, i) => (
                  <button
                    key={i}
                    onClick={() => pick(o)}
                    className="flex items-center gap-3.5 px-5 py-3.5 border border-gold/[0.12] bg-navy text-slate-muted text-left text-[13px] font-display cursor-pointer hover:border-gold/40 hover:bg-gold/[0.04] hover:text-gold transition-all"
                  >
                    <span className="w-5 h-5 rounded-full border-[1.5px] border-slate-muted/30 shrink-0 transition-all" />
                    {o}
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="mt-5 bg-transparent border-none text-slate-muted/60 cursor-pointer text-[11px] font-display tracking-wide hover:text-gold transition-colors"
                >
                  ← Back
                </button>
              )}
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="text-center py-20">
            <div className="text-4xl text-gold opacity-20 mb-6 font-display animate-pulse">
              ◈
            </div>
            <p className="text-sm text-slate-muted tracking-wide font-display">
              Analysing your skin profile{".".repeat(dots)}
            </p>
            <p className="text-[11px] text-slate-muted/50 mt-2.5 tracking-wide">
              Cross-referencing AAD, NICE, JAAD, BAD guidelines
            </p>
          </div>
        )}

        {/* REPORT */}
        {report && !report.error && (
          <div className="animate-fade-in">
            {/* Summary */}
            <div className="bg-navy-card border border-gold/[0.15] p-8 mb-4 text-center">
              <SectionLabel text="Your Analysis" />
              <h3 className="font-display text-2xl font-normal text-foreground mb-1">
                {report.primaryDiagnosis}
              </h3>
              <div className="text-[11px] text-gold tracking-[2px] mb-4">
                {report.fitzpatrick}
              </div>
              <GoldDivider />
              <p className="text-[13px] text-slate-muted leading-loose font-display max-w-lg mx-auto mb-6">
                {report.skinProfile}
              </p>
              <div className="flex gap-2.5 flex-wrap justify-center">
                {report.keyFindings?.map((f, i) => (
                  <span
                    key={i}
                    className="px-4 py-1.5 text-[11px] bg-navy border border-gold/[0.15] text-slate-muted font-display"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Routines */}
            {[
              { label: "☀ Morning Routine", data: report.morningRoutine },
              { label: "☽ Evening Routine", data: report.eveningRoutine },
            ].map((rt, ri) => (
              <div
                key={ri}
                className="bg-navy-card border border-gold/[0.12] p-7 mb-3"
              >
                <div className="text-[9px] tracking-[3px] text-gold uppercase mb-5 font-display">
                  {rt.label}
                </div>
                {rt.data?.map((s, i) => (
                  <div
                    key={i}
                    className="flex gap-3.5 mb-3.5 items-start"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold to-gold-dark text-navy flex items-center justify-center text-[11px] font-semibold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-[9px] tracking-[3px] text-gold uppercase mb-1 font-display">
                        {s.step}
                      </div>
                      <div className="text-[13px] font-medium text-foreground mb-1 font-display">
                        {s.product}
                      </div>
                      <div className="text-[11.5px] text-slate-muted leading-relaxed border-l-2 border-gold/20 pl-2.5">
                        <span className="text-gold-light font-semibold">
                          Why:{" "}
                        </span>
                        {s.why}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* Avoid */}
            {report.avoid && (
              <div className="p-5 bg-gold/[0.03] border border-gold/[0.08] mb-3">
                <div className="text-[9px] tracking-[3px] text-gold uppercase mb-3 font-display">
                  Avoid
                </div>
                <div className="flex gap-2 flex-wrap">
                  {report.avoid.map((a, i) => (
                    <span
                      key={i}
                      className="px-3.5 py-1 text-[11px] bg-navy-card border border-gold/[0.15] text-slate-muted font-display"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Roadmap */}
            {report.roadmap && (
              <div className="bg-navy-card border border-gold/[0.12] p-7 mb-3">
                <div className="text-[9px] tracking-[3px] text-gold uppercase mb-5 font-display">
                  3-Month Roadmap
                </div>
                <div className="flex gap-4 flex-wrap">
                  {report.roadmap.map((m, i) => (
                    <div
                      key={i}
                      className="flex-1 min-w-[180px] bg-navy border border-gold/[0.12] p-4"
                    >
                      <div className="text-[9px] tracking-[2px] text-gold uppercase mb-1.5 font-display">
                        {m.month}
                      </div>
                      <div className="text-[13px] text-foreground mb-2.5 font-medium font-display">
                        {m.focus}
                      </div>
                      {m.actions?.map((a, j) => (
                        <div
                          key={j}
                          className="flex gap-2 items-start mb-1.5"
                        >
                          <div className="w-1.5 h-1.5 rounded-full border-[1.5px] border-gold mt-1.5 shrink-0" />
                          <span className="text-[11px] text-slate-muted leading-relaxed">
                            {a}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3.5 bg-navy-card border border-gold/[0.08] text-center mb-5">
              <span className="text-[10px] text-slate-muted/60 tracking-[1.5px] font-display">
                Evidence: {report.evidenceBase} · For educational purposes only ·
                Consult a qualified dermatologist
              </span>
            </div>

            <div className="text-center flex gap-4 justify-center">
              <button
                onClick={resetAll}
                className="inline-block bg-transparent text-slate-muted font-display text-[11px] tracking-[3px] uppercase px-8 py-3.5 border border-slate-muted/50 hover:border-gold hover:text-gold transition-all"
              >
                Start Over
              </button>
              <Link
                href="/skin#contact"
                className="inline-block bg-gradient-to-br from-gold to-gold-dark text-navy font-display text-[11px] tracking-[3px] uppercase px-8 py-3.5 border border-gold hover:from-gold-light hover:to-gold transition-all"
              >
                Book Consultation
              </Link>
            </div>
          </div>
        )}

        {/* ERROR */}
        {report?.error && (
          <div className="text-center py-10">
            <p className="text-slate-muted mb-5 font-display">
              Something went wrong generating your report. Please try again.
            </p>
            <button
              onClick={resetAll}
              className="inline-block bg-transparent text-slate-muted font-display text-[11px] tracking-[3px] uppercase px-8 py-3.5 border border-slate-muted/50 hover:border-gold hover:text-gold transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
