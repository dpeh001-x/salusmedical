"use client";

export default function SecLabel({ icon, text }: { icon?: string; text: string }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      {icon && <span className="text-xs">{icon}</span>}
      <span className="text-[9px] tracking-[3.5px] uppercase text-gold-dk font-serif">
        {text}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-gold-lt to-transparent ml-1" />
    </div>
  );
}
