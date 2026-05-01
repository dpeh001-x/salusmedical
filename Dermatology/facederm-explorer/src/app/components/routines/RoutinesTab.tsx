"use client";

import { useState } from "react";
import { CHAR, CREAM, GOLD, GOLD_DK, GOLD_LT, GOLD_WM, IVORY, IVORY2, SMOKE } from "../theme";
import LuxCard from "../ui/LuxCard";
import Divider from "../ui/Divider";
import SecLabel from "../ui/SecLabel";
import GeoFace from "../icons/GeoFace";
import { routines, type Routine } from "../analyser/data";

const filterGroups: Record<string, Routine[]> = {
  All: routines,
  "Asia / SE Asia": routines.filter(r => ["East Asian / Chinese Skin", "Malay / Southeast Asian Skin", "Indian / South Asian Skin", "Tropical / Humid Climate (Singapore)"].includes(r.concern)),
  "By Skin Type": routines.filter(r => ["Oily / Acne-Prone", "Dry / Dehydrated", "Combination", "Sensitive / Reactive"].includes(r.concern)),
  "By Concern": routines.filter(r => ["Hyperpigmentation / PIH", "Rosacea-Prone", "Melanin-Rich Skin (IV–VI)", "Mature / Ageing"].includes(r.concern)),
};

export default function RoutinesTab() {
  const [selRoutine, setSelRoutine] = useState<Routine | null>(null);
  const [routineTime, setRoutineTime] = useState<"am" | "pm">("am");
  const [filter, setFilter] = useState("All");

  const shown = filterGroups[filter] || routines;

  return (
    <div className="max-w-[980px] mx-auto py-8 px-4 sm:px-5">
      <div className="text-center mb-2.5">
        <div className="text-[9px] tracking-[4px] text-gold uppercase mb-1.5">Evidence-Based Skincare</div>
        <p className="text-smoke text-[12.5px] mb-1">Routines backed by dermatology consensus guidelines.</p>
        <p className="text-gold-dk text-[10px] tracking-[1.5px] font-serif m-0">AAD {"·"} JAAD {"·"} BAD {"·"} NICE {"·"} EADV {"·"} Cochrane {"·"} Singapore Dermatological Society</p>
      </div>
      <Divider />

      {/* Filter buttons */}
      <div className="flex gap-2 justify-center my-4 flex-wrap">
        {Object.keys(filterGroups).map(f => (
          <button key={f} onClick={() => { setFilter(f); setSelRoutine(null); }}
            className="py-1.5 px-3.5 rounded-sm border cursor-pointer text-[10.5px] font-serif tracking-wide transition-all"
            style={{ borderColor: filter === f ? GOLD : GOLD_LT, background: filter === f ? `linear-gradient(135deg, ${GOLD_WM}, ${GOLD_DK})` : IVORY, color: filter === f ? IVORY : SMOKE }}>
            {f}
          </button>
        ))}
      </div>

      {/* Routine buttons */}
      <div className="flex gap-2 flex-wrap justify-center my-3.5">
        {shown.map((r, i) => (
          <button key={i} onClick={() => setSelRoutine(r)}
            className="py-2.5 px-4 rounded-sm border cursor-pointer text-xs font-serif tracking-wide transition-all"
            style={{ borderColor: selRoutine?.concern === r.concern ? r.color : GOLD_LT, background: selRoutine?.concern === r.concern ? r.color : IVORY, color: selRoutine?.concern === r.concern ? IVORY : SMOKE }}>
            {r.icon} {r.concern}
          </button>
        ))}
      </div>

      {!selRoutine && (
        <div className="text-center py-12 text-gray-300">
          <GeoFace size={80} dark={false} />
          <div className="font-serif tracking-wide mt-3 text-xs">Choose a skin concern above</div>
        </div>
      )}

      {selRoutine && (
        <div className="animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
            <div>
              <div className="text-[9px] tracking-[3px] text-gold uppercase font-serif">Routine For</div>
              <div className="text-lg font-serif mt-0.5" style={{ color: selRoutine.color }}>{selRoutine.icon} {selRoutine.concern}</div>
              <div className="text-[10px] text-smoke mt-0.5 opacity-70">{"📚"} {selRoutine.source}</div>
            </div>
            <div className="inline-flex rounded-sm overflow-hidden border border-gold-lt">
              {(["am", "pm"] as const).map(t => (
                <button key={t} onClick={() => setRoutineTime(t)}
                  className="py-2 px-5 border-none cursor-pointer text-[11px] font-serif tracking-[1.5px] uppercase"
                  style={{ background: routineTime === t ? `linear-gradient(135deg, ${GOLD_WM}, ${GOLD_DK})` : IVORY, color: routineTime === t ? IVORY : SMOKE }}>
                  {t === "am" ? "☀ AM" : "🌙 PM"}
                </button>
              ))}
            </div>
          </div>

          {(routineTime === "am" ? selRoutine.am : selRoutine.pm).map((step, i) => (
            <div key={i} className="bg-gradient-to-br from-ivory to-ivory2 border border-gold-lt rounded-sm p-3 sm:p-4 mb-2.5 flex gap-3 sm:gap-4">
              <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-ivory" style={{ background: `linear-gradient(135deg, ${GOLD_WM}, ${GOLD_DK})` }}>{i + 1}</div>
              <div className="min-w-0">
                <div className="text-[9px] tracking-[2.5px] text-gold uppercase mb-1 font-serif">{step.step}</div>
                <div className="text-[13px] sm:text-[13.5px] font-bold mb-1.5 text-char font-serif">{step.product}</div>
                <div className="text-xs text-smoke leading-relaxed pl-2.5 border-l-2" style={{ borderColor: GOLD_LT }}>
                  <span className="text-gold-dk font-bold">Why: </span>{step.why}
                </div>
              </div>
            </div>
          ))}

          {selRoutine.avoid && (
            <LuxCard className="!mt-4">
              <SecLabel icon="🚫" text="Ingredients & Products to Avoid" />
              <div className="flex gap-1.5 flex-wrap">
                {selRoutine.avoid.map((a, i) => (
                  <span key={i} className="py-1 px-3 rounded-sm text-[11px] bg-red-50 border border-red-200 text-red-800">{a}</span>
                ))}
              </div>
            </LuxCard>
          )}
        </div>
      )}
    </div>
  );
}
