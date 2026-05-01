"use client";

import { CHAR, CREAM, GOLD, GOLD_DK, GOLD_LT, GOLD_WM, IVORY, SMOKE } from "../theme";

const zones = [
  { id: "forehead", label: "Forehead", emoji: "👆" },
  { id: "eyes", label: "Eyes / Under-eye", emoji: "👁" },
  { id: "nose", label: "Nose", emoji: "👃" },
  { id: "cheeks", label: "Cheeks", emoji: "🤗" },
  { id: "chin", label: "Chin / Jawline", emoji: "💠" },
  { id: "all", label: "All over", emoji: "🔄" },
];

export default function ZoneDiagram({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (zones: string[]) => void;
}) {
  const toggle = (id: string) => {
    if (id === "all") {
      onChange(selected.includes("all") ? [] : ["all"]);
      return;
    }
    let next = selected.filter(s => s !== "all");
    next = next.includes(id) ? next.filter(s => s !== id) : [...next, id];
    onChange(next);
  };

  const isActive = (id: string) => selected.includes("all") || selected.includes(id);

  return (
    <div className="mb-6">
      <div className="text-[12.5px] font-bold text-char font-serif mb-1">
        13. Which zones concern you most?
      </div>
      <div className="text-[11px] text-smoke mb-3">
        Tap zones on the face or use the buttons. Select multiple.
      </div>
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        {/* SVG Face */}
        <div
          className="shrink-0 w-full sm:w-[180px] rounded border p-3 text-center"
          style={{ background: CREAM, borderColor: GOLD_LT }}
        >
          <div className="text-[9px] text-smoke tracking-[2px] uppercase mb-2 font-serif">
            Tap to select
          </div>
          <svg viewBox="0 0 160 200" width="160" height="200" className="block mx-auto cursor-pointer">
            <defs>
              <radialGradient id="fzbg" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FFF8EF" />
                <stop offset="100%" stopColor="#F0D8B8" />
              </radialGradient>
            </defs>
            <polygon points="52,52 44,75 42,100 48,130 58,155 80,168 102,155 112,130 118,100 116,75 108,52 80,46" fill="url(#fzbg)" stroke={GOLD_DK} strokeWidth="1" strokeLinejoin="round" />
            <path d="M52,52 Q80,18 108,52" fill="none" stroke={GOLD_DK} strokeWidth="1.2" strokeLinecap="round" />
            <polygon points="72,38 80,24 88,38 80,42" fill={CREAM} stroke={GOLD_DK} strokeWidth="0.8" strokeLinejoin="round" />
            <line x1="54" y1="88" x2="72" y2="84" stroke={CHAR} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="88" y1="84" x2="106" y2="88" stroke={CHAR} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M54,95 Q63,88 72,95 Q63,102 54,95 Z" fill="#EAD8C0" stroke={CHAR} strokeWidth="0.9" />
            <circle cx="63" cy="95" r="4" fill="#6B4C2A" /><circle cx="63" cy="95" r="1.6" fill="#1A0E00" /><circle cx="65" cy="93.5" r="0.9" fill="white" />
            <path d="M88,95 Q97,88 106,95 Q97,102 88,95 Z" fill="#EAD8C0" stroke={CHAR} strokeWidth="0.9" />
            <circle cx="97" cy="95" r="4" fill="#6B4C2A" /><circle cx="97" cy="95" r="1.6" fill="#1A0E00" /><circle cx="99" cy="93.5" r="0.9" fill="white" />
            <line x1="72" y1="86" x2="70" y2="112" stroke={CHAR} strokeWidth="0.7" strokeLinecap="round" opacity="0.6" />
            <line x1="88" y1="86" x2="90" y2="112" stroke={CHAR} strokeWidth="0.7" strokeLinecap="round" opacity="0.6" />
            <path d="M66,116 Q70,120 80,122 Q90,120 94,116 Q90,112 80,111 Q70,112 66,116 Z" fill="none" stroke={CHAR} strokeWidth="0.8" />
            <path d="M66,133 Q73,126 78,130 Q80,124 82,130 Q87,126 94,133" fill="none" stroke={CHAR} strokeWidth="1.1" strokeLinejoin="round" />
            <path d="M66,133 Q72,143 80,145 Q88,143 94,133" fill="none" stroke={CHAR} strokeWidth="0.9" />
            {/* Clickable zones */}
            <ellipse cx="80" cy="66" rx="36" ry="14" fill={isActive("forehead") ? GOLD : "transparent"} fillOpacity={isActive("forehead") ? 0.3 : 0} stroke={isActive("forehead") ? GOLD : GOLD_LT} strokeWidth={isActive("forehead") ? 1.5 : 0.8} strokeDasharray={isActive("forehead") ? "none" : "3 2"} onClick={() => toggle("forehead")} style={{ cursor: "pointer" }} />
            {[{ cx: 63, cy: 94, rx: 14, ry: 9 }, { cx: 97, cy: 94, rx: 14, ry: 9 }].map((p, pi) => (
              <ellipse key={pi} cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry} fill={isActive("eyes") ? GOLD : "transparent"} fillOpacity={isActive("eyes") ? 0.25 : 0} stroke={isActive("eyes") ? GOLD : GOLD_LT} strokeWidth={isActive("eyes") ? 1.5 : 0.8} strokeDasharray={isActive("eyes") ? "none" : "3 2"} onClick={() => toggle("eyes")} style={{ cursor: "pointer" }} />
            ))}
            <ellipse cx="80" cy="116" rx="16" ry="14" fill={isActive("nose") ? GOLD : "transparent"} fillOpacity={isActive("nose") ? 0.25 : 0} stroke={isActive("nose") ? GOLD : GOLD_LT} strokeWidth={isActive("nose") ? 1.5 : 0.8} strokeDasharray={isActive("nose") ? "none" : "3 2"} onClick={() => toggle("nose")} style={{ cursor: "pointer" }} />
            {[{ cx: 49, cy: 118, rx: 17, ry: 22 }, { cx: 111, cy: 118, rx: 17, ry: 22 }].map((p, pi) => (
              <ellipse key={pi} cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry} fill={isActive("cheeks") ? GOLD : "transparent"} fillOpacity={isActive("cheeks") ? 0.25 : 0} stroke={isActive("cheeks") ? GOLD : GOLD_LT} strokeWidth={isActive("cheeks") ? 1.5 : 0.8} strokeDasharray={isActive("cheeks") ? "none" : "3 2"} onClick={() => toggle("cheeks")} style={{ cursor: "pointer" }} />
            ))}
            <ellipse cx="80" cy="155" rx="26" ry="16" fill={isActive("chin") ? GOLD : "transparent"} fillOpacity={isActive("chin") ? 0.25 : 0} stroke={isActive("chin") ? GOLD : GOLD_LT} strokeWidth={isActive("chin") ? 1.5 : 0.8} strokeDasharray={isActive("chin") ? "none" : "3 2"} onClick={() => toggle("chin")} style={{ cursor: "pointer" }} />
            {/* Labels */}
            {isActive("forehead") && <text x="80" y="70" textAnchor="middle" fontSize="7" fill={GOLD_DK} fontFamily="Georgia,serif" fontWeight="bold">Forehead</text>}
            {isActive("eyes") && <text x="80" y="107" textAnchor="middle" fontSize="7" fill={GOLD_DK} fontFamily="Georgia,serif" fontWeight="bold">Eyes</text>}
            {isActive("nose") && <text x="80" y="119" textAnchor="middle" fontSize="6.5" fill={GOLD_DK} fontFamily="Georgia,serif" fontWeight="bold">Nose</text>}
            {isActive("cheeks") && <><text x="49" y="141" textAnchor="middle" fontSize="6.5" fill={GOLD_DK} fontFamily="Georgia,serif" fontWeight="bold">Cheeks</text><text x="111" y="141" textAnchor="middle" fontSize="6.5" fill={GOLD_DK} fontFamily="Georgia,serif" fontWeight="bold">Cheeks</text></>}
            {isActive("chin") && <text x="80" y="158" textAnchor="middle" fontSize="6.5" fill={GOLD_DK} fontFamily="Georgia,serif" fontWeight="bold">Chin</text>}
          </svg>
        </div>
        {/* Buttons */}
        <div className="flex-1 min-w-[160px] w-full">
          <div className="flex flex-col gap-1.5">
            {zones.map(z => {
              const active = selected.includes(z.id) || (z.id !== "all" && selected.includes("all")) || (z.id === "all" && selected.includes("all"));
              return (
                <button
                  key={z.id}
                  onClick={() => toggle(z.id)}
                  className="py-2 px-3.5 rounded-sm border-[1.5px] cursor-pointer text-xs font-serif flex items-center gap-2 text-left transition-all"
                  style={{
                    borderColor: active ? GOLD : GOLD_LT,
                    background: active ? `linear-gradient(135deg, ${GOLD_WM}22, ${GOLD_LT}40)` : IVORY,
                    color: active ? GOLD_DK : SMOKE,
                  }}
                >
                  <span>{z.emoji}</span>
                  <span className="flex-1">{z.label}</span>
                  {active && <span className="text-sm text-gold">{"✓"}</span>}
                </button>
              );
            })}
          </div>
          {selected.length > 0 && (
            <div
              className="mt-2.5 py-2 px-3 rounded-sm border text-[11px] font-serif"
              style={{ background: CREAM, borderColor: GOLD_LT, color: GOLD_DK }}
            >
              {"✓"} {selected.includes("all")
                ? "All zones"
                : selected.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
