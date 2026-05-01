"use client";

import { useState } from "react";
import { CHAR, CREAM, GOLD, GOLD_DK, GOLD_LT, GOLD_WM, IVORY, IVORY2, SMOKE } from "../theme";
import LuxCard from "../ui/LuxCard";
import Divider from "../ui/Divider";
import SecLabel from "../ui/SecLabel";
import GeoFace from "../icons/GeoFace";
import FaceLight from "../icons/FaceLight";
import { treatmentCategories, type Treatment } from "../analyser/data";

interface SelectedTx extends Treatment {
  tier: string;
  tierColor: string;
  tierBadgeBg: string;
  tierBadgeBorder: string;
}

export default function TreatmentsTab() {
  const [selTx, setSelTx] = useState<SelectedTx | null>(null);
  const [simActive, setSimActive] = useState(false);

  return (
    <div className="max-w-[980px] mx-auto py-8 px-4 sm:px-5">
      <div className="text-center mb-6">
        <div className="text-[9px] tracking-[4px] text-gold uppercase mb-1.5">Aesthetic Medicine</div>
        <p className="text-smoke text-[12.5px] m-0">Treatments organised by invasiveness. Select any to explore details.</p>
      </div>

      {treatmentCategories.map((cat, ci) => (
        <div key={ci} className="mb-6">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <div className="py-1 px-3.5 rounded-sm border text-[10px] font-serif tracking-[2px] uppercase font-bold shrink-0" style={{ background: cat.badgeBg, borderColor: cat.badgeBorder, color: cat.color }}>{cat.tier}</div>
            <div className="text-[11.5px] text-smoke">{cat.desc}</div>
            <div className="flex-1 h-px bg-gradient-to-r from-gold-lt to-transparent" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {cat.treatments.map((t, i) => (
              <button key={i} onClick={() => { setSelTx({ ...t, tier: cat.tier, tierColor: cat.color, tierBadgeBg: cat.badgeBg, tierBadgeBorder: cat.badgeBorder }); setSimActive(false); }}
                className="py-2.5 px-4 rounded-sm border cursor-pointer text-xs font-serif tracking-wide transition-all"
                style={{ borderColor: selTx?.name === t.name ? cat.color : GOLD_LT, background: selTx?.name === t.name ? cat.color : IVORY, color: selTx?.name === t.name ? IVORY : SMOKE }}>
                {t.icon} {t.name}
              </button>
            ))}
          </div>
        </div>
      ))}

      {!selTx && (
        <div className="text-center py-10 text-gray-300 border-t border-gold-lt mt-2">
          <GeoFace size={80} dark={false} />
          <div className="font-serif mt-3 text-xs">Select a treatment above to view details</div>
        </div>
      )}

      {selTx && (
        <div className="flex flex-col md:flex-row gap-5 animate-fade-in border-t border-gold-lt pt-6 mt-2">
          {/* Face visualization */}
          <div className="shrink-0 w-full md:w-[200px]">
            <LuxCard className="text-center">
              <div className="py-0.5 px-3 rounded-sm border text-[9px] tracking-[2px] uppercase font-serif inline-block mb-3" style={{ background: selTx.tierBadgeBg, borderColor: selTx.tierBadgeBorder, color: selTx.tierColor }}>{selTx.tier}</div>
              <div className="text-[9px] tracking-[3px] text-smoke uppercase mb-2.5 font-serif">{simActive ? "After" : "Before"}</div>
              <FaceLight selTx={selTx} simActive={simActive} />
              <div className="mt-3.5 flex gap-2 justify-center">
                {["Before", "After"].map((label, i) => (
                  <button key={i} onClick={() => setSimActive(i === 1)}
                    className="py-1.5 px-3.5 rounded-sm text-[11px] font-serif border cursor-pointer"
                    style={{ borderColor: simActive === (i === 1) ? GOLD : GOLD_LT, background: simActive === (i === 1) ? `linear-gradient(135deg, ${GOLD_WM}, ${GOLD_DK})` : IVORY, color: simActive === (i === 1) ? IVORY : SMOKE }}>
                    {label}
                  </button>
                ))}
              </div>
              {simActive && <div className="mt-2.5 text-[11px] text-gold-dk italic leading-relaxed font-serif">{selTx.effect}</div>}
            </LuxCard>
          </div>

          {/* Treatment details */}
          <div className="flex-1 min-w-[250px]">
            <LuxCard>
              <div className="flex items-center gap-3 mb-3.5">
                <span className="text-2xl">{selTx.icon}</span>
                <div>
                  <div className="text-[17px] font-serif text-char">{selTx.name}</div>
                  <div className="text-[9px] text-gold tracking-[3px] uppercase mt-0.5">Aesthetic Treatment</div>
                </div>
              </div>
              <Divider />
              {[
                { label: "How It Works", value: selTx.how, icon: "⚙" },
                { label: "Ideal For", value: selTx.ideal, icon: "✅" },
                { label: "Recovery", value: selTx.recovery, icon: "🕐" },
                { label: "Expected Results", value: selTx.results, icon: "🌟" },
              ].map((r, i) => (
                <div key={i} className="border-t border-gold-lt pt-3 mt-3">
                  <SecLabel icon={r.icon} text={r.label} />
                  <div className="text-[12.5px] text-smoke leading-relaxed">{r.value}</div>
                </div>
              ))}
            </LuxCard>
          </div>
        </div>
      )}
    </div>
  );
}
