"use client";

import Image from "next/image";
import { useMemo } from "react";

type Props = {
  src?: string;
  alt?: string;
};

const EMBERS = [
  { left: "8%",  size: 2.5, delay: 0,    duration: 18, opacity: 0.55 },
  { left: "14%", size: 1.5, delay: 6,    duration: 22, opacity: 0.4  },
  { left: "22%", size: 3,   delay: 11,   duration: 24, opacity: 0.6  },
  { left: "31%", size: 2,   delay: 3,    duration: 20, opacity: 0.45 },
  { left: "39%", size: 1.5, delay: 14,   duration: 26, opacity: 0.35 },
  { left: "46%", size: 2.5, delay: 8,    duration: 19, opacity: 0.55 },
  { left: "54%", size: 1.5, delay: 1,    duration: 23, opacity: 0.4  },
  { left: "61%", size: 3,   delay: 12,   duration: 21, opacity: 0.65 },
  { left: "68%", size: 2,   delay: 5,    duration: 25, opacity: 0.5  },
  { left: "75%", size: 1.5, delay: 9,    duration: 18, opacity: 0.4  },
  { left: "83%", size: 2.5, delay: 15,   duration: 22, opacity: 0.55 },
  { left: "90%", size: 1.5, delay: 2,    duration: 20, opacity: 0.45 },
];

export default function HeroCinematic({
  src = "/images/hero-cinematic.png",
  alt = "",
}: Props) {
  const embers = useMemo(() => EMBERS, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Layer 1 — Ken Burns base image with subtle shimmer */}
      <div className="absolute inset-0 cinematic-kenburns cinematic-shimmer">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Layer 2 — Deep navy darken to lift the gold in the image */}
      <div className="absolute inset-0 bg-[#001033]/55 mix-blend-multiply" />

      {/* Layer 3 — Aurora colour-grade (subtle moving gold/teal) */}
      <div
        className="absolute inset-0 mix-blend-soft-light cinematic-aurora opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(201,168,76,0.18), rgba(0,30,80,0) 35%, rgba(50,140,200,0.10) 65%, rgba(201,168,76,0.16))",
        }}
      />

      {/* Layer 4 — Bokeh drift A (large soft golden orbs) */}
      <div
        className="absolute inset-0 cinematic-bokeh-a opacity-60"
        style={{
          backgroundImage: `
            radial-gradient(circle at 18% 78%, rgba(232,212,139,0.16), transparent 9%),
            radial-gradient(circle at 72% 88%, rgba(232,212,139,0.20), transparent 7%),
            radial-gradient(circle at 88% 62%, rgba(232,212,139,0.10), transparent 8%),
            radial-gradient(circle at 8% 40%, rgba(232,212,139,0.08), transparent 6%)
          `,
        }}
      />

      {/* Layer 5 — Bokeh drift B (smaller sharper sparks) */}
      <div
        className="absolute inset-0 cinematic-bokeh-b opacity-70"
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 84%, rgba(255,225,150,0.45), transparent 1.6%),
            radial-gradient(circle at 55% 90%, rgba(255,225,150,0.55), transparent 1.2%),
            radial-gradient(circle at 78% 80%, rgba(255,225,150,0.35), transparent 1.5%),
            radial-gradient(circle at 42% 70%, rgba(255,225,150,0.30), transparent 1%),
            radial-gradient(circle at 65% 60%, rgba(255,225,150,0.25), transparent 0.9%),
            radial-gradient(circle at 22% 55%, rgba(255,225,150,0.20), transparent 0.8%)
          `,
        }}
      />

      {/* Layer 6 — Pulsing gold halo behind hero subject */}
      <div
        className="absolute inset-0 cinematic-halo"
        style={{
          background:
            "radial-gradient(ellipse 35% 45% at 60% 45%, rgba(201,168,76,0.28), rgba(201,168,76,0.08) 35%, transparent 65%)",
        }}
      />

      {/* Layer 7 — Sweeping light ray (god-ray) */}
      <div className="absolute inset-y-[-20%] -left-1/3 right-0 cinematic-light-sweep">
        <div
          className="h-full w-[35vw] blur-2xl"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(232,212,139,0.16) 40%, rgba(255,235,180,0.22) 50%, rgba(232,212,139,0.16) 60%, transparent)",
          }}
        />
      </div>

      {/* Layer 8 — Floating embers (gold particles rising) */}
      <div className="absolute inset-0">
        {embers.map((e, i) => (
          <span
            key={i}
            className="absolute bottom-[-4%] rounded-full bg-[#E8D48B] cinematic-ember"
            style={{
              left: e.left,
              width: `${e.size}px`,
              height: `${e.size}px`,
              opacity: e.opacity,
              animationDelay: `${e.delay}s`,
              animationDuration: `${e.duration}s`,
              boxShadow:
                "0 0 6px rgba(232,212,139,0.7), 0 0 12px rgba(201,168,76,0.4)",
            }}
          />
        ))}
      </div>

      {/* Layer 9 — Vignette + readability gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,16,51,0.55) 80%, rgba(0,16,51,0.85) 100%)",
        }}
      />

      {/* Layer 10 — Top/bottom darkening for nav + CTA contrast */}
      <div className="absolute inset-x-0 top-0 h-[18%] bg-gradient-to-b from-[#001033]/75 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t from-[#001033]/70 to-transparent" />
    </div>
  );
}
