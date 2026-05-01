"use client";

import { GOLD, GOLD_DK, GOLD_LT, IVORY } from "../theme";

const layers = [
  { name: "Stratum Corneum", y: 18, h: 16, color: "#F0E0C8" },
  { name: "Epidermis", y: 34, h: 26, color: "#F5D0A8" },
  { name: "Dermis", y: 60, h: 44, color: "#E8C090" },
  { name: "Subcutaneous", y: 104, h: 28, color: "#F0D8A0" },
];

const layerMap: Record<string, number> = {
  surface: 0, "stratum corneum": 0, epidermis: 1, dermis: 2, subcutaneous: 3,
};

export default function SkinLayerDiagram({ affectedLayer }: { affectedLayer: string }) {
  const hi = layerMap[affectedLayer] ?? 1;
  return (
    <svg viewBox="0 0 260 142" className="w-full">
      {layers.map((l, i) => (
        <g key={i}>
          <rect x="70" y={l.y} width="130" height={l.h} rx="2" fill={i === hi ? GOLD_LT : l.color} stroke={i === hi ? GOLD : "#C8A880"} strokeWidth={i === hi ? 1.2 : 0.6} opacity={i === hi ? 1 : 0.7} />
          {i === hi && <rect x="70" y={l.y} width="130" height={l.h} rx="2" fill={GOLD} opacity="0.12" />}
          <text x="62" y={l.y + l.h / 2 + 4} textAnchor="end" fontSize="7.5" fill={i === hi ? GOLD_DK : "#999"} fontFamily="Georgia,serif">{l.name}</text>
          {i === hi && (
            <>
              <line x1="200" y1={l.y + l.h / 2} x2="218" y2={l.y + l.h / 2} stroke={GOLD} strokeWidth="1" strokeDasharray="2 2" />
              <text x="220" y={l.y + l.h / 2 + 4} fontSize="7" fill={GOLD_DK} fontFamily="Georgia,serif">{"←"} affected</text>
            </>
          )}
        </g>
      ))}
      <circle cx="135" cy={layers[hi].y + layers[hi].h / 2} r="3.5" fill={GOLD_DK} />
    </svg>
  );
}
