"use client";

import { CHAR, CREAM, GOLD, GOLD_DK, IVORY } from "../theme";
import type { Treatment } from "../analyser/data";

export default function FaceLight({
  selTx,
  simActive,
}: {
  selTx: Treatment | null;
  simActive: boolean;
}) {
  return (
    <svg viewBox="0 0 160 200" width="160" height="200" className="block mx-auto">
      <defs>
        <radialGradient id="flt" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFF8EF" />
          <stop offset="100%" stopColor="#F0D8B8" />
        </radialGradient>
      </defs>
      <polygon points="52,52 44,75 42,100 48,130 58,155 80,168 102,155 112,130 118,100 116,75 108,52 80,46" fill="url(#flt)" stroke={GOLD_DK} strokeWidth="1" strokeLinejoin="round" />
      <path d="M52,52 Q80,18 108,52" fill="none" stroke={GOLD_DK} strokeWidth="1.2" strokeLinecap="round" />
      <polygon points="72,38 80,24 88,38 80,42" fill={CREAM} stroke={GOLD_DK} strokeWidth="0.8" strokeLinejoin="round" />
      <line x1="54" y1="88" x2="72" y2="84" stroke={CHAR} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="88" y1="84" x2="106" y2="88" stroke={CHAR} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M54,95 Q63,88 72,95 Q63,102 54,95 Z" fill="#EAD8C0" stroke={CHAR} strokeWidth="0.9" />
      <circle cx="63" cy="95" r="4" fill="#6B4C2A" /><circle cx="63" cy="95" r="1.6" fill="#1A0E00" /><circle cx="65" cy="93.5" r="0.9" fill="white" />
      <path d="M88,95 Q97,88 106,95 Q97,102 88,95 Z" fill="#EAD8C0" stroke={CHAR} strokeWidth="0.9" />
      <circle cx="97" cy="95" r="4" fill="#6B4C2A" /><circle cx="97" cy="95" r="1.6" fill="#1A0E00" /><circle cx="99" cy="93.5" r="0.9" fill="white" />
      <path d="M66,116 Q70,120 80,122 Q90,120 94,116 Q90,112 80,111 Q70,112 66,116 Z" fill="none" stroke={GOLD_DK} strokeWidth="0.8" />
      <path d="M66,133 Q73,126 78,130 Q80,124 82,130 Q87,126 94,133" fill="none" stroke={CHAR} strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M66,133 Q72,143 80,145 Q88,143 94,133" fill="none" stroke={CHAR} strokeWidth="0.9" />
      {!simActive && (
        <>
          <circle cx="58" cy="118" r="3" fill="#D08070" opacity="0.7" />
          <circle cx="102" cy="112" r="2.5" fill="#D08070" opacity="0.6" />
          <circle cx="72" cy="140" r="2" fill="#C07060" opacity="0.5" />
        </>
      )}
      {simActive && selTx?.zones.includes("forehead") && <ellipse cx="80" cy="66" rx="36" ry="14" fill={GOLD} fillOpacity="0.18" stroke={GOLD} strokeWidth="0.5" strokeDasharray="3 2" />}
      {simActive && selTx?.zones.includes("cheeks") && (
        <>
          <ellipse cx="54" cy="125" rx="18" ry="20" fill={GOLD} fillOpacity="0.16" stroke={GOLD} strokeWidth="0.5" strokeDasharray="3 2" />
          <ellipse cx="106" cy="125" rx="18" ry="20" fill={GOLD} fillOpacity="0.16" stroke={GOLD} strokeWidth="0.5" strokeDasharray="3 2" />
        </>
      )}
      {simActive && selTx?.zones.includes("nose") && <ellipse cx="80" cy="116" rx="16" ry="14" fill={GOLD} fillOpacity="0.16" stroke={GOLD} strokeWidth="0.5" strokeDasharray="3 2" />}
      {simActive && selTx?.zones.includes("chin") && <ellipse cx="80" cy="155" rx="26" ry="16" fill={GOLD} fillOpacity="0.16" stroke={GOLD} strokeWidth="0.5" strokeDasharray="3 2" />}
      {simActive && selTx?.zones.includes("eyes") && (
        <>
          <ellipse cx="63" cy="97" rx="14" ry="9" fill={GOLD} fillOpacity="0.18" stroke={GOLD} strokeWidth="0.5" strokeDasharray="3 2" />
          <ellipse cx="97" cy="97" rx="14" ry="9" fill={GOLD} fillOpacity="0.18" stroke={GOLD} strokeWidth="0.5" strokeDasharray="3 2" />
        </>
      )}
    </svg>
  );
}
