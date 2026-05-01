"use client";

import { useState, useRef } from "react";
import { CHAR, CREAM, GOLD, GOLD_DK, GOLD_LT, GOLD_WM, IVORY, IVORY2, SMOKE, sliderBg } from "../theme";
import LuxCard from "../ui/LuxCard";
import Divider from "../ui/Divider";
import SecLabel from "../ui/SecLabel";
import Tag from "../ui/Tag";
import SliderQuestion from "../ui/SliderQuestion";
import BMIWidget, { calcBMI, bmiCategory } from "../ui/BMIWidget";
import GeoFace from "../icons/GeoFace";
import ZoneDiagram from "./ZoneDiagram";
import {
  fitzpatrickTypes, ethnicityOptions, skinToneOptions, skinToneSwatches,
  sliderQuestionsEarly, concernOptions, radioMidQuestions,
  dietOptions, dietIcons, routineSteps, sensitivityOptions,
  hormoneOptionsByGender, genderIcons, routines,
} from "./data";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Results = Record<string, any>;

export default function Analyser() {
  const [sliderAnswers, setSliderAnswers] = useState<Record<string, number | null>>({
    ethnicity: null, tone: null, sunReaction: null, pih: null, oiliness: null, diet: null, sensitivity: null,
  });
  const [radioAnswers, setRadioAnswers] = useState<Record<string, string>>({ climate: "", sunExposure: "", concerns: "" });
  const [routineChecked, setRoutineChecked] = useState<string[]>([]);
  const [zones, setZones] = useState<string[]>([]);
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState("");
  const [hormones, setHormones] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [phase, setPhase] = useState<"form" | "loading" | "results">("form");
  const [results, setResults] = useState<Results | null>(null);
  const [routineTime, setRoutineTime] = useState<"am" | "pm">("am");
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const bmi = calcBMI(weight, height);
  const hormoneOptions = gender ? hormoneOptionsByGender[gender] || [] : [];

  const handleSlider = (id: string, val: number) => setSliderAnswers(p => ({ ...p, [id]: val }));
  const handleRadio = (id: string, val: string) => setRadioAnswers(p => ({ ...p, [id]: val }));
  const toggleRoutine = (id: string) => {
    if (id === "none") { setRoutineChecked(routineChecked.includes("none") ? [] : ["none"]); return; }
    const next = routineChecked.filter(r => r !== "none");
    setRoutineChecked(next.includes(id) ? next.filter(r => r !== id) : [...next, id]);
  };

  const slidersDone = ["ethnicity", "tone", "sunReaction", "pih", "oiliness", "diet", "sensitivity"].every(k => sliderAnswers[k] !== null && sliderAnswers[k] !== undefined);
  const radiosDone = radioAnswers.climate && radioAnswers.sunExposure && radioAnswers.concerns;
  const allAnswered = slidersDone && radiosDone && zones.length > 0 && routineChecked.length > 0 && gender && hormones;

  const getFitz = () => {
    const toneIdx = sliderAnswers.tone ?? 2;
    const sunIdx = sliderAnswers.sunReaction ?? 2;
    return fitzpatrickTypes[Math.min(Math.round((toneIdx + sunIdx) / 2), 5)];
  };

  const runAI = async () => {
    setPhase("loading");
    const fitz = getFitz();
    const bmiStr = bmi ? `BMI: ${bmi} (${bmiCategory(bmi)?.label}, Weight: ${weight}kg, Height: ${height}cm)` : "BMI: Not provided";
    const routineLabel = routineChecked.includes("none") ? "No routine / just water" : routineChecked.map(r => routineSteps.find(s => s.id === r)?.label || r).join(", ");
    const summary = [
      `Age: ${age}`, `Gender: ${gender}`, bmiStr,
      `Ethnicity: ${ethnicityOptions[sliderAnswers.ethnicity!]}`,
      `Skin tone: ${skinToneOptions[sliderAnswers.tone!]}`,
      `Sun reaction: ${sliderQuestionsEarly[0].options[sliderAnswers.sunReaction!]}`,
      `PIH tendency: ${sliderQuestionsEarly[1].options[sliderAnswers.pih!]}`,
      `Oiliness: ${sliderQuestionsEarly[2].options[sliderAnswers.oiliness!]}`,
      `Concerns: ${radioAnswers.concerns}`,
      `Zones: ${zones.includes("all") ? "All over" : zones.join(", ")}`,
      `Climate: ${radioAnswers.climate}`,
      `Sun exposure: ${radioAnswers.sunExposure}`,
      `Diet: ${dietOptions[sliderAnswers.diet!]}`,
      `Current routine: ${routineLabel}`,
      `Sensitivity: ${sensitivityOptions[sliderAnswers.sensitivity!]}`,
      `Hormonal history: ${hormones}`,
    ].join("\n");

    try {
      const res = await fetch("/api/skin-analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary,
          fitzType: fitz.type,
          fitzDesc: fitz.desc,
          age,
          gender,
          image: imgSrc || undefined,
        }),
      });
      const data = await res.json();
      setResults(data);
    } catch {
      setResults({
        summary: "Please consult an experienced skincare doctor for a full assessment.",
        overallSkinType: "Assessment pending",
        primaryConcerns: ["Consult a skincare doctor"],
        fitzpatrickAdvice: "Apply broad-spectrum SPF daily.",
        ageAdvice: "Routine should be adapted to your current life stage.",
        genderNotes: "Gender-specific hormonal influences will shape your routine.",
        bmiNotes: "Maintain a healthy weight for optimal skin health.",
        ethnicityNotes: "Heritage-specific skincare considerations apply.",
        climateAdvice: "Adjust routine based on humidity and seasonal changes.",
        zoneFindings: [],
        topIngredients: [],
        recommendedRoutine: "sensitive",
        routineRationale: "A gentle approach is recommended.",
        amTips: ["Apply SPF every morning", "Patch test new products", "Introduce actives gradually"],
        pmTips: ["Double cleanse to remove SPF", "Apply retinoid on dry skin", "Use rich moisturiser last"],
        suggestedTreatments: [],
        dietaryTips: ["Stay hydrated", "Reduce high-GI foods"],
        lifestyleNotes: ["Avoid peak sun hours", "Change pillowcases twice weekly"],
        threeMonthRoadmap: [
          { month: "Month 1", focus: "Establish basic routine", expectedChange: "Improved barrier" },
          { month: "Month 2", focus: "Introduce one active", expectedChange: "Texture improvement" },
          { month: "Month 3", focus: "Add targeted treatment", expectedChange: "Measurable improvement" },
        ],
        sunscreenAdvice: "Apply SPF 50+ every morning. Reapply every 2 hours outdoors.",
        ingredientsToAvoid: ["Fragrance", "Alcohol denat.", "Essential oils"],
      });
    }
    setPhase("results");
  };

  const reset = () => {
    setSliderAnswers({ ethnicity: null, tone: null, sunReaction: null, pih: null, oiliness: null, diet: null, sensitivity: null });
    setRadioAnswers({ climate: "", sunExposure: "", concerns: "" });
    setRoutineChecked([]); setZones([]); setAge(28); setGender(""); setHormones(""); setWeight(""); setHeight(""); setPhase("form"); setResults(null); setRoutineTime("am"); setImgSrc(null);
  };

  const fitz = getFitz();

  const routineKey = results?.recommendedRoutine || "";
  const matchedRoutine = routines.find(r => {
    const k = routineKey.toLowerCase();
    if (k.includes("east") || k.includes("chinese")) return r.concern.includes("East Asian");
    if (k.includes("southeast") || k.includes("malay")) return r.concern.includes("Malay");
    if (k.includes("indian") || k.includes("south asian")) return r.concern.includes("Indian");
    if (k.includes("tropical")) return r.concern.includes("Tropical");
    if (k.includes("acne")) return r.concern.includes("Acne");
    if (k.includes("dry")) return r.concern.includes("Dry");
    if (k.includes("comb")) return r.concern.includes("Comb");
    if (k.includes("sensitiv")) return r.concern.includes("Sensitive");
    if (k.includes("age") || k.includes("ageing") || k.includes("matur")) return r.concern.includes("Matur");
    if (k.includes("hyper") || k.includes("pih") || k.includes("pigment")) return r.concern.includes("Hyper");
    if (k.includes("rosac")) return r.concern.includes("Rosac");
    if (k.includes("melan")) return r.concern.includes("Melanin");
    return false;
  }) || routines[3];

  const urgCol: Record<string, string> = { routine: "#3A7050", monitor: GOLD_DK, consult: "#A03030" };
  const urgLbl: Record<string, string> = { routine: "Routine care", monitor: "Monitor", consult: "Consult doctor" };
  const sevCol: Record<string, string> = { mild: "#3A7050", moderate: GOLD_DK, significant: "#A03030" };
  const suitCol: Record<string, string> = { high: "#3A7050", moderate: GOLD_DK, low: "#A03030" };

  const completedSliders = ["ethnicity", "tone", "sunReaction", "pih", "oiliness", "diet", "sensitivity"].filter(k => sliderAnswers[k] !== null && sliderAnswers[k] !== undefined).length;
  const completedCount = completedSliders + (radioAnswers.climate ? 1 : 0) + (radioAnswers.sunExposure ? 1 : 0) + (radioAnswers.concerns ? 1 : 0) + (zones.length > 0 ? 1 : 0) + (routineChecked.length > 0 ? 1 : 0) + (gender ? 1 : 0) + (hormones ? 1 : 0);
  const totalCount = 14;

  // ──── FORM ────
  if (phase === "form") return (
    <div className="max-w-[620px] mx-auto py-9 px-4 sm:px-5 animate-fade-in">
      <div className="text-center mb-7">
        <div className="inline-block mb-4">
          <GeoFace size={120} gender={gender} />
        </div>
        <div className="text-[9px] tracking-[4px] text-gold uppercase mb-1 font-serif">AI-Powered Assessment</div>
        <h2 className="font-normal text-xl sm:text-2xl mb-1 font-serif text-char">Skin Analyser</h2>
        <Divider />
      </div>

      <LuxCard>
        <div className="text-[9px] text-smoke tracking-[2px] uppercase mb-4 font-serif">Complete all sections, then tap Analyse</div>

        {/* Q1 - Age */}
        <div className="mb-6">
          <div className="text-[12.5px] font-bold text-char font-serif mb-1">1. Age</div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] text-smoke">Drag to select your age</span>
            <div className="flex items-center gap-1.5">
              <div className="w-[52px] h-9 rounded-sm flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${GOLD_WM}, ${GOLD_DK})` }}>
                <span className="text-lg font-bold text-ivory font-serif">{age}</span>
              </div>
              <span className="text-[11px] text-smoke">yrs</span>
            </div>
          </div>
          <input type="range" min="13" max="85" value={age} onChange={e => setAge(parseInt(e.target.value))} style={{ background: sliderBg(age, 13, 85) }} />
          <div className="flex justify-between text-[9px] text-smoke opacity-60 mt-1">
            {[13, 25, 35, 45, 55, 65, 75, 85].map(v => <span key={v}>{v}</span>)}
          </div>
          <div className="mt-2.5 py-1.5 px-3 rounded-sm border text-[11px] font-serif" style={{ background: CREAM, borderColor: GOLD_LT, color: GOLD_DK }}>
            {age < 20 ? "🌱 Teen skin — gentle actives, acne management and SPF habits"
              : age < 30 ? "✨ 20s — preventative care and antioxidant protection"
                : age < 40 ? "🔬 30s — introducing retinoids, peptides and advanced actives"
                  : age < 50 ? "⌛ 40s — collagen support, firming and pigmentation management"
                    : age < 60 ? "🌿 50s — hormone-influenced changes, barrier restoration, rich hydration"
                      : "🏅 60s+ — advanced anti-ageing, barrier repair and photoprotection focus"}
          </div>
        </div>
        <div className="h-px bg-gold-lt mb-5 opacity-50" />

        {/* Q2 - Gender */}
        <div className="mb-6">
          <div className="text-[12.5px] font-bold text-char font-serif mb-2.5">2. Gender</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.keys(genderIcons).map(g => (
              <button key={g} onClick={() => { setGender(g); setHormones(""); }}
                className="py-3 px-2.5 rounded-sm border-[1.5px] cursor-pointer text-xs font-serif flex items-center gap-2 transition-all"
                style={{ borderColor: gender === g ? GOLD : GOLD_LT, background: gender === g ? `linear-gradient(135deg, ${GOLD_WM}22, ${GOLD_LT}40)` : IVORY, color: gender === g ? GOLD_DK : SMOKE }}>
                <span className="text-lg opacity-80">{genderIcons[g]}</span><span>{g}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="h-px bg-gold-lt mb-5 opacity-50" />

        {/* Q3 - BMI */}
        <div className="mb-6">
          <div className="text-[12.5px] font-bold text-char font-serif mb-1">3. Height & Weight <span className="text-[11px] text-smoke font-normal">(optional)</span></div>
          <div className="text-[11px] text-smoke mb-3">BMI influences sebum production, inflammation and skin health.</div>
          <BMIWidget weight={weight} height={height} onWeightChange={setWeight} onHeightChange={setHeight} />
        </div>
        <div className="h-px bg-gold-lt mb-5 opacity-50" />

        {/* Q4 - Ethnicity */}
        <div className="mb-6">
          <div className="text-[12.5px] font-bold text-char font-serif mb-3">4. Ethnicity / skin heritage</div>
          <div className="p-3 sm:p-4 rounded-sm border" style={{ background: CREAM, borderColor: sliderAnswers.ethnicity !== null ? GOLD : GOLD_LT }}>
            <div className="flex justify-between items-center mb-3 gap-2">
              <div className="text-[11px] text-smoke opacity-70 hidden sm:block">Slide to select</div>
              <div className="py-1 px-3 rounded-sm text-[11.5px] font-serif max-w-[60%] text-right" style={{ background: `linear-gradient(135deg, ${GOLD_WM}, ${GOLD_DK})`, color: IVORY }}>
                {ethnicityOptions[sliderAnswers.ethnicity ?? 3]}
              </div>
            </div>
            <input type="range" min={0} max={ethnicityOptions.length - 1} step={1} value={sliderAnswers.ethnicity ?? 3} onChange={e => handleSlider("ethnicity", parseInt(e.target.value))} style={{ background: sliderBg(sliderAnswers.ethnicity ?? 3, 0, ethnicityOptions.length - 1) }} className="mb-2" />
            <div className="flex justify-between mt-1">
              {ethnicityOptions.map((o, i) => (
                <div key={i} className="flex flex-col items-center flex-1 cursor-pointer" onClick={() => handleSlider("ethnicity", i)}>
                  <div className="w-0.5 h-1.5 rounded-sm mb-0.5" style={{ background: i === (sliderAnswers.ethnicity ?? 3) ? GOLD : GOLD_LT }} />
                  <div className="text-[7px] sm:text-[7.5px] text-center leading-tight font-serif max-w-[48px] break-words" style={{ color: i === (sliderAnswers.ethnicity ?? 3) ? GOLD_DK : SMOKE, opacity: i === (sliderAnswers.ethnicity ?? 3) ? 1 : 0.55 }}>
                    {o.split("/")[0].trim().substring(0, 10)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="h-px bg-gold-lt mb-5 opacity-50" />

        {/* Q5 - Skin tone */}
        <div className="mb-6">
          <div className="text-[12.5px] font-bold text-char font-serif mb-3">5. Skin tone (unexposed areas)</div>
          <div className="p-3 sm:p-4 rounded-sm border" style={{ background: CREAM, borderColor: sliderAnswers.tone !== null ? GOLD : GOLD_LT }}>
            <div className="flex justify-between items-center mb-3 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full border-2 border-gold shrink-0" style={{ background: skinToneSwatches[skinToneOptions[sliderAnswers.tone ?? 3]] || "#E8A87C" }} />
                <span className="text-[11px] text-smoke opacity-70 hidden sm:block">Slide to match</span>
              </div>
              <div className="py-1 px-3 rounded-sm text-[11.5px] font-serif max-w-[55%] text-right" style={{ background: `linear-gradient(135deg, ${GOLD_WM}, ${GOLD_DK})`, color: IVORY }}>
                {skinToneOptions[sliderAnswers.tone ?? 3]}
              </div>
            </div>
            <input type="range" min={0} max={skinToneOptions.length - 1} step={1} value={sliderAnswers.tone ?? 3} onChange={e => handleSlider("tone", parseInt(e.target.value))} style={{ background: sliderBg(sliderAnswers.tone ?? 3, 0, skinToneOptions.length - 1) }} className="mb-2" />
            <div className="flex justify-between mt-1">
              {skinToneOptions.map((o, i) => (
                <div key={i} className="flex flex-col items-center flex-1 cursor-pointer" onClick={() => handleSlider("tone", i)}>
                  <div className="w-0.5 h-1.5 rounded-sm mb-0.5" style={{ background: i === (sliderAnswers.tone ?? 3) ? GOLD : GOLD_LT }} />
                  <div className="w-4 h-4 sm:w-[18px] sm:h-[18px] rounded-full mb-0.5" style={{ background: skinToneSwatches[o], border: i === (sliderAnswers.tone ?? 3) ? `2px solid ${GOLD_DK}` : `1px solid ${GOLD_LT}` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="h-px bg-gold-lt mb-5 opacity-50" />

        {/* Q6-Q8 - Slider questions */}
        {sliderQuestionsEarly.map((q, qi) => (
          <div key={q.id}>
            <SliderQuestion qNum={qi + 6} label={q.label} options={q.options} value={sliderAnswers[q.id]} onChange={val => handleSlider(q.id, val)} />
            <div className="h-px bg-gold-lt mb-5 opacity-50" />
          </div>
        ))}

        {/* Q9 - Concerns */}
        <div className="mb-5">
          <div className="text-[12.5px] font-bold text-char font-serif mb-2.5">9. Primary skin concerns (pick closest)</div>
          <div className="flex flex-col gap-1.5 pl-0 sm:pl-2">
            {concernOptions.map(opt => {
              const sel = radioAnswers.concerns === opt;
              return (
                <label key={opt} onClick={() => handleRadio("concerns", opt)} className="flex items-center gap-2.5 cursor-pointer py-2 px-3 rounded-sm border transition-all" style={{ borderColor: sel ? GOLD : GOLD_LT, background: sel ? `linear-gradient(135deg, ${GOLD_WM}18, ${GOLD_LT}28)` : IVORY }}>
                  <div className="w-3.5 h-3.5 rounded-full border-[1.5px] shrink-0 flex items-center justify-center" style={{ borderColor: sel ? GOLD : GOLD_LT, background: sel ? GOLD : "transparent" }}>
                    {sel && <div className="w-1.5 h-1.5 rounded-full bg-ivory" />}
                  </div>
                  <span className="text-xs font-serif flex-1" style={{ color: sel ? GOLD_DK : SMOKE }}>{opt}</span>
                </label>
              );
            })}
          </div>
          <div className="h-px bg-gold-lt mt-5 opacity-50" />
        </div>

        {/* Q10-Q11 - Radio questions */}
        {radioMidQuestions.map((q, qi) => (
          <div key={q.id} className="mb-5">
            <div className="text-[12.5px] font-bold text-char font-serif mb-2.5">{qi + 10}. {q.label}</div>
            <div className="flex flex-col gap-1.5 pl-0 sm:pl-2">
              {q.options.map(opt => {
                const sel = radioAnswers[q.id] === opt;
                return (
                  <label key={opt} onClick={() => handleRadio(q.id, opt)} className="flex items-center gap-2.5 cursor-pointer py-2 px-3 rounded-sm border transition-all" style={{ borderColor: sel ? GOLD : GOLD_LT, background: sel ? `linear-gradient(135deg, ${GOLD_WM}18, ${GOLD_LT}28)` : IVORY }}>
                    <div className="w-3.5 h-3.5 rounded-full border-[1.5px] shrink-0 flex items-center justify-center" style={{ borderColor: sel ? GOLD : GOLD_LT, background: sel ? GOLD : "transparent" }}>
                      {sel && <div className="w-1.5 h-1.5 rounded-full bg-ivory" />}
                    </div>
                    <span className="text-xs font-serif flex-1" style={{ color: sel ? GOLD_DK : SMOKE }}>{opt}</span>
                  </label>
                );
              })}
            </div>
            <div className="h-px bg-gold-lt mt-5 opacity-50" />
          </div>
        ))}

        {/* Q12 - Diet */}
        <SliderQuestion qNum={12} label="Diet pattern" options={dietOptions} icons={dietIcons} value={sliderAnswers.diet} onChange={val => handleSlider("diet", val)} />
        <div className="h-px bg-gold-lt mb-5 opacity-50" />

        {/* Q13 - Zones */}
        <ZoneDiagram selected={zones} onChange={setZones} />
        <div className="h-px bg-gold-lt mb-5 opacity-50" />

        {/* Q14 - Routine */}
        <div className="mb-6">
          <div className="text-[12.5px] font-bold text-char font-serif mb-1">14. Current skincare routine</div>
          <div className="text-[11px] text-smoke mb-3">Tick all steps you currently use. Select multiple.</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {routineSteps.map(step => {
              const checked = routineChecked.includes(step.id);
              const disabled = step.id !== "none" && routineChecked.includes("none");
              return (
                <button key={step.id} onClick={() => !disabled && toggleRoutine(step.id)}
                  className="py-2.5 px-3 rounded-sm border-[1.5px] text-[11.5px] font-serif flex items-center gap-2 transition-all text-left"
                  style={{ borderColor: checked ? GOLD : GOLD_LT, background: checked ? `linear-gradient(135deg, ${GOLD_WM}28, ${GOLD_LT}50)` : disabled ? "#f5f5f5" : IVORY, color: checked ? GOLD_DK : disabled ? "#ccc" : SMOKE, cursor: disabled ? "not-allowed" : "pointer" }}>
                  <div className="w-4 h-4 rounded-sm border-[1.5px] shrink-0 flex items-center justify-center" style={{ borderColor: checked ? GOLD : GOLD_LT, background: checked ? GOLD : "transparent" }}>
                    {checked && <span className="text-[10px] text-ivory font-bold leading-none">{"✓"}</span>}
                  </div>
                  <span className="text-base">{step.emoji}</span>
                  <span className="flex-1 leading-tight">{step.label}</span>
                </button>
              );
            })}
          </div>
          {routineChecked.length > 0 && !routineChecked.includes("none") && (
            <div className="mt-2.5 py-2 px-3 rounded-sm border text-[11px] font-serif" style={{ background: CREAM, borderColor: GOLD_LT, color: GOLD_DK }}>
              ✓ {routineChecked.length} step{routineChecked.length > 1 ? "s" : ""} selected: {routineChecked.map(r => routineSteps.find(s => s.id === r)?.emoji).join(" ")}
            </div>
          )}
          <div className="h-px bg-gold-lt mt-5 opacity-50" />
        </div>

        {/* Q15 - Sensitivity */}
        <SliderQuestion qNum={15} label="Skin reactivity to new products" options={sensitivityOptions} value={sliderAnswers.sensitivity} onChange={val => handleSlider("sensitivity", val)} />
        <div className="h-px bg-gold-lt mb-5 opacity-50" />

        {/* Q16 - Hormones */}
        {gender && (
          <div className="mb-6">
            <div className="text-[12.5px] font-bold text-char font-serif mb-1">16. Hormonal Profile</div>
            <div className="text-[11px] text-smoke mb-3">Tailored to your gender. Select the option that best describes your hormonal status.</div>
            <div className="flex flex-col gap-1.5 pl-0 sm:pl-2">
              {hormoneOptions.map(opt => {
                const sel = hormones === opt;
                return (
                  <label key={opt} onClick={() => setHormones(opt)} className="flex items-center gap-2.5 cursor-pointer py-2 px-3 rounded-sm border transition-all" style={{ borderColor: sel ? GOLD : GOLD_LT, background: sel ? `linear-gradient(135deg, ${GOLD_WM}18, ${GOLD_LT}28)` : IVORY }}>
                    <div className="w-3.5 h-3.5 rounded-full border-[1.5px] shrink-0 flex items-center justify-center" style={{ borderColor: sel ? GOLD : GOLD_LT, background: sel ? GOLD : "transparent" }}>
                      {sel && <div className="w-1.5 h-1.5 rounded-full bg-ivory" />}
                    </div>
                    <span className="text-xs font-serif" style={{ color: sel ? GOLD_DK : SMOKE }}>{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
        {!gender && <div className="mb-6 p-3 rounded-sm border border-dashed text-[11px] text-smoke text-center font-serif" style={{ background: CREAM, borderColor: GOLD_LT }}>{"↑"} Select your gender above to unlock the Hormonal Profile question</div>}

        {/* Q17 - Facial Scanner (optional) */}
        <div className="mb-6">
          <div className="text-[12.5px] font-bold text-char font-serif mb-1">17. Facial Skin Scanner <span className="text-[11px] text-smoke font-normal">(optional)</span></div>
          <div className="text-[11px] text-smoke mb-3">Upload a clear, well-lit photo of your face for AI-powered texture and condition analysis.</div>
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
            <div className="shrink-0 text-center">
              {imgSrc ? (
                <div className="relative inline-block">
                  <img src={imgSrc} alt="selfie" className="w-32 h-40 object-cover rounded border-2 border-gold block" />
                  <button onClick={() => setImgSrc(null)} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-char text-ivory text-xs flex items-center justify-center cursor-pointer border border-gold-lt">{"✕"}</button>
                </div>
              ) : (
                <div className="p-3 rounded border" style={{ background: CREAM, borderColor: GOLD_LT }}>
                  <GeoFace size={100} dark={true} gender={gender} />
                </div>
              )}
            </div>
            <div className="flex-1 w-full">
              <label
                className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-sm border-[1.5px] cursor-pointer text-xs font-serif transition-all w-full"
                style={{ borderColor: imgSrc ? GOLD : GOLD_LT, background: imgSrc ? `linear-gradient(135deg, ${GOLD_WM}22, ${GOLD_LT}40)` : IVORY, color: imgSrc ? GOLD_DK : SMOKE }}
              >
                <span className="text-lg">📷</span>
                <span>{imgSrc ? "Change Photo" : "Upload Face Photo"}</span>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => setImgSrc(ev.target?.result as string); r.readAsDataURL(f); } }} />
              </label>
              <div className="mt-2.5 text-[10px] text-smoke leading-relaxed space-y-1">
                <div>📐 <strong className="text-char">Best results:</strong> Front-facing, natural light, no makeup</div>
                <div>🔬 <strong className="text-char">AI analyses:</strong> Texture, pores, oiliness, pigmentation, redness, fine lines</div>
                <div>🔒 <strong className="text-char">Privacy:</strong> Your photo is processed securely and not stored</div>
              </div>
              {imgSrc && (
                <div className="mt-2.5 py-2 px-3 rounded-sm border text-[11px] font-serif" style={{ background: CREAM, borderColor: GOLD, color: GOLD_DK }}>
                  ✓ Photo uploaded — AI skin texture analysis will be included in your report
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="h-px bg-gold-lt mb-5 opacity-50" />

        {/* Disclaimer + Submit */}
        <div className="p-2.5 rounded-sm text-[11px] text-smoke leading-relaxed mb-5 border-l-2" style={{ background: CREAM, borderColor: GOLD_LT }}>
          For <strong className="text-char">educational purposes only</strong>. Not a substitute for professional advice.
        </div>
        <button onClick={runAI} disabled={!allAnswered}
          className="w-full py-3.5 rounded-sm border-none text-[13px] font-serif tracking-[2px] uppercase transition-all"
          style={{ background: allAnswered ? `linear-gradient(135deg, ${GOLD_WM}, ${GOLD_DK})` : "#ddd", color: IVORY, cursor: allAnswered ? "pointer" : "not-allowed", boxShadow: allAnswered ? "0 4px 18px rgba(139,104,32,0.25)" : "none" }}>
          {allAnswered ? "Analyse My Skin →" : `${completedCount} / ${totalCount} completed`}
        </button>
      </LuxCard>
    </div>
  );

  // ──── LOADING ────
  if (phase === "loading") return (
    <div className="text-center py-20 px-5 animate-fade-in">
      <GeoFace size={140} gender={gender} />
      <div className="text-[9px] tracking-[4px] text-gold uppercase font-serif mt-5 mb-2">Processing</div>
      <div className="text-lg font-serif text-char mb-1.5">Analysing your skin profile{"…"}</div>
      <div className="text-xs text-smoke mb-7">Generating your personalised report</div>
      <div className="flex justify-center gap-2.5">
        {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full animate-glow-pulse" style={{ background: `linear-gradient(135deg, ${GOLD_WM}, ${GOLD_DK})`, animationDelay: `${i * 0.45}s` }} />)}
      </div>
    </div>
  );

  // ──── RESULTS ────
  if (phase === "results" && results) return (
    <div className="max-w-[760px] mx-auto py-7 px-4 sm:px-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-5 gap-2.5">
        <div>
          <div className="text-[9px] text-gold tracking-[4px] uppercase font-serif">Personalised Report</div>
          <div className="text-xl sm:text-2xl font-serif text-char mt-0.5">Skin Analysis Results</div>
          <Divider opacity={0.5} />
        </div>
        <div className="flex gap-2.5 items-center">
          {imgSrc && <img src={imgSrc} alt="selfie" className="w-11 h-11 rounded-full object-cover border-[1.5px] border-gold" />}
          <button onClick={reset} className="py-2 px-5 rounded-sm border border-gold-lt bg-ivory text-gold-dk cursor-pointer text-[11px] font-serif tracking-wide">{"↺"} Retake</button>
        </div>
      </div>

      {/* Patient tags */}
      <LuxCard className="!p-3.5 !mb-3.5">
        <div className="flex gap-2 flex-wrap items-center">
          <Tag color={GOLD_DK} bg={CREAM}>{"📅"} Age {age}</Tag>
          {gender && <Tag color={GOLD_DK} bg={CREAM}>{genderIcons[gender]} {gender}</Tag>}
          {bmi && <Tag color={bmiCategory(bmi)?.color} bg={CREAM}>{"⚖"} BMI {bmi} {"—"} {bmiCategory(bmi)?.label}</Tag>}
          {sliderAnswers.ethnicity !== null && <Tag color={GOLD_DK} bg={CREAM}>{"🌏"} {ethnicityOptions[sliderAnswers.ethnicity]}</Tag>}
          {radioAnswers.climate && <Tag color={GOLD_DK} bg={CREAM}>{"🌡"} {radioAnswers.climate}</Tag>}
        </div>
      </LuxCard>

      {/* Skin Type & Implications */}
      <LuxCard>
        <SecLabel icon="🏆" text="Your Skin Type" />
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full border-[2.5px] border-gold shrink-0" style={{ background: fitz.tone }} />
            <div>
              <div className="text-lg font-bold font-serif text-char">Fitzpatrick Type {fitz.type}</div>
              <div className="text-[12px] text-smoke">{fitz.desc}</div>
            </div>
          </div>
          <div className="flex justify-center gap-1 items-center">
            {fitzpatrickTypes.map((f, i) => <div key={i} className="w-4 h-4 rounded-full" style={{ background: f.tone, border: f.type === fitz.type ? `2px solid ${GOLD_DK}` : `1px solid ${GOLD_LT}` }} />)}
          </div>
        </div>
        <div className="text-[12.5px] font-bold text-gold-dk mb-1.5 font-serif">{results.overallSkinType}</div>
        <div className="text-[12.5px] text-smoke leading-relaxed mb-3 pl-3 border-l-2" style={{ borderColor: GOLD_LT }}>
          {results.fitzpatrickAdvice}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
          <div className="p-3 rounded-sm border" style={{ background: CREAM, borderColor: GOLD_LT }}>
            <div className="text-[10px] text-gold-dk tracking-[1.5px] uppercase font-serif mb-1">⚠ UV Risk Profile</div>
            <div className="text-[12px] text-smoke leading-relaxed">{fitz.risk}</div>
          </div>
          <div className="p-3 rounded-sm border" style={{ background: CREAM, borderColor: GOLD_LT }}>
            <div className="text-[10px] text-gold-dk tracking-[1.5px] uppercase font-serif mb-1">☀ SPF Recommendation</div>
            <div className="text-[12px] text-smoke leading-relaxed">{fitz.spf}</div>
          </div>
        </div>
      </LuxCard>

      {/* Overview — broad review of skin condition */}
      <LuxCard>
        <SecLabel icon="📋" text="Skin Condition Overview" />
        <p className="text-[13px] text-smoke leading-relaxed mb-4">{results.summary}</p>
        <div className="text-[9px] tracking-[2.5px] text-gold uppercase mb-2 font-serif">Primary Concerns Identified</div>
        <div className="flex gap-1.5 flex-wrap mb-4">{(results.primaryConcerns || []).map((c: string, i: number) => <Tag key={i} color={GOLD_DK} bg={CREAM}>{c}</Tag>)}</div>
        {results.skinConditionNotes && (
          <div className="text-[12.5px] text-smoke leading-relaxed pl-3 border-l-2 mb-3" style={{ borderColor: GOLD_LT }}>
            {results.skinConditionNotes}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
          <div className="p-3 rounded-sm border" style={{ background: CREAM, borderColor: GOLD_LT }}>
            <div className="text-[10px] text-gold-dk tracking-[1.5px] uppercase font-serif mb-1.5">🧴 Product Tips</div>
            {(results.productTips || results.amTips || []).slice(0, 3).map((tip: string, i: number) => (
              <div key={i} className="text-[11.5px] text-smoke mb-1.5 leading-relaxed">· {tip}</div>
            ))}
          </div>
          <div className="p-3 rounded-sm border" style={{ background: CREAM, borderColor: GOLD_LT }}>
            <div className="text-[10px] text-gold-dk tracking-[1.5px] uppercase font-serif mb-1.5">🌿 Lifestyle Tips</div>
            {(results.lifestyleNotes || []).slice(0, 3).map((note: string, i: number) => (
              <div key={i} className="text-[11.5px] text-smoke mb-1.5 leading-relaxed">· {note}</div>
            ))}
          </div>
        </div>
      </LuxCard>

      {/* Photo Analysis */}
      {results.imageAnalysis && imgSrc && (
        <LuxCard>
          <SecLabel icon="📸" text="Photo Skin Analysis" />
          <div className="flex flex-col md:flex-row gap-4">
            {/* Photo + Score */}
            <div className="shrink-0 text-center">
              <img src={imgSrc} alt="Uploaded selfie" className="w-28 h-36 sm:w-32 sm:h-40 object-cover rounded border-2 border-gold-lt mx-auto mb-3" />
              {results.imageAnalysis.skinQualityScore && (
                <div className="inline-flex flex-col items-center p-3 rounded-sm border" style={{ background: CREAM, borderColor: GOLD_LT }}>
                  <div className="text-[9px] tracking-[2px] text-gold uppercase font-serif mb-1">Skin Quality</div>
                  <div className="text-3xl font-bold font-serif" style={{ color: results.imageAnalysis.skinQualityScore >= 7 ? "#3A7050" : results.imageAnalysis.skinQualityScore >= 4 ? GOLD_DK : "#A03030" }}>
                    {results.imageAnalysis.skinQualityScore}<span className="text-sm text-smoke font-normal">/10</span>
                  </div>
                  <div className="w-full h-2 rounded-full mt-2 mb-1" style={{ background: `linear-gradient(to right, #A03030, ${GOLD_DK}, #3A7050)` }}>
                    <div className="h-2 w-3 rounded-full bg-ivory border-2 border-char relative" style={{ marginLeft: `${Math.max(0, Math.min(100, (results.imageAnalysis.skinQualityScore / 10) * 100 - 5))}%` }} />
                  </div>
                </div>
              )}
            </div>
            {/* Analysis details */}
            <div className="flex-1 min-w-0">
              {/* Texture Assessment */}
              {results.imageAnalysis.textureAssessment && (
                <div className="mb-3">
                  <div className="text-[10px] text-gold-dk tracking-[1.5px] uppercase font-serif mb-1">Texture Assessment</div>
                  <div className="text-[12.5px] text-smoke leading-relaxed pl-3 border-l-2" style={{ borderColor: GOLD_LT }}>
                    {results.imageAnalysis.textureAssessment}
                  </div>
                </div>
              )}
              {/* Observations */}
              {results.imageAnalysis.observations?.length > 0 && (
                <div className="mb-3">
                  <div className="text-[10px] text-gold-dk tracking-[1.5px] uppercase font-serif mb-2">Zone-by-Zone Observations</div>
                  <div className="flex flex-col gap-2">
                    {results.imageAnalysis.observations.map((obs: Results, i: number) => (
                      <div key={i} className="p-2.5 rounded-sm border" style={{ background: CREAM, borderColor: GOLD_LT }}>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[12px] font-bold text-char font-serif">{obs.area}</span>
                          <Tag color={sevCol[obs.severity] || GOLD_DK}>{obs.severity}</Tag>
                        </div>
                        <div className="text-[11.5px] text-smoke leading-relaxed mb-1">{obs.finding}</div>
                        <div className="text-[11px] text-gold-dk italic">{obs.recommendation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Visible Concerns */}
              {results.imageAnalysis.visibleConcerns?.length > 0 && (
                <div className="mb-3">
                  <div className="text-[10px] text-gold-dk tracking-[1.5px] uppercase font-serif mb-1.5">Visible Concerns</div>
                  <div className="flex gap-1.5 flex-wrap">
                    {results.imageAnalysis.visibleConcerns.map((c: string, i: number) => <Tag key={i} color={GOLD_DK} bg={CREAM}>{c}</Tag>)}
                  </div>
                </div>
              )}
              {/* Score explanation */}
              {results.imageAnalysis.scoreExplanation && (
                <div className="text-[11.5px] text-smoke leading-relaxed pl-3 border-l-2 mt-2" style={{ borderColor: GOLD }}>
                  {results.imageAnalysis.scoreExplanation}
                </div>
              )}
              {/* Overall photo notes */}
              {results.imageAnalysis.overallPhotoNotes && (
                <div className="mt-3 p-2.5 rounded-sm text-[11.5px] text-smoke leading-relaxed italic" style={{ background: `linear-gradient(135deg, ${CREAM}, ${IVORY})`, border: `1px solid ${GOLD_LT}` }}>
                  💡 {results.imageAnalysis.overallPhotoNotes}
                </div>
              )}
              {/* Photo-based recommendations */}
              {results.imageAnalysis.photoBasedRecommendations?.length > 0 && (
                <div className="mt-3">
                  <div className="text-[10px] text-gold-dk tracking-[1.5px] uppercase font-serif mb-2">📸 Recommendations Based on Your Photo</div>
                  <div className="flex flex-col gap-1.5">
                    {results.imageAnalysis.photoBasedRecommendations.map((rec: string, i: number) => (
                      <div key={i} className="p-2.5 rounded-sm border text-[11.5px] text-smoke leading-relaxed" style={{ background: IVORY, borderColor: GOLD_LT }}>
                        <span className="text-gold-dk font-bold">{i + 1}.</span> {rec}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-3 text-[10px] text-smoke opacity-60 text-center">
            Photo analysis is AI-assisted and for educational purposes only. It does not replace clinical examination under proper lighting.
          </div>
        </LuxCard>
      )}

      {/* Your Answers — How Each Response Shapes Your Analysis */}
      {results.inputAnalysis?.length > 0 && (
        <LuxCard>
          <SecLabel icon="🔍" text="How Your Answers Shape Your Analysis" />
          <div className="text-[11px] text-smoke mb-4 pl-3 border-l-2 italic" style={{ borderColor: GOLD }}>
            Every answer you provided directly influenced your personalised report. Here is how each response affects our assessment of your skin.
          </div>
          <div className="flex flex-col gap-2">
            {results.inputAnalysis.map((item: Results, i: number) => (
              <div key={i} className="rounded-sm border overflow-hidden" style={{ borderColor: GOLD_LT }}>
                <div className="flex items-start gap-3 p-3" style={{ background: CREAM }}>
                  <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold text-ivory" style={{ background: `linear-gradient(135deg, ${GOLD_WM}, ${GOLD_DK})` }}>{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                      <span className="text-[10px] text-gold-dk tracking-[1.5px] uppercase font-serif font-bold">{item.question}</span>
                      <span className="text-[12px] text-char font-bold font-serif">→ {item.yourAnswer}</span>
                    </div>
                    <div className="text-[12px] text-smoke leading-relaxed">{item.impact}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </LuxCard>
      )}

      <LuxCard><SecLabel icon="🧬" text="Fitzpatrick-Specific Guidance" /><div className="text-[12.5px] text-smoke leading-relaxed">{results.fitzpatrickAdvice}</div></LuxCard>

      {/* Zone Findings — based on user's selected zones */}
      {results.zoneFindings?.length > 0 && (
        <LuxCard>
          <SecLabel icon="🗺" text="Your Zone Analysis" />
          <div className="text-[11px] text-smoke mb-3 pl-3 border-l-2 italic" style={{ borderColor: GOLD }}>
            Based on the zones you selected: <strong className="text-char not-italic">{zones.includes("all") ? "All zones" : zones.map(z => z.charAt(0).toUpperCase() + z.slice(1)).join(", ")}</strong>
          </div>
          <div className="flex flex-col gap-2.5">
            {results.zoneFindings.map((f: Results, i: number) => (
              <div key={i} className="p-3 rounded-sm border" style={{ borderColor: GOLD_LT, background: CREAM }}>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="font-bold text-[13px] font-serif text-char">{f.zone}</span>
                  <Tag color={sevCol[f.severity] || GOLD_DK}>{f.severity}</Tag>
                  <Tag color={urgCol[f.urgency] || GOLD_DK}>{urgLbl[f.urgency] || f.urgency}</Tag>
                </div>
                <div className="flex gap-1.5 flex-wrap mb-1.5">{(f.likelyConcerns || []).map((c: string, j: number) => <Tag key={j} color={GOLD_DK} bg={IVORY}>{c}</Tag>)}</div>
                <div className="text-xs text-smoke leading-relaxed mb-1.5">{f.explanation}</div>
                {f.specificAdvice && <div className="text-[11.5px] text-gold-dk leading-relaxed mb-1.5 pl-2.5 border-l-2" style={{ borderColor: GOLD }}>💡 {f.specificAdvice}</div>}
                {f.keyIngredients?.length > 0 && <div className="text-[11px] text-smoke opacity-80">Key ingredients: <span className="text-gold-dk">{f.keyIngredients.join(", ")}</span></div>}
              </div>
            ))}
          </div>
        </LuxCard>
      )}

      {/* Diet Impact — based on user's diet selection */}
      {results.dietImpact && (
        <LuxCard>
          <SecLabel icon="🥗" text="How Your Diet Affects Your Skin" />
          <div className="text-[11px] text-smoke mb-3 pl-3 border-l-2 italic" style={{ borderColor: GOLD }}>
            You selected: <strong className="text-char not-italic">{results.dietImpact.patientDiet || dietOptions[sliderAnswers.diet!]}</strong>
          </div>
          <div className="text-[12.5px] text-smoke leading-relaxed mb-4">{results.dietImpact.skinEffects}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="p-3 rounded-sm border" style={{ background: "#F0F8F0", borderColor: "#B8D8B8" }}>
              <div className="text-[10px] tracking-[1.5px] uppercase font-serif mb-2" style={{ color: "#3A7050" }}>✓ Beneficial Foods</div>
              {(results.dietImpact.beneficialFoods || []).map((f: string, i: number) => (
                <div key={i} className="text-[11.5px] mb-1.5 leading-relaxed" style={{ color: "#3A6040" }}>· {f}</div>
              ))}
            </div>
            <div className="p-3 rounded-sm border" style={{ background: "#FDF5F5", borderColor: "#E8CCCC" }}>
              <div className="text-[10px] tracking-[1.5px] uppercase font-serif mb-2" style={{ color: "#903030" }}>✗ Foods to Reduce</div>
              {(results.dietImpact.foodsToReduce || []).map((f: string, i: number) => (
                <div key={i} className="text-[11.5px] mb-1.5 leading-relaxed" style={{ color: "#804040" }}>· {f}</div>
              ))}
            </div>
          </div>
          {results.dietImpact.dietRecommendation && (
            <div className="text-[12px] text-smoke leading-relaxed pl-3 border-l-2" style={{ borderColor: GOLD_LT }}>
              <strong className="text-gold-dk">Recommendation:</strong> {results.dietImpact.dietRecommendation}
            </div>
          )}
        </LuxCard>
      )}

      {/* Routine Analysis — based on user's current routine */}
      {results.routineAnalysis && (
        <LuxCard>
          <SecLabel icon="🔬" text="Your Current Routine — Analysed" />
          <div className="text-[11px] text-smoke mb-3 pl-3 border-l-2 italic" style={{ borderColor: GOLD }}>
            You told us you use: <strong className="text-char not-italic">
              {routineChecked.includes("none")
                ? "No routine / just water"
                : routineChecked.map(r => routineSteps.find(st => st.id === r)?.label || r).join(", ")}
            </strong>
          </div>
          {/* Current steps */}
          {results.routineAnalysis.currentSteps?.length > 0 && (
            <div className="mb-3">
              <div className="text-[10px] text-gold-dk tracking-[1.5px] uppercase font-serif mb-1.5">✓ What You're Doing</div>
              <div className="flex gap-1.5 flex-wrap">
                {results.routineAnalysis.currentSteps.map((s: string, i: number) => <Tag key={i} color="#3A7050" bg="#F0F8F0">{s}</Tag>)}
              </div>
            </div>
          )}
          {/* Missing steps */}
          {results.routineAnalysis.missingSteps?.length > 0 && (
            <div className="mb-3">
              <div className="text-[10px] tracking-[1.5px] uppercase font-serif mb-2" style={{ color: "#A03030" }}>✗ Critical Missing Steps</div>
              <div className="flex flex-col gap-1.5">
                {results.routineAnalysis.missingSteps.map((s: string, i: number) => (
                  <div key={i} className="p-2 rounded-sm border text-[11.5px] leading-relaxed" style={{ background: "#FDF5F5", borderColor: "#E8CCCC", color: "#703030" }}>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Steps to improve */}
          {results.routineAnalysis.stepsToImprove?.length > 0 && (
            <div className="mb-3">
              <div className="text-[10px] text-gold-dk tracking-[1.5px] uppercase font-serif mb-2">⚡ Steps to Optimise</div>
              <div className="flex flex-col gap-1.5">
                {results.routineAnalysis.stepsToImprove.map((s: string, i: number) => (
                  <div key={i} className="p-2 rounded-sm border text-[11.5px] text-smoke leading-relaxed" style={{ background: IVORY, borderColor: GOLD_LT }}>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Verdict */}
          {results.routineAnalysis.routineVerdict && (
            <div className="p-3 rounded-sm border-l-2 mt-2" style={{ background: `linear-gradient(135deg, ${CREAM}, ${IVORY})`, borderColor: GOLD }}>
              <div className="text-[10px] text-gold-dk tracking-[1.5px] uppercase font-serif mb-1">Overall Assessment</div>
              <div className="text-[12.5px] text-smoke leading-relaxed">{results.routineAnalysis.routineVerdict}</div>
            </div>
          )}
        </LuxCard>
      )}

      {/* Recommended Routine */}
      {matchedRoutine && (
        <LuxCard>
          <SecLabel icon="🧴" text={`Recommended Routine — ${matchedRoutine.concern}`} />
          <div className="text-xs text-smoke leading-relaxed pl-3 mb-4 border-l-2" style={{ borderColor: GOLD_LT }}>{results.routineRationale}</div>
          <div className="inline-flex rounded-sm overflow-hidden border border-gold-lt mb-4">
            {(["am", "pm"] as const).map(t => <button key={t} onClick={() => setRoutineTime(t)} className="py-2 px-5 border-none cursor-pointer text-[11px] font-serif tracking-[1.5px] uppercase" style={{ background: routineTime === t ? `linear-gradient(135deg, ${GOLD_WM}, ${GOLD_DK})` : IVORY, color: routineTime === t ? IVORY : SMOKE }}>{t === "am" ? "☀ AM" : "🌙 PM"}</button>)}
          </div>
          {(routineTime === "am" ? matchedRoutine.am : matchedRoutine.pm).map((step, i) => (
            <div key={i} className="bg-gradient-to-br from-ivory to-ivory2 border border-gold-lt rounded-sm p-3 sm:p-4 mb-2.5 flex gap-3 sm:gap-4">
              <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-ivory" style={{ background: `linear-gradient(135deg, ${GOLD_WM}, ${GOLD_DK})` }}>{i + 1}</div>
              <div className="min-w-0">
                <div className="text-[9px] tracking-[2.5px] text-gold uppercase mb-1 font-serif">{step.step}</div>
                <div className="text-[13px] sm:text-[13.5px] font-bold mb-1.5 text-char font-serif">{step.product}</div>
                <div className="text-xs text-smoke leading-relaxed pl-2.5 border-l-2" style={{ borderColor: GOLD_LT }}><span className="text-gold-dk font-bold">Why: </span>{step.why}</div>
              </div>
            </div>
          ))}
          {matchedRoutine.avoid && (
            <div className="mt-3.5 p-3.5 rounded-sm border" style={{ background: IVORY2, borderColor: GOLD_LT }}>
              <SecLabel icon="🚫" text="Avoid" />
              <div className="flex gap-1.5 flex-wrap">{matchedRoutine.avoid.map((a, i) => <span key={i} className="py-1 px-3 rounded-sm text-[11px] bg-red-50 border border-red-200 text-red-800">{a}</span>)}</div>
            </div>
          )}
          <div className="mt-3 p-3 rounded-sm border-l-2" style={{ background: IVORY2, borderColor: GOLD }}>
            <SecLabel icon="💡" text={`${routineTime === "am" ? "AM" : "PM"} Tips`} />
            {((routineTime === "am" ? results.amTips : results.pmTips) || []).map((tip: string, i: number) => <div key={i} className="text-xs text-smoke mb-1">{"·"} {tip}</div>)}
          </div>
        </LuxCard>
      )}

      {/* Suggested Treatments */}
      {results.suggestedTreatments?.length > 0 && (
        <LuxCard>
          <SecLabel icon="💉" text="Suggested Treatments" />
          {results.suggestedTreatments.map((t: Results, i: number) => (
            <div key={i} className="flex gap-3 p-2.5 rounded-sm border items-start mb-2" style={{ borderColor: GOLD_LT, background: CREAM }}>
              <Tag color={suitCol[t.suitability] || GOLD_DK}>{t.suitability === "high" ? "⭐ High" : t.suitability === "moderate" ? "✓ Moderate" : "· Low"}</Tag>
              <div><div className="text-[13px] font-bold text-char font-serif">{t.name}</div>{t.reason && <div className="text-[11.5px] text-smoke mt-0.5">{t.reason}</div>}</div>
            </div>
          ))}
        </LuxCard>
      )}

      {/* 3-Month Roadmap */}
      <LuxCard>
        <SecLabel icon="📅" text="3-Month Roadmap" />
        <div className="flex flex-col sm:flex-row gap-2.5">
          {(results.threeMonthRoadmap || []).map((m: Results, i: number) => (
            <div key={i} className="flex-1 min-w-[160px] p-3 rounded-sm border" style={{ borderColor: GOLD_LT, background: CREAM }}>
              <div className="text-[10.5px] font-bold text-gold-dk mb-1.5 font-serif">{m.month}</div>
              <div className="text-[11.5px] text-smoke leading-relaxed mb-1.5"><strong className="text-char">Focus:</strong> {m.focus}</div>
              <div className="text-[11px] text-smoke leading-relaxed pl-2 border-l-2" style={{ borderColor: GOLD_LT }}>{m.expectedChange}</div>
            </div>
          ))}
        </div>
      </LuxCard>

      {/* Lifestyle + Diet + Avoid */}
      <div className="flex flex-col sm:flex-row gap-3 mb-3.5">
        {[{ icon: "🌿", title: "Lifestyle", data: results.lifestyleNotes }, { icon: "🥗", title: "Diet", data: results.dietaryTips }].map((s, i) => (
          <LuxCard key={i} className="flex-1 min-w-[160px]">
            <SecLabel icon={s.icon} text={s.title} />
            {(s.data || []).map((n: string, j: number) => <div key={j} className="text-xs text-smoke mb-1">{"·"} {n}</div>)}
          </LuxCard>
        ))}
        <LuxCard className="flex-1 min-w-[160px]">
          <SecLabel icon="🚫" text="Avoid" />
          <div className="flex gap-1.5 flex-wrap">{(results.ingredientsToAvoid || []).map((ing: string, i: number) => <span key={i} className="py-0.5 px-2 rounded-sm text-[11px] bg-red-50 border border-red-200 text-red-800">{ing}</span>)}</div>
        </LuxCard>
      </div>

      <LuxCard><SecLabel icon="☀" text="Sunscreen Guidance" /><div className="text-[12.5px] text-smoke leading-relaxed">{results.sunscreenAdvice}</div></LuxCard>

      {/* Consultation CTA */}
      <LuxCard className="!border-gold !shadow-[0_4px_30px_rgba(139,104,32,0.12)]">
        <div className="text-center">
          <div className="text-[9px] tracking-[4px] text-gold uppercase mb-2 font-serif">Next Step</div>
          <div className="text-lg sm:text-xl font-serif text-char mb-2">Ready for a Full Skin Consultation?</div>
          <p className="text-[12.5px] text-smoke leading-relaxed mb-4 max-w-[480px] mx-auto">
            This AI assessment provides educational guidance based on your profile. For a comprehensive, personalised treatment plan with prescription-grade options, book a consultation with an experienced skincare doctor.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4">
            <button
              className="w-full sm:w-auto py-3.5 px-8 rounded-sm border-none text-[13px] font-serif tracking-[2px] uppercase cursor-pointer transition-all"
              style={{ background: `linear-gradient(135deg, ${GOLD_WM}, ${GOLD_DK})`, color: IVORY, boxShadow: "0 4px 18px rgba(139,104,32,0.25)" }}
              onClick={() => window.open("https://wa.me/", "_blank")}
            >
              Book a Consultation
            </button>
            <button onClick={reset}
              className="w-full sm:w-auto py-3 px-6 rounded-sm border cursor-pointer text-[12px] font-serif tracking-[1px]"
              style={{ borderColor: GOLD_LT, background: IVORY, color: GOLD_DK }}>
              ↺ Retake Assessment
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-[10px] text-smoke opacity-70">
            <span>✓ Evidence-based approach</span>
            <span>✓ Personalised treatment plans</span>
            <span>✓ Prescription-grade options</span>
          </div>
        </div>
      </LuxCard>

      <div className="p-2.5 rounded-sm border text-[10px] text-smoke leading-relaxed mb-5 text-center" style={{ background: CREAM, borderColor: GOLD_LT }}>
        ⚠ For <strong>educational purposes only</strong>. This assessment is not a medical diagnosis. Always consult a qualified skincare doctor before starting any new treatment.
      </div>
    </div>
  );

  return null;
}
