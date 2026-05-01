"use client";

import { CHAR, CREAM, GOLD, GOLD_DK, GOLD_LT, GOLD_WM, IVORY, SMOKE, sliderBg } from "../theme";

interface SliderQuestionProps {
  qNum: number;
  label: string;
  options: string[];
  value: number | null;
  onChange: (val: number) => void;
  icons?: string[];
}

export default function SliderQuestion({ qNum, label, options, value, onChange, icons }: SliderQuestionProps) {
  const idx = value !== null && value !== undefined ? value : Math.floor(options.length / 2);
  return (
    <div className="mb-6">
      <div className="text-[12.5px] font-bold text-char font-serif mb-3">
        {qNum}. {label}
      </div>
      <div
        className="p-3 sm:p-4 rounded-sm border"
        style={{
          background: CREAM,
          borderColor: value !== null && value !== undefined ? GOLD : GOLD_LT,
        }}
      >
        <div className="flex justify-between items-center mb-3 gap-2">
          <div className="text-[11px] text-smoke font-serif opacity-70 hidden sm:block">Slide to select</div>
          <div
            className="py-1 px-3 rounded-sm text-[11.5px] font-serif tracking-wide text-right max-w-[70%] sm:max-w-[60%]"
            style={{
              background: `linear-gradient(135deg, ${GOLD_WM}, ${GOLD_DK})`,
              color: IVORY,
            }}
          >
            {icons && icons[idx] ? `${icons[idx]} ` : ""}{options[idx]}
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={options.length - 1}
          step={1}
          value={idx}
          onChange={e => onChange(parseInt(e.target.value))}
          style={{ background: sliderBg(idx, 0, options.length - 1) }}
          className="mb-2"
        />
        <div className="flex justify-between mt-1">
          {options.map((o, i) => (
            <div
              key={i}
              className="flex flex-col items-center flex-1 cursor-pointer"
              onClick={() => onChange(i)}
            >
              <div
                className="w-0.5 h-1.5 rounded-sm mb-0.5"
                style={{ background: i === idx ? GOLD : GOLD_LT }}
              />
              {icons && <div className="text-sm mb-0.5" style={{ opacity: i === idx ? 1 : 0.4 }}>{icons[i]}</div>}
              <div
                className="text-[7px] sm:text-[8px] text-center leading-tight font-serif max-w-[52px] break-words"
                style={{ color: i === idx ? GOLD_DK : SMOKE, opacity: i === idx ? 1 : 0.6 }}
              >
                {o.length > 18 ? o.substring(0, 15) + "…" : o}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
