"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/* ── Data ─────────────────────────────────────────────────────── */

const conditions = [
  {
    name: "Acne Vulgaris",
    icon: "◯",
    desc: "Chronic inflammatory condition of the pilosebaceous unit. We treat all grades — from comedonal to cystic — with evidence-based protocols combining topical retinoids, antimicrobials, and in-clinic treatments.",
    approach: [
      "Personalised topical regimen",
      "Chemical peels (salicylic / glycolic)",
      "Oral antibiotics (doxycycline / lymecycline)",
      "Isotretinoin therapy",
      "Scar prevention protocol",
    ],
    evidence: "AAD Guidelines 2024 · Cochrane Systematic Review · JAAD",
  },
  {
    name: "Eczema",
    icon: "◇",
    desc: "Atopic dermatitis affecting the epidermal barrier. Our approach restores barrier integrity through ceramide-based repair, immunomodulatory treatments, and trigger identification.",
    approach: [
      "Barrier repair with ceramide complex (3:1:1 ratio)",
      "Topical calcineurin inhibitors",
      "Environmental trigger mapping",
      "Antihistamine treatment",
      "Topical corticosteroids",
      "Emollient therapy",
    ],
    evidence: "NICE 2023 · BAD Guidelines · EADV Consensus",
  },
  {
    name: "Rosacea",
    icon: "△",
    desc: "Chronic vascular condition of the central face. We address all four subtypes with tailored protocols — from topical azelaic acid to IPL vascular therapy.",
    approach: [
      "Azelaic acid 15% foundation therapy",
      "IPL photorejuvenation for vessels",
      "Ivermectin 1% for papulopustular type",
      "Trigger avoidance counselling",
      "Mineral SPF protocol",
    ],
    evidence: "NRS Guidelines · BAD 2021 · Cochrane 2015",
  },
  {
    name: "Hyperpigmentation",
    icon: "▢",
    desc: "Melasma, post-inflammatory hyperpigmentation, and sun damage. Our triple-therapy approach combines tyrosinase inhibitors, retinoids, and strict photoprotection.",
    approach: [
      "Triple combination therapy",
      "Tranexamic acid protocols",
      "Chemical peels (modified Jessner's)",
      "Tinted SPF with iron oxides",
      "Maintenance prevention programme",
    ],
    evidence: "JAAD 2022 · BJD · Skin of Color Society",
  },
];

const treatments = [
  {
    name: "LED Light Therapy",
    time: "30 min",
    down: "None",
    desc: "Photobiomodulation using red (630nm) and blue (415nm) wavelengths to reduce inflammation and target acne bacteria.",
    price: "From $180",
  },
  {
    name: "Chemical Peels",
    time: "45 min",
    down: "2–3 days",
    desc: "Medical-grade acid exfoliation targeting acne, pigmentation, and texture. Customised depth for each patient.",
    price: "From $250",
  },
  {
    name: "Microneedling",
    time: "60 min",
    down: "1–3 days",
    desc: "Collagen induction therapy using fine needles to improve acne scarring, texture, and overall skin quality.",
    price: "From $380",
  },
  {
    name: "IPL Photorejuvenation",
    time: "30 min",
    down: "24–48 hrs",
    desc: "Intense pulsed light targeting redness, broken capillaries, and pigmentation for clearer, more even skin.",
    price: "From $320",
  },
];

const testimonials = [
  {
    name: "Sarah L.",
    cond: "Acne",
    text: "After years of struggling with cystic acne, the team at Salus gave me a protocol that finally worked. My skin is clearer than it's been since I was fifteen.",
  },
  {
    name: "James T.",
    cond: "Eczema",
    text: "The barrier repair programme transformed my eczema management. I went from weekly flares to months of calm, healthy skin.",
  },
  {
    name: "Mei W.",
    cond: "Melasma",
    text: "Living in Singapore, my melasma was relentless. The triple therapy combined with their SPF protocol made a visible difference within eight weeks.",
  },
];

const routineData = [
  {
    name: "Acne-Prone",
    icon: "◯",
    source: "AAD 2024 · Cochrane 2013 · JAAD 2018",
    am: [
      { step: "Cleanse", product: "Salicylic acid 0.5–2% foaming cleanser", why: "BHA is lipid-soluble, penetrates follicles to dissolve comedones and reduce sebum." },
      { step: "Treat", product: "Niacinamide 5% + zinc PCA serum", why: "Niacinamide regulates sebum production; zinc is anti-inflammatory and reduces P. acnes activity." },
      { step: "Treat", product: "Benzoyl peroxide 2.5% gel (spot or all-over)", why: "Bactericidal against C. acnes without inducing antibiotic resistance. Low concentration = less irritation." },
      { step: "Moisturise", product: "Lightweight oil-free gel moisturiser", why: "Skipping moisturiser triggers compensatory sebum overproduction." },
      { step: "Protect", product: "Non-comedogenic SPF 50+ fluid", why: "UV worsens post-inflammatory hyperpigmentation from acne lesions." },
    ],
    pm: [
      { step: "Cleanse", product: "Gentle gel or foam cleanser (sulfate-free)", why: "Removes pollution and excess sebum without over-stripping the barrier." },
      { step: "Treat", product: "Adapalene 0.1% or tretinoin 0.025%", why: "Gold-standard retinoid. Normalises keratinisation, prevents comedone formation." },
      { step: "Treat", product: "Azelaic acid 10% (alternate nights)", why: "Anti-inflammatory, antibacterial, reduces PIH. Well-tolerated with retinoids." },
      { step: "Moisturise", product: "Gel-cream with hyaluronic acid + ceramides", why: "Lightweight barrier support — critical for retinoid tolerability." },
    ],
    avoid: ["Coconut oil", "Alcohol-based astringents", "Heavy occlusive creams", "Harsh physical scrubs"],
  },
  {
    name: "Eczema / Dry",
    icon: "◇",
    source: "NICE 2023 · BAD 2021 · JEADV 2020",
    am: [
      { step: "Cleanse", product: "Cream or milk cleanser (no SLS/SLES)", why: "Sulfate-free formula preserves natural lipid barrier already compromised in eczema." },
      { step: "Treat", product: "Hyaluronic acid serum on damp skin", why: "Draws water into epidermis. Apply within 60 seconds of cleansing for maximum effect." },
      { step: "Moisturise", product: "Ceramide + cholesterol + fatty acid cream (3:1:1)", why: "Replicates the natural lamellar body lipid ratio. Proven to restore barrier function." },
      { step: "Seal", product: "Squalane or rosehip oil (2–3 drops)", why: "Occlusive layer reduces transepidermal water loss (TEWL) by up to 40%." },
      { step: "Protect", product: "Hydrating mineral SPF 50+ (fragrance-free)", why: "Chemical UV filters may sting compromised skin. Mineral is better tolerated." },
    ],
    pm: [
      { step: "Cleanse", product: "Balm or oil cleanser — single gentle cleanse", why: "Over-cleansing is the most common barrier-damaging mistake in eczema." },
      { step: "Treat", product: "Colloidal oatmeal 1–2% serum or panthenol 5%", why: "Oat beta-glucan inhibits NF-κB mediated inflammation. Panthenol accelerates repair." },
      { step: "Treat", product: "Low-dose retinol 0.025% (2× weekly if tolerated)", why: "Retinoids thicken dermis and boost collagen — only when barrier is stable." },
      { step: "Moisturise", product: "Thick ceramide night cream or sleeping mask", why: "TEWL peaks during sleep — rich occlusive application is optimal at night." },
    ],
    avoid: ["SLS foaming cleansers", "Hot water", "Alcohol denat. in toners", "Fragrance / parfum", "Mattifying products"],
  },
  {
    name: "Rosacea",
    icon: "△",
    source: "BAD 2021 · NRS Guidelines · Cochrane 2015",
    am: [
      { step: "Cleanse", product: "Fragrance-free cream cleanser (tepid water)", why: "Hot water triggers vasodilation and flushing. Cream cleansers minimise irritation." },
      { step: "Treat", product: "Azelaic acid 15% gel", why: "First-line treatment. Anti-inflammatory, antimicrobial against Demodex overgrowth." },
      { step: "Moisturise", product: "Ceramide + niacinamide 4% cream (fragrance-free)", why: "Rosacea patients have reduced ceramide levels. Niacinamide calms redness." },
      { step: "Protect", product: "Mineral SPF 50+ (zinc oxide / titanium dioxide only)", why: "Chemical filters can trigger sensitisation in rosacea. Mineral is gold standard." },
    ],
    pm: [
      { step: "Cleanse", product: "Micellar water — no rinse if very reactive", why: "Eliminates tap water mineral contact on sensitised skin." },
      { step: "Treat", product: "Ivermectin 1% cream (prescription)", why: "Superior to metronidazole in randomised controlled trials for papulopustular rosacea." },
      { step: "Treat", product: "Centella asiatica 2–5% barrier serum", why: "Madecassoside reduces neurogenic inflammation without irritation." },
      { step: "Moisturise", product: "Rich ceramide + oat emollient balm", why: "Colloidal oat reduces overnight neurogenic inflammation and prevents barrier breakdown." },
    ],
    avoid: ["Fragrance & essential oils", "Physical exfoliants", "Alcohol in products", "Niacinamide >4% initially", "Hot showers", "Retinoids until stable"],
  },
  {
    name: "Pigmentation",
    icon: "▢",
    source: "JAAD 2022 · BJD 2002 · Skin of Color Society",
    am: [
      { step: "Cleanse", product: "Gentle low-pH cleanser (pH 4.5–5.5)", why: "Maximises efficacy of pH-dependent vitamin C applied next." },
      { step: "Treat", product: "Vitamin C 15–20% + vitamin E + ferulic acid", why: "Tyrosinase inhibition + synergistic antioxidant triple provides 8× photoprotection." },
      { step: "Treat", product: "Tranexamic acid 3–5% serum", why: "Disrupts UV-triggered melanocyte signalling pathways. Effective for melasma." },
      { step: "Moisturise", product: "Niacinamide 5–10% moisturiser", why: "Inhibits melanosome transfer to keratinocytes — reduces pigment by 35–68%." },
      { step: "Protect", product: "SPF 50+ tinted with iron oxides", why: "Visible light worsens PIH and melasma. Iron oxides are the only effective block." },
    ],
    pm: [
      { step: "Cleanse", product: "Oil cleanse + low-pH second cleanser", why: "Thorough SPF removal is essential for night actives to penetrate." },
      { step: "Treat", product: "Tretinoin 0.025–0.05%", why: "Accelerates epidermal turnover, disperses melanin granules." },
      { step: "Treat", product: "Alpha arbutin 2% + kojic acid 1% (off-retinoid nights)", why: "Tyrosinase inhibitors — safer than hydroquinone for long-term maintenance." },
      { step: "Moisturise", product: "Barrier-repair ceramide cream", why: "Prevents irritation-driven inflammation that worsens pigmentation." },
    ],
    avoid: ["Unprotected sun exposure", "Picking or squeezing", "Harsh scrubs", "Unsupervised hydroquinone >12 weeks", "Fragrance on active PIH"],
  },
];

const approachSteps = [
  { n: "01", title: "Assess", desc: "Comprehensive skin analysis — in-person consultation supported by our AI diagnostic tool." },
  { n: "02", title: "Diagnose", desc: "Clinical evaluation grounded in published guidelines (AAD, NICE, JAAD, BAD)." },
  { n: "03", title: "Treat", desc: "Personalised protocol combining medical-grade topicals and in-clinic treatments." },
  { n: "04", title: "Maintain", desc: "Ongoing monitoring, routine optimisation, and preventive care for lasting results." },
];

/* ── Shared Components ────────────────────────────────────────── */

function GoldDivider() {
  return (
    <div className="relative mx-auto my-6 w-[60%] max-w-[300px] h-[1px]">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="absolute left-1/2 -top-[2.5px] -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold opacity-40" />
    </div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 justify-center mb-3">
      <div className="w-8 h-[0.5px] bg-gold" />
      <span className="text-[9px] tracking-[5px] uppercase text-gold font-display">
        {text}
      </span>
      <div className="w-8 h-[0.5px] bg-gold" />
    </div>
  );
}

/* ── Page Component ───────────────────────────────────────────── */

export default function SkinPage() {
  const [condSel, setCondSel] = useState(0);
  const [routineSel, setRoutineSel] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState<"am" | "pm">("am");
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const iv = setInterval(
      () => setTestimonialIdx((p) => (p + 1) % testimonials.length),
      5000
    );
    return () => clearInterval(iv);
  }, []);

  const cond = conditions[condSel];
  const routine = routineData[routineSel];
  const steps = timeOfDay === "am" ? routine.am : routine.pm;
  const test = testimonials[testimonialIdx];

  return (
    <div className="pt-[72px]">
      {/* ─── HERO ─── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-navy via-navy-light to-navy-card">
        {/* Decorative gold orbs */}
        <div className="absolute top-[12%] right-[12%] w-80 h-80 rounded-full bg-gold/[0.04] blur-3xl animate-pulse" />
        <div className="absolute bottom-[18%] left-[8%] w-60 h-60 rounded-full bg-gold-dark/[0.03] blur-3xl animate-pulse" style={{ animationDelay: "2.5s" }} />

        <div className="text-center px-6 max-w-3xl relative z-10 animate-fade-in">
          <div className="text-[9px] tracking-[8px] uppercase text-gold mb-8 font-display opacity-75">
            Dermatology · Singapore
          </div>
          <h1 className="font-display text-4xl md:text-[56px] font-normal leading-[1.12] text-foreground mb-2">
            Where Science Meets{" "}
            <br className="hidden md:block" />
            <em className="text-gold font-medium">Beautiful Skin</em>
          </h1>
          <GoldDivider />
          <p className="text-[15px] text-slate-muted leading-loose max-w-lg mx-auto mb-10 font-display tracking-wide">
            Evidence-based skincare routines for acne, eczema, and common skin
            conditions. Every recommendation backed by peer-reviewed research
            and international guidelines.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/skin/analyser"
              className="inline-block bg-gradient-to-br from-gold to-gold-dark text-navy font-display text-[11px] tracking-[3px] uppercase px-10 py-4 border border-gold hover:from-gold-light hover:to-gold transition-all"
            >
              Free Skin Analysis
            </Link>
            <a
              href="#conditions"
              className="inline-block bg-transparent text-slate-muted font-display text-[11px] tracking-[3px] uppercase px-8 py-4 border border-slate-muted/50 hover:border-gold hover:text-gold-dark transition-all"
            >
              Our Expertise
            </a>
          </div>
          <div className="mt-16 flex gap-10 justify-center">
            {["AAD", "NICE", "JAAD", "BAD", "EADV"].map((s) => (
              <span
                key={s}
                className="text-[9px] tracking-[3.5px] text-slate-muted/40 font-display"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONDITIONS ─── */}
      <section id="conditions" className="bg-navy-light py-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <SectionLabel text="Conditions We Treat" />
          <h2 className="text-center font-display text-3xl md:text-4xl font-normal text-foreground mb-2">
            Focused <em className="text-gold">Expertise</em>
          </h2>
          <p className="text-center text-[13px] text-slate-muted max-w-lg mx-auto leading-loose font-display">
            We specialise in the conditions that affect you most — treating them
            with precision, compassion, and the latest clinical evidence.
          </p>
          <GoldDivider />

          {/* Condition tabs */}
          <div className="flex justify-center mb-10 flex-wrap gap-1">
            {conditions.map((cd, i) => (
              <button
                key={i}
                onClick={() => setCondSel(i)}
                className={`px-5 py-4 border-none bg-transparent cursor-pointer font-display text-xs tracking-wide transition-all whitespace-nowrap border-b-2 ${
                  condSel === i
                    ? "border-b-gold text-gold"
                    : "border-b-transparent text-slate-muted hover:text-gold/70"
                }`}
              >
                <span
                  className={`text-lg block mb-1 transition-opacity ${
                    condSel === i ? "opacity-100" : "opacity-30"
                  }`}
                >
                  {cd.icon}
                </span>
                {cd.name}
              </button>
            ))}
          </div>

          {/* Condition detail */}
          <div className="flex gap-10 flex-wrap animate-fade-in" key={condSel}>
            <div className="flex-[2] min-w-[300px]">
              <div className="bg-navy-card border border-gold/[0.15] p-10 relative">
                <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-gold via-gold-light/60 to-transparent" />
                <h3 className="font-display text-2xl font-normal text-foreground mb-4">
                  {cond.name}
                </h3>
                <p className="text-[13px] text-slate-muted leading-loose mb-7 font-display">
                  {cond.desc}
                </p>
                <div className="text-[9px] tracking-[3px] text-gold uppercase mb-4">
                  Our Approach
                </div>
                {cond.approach.map((a, i) => (
                  <div key={i} className="flex gap-3.5 items-start mb-3">
                    <div className="w-1.5 h-1.5 rounded-full border-[1.5px] border-gold mt-1.5 shrink-0" />
                    <span className="text-[12.5px] text-slate-muted leading-relaxed font-display">
                      {a}
                    </span>
                  </div>
                ))}
                <div className="mt-7 px-4 py-3 bg-gold/[0.04] border border-gold/[0.12]">
                  <span className="text-[9px] tracking-[2px] text-gold uppercase">
                    Evidence Base:{" "}
                  </span>
                  <span className="text-[11px] text-slate-muted">
                    {cond.evidence}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-[200px] flex flex-col justify-center items-center gap-6">
              <div className="w-48 h-60 bg-gradient-to-br from-navy-card to-navy-light border border-gold/[0.15] flex items-center justify-center relative">
                <span className="text-[90px] text-gold opacity-[0.12] font-display">
                  {cond.icon}
                </span>
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
              </div>
              <Link
                href="/skin/analyser"
                className="w-full text-center inline-block bg-transparent text-slate-muted font-display text-[11px] tracking-[3px] uppercase px-8 py-3.5 border border-slate-muted/50 hover:border-gold hover:text-gold transition-all"
              >
                Analyse Your Skin
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TREATMENTS ─── */}
      <section className="py-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <SectionLabel text="In-Clinic Treatments" />
          <h2 className="text-center font-display text-3xl md:text-4xl font-normal text-foreground mb-2">
            In-Clinic <em className="text-gold">Treatments</em>
          </h2>
          <p className="text-center text-[13px] text-slate-muted max-w-md mx-auto leading-loose font-display">
            Every treatment is selected for its clinical evidence and adapted to
            your unique skin profile.
          </p>
          <GoldDivider />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {treatments.map((t, i) => (
              <div
                key={i}
                className="bg-navy-card border border-gold/[0.12] p-8 relative hover:border-gold/30 hover:-translate-y-1 transition-all group"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/20 to-transparent group-hover:via-gold/40 transition-all" />
                <div className="text-[9px] tracking-[3.5px] text-gold uppercase mb-4 font-display">
                  {t.name}
                </div>
                <p className="text-xs text-slate-muted leading-loose mb-5 font-display min-h-[64px]">
                  {t.desc}
                </p>
                <div className="flex justify-between border-t border-gold/[0.12] pt-4">
                  {[
                    { l: "Duration", v: t.time },
                    { l: "Downtime", v: t.down },
                  ].map((d, j) => (
                    <div key={j}>
                      <div className="text-[8px] tracking-[2px] text-slate-muted/60 uppercase mb-1">
                        {d.l}
                      </div>
                      <div className="text-xs text-slate-muted font-display">
                        {d.v}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-[15px] text-gold font-display font-medium">
                  {t.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SKINCARE ROUTINES ─── */}
      <section id="routines" className="bg-navy-light py-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <SectionLabel text="Evidence-Based Skincare" />
          <h2 className="text-center font-display text-3xl md:text-4xl font-normal text-foreground mb-2">
            Personalised <em className="text-gold">Routines</em>
          </h2>
          <p className="text-center text-[13px] text-slate-muted max-w-lg mx-auto leading-loose font-display">
            Every product recommendation is backed by peer-reviewed research and
            international dermatology guidelines. We build routines, not
            guesswork.
          </p>
          <GoldDivider />

          {/* Routine tabs */}
          <div className="flex justify-center mb-8 flex-wrap gap-1">
            {routineData.map((rd, i) => (
              <button
                key={i}
                onClick={() => {
                  setRoutineSel(i);
                  setTimeOfDay("am");
                }}
                className={`px-5 py-3 border-none bg-transparent cursor-pointer font-display text-xs tracking-wide transition-all whitespace-nowrap border-b-2 ${
                  routineSel === i
                    ? "border-b-gold text-gold"
                    : "border-b-transparent text-slate-muted hover:text-gold/70"
                }`}
              >
                <span
                  className={`text-base block mb-1 transition-opacity ${
                    routineSel === i ? "opacity-100" : "opacity-30"
                  }`}
                >
                  {rd.icon}
                </span>
                {rd.name}
              </button>
            ))}
          </div>

          {/* Routine detail */}
          <div
            className="max-w-2xl mx-auto animate-fade-in"
            key={`${routineSel}-${timeOfDay}`}
          >
            {/* Header + AM/PM toggle */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <div className="text-[9px] tracking-[3px] text-gold uppercase font-display">
                  Routine For
                </div>
                <div className="text-xl font-display text-foreground mt-1">
                  {routine.icon} {routine.name}
                </div>
                <div className="text-[10px] text-slate-muted/60 mt-1 tracking-wide">
                  Sources: {routine.source}
                </div>
              </div>
              <div className="inline-flex border border-gold/30 overflow-hidden">
                {(["am", "pm"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeOfDay(t)}
                    className={`px-6 py-2.5 border-none cursor-pointer font-display text-[10px] tracking-[2px] uppercase transition-all ${
                      timeOfDay === t
                        ? "bg-gradient-to-br from-gold to-gold-dark text-navy"
                        : "bg-navy-card text-slate-muted hover:text-gold"
                    }`}
                  >
                    {t === "am" ? "☀ Morning" : "☽ Evening"}
                  </button>
                ))}
              </div>
            </div>

            {/* Steps */}
            {steps.map((s, i) => (
              <div
                key={i}
                className="bg-navy-card border border-gold/[0.12] p-5 mb-2 flex gap-4 items-start hover:border-gold/25 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-dark text-navy flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="text-[9px] tracking-[3px] text-gold uppercase mb-1 font-display">
                    {s.step}
                  </div>
                  <div className="text-sm font-medium mb-2 text-foreground font-display">
                    {s.product}
                  </div>
                  <div className="text-xs text-slate-muted leading-relaxed border-l-2 border-gold/20 pl-3">
                    <span className="text-gold-light font-semibold">Why: </span>
                    {s.why}
                  </div>
                </div>
              </div>
            ))}

            {/* Avoid list */}
            {routine.avoid && (
              <div className="mt-5 p-5 bg-gold/[0.03] border border-gold/[0.08]">
                <div className="text-[9px] tracking-[3px] text-gold uppercase mb-3 font-display">
                  Ingredients & Products to Avoid
                </div>
                <div className="flex gap-2 flex-wrap">
                  {routine.avoid.map((a, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-[11px] bg-navy-card border border-gold/[0.15] text-slate-muted font-display"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 p-3 bg-navy-card border border-gold/[0.08] text-center">
              <span className="text-[10px] text-slate-muted/60 tracking-[1.5px] font-display">
                For educational purposes only · Always consult a qualified
                dermatologist before starting a new routine
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── APPROACH ─── */}
      <section className="bg-navy-light py-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <SectionLabel text="Our Philosophy" />
          <h2 className="text-center font-display text-3xl md:text-4xl font-normal text-foreground mb-2">
            The Salus <em className="text-gold">Method</em>
          </h2>
          <p className="text-center text-[13px] text-slate-muted max-w-lg mx-auto leading-loose font-display">
            A systematic, four-stage approach ensuring every patient receives
            care that is both scientifically rigorous and deeply personal.
          </p>
          <GoldDivider />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[2px]">
            {approachSteps.map((s, i) => (
              <div
                key={i}
                className={`text-center py-10 px-7 relative ${
                  i < 3 ? "lg:border-r lg:border-gold/[0.1]" : ""
                }`}
              >
                <div className="text-5xl font-light text-gold opacity-[0.15] font-display mb-2.5">
                  {s.n}
                </div>
                <div className="text-[17px] text-foreground font-display mb-3 tracking-[1.5px]">
                  {s.title}
                </div>
                <div className="w-6 h-[1px] bg-gold mx-auto mb-4 opacity-40" />
                <p className="text-xs text-slate-muted leading-loose font-display">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <SectionLabel text="Patient Stories" />
          <div className="max-w-xl mx-auto text-center min-h-[220px]">
            <div key={testimonialIdx} className="animate-fade-in">
              <div className="text-5xl text-gold opacity-[0.15] mb-3 font-display">
                &ldquo;
              </div>
              <p className="text-[15px] text-slate-muted leading-loose font-display italic mb-6">
                {test.text}
              </p>
              <div className="text-xs text-gold tracking-[2.5px] font-display">
                {test.name}
              </div>
              <div className="text-[10px] text-slate-muted/60 tracking-[1.5px] mt-1">
                {test.cond} Patient
              </div>
            </div>
            <div className="flex gap-2.5 justify-center mt-7">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  className={`h-[3px] border-none rounded-sm cursor-pointer transition-all ${
                    testimonialIdx === i
                      ? "w-7 bg-gold"
                      : "w-2 bg-slate-muted/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SKIN ANALYSIS CTA ─── */}
      <section className="bg-navy-light py-20 px-6">
        <div className="text-center max-w-xl mx-auto">
          <SectionLabel text="AI-Powered" />
          <h2 className="font-display text-3xl md:text-4xl font-normal text-foreground mb-2">
            Free Skin <em className="text-gold">Analysis</em>
          </h2>
          <p className="text-[13px] text-slate-muted leading-loose mb-8 font-display">
            Our AI skin analyser evaluates your skin type, concerns, and
            lifestyle to generate a personalised routine backed by clinical
            evidence. Complete the assessment and receive your report instantly.
          </p>
          <div className="flex gap-5 justify-center mb-8 flex-wrap">
            {[
              "16-point questionnaire",
              "Fitzpatrick typing",
              "Personalised routine",
              "3-month roadmap",
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold opacity-70" />
                <span className="text-[11px] text-slate-muted font-display tracking-wide">
                  {f}
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/skin/analyser"
            className="inline-block bg-gradient-to-br from-gold to-gold-dark text-navy font-display text-[11px] tracking-[3px] uppercase px-10 py-4 border border-gold hover:from-gold-light hover:to-gold transition-all"
          >
            Launch Skin Analyser
          </Link>
          <p className="text-[10px] text-slate-muted/50 mt-4 tracking-[1.5px] font-display">
            For educational purposes only
          </p>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-[1100px] mx-auto flex gap-16 flex-wrap items-start">
          <div className="flex-1 min-w-[280px]">
            <SectionLabel text="Visit Us" />
            <h2 className="font-display text-3xl font-normal text-foreground mb-5">
              Begin Your <em className="text-gold">Journey</em>
            </h2>
            <GoldDivider />

            {[
              {
                l: "Address",
                v: "1 Orchard Boulevard, #08-01\nCamden Medical Centre\nSingapore 248649",
              },
              {
                l: "Hours",
                v: "Mon–Fri  9:00 AM – 6:00 PM\nSat  9:00 AM – 1:00 PM\nSun & PH  Closed",
              },
              {
                l: "Contact",
                v: "hello@salusskin.sg\n+65 6812 0000",
              },
            ].map((d, i) => (
              <div key={i} className="mb-7">
                <div className="text-[9px] tracking-[3px] text-gold uppercase mb-2.5 font-display">
                  {d.l}
                </div>
                <div className="text-[13px] text-slate-muted leading-loose font-display whitespace-pre-line">
                  {d.v}
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1 min-w-[280px]">
            <div className="bg-navy-card border border-gold/[0.15] p-8 md:p-10">
              <div className="text-[9px] tracking-[3px] text-gold uppercase mb-6 font-display">
                Request a Consultation
              </div>
              {["Full Name", "Email Address", "Phone Number"].map((p, i) => (
                <div key={i} className="mb-4">
                  <div className="text-[9px] tracking-[2px] text-slate-muted/60 uppercase mb-2 font-display">
                    {p}
                  </div>
                  <input
                    className="w-full px-4 py-3 bg-navy border border-gold/[0.12] text-foreground text-[13px] font-display outline-none focus:border-gold/50 transition-colors placeholder-slate-muted/30"
                    placeholder={p}
                  />
                </div>
              ))}
              <div className="mb-4">
                <div className="text-[9px] tracking-[2px] text-slate-muted/60 uppercase mb-2 font-display">
                  Primary Concern
                </div>
                <select className="w-full px-4 py-3 bg-navy border border-gold/[0.12] text-slate-muted text-[13px] font-display outline-none focus:border-gold/50 transition-colors">
                  <option>Acne / Breakouts</option>
                  <option>Eczema / Dermatitis</option>
                  <option>Rosacea</option>
                  <option>Pigmentation / Melasma</option>
                  <option>General Skin Health</option>
                </select>
              </div>
              <button className="w-full text-center bg-gradient-to-br from-gold to-gold-dark text-navy font-display text-[11px] tracking-[3px] uppercase px-8 py-4 border border-gold hover:from-gold-light hover:to-gold transition-all mt-2">
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
