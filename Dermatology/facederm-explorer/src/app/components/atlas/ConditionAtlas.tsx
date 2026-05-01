"use client";

import { useState } from "react";
import { CHAR, CREAM, GOLD, GOLD_DK, GOLD_LT, GOLD_WM, IVORY, IVORY2, SMOKE } from "../theme";
import LuxCard from "../ui/LuxCard";
import Divider from "../ui/Divider";
import SecLabel from "../ui/SecLabel";
import SkinLayerDiagram from "./SkinLayerDiagram";
import { allConditions, categoryColors, type Condition } from "../analyser/data";

export default function ConditionAtlas() {
  const [sel, setSel] = useState<Condition | null>(null);
  const [filter, setFilter] = useState("All");
  const cats = ["All", ...Array.from(new Set(allConditions.map(c => c.category)))];
  const filtered = filter === "All" ? allConditions : allConditions.filter(c => c.category === filter);

  return (
    <div className="max-w-[840px] mx-auto py-8 px-4 sm:px-5">
      {/* Disclaimer */}
      <div className="bg-gradient-to-r from-ivory2 to-ivory border border-gold-lt rounded p-4 mb-6 flex gap-3 items-start">
        <span className="text-lg">{"⚕"}</span>
        <div className="text-xs text-smoke leading-relaxed">
          For <strong className="text-char">educational awareness only</strong>. Please consult an <strong className="text-char">experienced skincare doctor</strong> for accurate diagnosis and treatment.
        </div>
      </div>

      {!sel && (
        <>
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap mb-5 justify-center">
            {cats.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className="py-1.5 px-4 rounded-sm border cursor-pointer text-[11px] font-serif tracking-wide transition-all"
                style={{ borderColor: filter === cat ? GOLD : GOLD_LT, background: filter === cat ? `linear-gradient(135deg, ${GOLD_WM}, ${GOLD_DK})` : IVORY, color: filter === cat ? IVORY : SMOKE }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Condition grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((c, i) => (
              <div key={i} onClick={() => setSel(c)}
                className="bg-gradient-to-br from-ivory to-ivory2 border border-gold-lt rounded p-4 cursor-pointer transition-all hover:border-gold hover:-translate-y-0.5">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="text-xl">{c.emoji}</span>
                  <div>
                    <div className="text-[12.5px] font-bold text-char font-serif">{c.name}</div>
                    <span className="text-[9px] py-0.5 px-1.5 rounded-sm border tracking-wide" style={{ background: CREAM, borderColor: GOLD_LT, color: categoryColors[c.category] || GOLD_DK }}>{c.category}</span>
                  </div>
                </div>
                <div className="text-[11.5px] text-smoke leading-relaxed">{c.desc.substring(0, 90)}{"…"}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {sel && (
        <div className="animate-fade-in">
          <button onClick={() => setSel(null)}
            className="bg-transparent border-none text-gold-dk cursor-pointer text-[11px] mb-4 p-0 font-serif tracking-[1.5px] uppercase">
            {"←"} Return to Library
          </button>
          <LuxCard>
            <div className="flex items-center gap-3.5 mb-2.5">
              <span className="text-3xl">{sel.emoji}</span>
              <div>
                <div className="text-lg font-bold font-serif text-char">{sel.name}</div>
                <span className="text-[9px] py-0.5 px-2 rounded-sm border tracking-wider" style={{ background: CREAM, borderColor: GOLD_LT, color: categoryColors[sel.category] || GOLD_DK }}>{sel.category}</span>
              </div>
            </div>
            <Divider />
            <p className="text-smoke leading-relaxed text-[12.5px] mt-2.5">{sel.desc}</p>

            {/* Skin layer diagram */}
            <div className="mt-4 mb-4">
              <SecLabel icon="🔬" text="Skin Layer Affected" />
              <div className="rounded p-2.5 border" style={{ background: CREAM, borderColor: GOLD_LT }}>
                <SkinLayerDiagram affectedLayer={sel.affectedLayer} />
              </div>
            </div>

            {[
              { label: "Common Triggers", value: sel.triggers, icon: "⚠" },
              { label: "Clinical Presentation", value: sel.appearance, icon: "🔍" },
            ].map((r, i) => (
              <div key={i} className="border-t border-gold-lt pt-3 mt-3">
                <SecLabel icon={r.icon} text={r.label} />
                <div className="text-[12.5px] text-smoke leading-relaxed">{r.value}</div>
              </div>
            ))}

            {/* Clinical note */}
            <div className="mt-4 p-3.5 rounded border-l-[3px]" style={{ background: `linear-gradient(135deg, ${CREAM}, ${IVORY})`, border: `1px solid ${GOLD}`, borderLeftWidth: 3 }}>
              <SecLabel icon="⚕" text="Clinical Note" />
              <div className="text-[12.5px] text-smoke leading-relaxed italic">{sel.note}</div>
              <div className="mt-2 text-[11.5px] text-gold-dk font-serif">Always consult an experienced skincare doctor for diagnosis and treatment.</div>
            </div>
          </LuxCard>
        </div>
      )}
    </div>
  );
}
