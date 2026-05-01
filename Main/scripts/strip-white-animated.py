"""Strip near-white background from every frame of an animated GIF and save
as an animated WebP (and/or APNG) with alpha preserved.

Usage:
    py scripts/strip-white-animated.py <input.gif> [--out-webp path] [--out-png path]
                                        [--threshold 240] [--soft 18]
                                        [--quality 88] [--method 6]
                                        [--every 1]

The default outputs are next to the input with `.webp` / `.apng` extensions.
`--every N` keeps every Nth frame (useful to shrink large gifs).
"""

from __future__ import annotations

import argparse
import os
import sys
from PIL import Image


def strip_white_frame(rgba: Image.Image, threshold: int, soft: int) -> Image.Image:
    px = rgba.load()
    w, h = rgba.size
    soft = max(1, soft)
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            m = min(r, g, b)
            if m >= threshold:
                px[x, y] = (r, g, b, 0)
            elif m >= threshold - soft:
                ratio = (m - (threshold - soft)) / soft
                new_a = int(a * (1 - ratio))
                px[x, y] = (r, g, b, new_a)
    return rgba


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("input", help="Path to animated GIF")
    p.add_argument("--out-webp", help="Output path for animated WebP")
    p.add_argument("--out-png", help="Output path for APNG")
    p.add_argument("--threshold", type=int, default=240)
    p.add_argument("--soft", type=int, default=18)
    p.add_argument("--quality", type=int, default=88)
    p.add_argument("--method", type=int, default=6, help="WebP encoder method 0-6 (slower = better)")
    p.add_argument("--every", type=int, default=1, help="Keep every Nth frame (default 1)")
    args = p.parse_args()

    if not os.path.isfile(args.input):
        print(f"input not found: {args.input}", file=sys.stderr)
        return 2

    base, _ = os.path.splitext(args.input)
    out_webp = args.out_webp or (base + ".webp")
    out_png = args.out_png  # may be None

    src = Image.open(args.input)
    n = getattr(src, "n_frames", 1)
    print(f"input: {args.input}  size={src.size}  frames={n}")

    frames = []
    durations = []
    for i in range(n):
        if i % args.every != 0:
            continue
        src.seek(i)
        rgba = src.convert("RGBA")
        out = strip_white_frame(rgba, args.threshold, args.soft)
        frames.append(out)
        # GIF stores per-frame duration in `info["duration"]`
        durations.append(src.info.get("duration", 60))

    if not frames:
        print("no frames produced", file=sys.stderr)
        return 1

    # ── animated WebP ──
    frames[0].save(
        out_webp,
        format="WEBP",
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0,
        quality=args.quality,
        method=args.method,
        lossless=False,
    )
    print(f"wrote {out_webp}  ({len(frames)} frames, ~{os.path.getsize(out_webp)//1024} KB)")

    # ── optional APNG ──
    if out_png:
        frames[0].save(
            out_png,
            format="PNG",
            save_all=True,
            append_images=frames[1:],
            duration=durations,
            loop=0,
        )
        print(f"wrote {out_png}  ({len(frames)} frames, ~{os.path.getsize(out_png)//1024} KB)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
