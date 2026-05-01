"use client";

import { CREAM, GOLD_LT } from "../theme";

export default function Tag({
  children,
  color = "#555",
  bg = CREAM,
}: {
  children: React.ReactNode;
  color?: string;
  bg?: string;
}) {
  return (
    <span
      className="px-2.5 py-0.5 rounded-sm text-[10.5px] font-serif tracking-wide border"
      style={{ background: bg, borderColor: GOLD_LT, color }}
    >
      {children}
    </span>
  );
}
