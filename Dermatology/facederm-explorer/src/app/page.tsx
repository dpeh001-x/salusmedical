"use client";

import { useState } from "react";
import { CHAR, CREAM, GOLD, GOLD_DK, GOLD_LT, IVORY, IVORY2, SMOKE } from "./components/theme";
import Analyser from "./components/analyser/Analyser";
import RoutinesTab from "./components/routines/RoutinesTab";
import TreatmentsTab from "./components/treatments/TreatmentsTab";
import ConditionAtlas from "./components/atlas/ConditionAtlas";

const tabs = [
  {
    id: "analyser", label: "AI Analyser",
    icon: (
      <svg viewBox="0 0 20 20" width="16" height="16">
        <ellipse cx="10" cy="11" rx="6" ry="7.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <line x1="4" y1="7.5" x2="16" y2="7.5" stroke="currentColor" strokeWidth=".7" strokeDasharray="2 2" opacity=".7" />
        <line x1="10" y1="3.5" x2="10" y2="18.5" stroke="currentColor" strokeWidth=".7" strokeDasharray="2 2" opacity=".6" />
        <circle cx="7" cy="11" r="1.3" fill="none" stroke="currentColor" strokeWidth=".9" />
        <circle cx="13" cy="11" r="1.3" fill="none" stroke="currentColor" strokeWidth=".9" />
        <circle cx="7" cy="11" r=".5" fill="currentColor" />
        <circle cx="13" cy="11" r=".5" fill="currentColor" />
        <path d="M8 14.5 Q10 16 12 14.5" stroke="currentColor" strokeWidth=".8" fill="none" />
      </svg>
    ),
  },
  {
    id: "routines", label: "Routines",
    icon: (
      <svg viewBox="0 0 20 20" width="16" height="16">
        <circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="10" cy="10" r="1.3" fill="currentColor" opacity=".5" />
        <line x1="10" y1="10" x2="13.5" y2="7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <line x1="10" y1="10" x2="10" y2="6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "treatments", label: "Treatments",
    icon: (
      <svg viewBox="0 0 20 20" width="16" height="16">
        <path d="M5 15 L10 4 L15 15" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
        <line x1="7" y1="11" x2="13" y2="11" stroke="currentColor" strokeWidth=".9" opacity=".7" />
        <line x1="3" y1="17" x2="17" y2="17" stroke="currentColor" strokeWidth="1.1" opacity=".5" />
      </svg>
    ),
  },
  {
    id: "atlas", label: "Conditions",
    icon: (
      <svg viewBox="0 0 20 20" width="16" height="16">
        <rect x="3" y="2" width="14" height="16" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <line x1="6" y1="6.5" x2="14" y2="6.5" stroke="currentColor" strokeWidth=".9" opacity=".7" />
        <line x1="6" y1="9.5" x2="14" y2="9.5" stroke="currentColor" strokeWidth=".9" opacity=".7" />
        <line x1="6" y1="12.5" x2="11" y2="12.5" stroke="currentColor" strokeWidth=".9" opacity=".7" />
      </svg>
    ),
  },
];

export default function Home() {
  const [tab, setTab] = useState("analyser");

  return (
    <div
      className="min-h-screen font-serif"
      style={{
        background: `radial-gradient(ellipse at top, ${IVORY} 0%, ${IVORY2} 60%, ${CREAM} 100%)`,
        color: CHAR,
      }}
    >
      {/* Header */}
      <div
        className="px-4 sm:px-6 py-5 sm:py-6 text-center relative"
        style={{ background: `linear-gradient(180deg, ${CHAR} 0%, #2A2218 100%)` }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[1.5px]"
          style={{ background: `linear-gradient(90deg, transparent, ${GOLD_LT} 30%, ${GOLD} 50%, ${GOLD_LT} 70%, transparent)` }}
        />
        <a href="/" className="inline-block mb-2">
          <img src="/skin/explorer/images/Salus Medical Logo1 png.png" alt="Salus Medical" className="h-10 mx-auto" />
        </a>
        <div className="text-[8.5px] tracking-[5px] uppercase mb-1 font-serif" style={{ color: GOLD_LT, opacity: 0.85 }}>
          Dermatology Reference
        </div>
        <h1 className="m-0 text-xl sm:text-2xl font-normal tracking-wider font-serif" style={{ color: IVORY }}>
          FaceDerm <span style={{ color: GOLD }} className="italic">Explorer</span>
        </h1>
        <div
          className="h-px mx-auto my-2.5 w-[60%] max-w-[300px] opacity-60"
          style={{ background: `linear-gradient(90deg, transparent, ${GOLD_LT}, transparent)` }}
        />
        <div className="text-[9px] sm:text-[10px] tracking-[1.5px] opacity-70 font-serif" style={{ color: GOLD_LT }}>
          Educational Guide to Facial Skin Conditions, Treatments & Evidence-Based Care
        </div>
        <div className="absolute top-3.5 left-4 text-sm opacity-30" style={{ color: GOLD }}>{"✦"}</div>
        <div className="absolute top-3.5 right-4 text-sm opacity-30" style={{ color: GOLD }}>{"✦"}</div>
      </div>

      {/* Tab navigation */}
      <div
        className="overflow-x-auto"
        style={{ background: `linear-gradient(180deg, ${IVORY2}, ${IVORY})`, borderBottom: `1px solid ${GOLD_LT}` }}
      >
        <div className="grid grid-cols-4 max-w-[600px] mx-auto min-w-[320px]">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex flex-col items-center gap-1 py-2.5 sm:py-3 px-1 border-none bg-transparent cursor-pointer font-serif transition-all text-[7px] sm:text-[8px] tracking-wider uppercase"
              style={{
                borderBottom: tab === t.id ? `2px solid ${GOLD}` : "2px solid transparent",
                color: tab === t.id ? GOLD_DK : SMOKE,
              }}
            >
              <span style={{ color: tab === t.id ? GOLD : "#c0b090" }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {tab === "analyser" && <Analyser />}
      {tab === "routines" && <RoutinesTab />}
      {tab === "treatments" && <TreatmentsTab />}
      {tab === "atlas" && <ConditionAtlas />}

      {/* Footer */}
      <div
        className="text-center py-5 mt-8"
        style={{ background: `linear-gradient(180deg, ${IVORY2}, ${CREAM})`, borderTop: `1px solid ${GOLD_LT}` }}
      >
        <div className="text-[8px] tracking-[3px] uppercase font-serif" style={{ color: GOLD_LT }}>FaceDerm Explorer</div>
        <div className="text-[8.5px] mt-0.5 tracking-[1.5px]" style={{ color: "#bbb" }}>For Educational Use Only {"·"} Not Medical Advice</div>
      </div>
    </div>
  );
}
