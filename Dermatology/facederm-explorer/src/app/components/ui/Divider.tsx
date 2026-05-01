"use client";

export default function Divider({ opacity = 0.35 }: { opacity?: number }) {
  return (
    <div
      className="flex items-center gap-2.5 my-1.5"
      style={{ opacity }}
    >
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold" />
      <div className="w-1 h-1 rounded-full bg-gold shrink-0" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold" />
    </div>
  );
}
