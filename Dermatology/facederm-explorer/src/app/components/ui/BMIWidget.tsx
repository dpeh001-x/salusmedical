"use client";

import { CHAR, CREAM, GOLD_DK, GOLD_LT, IVORY, SMOKE } from "../theme";

const calcBMI = (kg: string, cm: string) => {
  const k = parseFloat(kg);
  const c = parseFloat(cm);
  if (!k || !c || c === 0) return null;
  const m = c / 100;
  return (k / (m * m)).toFixed(1);
};

const bmiCategory = (bmi: string | null) => {
  if (!bmi) return null;
  const b = parseFloat(bmi);
  if (b < 18.5) return { label: "Underweight", color: "#4070B0" };
  if (b < 23) return { label: "Normal (Asian range)", color: "#3A7050" };
  if (b < 25) return { label: "Overweight (Asian range)", color: GOLD_DK };
  if (b < 30) return { label: "Obese Class I", color: "#C04050" };
  return { label: "Obese Class II+", color: "#A02030" };
};

const bmiBarPct = (bmi: string) => Math.min(100, Math.max(0, ((parseFloat(bmi) - 14) / (40 - 14)) * 100));

export { calcBMI, bmiCategory };

export default function BMIWidget({
  weight,
  height,
  onWeightChange,
  onHeightChange,
}: {
  weight: string;
  height: string;
  onWeightChange: (v: string) => void;
  onHeightChange: (v: string) => void;
}) {
  const bmi = calcBMI(weight, height);
  const cat = bmiCategory(bmi);
  const pct = bmi ? bmiBarPct(bmi) : 0;

  return (
    <div>
      <div className="flex gap-3 mb-3.5">
        <div className="flex-1">
          <div className="text-[10px] text-smoke tracking-[1.5px] uppercase font-serif mb-1.5">Weight (kg)</div>
          <input
            type="number"
            min="30"
            max="200"
            value={weight}
            placeholder="e.g. 65"
            onChange={e => onWeightChange(e.target.value)}
            className="w-full p-2.5 rounded-sm border text-sm text-center font-serif outline-none"
            style={{ borderColor: GOLD_LT, background: IVORY, color: CHAR }}
          />
        </div>
        <div className="flex-1">
          <div className="text-[10px] text-smoke tracking-[1.5px] uppercase font-serif mb-1.5">Height (cm)</div>
          <input
            type="number"
            min="100"
            max="220"
            value={height}
            placeholder="e.g. 165"
            onChange={e => onHeightChange(e.target.value)}
            className="w-full p-2.5 rounded-sm border text-sm text-center font-serif outline-none"
            style={{ borderColor: GOLD_LT, background: IVORY, color: CHAR }}
          />
        </div>
      </div>
      {bmi && cat && (
        <div
          className="p-3.5 rounded-sm border"
          style={{ background: CREAM, borderColor: GOLD_LT }}
        >
          <div className="flex justify-between items-center mb-2.5 flex-wrap gap-2">
            <div>
              <span className="text-[10px] text-smoke tracking-[1.5px] uppercase font-serif">BMI  </span>
              <span className="text-xl font-bold text-char font-serif">{bmi}</span>
            </div>
            <span
              className="py-1 px-3 rounded-sm text-[11px] font-serif font-bold border"
              style={{ background: IVORY, borderColor: GOLD_LT, color: cat.color }}
            >
              {cat.label}
            </span>
          </div>
          <div className="relative h-2 rounded-full mb-1.5" style={{ background: `linear-gradient(to right, #4070B0 0%, #3A7050 28%, ${GOLD_DK} 52%, #C04050 72%, #A02030 100%)` }}>
            <div
              className="absolute -top-1 w-4 h-4 rounded-full -translate-x-1/2"
              style={{
                left: `${pct}%`,
                background: IVORY,
                border: `2.5px solid ${cat.color}`,
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-smoke opacity-70">
            <span>14</span><span>18.5</span><span>23</span><span>25</span><span>30</span><span>40</span>
          </div>
          <div
            className="mt-2 text-[10.5px] text-smoke leading-relaxed pl-2 border-l-2"
            style={{ borderColor: GOLD_LT }}
          >
            {parseFloat(bmi) >= 25
              ? "Higher BMI is associated with increased sebum production and inflammatory acne. Weight management may benefit skin health."
              : parseFloat(bmi) < 18.5
                ? "Lower BMI may reduce skin barrier lipids. Focus on barrier-supportive ingredients and adequate nutrition for skin repair."
                : "Your BMI is in a healthy range. Maintain through balanced diet and activity for optimal skin health."}
          </div>
        </div>
      )}
    </div>
  );
}
