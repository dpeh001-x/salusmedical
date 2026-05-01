"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src?: string;
  /** Higher = more video time per scroll tick. */
  sensitivity?: number;
  /** How quickly the video catches up to the target time (0..1). */
  smoothing?: number;
};

/**
 * Full-viewport cinematic video that scrubs on scroll/swipe.
 * - Scroll forward → video plays forward (faster the harder you scroll).
 * - Scroll back   → video plays in reverse.
 * - Idle          → video pauses where it is.
 *
 * Layered with a futuristic HUD on top (grid, scanline, corner brackets,
 * timecode + progress).  Renders below page content (z-index 0); panels
 * stack above with their own backgrounds.
 */
export default function CinematicVideoBackground({
  src = "/videos/seed-cinematic.mp4",
  sensitivity = 0.0035,
  smoothing = 0.18,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const targetTime = useRef(0);
  const lastDelta = useRef(0);
  const lastInputAt = useRef(0);
  const rafId = useRef<number | null>(null);
  const touchY = useRef(0);
  const touchX = useRef(0);

  const [duration, setDuration] = useState(0);
  const [hudTime, setHudTime] = useState(0);
  const [velocity, setVelocity] = useState(0); // signed: + forward, - reverse
  const [ready, setReady] = useState(false);

  /* ── load + initial state ── */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onMeta = () => {
      setDuration(v.duration || 0);
      v.pause();
      v.currentTime = 0;
      setReady(true);
    };
    if (v.readyState >= 1) onMeta();
    else v.addEventListener("loadedmetadata", onMeta);
    return () => v.removeEventListener("loadedmetadata", onMeta);
  }, []);

  /* ── input handlers (wheel + touch) ── */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const pushDelta = (delta: number) => {
      if (!duration) return;
      const next = Math.max(
        0,
        Math.min(duration, targetTime.current + delta * sensitivity),
      );
      targetTime.current = next;
      lastDelta.current = delta;
      lastInputAt.current = performance.now();
    };

    const onWheel = (e: WheelEvent) => {
      // Use whichever axis dominates — page uses horizontal swipe via wheel
      // (deltaX) on trackpads and deltaY for vertical wheels.
      const d =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      pushDelta(d);
    };

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touchX.current = t.clientX;
      touchY.current = t.clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      const dx = touchX.current - t.clientX;
      const dy = touchY.current - t.clientY;
      const d = Math.abs(dx) > Math.abs(dy) ? dx : dy;
      // touch moves are large so weight them up (4×) and reset anchor
      pushDelta(d * 4);
      touchX.current = t.clientX;
      touchY.current = t.clientY;
    };
    const onKey = (e: KeyboardEvent) => {
      if (!duration) return;
      if (e.key === "ArrowRight") pushDelta(220);
      if (e.key === "ArrowLeft") pushDelta(-220);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [duration, sensitivity]);

  /* ── RAF: smoothly seek currentTime → targetTime ── */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let prev = performance.now();

    const tick = (now: number) => {
      const dt = Math.max(1, now - prev);
      prev = now;

      // Auto-decay velocity when input is idle so HUD stops animating
      const idleFor = now - lastInputAt.current;
      if (idleFor > 120) {
        lastDelta.current *= 0.86;
        if (Math.abs(lastDelta.current) < 0.05) lastDelta.current = 0;
      }

      const cur = v.currentTime;
      const diff = targetTime.current - cur;
      if (Math.abs(diff) > 0.005) {
        const step = diff * smoothing;
        // Compute realised velocity in seconds-of-video / seconds-of-realtime
        const vel = (step / dt) * 1000;
        v.currentTime = Math.max(0, Math.min(duration || 0, cur + step));
        setVelocity(vel);
      } else if (Math.abs(diff) <= 0.005) {
        setVelocity(0);
      }
      setHudTime(v.currentTime);

      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [duration, smoothing]);

  /* ── HUD helpers ── */
  const fmt = (t: number) => {
    if (!isFinite(t)) return "00:00.00";
    const m = Math.floor(t / 60).toString().padStart(2, "0");
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    const cs = Math.floor((t * 100) % 100).toString().padStart(2, "0");
    return `${m}:${s}.${cs}`;
  };
  const progress = duration ? Math.min(1, hudTime / duration) : 0;
  const dir = velocity > 0.05 ? "FWD" : velocity < -0.05 ? "REV" : "IDLE";
  const speed = Math.abs(velocity).toFixed(2);

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none bg-[#000814]"
      aria-hidden="true"
    >
      {/* ── 1. The video itself, stretched ── */}
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ── 2. Cool blue/navy colour grade ── */}
      <div
        className="absolute inset-0 mix-blend-color opacity-40"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,16,51,0.6) 0%, rgba(0,30,80,0.4) 50%, rgba(0,16,51,0.7) 100%)",
        }}
      />

      {/* ── 3. Vignette ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,8,20,0.55) 80%, rgba(0,8,20,0.9) 100%)",
        }}
      />

      {/* ── 4. Scanlines (horizontal pinstripe) ── */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(255,255,255,0.6) 2px, rgba(255,255,255,0.6) 3px)",
          mixBlendMode: "overlay",
        }}
      />

      {/* ── 5. Tech grid overlay ── */}
      <div
        className="absolute inset-0 opacity-25 hud-grid"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(201,168,76,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(201,168,76,0.18) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* ── 6. Sweeping scanline (one bright line crossing) ── */}
      <div
        className="absolute inset-x-0 h-[2px] hud-scanline"
        style={{
          top: 0,
          background:
            "linear-gradient(90deg, transparent, rgba(232,212,139,0.7) 40%, rgba(255,235,180,0.95) 50%, rgba(232,212,139,0.7) 60%, transparent)",
          boxShadow:
            "0 0 14px rgba(232,212,139,0.7), 0 0 28px rgba(232,212,139,0.4)",
        }}
      />

      {/* ── 7. Corner brackets ── */}
      <CornerBracket pos="tl" />
      <CornerBracket pos="tr" />
      <CornerBracket pos="bl" />
      <CornerBracket pos="br" />

      {/* ── 8. Top HUD strip ── */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-3 px-3 py-1 text-[9px] tracking-[3px] uppercase text-gold/80 font-mono border border-gold/20 bg-black/30 backdrop-blur-sm rounded-sm hud-glitch">
        <span className="hud-blink text-gold">●</span>
        <span>SALUS · CIN-FEED</span>
        <span className="text-gold/50">|</span>
        <span>{ready ? "LINK OK" : "LINK ··"}</span>
      </div>

      {/* ── 9. Bottom HUD: timecode + direction + progress ── */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[min(560px,80vw)] px-3 py-2 flex items-center gap-3 text-[9px] tracking-[2px] uppercase text-gold/85 font-mono border border-gold/20 bg-black/30 backdrop-blur-sm rounded-sm">
        <span className="text-gold">TC</span>
        <span className="text-[#F5F3ED]">{fmt(hudTime)}</span>
        <span className="text-gold/50">/</span>
        <span className="text-gold/60">{fmt(duration)}</span>
        <span className="flex-1 mx-2 relative h-[3px] bg-gold/15 rounded-full overflow-hidden">
          <span
            className="absolute inset-y-0 left-0 bg-gold rounded-full transition-[width] duration-75"
            style={{ width: `${progress * 100}%` }}
          />
        </span>
        <span
          className={
            "px-1.5 py-[1px] rounded-[2px] border " +
            (dir === "FWD"
              ? "border-gold/60 text-gold"
              : dir === "REV"
              ? "border-[#E8D48B]/70 text-[#E8D48B]"
              : "border-gold/20 text-gold/40")
          }
        >
          {dir} · {speed}×
        </span>
      </div>
    </div>
  );
}

function CornerBracket({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const base =
    "absolute w-10 h-10 border-gold/60 hud-corner pointer-events-none";
  const map: Record<typeof pos, string> = {
    tl: "top-3 left-3 border-t border-l",
    tr: "top-3 right-3 border-t border-r",
    bl: "bottom-3 left-3 border-b border-l",
    br: "bottom-3 right-3 border-b border-r",
  };
  return (
    <div
      className={`${base} ${map[pos]}`}
      style={{
        boxShadow:
          "inset 0 0 24px -16px rgba(232,212,139,0.5), 0 0 12px -4px rgba(201,168,76,0.4)",
      }}
    />
  );
}
