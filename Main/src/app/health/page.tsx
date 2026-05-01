"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

/* ── Data ─────────────────────────────────────────────────────── */

interface Pillar {
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  summary: string;
  desc: string;
  tests: string[];
  isCancer?: boolean;
}

interface CancerEntry {
  cancer: string;
  icon: string;
  gender: string;
  uspstf: string;
  mohsg: string;
  additional: string;
  risk: string;
}

const STATS = [
  { target: 80, suffix: "%", color: "text-red-600", label: "of heart disease is preventable with early detection and lifestyle changes" },
  { target: 7, suffix: " yrs", color: "text-pink-500", label: "average delay between onset and diabetes diagnosis worldwide" },
  { target: 37, suffix: "%", color: "text-amber-500", label: "of adults have pre-diabetes — most don't know it" },
  { target: 90, suffix: "%", color: "text-violet-500", label: "of kidney function can be lost before symptoms appear" },
];

const PILLARS: Pillar[] = [
  { icon: "\u{1FA78}", title: "Blood Counts (CBC)", subtitle: "Red Cells, White Cells & Platelets", color: "#EF4444", summary: "Your complete blood count — the foundation of any health check. Detects anaemia, infection, clotting issues, and blood cancers.", desc: "The full blood count (FBC/CBC) is the most commonly ordered blood test worldwide. White blood cells reveal infections and immune disorders. Red blood cells and haemoglobin detect anaemia — from iron deficiency to chronic disease. Platelets flag clotting risks. The differential (neutrophils, lymphocytes, monocytes, eosinophils, basophils) provides a detailed breakdown of your immune system's activity.", tests: ["WBC", "RBC", "Haemoglobin", "Haematocrit", "Platelets", "MCV", "Neutrophils", "Lymphocytes"] },
  { icon: "\u{1FAC0}", title: "Cardiovascular Health", subtitle: "Heart & Circulation", color: "#DC2626", summary: "Lipid panels, cardiac biomarkers, and metabolic risk profiling to track heart disease risk over time.", desc: "Comprehensive lipid panels, cardiac biomarkers (BNP, hs-CRP), and metabolic risk profiling. Track your cholesterol trajectory over time with our visual trend engine. Lp(a) is a genetic risk factor the guidelines now recommend testing once in your lifetime. ApoB gives a more accurate count of harmful cholesterol particles than LDL alone.", tests: ["Total Cholesterol", "LDL / HDL", "ApoB", "Lp(a)", "hs-CRP", "NT-proBNP"] },
  { icon: "\u{1F36C}", title: "Metabolic & Diabetes", subtitle: "Blood Sugar & Insulin", color: "#EC4899", summary: "Fasting glucose, HbA1c 3-month averages, and fasting insulin to catch pre-diabetes early.", desc: "From fasting glucose to HbA1c 3-month averages and fasting insulin. Catch pre-diabetes early and monitor glycaemic control with evidence-based targets. 37% of adults have pre-diabetes and most don't know it. HbA1c below 5.7% is normal, 5.7\u20136.4% is pre-diabetic, and 6.5%+ indicates diabetes.", tests: ["Fasting Glucose", "HbA1c", "Fasting Insulin", "HOMA-IR"] },
  { icon: "\u{1FAD8}", title: "Kidney Function", subtitle: "Filtration & Waste", color: "#8B5CF6", summary: "eGFR scoring, creatinine, and the UACR urine test that catches kidney damage years before symptoms.", desc: "eGFR scoring, creatinine monitoring, and the critical UACR urine test that catches kidney damage years before symptoms appear — especially vital for diabetes and hypertension. 90% of kidney function can be lost before symptoms appear. eGFR above 90 is normal; below 60 warrants closer monitoring.", tests: ["Creatinine", "eGFR", "UACR", "Uric Acid", "Electrolytes"] },
  { icon: "\u{1FAC1}", title: "Liver Health", subtitle: "Detoxification & Metabolism", color: "#10B981", summary: "Liver enzyme panels, bilirubin, and albumin — essential for statin monitoring and fatty liver screening.", desc: "Liver enzyme panels (ALT, AST, GGT, ALP), bilirubin, and albumin. Essential monitoring before and during statin therapy, and for fatty liver disease screening. GGT is particularly sensitive to alcohol consumption. Elevated ALT is the most common early sign of non-alcoholic fatty liver disease (NAFLD).", tests: ["ALT", "AST", "GGT", "ALP", "Bilirubin", "Albumin"] },
  { icon: "\u{1F98B}", title: "Thyroid Function", subtitle: "Energy & Metabolism", color: "#06B6D4", summary: "TSH, Free T4, and Free T3 — reveals if your thyroid is the hidden cause of fatigue or weight changes.", desc: "TSH, Free T4, and Free T3 — the trio that reveals if your thyroid is underactive, overactive, or just right. Often the hidden cause behind fatigue, weight changes, and mood shifts. An underactive thyroid can also cause high cholesterol. Thyroid disorders affect roughly 1 in 20 people and are more common in women.", tests: ["TSH", "Free T4", "Free T3"] },
  { icon: "\u{1F48A}", title: "Nutrients & Vitamins", subtitle: "Deficiency Detection", color: "#F97316", summary: "Vitamin D, B12, folate, and iron — among the most common and treatable deficiencies worldwide.", desc: "Essential micronutrients that drive energy, immunity, and bone health. Vitamin D deficiency affects up to 40% of adults and impacts bone density, immune function, and mood. B12 deficiency causes fatigue and neurological symptoms — common in vegetarians and older adults. Folate is critical for DNA synthesis and pregnancy. Iron studies (ferritin, serum iron, TIBC, transferrin saturation) reveal both deficiency and overload.", tests: ["Vitamin D", "Vitamin B12", "Folate", "Ferritin", "Serum Iron", "TIBC", "Transferrin Sat %"] },
  { icon: "\u{1F397}\uFE0F", title: "Cancer Screening", subtitle: "Early Detection Markers", color: "#7C3AED", summary: "Blood-based tumour markers plus screening schedules aligned with USPSTF and Singapore MOH guidelines.", desc: "Blood-based tumour markers plus personalised screening schedules aligned with USPSTF and Singapore MOH (Healthier SG) guidelines. These markers are screening aids — not definitive diagnoses. An abnormal result prompts further investigation. The dashboard also includes age-and-gender-personalised screening recommendations.", tests: ["PSA", "CEA", "AFP", "CA-125", "CA 19-9", "CA 15-3", "B2M", "B-hCG"], isCancer: true },
];

const CANCER: CancerEntry[] = [
  { cancer: "Breast Cancer", icon: "\u{1F380}", gender: "F", uspstf: "Women aged 40\u201374: mammogram every 2 years (Grade B). Evidence insufficient for 75+.", mohsg: "Women aged 50\u201369: mammogram every 2 years. Women 40\u201349 and 70+: discuss with doctor on a case-by-case basis.", additional: "Breast ultrasound (dense breasts), breast MRI (BRCA carriers / high-risk), genetic testing (BRCA1/BRCA2).", risk: "Family history, BRCA1/2 mutations, dense breast tissue, prior chest radiation" },
  { cancer: "Cervical Cancer", icon: "\u2640\uFE0F", gender: "F", uspstf: "Women 21\u201329: Pap smear every 3 years. Women 30\u201365: HPV primary test every 5 years (preferred), or Pap every 3 years, or co-testing every 5 years.", mohsg: "Women 25\u201329 (sexually active): Pap smear every 3 years. Women 30\u201369: HPV test every 5 years. Self-collected HPV samples now supported.", additional: "HPV vaccination (ages 9\u201326, up to 45 for nanovalent vaccine), colposcopy for abnormal results.", risk: "HPV infection, smoking, immunosuppression, multiple sexual partners" },
  { cancer: "Colorectal Cancer", icon: "\u{1FAC1}", gender: "All", uspstf: "Adults aged 45\u201375: high-sensitivity stool test (FIT) yearly, or colonoscopy every 10 years, or stool DNA test every 1\u20133 years (Grade A/B). Ages 76\u201385: individual decision.", mohsg: "Adults aged 50+: FIT yearly or colonoscopy every 10 years. Subsidised under Healthier SG Screening.", additional: "CT colonography every 5 years, flexible sigmoidoscopy every 5 years, CEA tumour marker monitoring (for diagnosed patients).", risk: "Family history, polyps, inflammatory bowel disease, obesity, smoking" },
  { cancer: "Lung Cancer", icon: "\u{1FAC1}", gender: "All", uspstf: "Adults aged 50\u201380 with \u226520 pack-year smoking history who currently smoke or quit within 15 years: annual low-dose CT scan (Grade B).", mohsg: "Not recommended for general population screening. High-risk individuals (heavy smokers, occupational exposure) should discuss with their doctor.", additional: "Chest X-ray (limited sensitivity), sputum cytology, PET-CT for suspicious findings, lung function tests.", risk: "Smoking (\u226520 pack-years), radon exposure, asbestos, family history" },
  { cancer: "Prostate Cancer", icon: "\u2642\uFE0F", gender: "M", uspstf: "Men aged 55\u201369: individual decision about PSA testing after discussing risks and benefits with a clinician (Grade C). Not recommended for 70+ (Grade D).", mohsg: "Not part of Healthier SG population screening. Discuss with doctor if concerned, especially with family history.", additional: "PSA blood test, free/total PSA ratio, prostate MRI (mpMRI), digital rectal exam (DRE), prostate biopsy if indicated.", risk: "Family history, Black ethnicity, age >50, BRCA2 mutations" },
  { cancer: "Liver Cancer", icon: "\u{1FAC0}", gender: "All", uspstf: "No general population recommendation. High-risk groups should be monitored.", mohsg: "Not recommended for general population. High-risk patients (Hepatitis B/C carriers, cirrhosis): AFP blood test + liver ultrasound every 6 months.", additional: "AFP tumour marker, liver ultrasound, CT/MRI abdomen, Hepatitis B/C serology, FibroScan for fibrosis staging.", risk: "Chronic Hepatitis B/C, liver cirrhosis, heavy alcohol use, fatty liver disease" },
  { cancer: "Gastric (Stomach) Cancer", icon: "\u{1F534}", gender: "All", uspstf: "No current recommendation for general population screening in the US.", mohsg: "Not part of Healthier SG Screening. However, Singapore's higher gastric cancer incidence (vs. Western countries) means doctors may recommend endoscopy for high-risk individuals.", additional: "Upper GI endoscopy (OGD), H. pylori breath/stool test, pepsinogen I/II ratio, barium swallow.", risk: "H. pylori infection, family history, smoking, high-salt diet, East Asian ethnicity" },
  { cancer: "Ovarian Cancer", icon: "\u2640\uFE0F", gender: "F", uspstf: "Screening with CA-125 or ultrasound is NOT recommended for average-risk women (Grade D) due to high false-positive rates.", mohsg: "Not recommended for general population screening. High-risk women (BRCA1/2, strong family history) should discuss with gynaecologist.", additional: "CA-125 blood test (monitoring), transvaginal ultrasound, BRCA genetic testing, risk-reducing salpingo-oophorectomy for carriers.", risk: "BRCA1/2 mutations, family history, Lynch syndrome, endometriosis" },
];

const JOURNEY = [
  { num: "01", title: "Get Tested", desc: "Visit your lab or clinic. Bring your results — paper or digital.", icon: "\u{1F9EA}" },
  { num: "02", title: "Enter Results", desc: "Type your values into the Salus dashboard. Units auto-convert.", icon: "\u{1F4CA}" },
  { num: "03", title: "See Your Picture", desc: "Instant colour-coded gauges, trend sparklines, and condition overlays.", icon: "\u{1F3AF}" },
  { num: "04", title: "Consult & Act", desc: "Share with your doctor via telemedicine. Track changes over time.", icon: "\u{1F4AC}" },
];

const CHRONIC = [
  { icon: "\u{1F36C}", name: "Diabetes", color: "#EC4899", points: ["HbA1c target tracking (<7%)", "Annual UACR kidney screening", "Lipid panel for cardiovascular risk", "Liver enzyme monitoring for fatty liver"] },
  { icon: "\u{1F493}", name: "High Blood Pressure", color: "#EF4444", points: ["Kidney function (eGFR, creatinine)", "Electrolytes (K\u207A) on medications", "Metabolic screening for diabetes co-morbidity", "Cardiac strain markers (BNP)"] },
  { icon: "\u{1F9C8}", name: "High Cholesterol", color: "#F59E0B", points: ["LDL targets by risk category", "One-time Lp(a) genetic test", "ApoB for advanced lipid analysis", "Liver safety on statin therapy"] },
];

const TELE = [
  { icon: "\u{1F4F1}", title: "Shareable Reports", desc: "Export a clean summary of your results and trends to share with any doctor — in-person or remote." },
  { icon: "\u{1F504}", title: "Longitudinal Tracking", desc: "Multiple visit support with date-stamped records. See how your numbers move across months and years." },
  { icon: "\u{1F916}", title: "AI Health Assistant", desc: "Ask about any test — even ones not in the panel. Get plain-English explanations powered by clinical AI." },
  { icon: "\u{1F3E5}", title: "Condition Overlays", desc: "Select your chronic conditions (diabetes, hypertension, high cholesterol) and see which tests matter most for you." },
];

const DASH_CATS = [
  "\u{1FA78} Blood Cells", "\u{1FAC0} Cholesterol", "\u{1FAC1} Liver", "\u{1FAD8} Kidney",
  "\u{1F36C} Sugar", "\u{1F98B} Thyroid", "\u2764\uFE0F Heart", "\u{1F397}\uFE0F Cancer",
];

const DASH_GAUGES = [
  { name: "Haemoglobin", pct: 65, color: "#10B981", status: "Normal" },
  { name: "LDL Cholesterol", pct: 82, color: "#EF4444", status: "High" },
  { name: "HbA1c", pct: 55, color: "#10B981", status: "Normal" },
];

/* ── Animated Counter Hook ────────────────────────────────────── */

function useCounterAnimation(target: number, suffix: string) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated.current) {
            animated.current = true;
            let start = 0;
            const step = target / 125;
            const id = setInterval(() => {
              start += step;
              if (start >= target) {
                setValue(target);
                clearInterval(id);
              } else {
                setValue(Math.floor(start));
              }
            }, 16);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return { ref, display: `${value}${suffix}` };
}

/* ── InView Animation Hook ────────────────────────────────────── */

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, className: visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8" };
}

/* ── Stat Card ────────────────────────────────────────────────── */

function StatCard({ target, suffix, color, label }: typeof STATS[number]) {
  const counter = useCounterAnimation(target, suffix);
  return (
    <div className="rounded-3xl bg-white border border-navy/[0.06] shadow-sm p-8 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lg">
      <div ref={counter.ref} className={`font-display text-5xl md:text-[48px] leading-none ${color}`}>
        {counter.display}
      </div>
      <p className="font-body text-sm text-gray-500 leading-relaxed mt-3">{label}</p>
    </div>
  );
}

/* ── Pillar Accordion Item ────────────────────────────────────── */

function PillarItem({ pillar, isOpen, onToggle }: { pillar: Pillar; isOpen: boolean; onToggle: () => void }) {
  const [openCancers, setOpenCancers] = useState<Set<number>>(new Set());

  const toggleCancer = useCallback((idx: number) => {
    setOpenCancers((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }, []);

  return (
    <div
      className="rounded-2xl mb-3 border overflow-hidden transition-all duration-500"
      style={{
        background: "#fff",
        borderColor: isOpen ? `${pillar.color}4D` : "rgba(15,27,61,0.06)",
        boxShadow: isOpen ? `0 8px 24px ${pillar.color}15` : "0 2px 8px rgba(15,27,61,0.02)",
      }}
    >
      {/* Header */}
      <button onClick={onToggle} className="w-full text-left px-6 py-[18px] flex items-center gap-4 bg-transparent border-none cursor-pointer">
        <div
          className="w-1 h-9 rounded flex-shrink-0 transition-opacity duration-300"
          style={{ background: pillar.color, opacity: isOpen ? 1 : 0.4 }}
        />
        <span className="text-2xl flex-shrink-0">{pillar.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <h3 className="font-display text-[19px] font-normal text-navy m-0">{pillar.title}</h3>
            <span className="font-body text-[11px] font-semibold tracking-wide" style={{ color: pillar.color }}>
              {pillar.subtitle}
            </span>
          </div>
          {!isOpen && (
            <p className="font-body text-[13px] text-gray-400 mt-1 leading-snug font-light">{pillar.summary}</p>
          )}
        </div>
        <div
          className="text-lg flex-shrink-0 ml-2 transition-all duration-300"
          style={{ color: isOpen ? pillar.color : "#CBD5E1", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
        >
          &#9662;
        </div>
      </button>

      {/* Body */}
      {isOpen && (
        <div className="px-6 pb-6 pl-[68px] animate-[fadeUp_0.3s_ease-out] md:pl-[68px] max-md:pl-6">
          <p className="font-body text-sm text-gray-600 leading-relaxed font-light mb-4">{pillar.desc}</p>
          <div className="flex flex-wrap gap-1.5">
            {pillar.tests.map((t) => (
              <span
                key={t}
                className="font-body px-3 py-1.5 rounded-lg text-[11px] font-medium border"
                style={{
                  background: `${pillar.color}12`,
                  color: `${pillar.color}CC`,
                  borderColor: `${pillar.color}18`,
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Cancer Guidelines */}
          {pillar.isCancer && (
            <div className="border-t border-violet-500/10 pt-5 mt-6">
              <h4 className="font-display text-xl text-navy font-normal mb-1">Evidence-Based Screening Guidelines</h4>
              <p className="font-body text-xs text-gray-400 mb-4 font-light">
                USPSTF (US) and MOH Singapore (Healthier SG) recommendations
              </p>

              {/* Legend */}
              <div className="flex gap-4 mb-4 flex-wrap">
                {[
                  { color: "#1E40AF", label: "USPSTF" },
                  { color: "#DC2626", label: "MOH Singapore" },
                  { color: "#7C3AED", label: "Additional Tests" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-sm" style={{ background: l.color }} />
                    <span className="font-body text-[11px] text-gray-500 font-medium">{l.label}</span>
                  </div>
                ))}
              </div>

              {/* Cancer Cards */}
              {CANCER.map((c, idx) => {
                const cOpen = openCancers.has(idx);
                const gLabel = c.gender === "F" ? "Women" : c.gender === "M" ? "Men" : "All adults";
                return (
                  <div
                    key={idx}
                    className="rounded-[14px] overflow-hidden border mb-2.5 transition-all duration-300"
                    style={{
                      background: cOpen ? "rgba(124,58,237,0.02)" : "#FAFAF7",
                      borderColor: cOpen ? "rgba(124,58,237,0.12)" : "rgba(15,27,61,0.06)",
                    }}
                  >
                    <button
                      onClick={() => toggleCancer(idx)}
                      className="w-full text-left px-[18px] py-3.5 flex items-center gap-3 bg-transparent border-none cursor-pointer"
                    >
                      <span className="text-[22px] flex-shrink-0">{c.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-body text-sm font-semibold text-navy m-0">{c.cancer}</h4>
                        <span className="font-body text-[11px] text-gray-400">{gLabel}</span>
                      </div>
                      <div
                        className="text-sm flex-shrink-0 transition-all duration-300"
                        style={{ color: cOpen ? "#7C3AED" : "#CBD5E1", transform: cOpen ? "rotate(180deg)" : "rotate(0)" }}
                      >
                        &#9662;
                      </div>
                    </button>
                    {cOpen && (
                      <div className="px-[18px] pb-[18px] pl-[52px] max-md:pl-[18px] animate-[fadeUp_0.25s_ease-out]">
                        {/* USPSTF */}
                        <div className="mb-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            <div className="w-[7px] h-[7px] rounded-sm flex-shrink-0 bg-blue-800" />
                            <span className="font-body text-[10px] font-bold tracking-wider uppercase text-blue-800">USPSTF</span>
                          </div>
                          <p className="font-body text-xs text-gray-700 leading-relaxed font-light pl-[13px]">{c.uspstf}</p>
                        </div>
                        {/* MOH Singapore */}
                        <div className="mb-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            <div className="w-[7px] h-[7px] rounded-sm flex-shrink-0 bg-red-600" />
                            <span className="font-body text-[10px] font-bold tracking-wider uppercase text-red-600">MOH Singapore</span>
                          </div>
                          <p className="font-body text-xs text-gray-700 leading-relaxed font-light pl-[13px]">{c.mohsg}</p>
                        </div>
                        {/* Additional Tests */}
                        <div className="mb-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            <div className="w-[7px] h-[7px] rounded-sm flex-shrink-0 bg-violet-600" />
                            <span className="font-body text-[10px] font-bold tracking-wider uppercase text-violet-600">Additional Tests</span>
                          </div>
                          <p className="font-body text-xs text-gray-700 leading-relaxed font-light pl-[13px]">{c.additional}</p>
                        </div>
                        {/* Risk */}
                        <div className="rounded-[10px] bg-amber-500/5 border border-amber-500/10 px-3.5 py-2.5">
                          <div className="font-body text-[10px] font-bold text-amber-900 tracking-wider uppercase mb-0.5">Higher Risk If</div>
                          <p className="font-body text-[11px] text-amber-950 leading-relaxed font-light">{c.risk}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Screening Note */}
              <div className="mt-5 p-4 px-5 rounded-[14px] bg-violet-500/[0.04] border border-violet-500/10 flex gap-3.5 items-start">
                <span className="text-xl flex-shrink-0">{"\u2695\uFE0F"}</span>
                <div>
                  <div className="font-body text-[13px] font-semibold text-navy mb-1">Screening is for people without symptoms</div>
                  <p className="font-body text-xs text-gray-500 leading-relaxed font-light">
                    If you have symptoms (unexplained weight loss, blood in stool, lumps, unusual bleeding), see your doctor immediately. People with strong family history may need earlier or more frequent screening. Tumour markers are screening aids — an abnormal result does not automatically mean cancer.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Page Component ───────────────────────────────────────────── */

export default function HealthPage() {
  const [openPillar, setOpenPillar] = useState<number | null>(null);

  const heroInView = useInView();
  const pillarsInView = useInView();
  const journeyInView = useInView();
  const chronicInView = useInView();
  const teleInView = useInView();

  return (
    <main className="bg-[#FAFAF7] text-navy">
      {/* ═══ Global animation keyframes ═══ */}
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float1 { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-40px,30px) scale(1.1); } }
        @keyframes float2 { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-40px) scale(1.05); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}</style>

      {/* ═══════ WHY PREVENTION ═══════ */}
      <section className="relative bg-[#FAFAF7]">
        {/* Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute w-[600px] h-[600px] rounded-full -top-[200px] -right-[100px] animate-[float1_20s_ease-in-out_infinite]" style={{ background: "radial-gradient(circle, rgba(212,168,67,0.08) 0%, transparent 70%)" }} />
          <div className="absolute w-[400px] h-[400px] rounded-full -bottom-[100px] -left-[50px] animate-[float2_25s_ease-in-out_infinite]" style={{ background: "radial-gradient(circle, rgba(15,27,61,0.06) 0%, transparent 70%)" }} />
        </div>

        <div className="relative z-[1] max-w-[1200px] mx-auto px-6 py-[100px] max-md:py-[60px]">
          <div
            ref={heroInView.ref}
            className={`text-center max-w-[680px] mx-auto transition-all duration-700 ${heroInView.className}`}
          >
            <div className="inline-flex px-[18px] py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase font-body bg-navy/[0.04] border border-navy/[0.06] text-[#8B7355] mb-5">
              The Case for Prevention
            </div>
            <h2 className="font-display text-[44px] max-md:text-[32px] leading-[1.15] font-normal text-navy mb-5 tracking-tight">
              Chronic disease doesn&apos;t arrive overnight
            </h2>
            <p className="font-body text-base text-gray-500 leading-relaxed font-light">
              Most chronic conditions — diabetes, heart disease, kidney failure — develop silently over years. Routine blood tests are your early warning system. The difference between a manageable condition and a crisis often comes down to catching it one test earlier.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 max-md:grid-cols-2 gap-6 mt-16">
            {STATS.map((s, i) => (
              <StatCard key={i} {...s} />
            ))}
          </div>

          {/* Continuity Callout */}
          <div className="mt-16 p-12 max-md:p-8 rounded-[28px] relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0F1B3D, #162650)" }}>
            <div className="absolute -top-[60px] -right-[60px] w-[300px] h-[300px] rounded-full" style={{ background: "radial-gradient(circle, rgba(212,168,67,0.08), transparent)" }} />
            <div className="relative z-[1] flex gap-12 items-center flex-wrap max-md:flex-col max-md:gap-6">
              <div className="flex-1 min-w-[300px] max-md:min-w-0">
                <h3 className="font-display text-[32px] max-md:text-[26px] text-white leading-[1.25] font-normal">
                  Health is not a series of <span className="text-gold italic">disconnected snapshots</span>. It&apos;s a continuous story.
                </h3>
              </div>
              <div className="flex-1 min-w-[300px] max-md:min-w-0">
                <p className="font-body text-[15px] text-white/60 leading-[1.8] font-light">
                  Every blood test you take is a chapter. Salus connects them — across different labs, different doctors, different years. When you see your doctor next (whether across a desk or across a screen), you arrive with your full story, not just today&apos;s page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ HEALTH PILLARS ═══════ */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-[100px] max-md:py-[60px]">
          <div
            ref={pillarsInView.ref}
            className={`text-center max-w-[680px] mx-auto transition-all duration-700 ${pillarsInView.className}`}
          >
            <div className="inline-flex px-[18px] py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase font-body bg-navy/[0.04] border border-navy/[0.06] text-[#8B7355] mb-5">
              What We Track
            </div>
            <h2 className="font-display text-[44px] max-md:text-[32px] leading-[1.15] font-normal text-navy mb-5 tracking-tight">
              Essential pillars of preventive health
            </h2>
            <p className="font-body text-base text-gray-500 leading-relaxed font-light">
              Each pillar maps to a category in the Salus dashboard — with colour-coded gauges, normal ranges, and plain-English explanations that make complex lab results accessible to everyone.
            </p>
          </div>

          <div className="mt-14 max-w-[800px] mx-auto">
            {PILLARS.map((p, i) => (
              <PillarItem
                key={i}
                pillar={p}
                isOpen={openPillar === i}
                onToggle={() => setOpenPillar(openPillar === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="bg-[#FAFAF7] relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute w-[600px] h-[600px] rounded-full -top-[200px] -right-[100px] animate-[float1_20s_ease-in-out_infinite]" style={{ background: "radial-gradient(circle, rgba(212,168,67,0.08) 0%, transparent 70%)" }} />
          <div className="absolute w-[400px] h-[400px] rounded-full -bottom-[100px] -left-[50px] animate-[float2_25s_ease-in-out_infinite]" style={{ background: "radial-gradient(circle, rgba(15,27,61,0.06) 0%, transparent 70%)" }} />
        </div>
        <div className="relative z-[1] max-w-[1200px] mx-auto px-6 py-[100px] max-md:py-[60px]">
          <div
            ref={journeyInView.ref}
            className={`text-center max-w-[680px] mx-auto transition-all duration-700 ${journeyInView.className}`}
          >
            <div className="inline-flex px-[18px] py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase font-body bg-navy/[0.04] border border-navy/[0.06] text-[#8B7355] mb-5">
              How It Works
            </div>
            <h2 className="font-display text-[44px] max-md:text-[32px] leading-[1.15] font-normal text-navy mb-5 tracking-tight">
              From lab to insight in four steps
            </h2>
            <p className="font-body text-base text-gray-500 leading-relaxed font-light">
              No accounts. No subscriptions. No data stored on servers. Your blood test results stay on your device — always private, always yours.
            </p>
          </div>

          <div className="grid grid-cols-4 max-md:grid-cols-1 gap-5 mt-16">
            {JOURNEY.map((s) => (
              <div key={s.num} className="bg-white rounded-3xl p-8 border border-navy/[0.06] shadow-sm relative transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lg">
                <div className="absolute top-4 right-5 font-display text-[56px] font-normal text-navy/[0.04] leading-none">{s.num}</div>
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="font-display text-[22px] mb-2 font-normal text-navy">{s.title}</h3>
                <p className="font-body text-sm text-gray-500 leading-relaxed font-light">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CHRONIC CONDITIONS ═══════ */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(165deg, #0F1B3D 0%, #162650 50%, #1A2D5C 100%)" }}>
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(rgba(212,168,67,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,67,0.8) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative z-[1] max-w-[1200px] mx-auto px-6 py-[100px] max-md:py-[60px]">
          <div
            ref={chronicInView.ref}
            className={`text-center max-w-[680px] mx-auto transition-all duration-700 ${chronicInView.className}`}
          >
            <div className="inline-flex px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase font-body bg-gold/10 border border-gold/20 text-gold mb-5">
              Chronic Disease Management
            </div>
            <h2 className="font-display text-[44px] max-md:text-[32px] leading-[1.15] font-normal text-white mb-5 tracking-tight">
              Living with a chronic condition?
            </h2>
            <p className="font-body text-base text-white/50 leading-relaxed font-light">
              Select your conditions in the dashboard and Salus highlights the tests that matter most for you — with clinical advice tailored to diabetes, hypertension, and high cholesterol.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {CHRONIC.map((c) => (
              <div
                key={c.name}
                className="rounded-3xl border border-white/[0.08] p-9 backdrop-blur-[10px] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lg"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <div className="flex items-center gap-3.5 mb-6">
                  <div
                    className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-[26px]"
                    style={{ background: `${c.color}20` }}
                  >
                    {c.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-white font-normal">{c.name}</h3>
                    <div className="font-body text-xs text-white/40 mt-0.5">Condition Overlay</div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {c.points.map((pt, j) => (
                    <div key={j} className="flex items-start gap-2.5">
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `${c.color}30` }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
                      </div>
                      <span className="font-body text-sm text-white/70 leading-relaxed font-light">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TELEMEDICINE ═══════ */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-[100px] max-md:py-[60px]">
          <div
            ref={teleInView.ref}
            className={`text-center max-w-[680px] mx-auto transition-all duration-700 ${teleInView.className}`}
          >
            <div className="inline-flex px-[18px] py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase font-body bg-navy/[0.04] border border-navy/[0.06] text-[#8B7355] mb-5">
              Telemedicine Continuity
            </div>
            <h2 className="font-display text-[44px] max-md:text-[32px] leading-[1.15] font-normal text-navy mb-5 tracking-tight">
              Bridging the gap between visits
            </h2>
            <p className="font-body text-base text-gray-500 leading-relaxed font-light">
              Whether your next appointment is in a clinic or on a video call, Salus ensures your doctor sees the full picture — trends, flags, and context — not just a single data point.
            </p>
          </div>

          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6 mt-16">
            {TELE.map((f) => (
              <div key={f.title} className="bg-[#FAFAF7] rounded-3xl p-9 border border-navy/[0.06] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lg">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[26px] mb-5" style={{ background: "linear-gradient(135deg, #0F1B3D, #1A2D5C)" }}>
                  {f.icon}
                </div>
                <h3 className="font-display text-[22px] mb-2.5 font-normal text-navy">{f.title}</h3>
                <p className="font-body text-sm text-gray-500 leading-relaxed font-light">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Box */}
          <div className="mt-16 text-center py-14 px-10 rounded-[28px] border border-gold/[0.15]" style={{ background: "linear-gradient(135deg, rgba(212,168,67,0.06), rgba(212,168,67,0.02))" }}>
            <p className="font-display text-[28px] max-w-[600px] mx-auto mb-2 font-normal leading-[1.35]">
              Your next doctor visit — <span className="text-gold-dark italic">prepared, not panicked</span>.
            </p>
            <p className="font-body text-[15px] text-gray-500 max-w-[500px] mx-auto mb-8 font-light leading-relaxed">
              Stop trying to remember numbers from memory. Enter once, track forever.
            </p>
            <Link
              href="/health/dashboard"
              className="inline-flex items-center gap-2.5 px-10 py-[18px] rounded-full font-semibold text-base font-body text-navy no-underline transition-all duration-500 hover:-translate-y-0.5 hover:shadow-xl"
              style={{ background: "linear-gradient(135deg, #D4A843, #B8922E)" }}
            >
              Open Your Dashboard &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ DASHBOARD CTA ═══════ */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(165deg, #0F1B3D, #0A1229)" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 0%, rgba(212,168,67,0.06) 0%, transparent 60%)" }} />
        <div className="relative z-[1] max-w-[1200px] mx-auto px-6 py-[100px] max-md:py-[60px] text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold font-body text-[13px] font-medium mb-8">
            <span className="text-base">{"\u{1FA7A}"}</span> Ready to Begin
          </div>
          <h2 className="font-display text-[48px] max-md:text-[32px] text-white font-normal leading-[1.15] max-w-[700px] mx-auto mb-6">
            Take control of your <span className="text-gold italic">health story</span>
          </h2>
          <p className="font-body text-base text-white/50 max-w-[520px] mx-auto mb-12 leading-relaxed font-light">
            Open the Salus Blood Test Dashboard to enter your results, visualise your health across the various organ systems, and track your progress over time.
          </p>

          {/* Mini Dashboard Preview */}
          <div className="max-w-[480px] mx-auto mb-12 rounded-3xl border border-white/[0.08] p-8 backdrop-blur-[10px]" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="flex gap-3 justify-center flex-wrap mb-6">
              {DASH_CATS.map((cat, i) => (
                <div
                  key={cat}
                  className="font-body px-3.5 py-1.5 rounded-full text-xs border"
                  style={{
                    background: i === 0 ? "rgba(212,168,67,0.15)" : "rgba(255,255,255,0.05)",
                    color: i === 0 ? "#D4A843" : "rgba(255,255,255,0.4)",
                    borderColor: i === 0 ? "rgba(212,168,67,0.3)" : "rgba(255,255,255,0.06)",
                  }}
                >
                  {cat}
                </div>
              ))}
            </div>
            {DASH_GAUGES.map((g) => (
              <div key={g.name} className="mb-4">
                <div className="flex justify-between mb-1.5">
                  <span className="font-body text-xs text-white/50">{g.name}</span>
                  <span className="font-body text-[11px] font-semibold" style={{ color: g.color }}>{g.status}</span>
                </div>
                <div className="h-2 rounded bg-white/[0.06] overflow-hidden">
                  <div className="h-full rounded transition-all duration-1000" style={{ width: `${g.pct}%`, background: g.color }} />
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/health/dashboard"
            className="inline-flex items-center gap-2.5 px-12 py-5 rounded-full font-bold text-lg font-body text-navy no-underline transition-all duration-500 hover:-translate-y-0.5 hover:shadow-xl"
            style={{ background: "linear-gradient(135deg, #D4A843, #B8922E)" }}
          >
            Launch Dashboard {"\u{1F680}"}
          </Link>
          <p className="font-body text-xs text-white/30 mt-6 max-w-[480px] mx-auto leading-relaxed">
            Free. Private. No account required. All data stays in your browser.
          </p>
        </div>
      </section>

      {/* ═══════ MEDICAL DISCLAIMER ═══════ */}
      <section className="bg-[#F5F0E8] border-t-2 border-gold/[0.19]">
        <div className="max-w-[800px] mx-auto px-6 py-12 text-center">
          <div className="text-[28px] mb-4">{"\u2695\uFE0F"}</div>
          <h3 className="font-display text-[22px] mb-4 text-navy font-normal">Medical Disclaimer</h3>
          <p className="font-body text-sm text-gray-500 leading-[1.8] font-light">
            Salus Health provides a health information and tracking tool — <strong>not a substitute for professional medical advice, diagnosis, or treatment</strong>.
          </p>
          <p className="font-body text-sm text-gray-500 leading-[1.8] font-light mt-3">
            Always consult a qualified healthcare provider about your test results. Reach us by{" "}
            <Link href="/contact" className="text-gold-dark underline font-medium">scheduling a teleconsultation online</Link>.
          </p>
          <p className="font-body text-sm text-gray-500 leading-[1.8] font-light mt-3">
            Normal reference ranges may vary by laboratory, age, sex, and ethnicity. <em>An abnormal result does not necessarily indicate disease, and a normal result does not guarantee the absence of disease.</em>
          </p>
          <p className="font-body text-sm text-gray-500 leading-[1.8] font-light mt-3">
            The AI assistant provides general educational information only.
          </p>
        </div>
      </section>
    </main>
  );
}
