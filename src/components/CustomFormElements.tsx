"use client";

import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════
   CustomSelect — replaces native <select> dropdowns
   ═══════════════════════════════════════════════════════ */
export type SelectOption = { value: string; label: string };

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left bg-white/[0.08] border border-gold/[0.1] rounded-[3px] px-3 py-[9px] text-xs text-[#F5F3ED] font-body outline-none transition-colors focus:border-gold flex items-center justify-between gap-2"
      >
        <span className={selected ? "text-[#F5F3ED]" : "text-slate-muted/50"}>
          {selected ? selected.label : placeholder || "Select..."}
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#8A9BB5"
          strokeWidth="2.5"
          className={`w-2.5 h-2.5 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div
        className={`absolute z-50 left-0 right-0 top-full mt-1 bg-[#003267] border border-gold/20 rounded shadow-lg overflow-hidden transition-all origin-top ${
          open
            ? "opacity-100 scale-y-100"
            : "opacity-0 scale-y-0 pointer-events-none"
        }`}
      >
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => {
              onChange(o.value);
              setOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-xs transition-colors ${
              o.value === value
                ? "bg-gold/20 text-gold"
                : "text-[#F5F3ED] hover:bg-white/[0.08]"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CustomDatePicker — replaces native <input type="date">
   Shows day / month / year dropdowns
   ═══════════════════════════════════════════════════════ */
const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

function daysInMonth(m: number, y: number) {
  if (!m || !y) return 31;
  return new Date(y, m, 0).getDate();
}

export function CustomDatePicker({
  value,
  onChange,
  className = "",
}: {
  value: string; // "YYYY-MM-DD" or ""
  onChange: (v: string) => void;
  className?: string;
}) {
  const parts = value ? value.split("-") : ["", "", ""];
  const year = parts[0] || "";
  const month = parts[1] || "";
  const day = parts[2] || "";

  const now = new Date();
  const curYear = now.getFullYear();
  const years: SelectOption[] = [
    { value: "", label: "Year" },
    ...Array.from({ length: 3 }, (_, i) => ({
      value: String(curYear + i),
      label: String(curYear + i),
    })),
  ];
  const months: SelectOption[] = [
    { value: "", label: "Month" },
    ...MONTHS.map((m, i) => ({
      value: String(i + 1).padStart(2, "0"),
      label: m,
    })),
  ];
  const maxDay = daysInMonth(Number(month), Number(year));
  const days: SelectOption[] = [
    { value: "", label: "Day" },
    ...Array.from({ length: maxDay }, (_, i) => ({
      value: String(i + 1).padStart(2, "0"),
      label: String(i + 1),
    })),
  ];

  const update = (field: "y" | "m" | "d", val: string) => {
    let y = year,
      m = month,
      d = day;
    if (field === "y") y = val;
    if (field === "m") m = val;
    if (field === "d") d = val;
    if (y && m && d) {
      onChange(`${y}-${m}-${d}`);
    } else {
      onChange("");
    }
  };

  return (
    <div className={`grid grid-cols-3 gap-1.5 ${className}`}>
      <CustomSelect
        value={day}
        onChange={(v) => update("d", v)}
        options={days}
        placeholder="Day"
      />
      <CustomSelect
        value={month}
        onChange={(v) => update("m", v)}
        options={months}
        placeholder="Month"
      />
      <CustomSelect
        value={year}
        onChange={(v) => update("y", v)}
        options={years}
        placeholder="Year"
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CustomNumberInput — replaces native <input type="number">
   Hides native spinner, adds +/- buttons
   ═══════════════════════════════════════════════════════ */
export function CustomNumberInput({
  value,
  onChange,
  placeholder,
  min,
  max,
  step = 1,
  className = "",
  style,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const adjust = (delta: number) => {
    const num = parseFloat(value) || 0;
    let next = +(num + delta).toFixed(10);
    if (min !== undefined && next < min) next = min;
    if (max !== undefined && next > max) next = max;
    onChange(String(next));
  };

  return (
    <div className={`relative flex items-center ${className}`} style={style}>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "" || /^-?\d*\.?\d*$/.test(v)) onChange(v);
        }}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-inherit placeholder-inherit pr-7 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex flex-col gap-0">
        <button
          type="button"
          onClick={() => adjust(step)}
          className="text-gold/60 hover:text-gold transition-colors leading-none text-[10px] px-0.5"
        >
          ▲
        </button>
        <button
          type="button"
          onClick={() => adjust(-step)}
          className="text-gold/60 hover:text-gold transition-colors leading-none text-[10px] px-0.5"
        >
          ▼
        </button>
      </div>
    </div>
  );
}
