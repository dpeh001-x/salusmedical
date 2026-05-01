"""Strip a (near-)white background from an image and save as PNG with alpha.

Usage:
    py scripts/strip-white-bg.py <input> [output] [--threshold 240]

Defaults: output is the input with `.png` extension; threshold = 240 (0-255).
A pixel is considered "white" when min(R,G,B) >= threshold. Soft alpha is used
near the threshold to keep edges clean.
"""

from __future__ import annotations

import argparse
import os
import sys
from PIL import Image


def strip_white(img: Image.Image, threshold: int = 240, soft: int = 16) -> Image.Image:
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    soft = max(1, soft)
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            m = min(r, g, b)
            if m >= threshold:
                px[x, y] = (r, g, b, 0)
            elif m >= threshold - soft:
                # Soft fade — alpha falls off linearly as we approach white
                ratio = (m - (threshold - soft)) / soft
                new_a = int(a * (1 - ratio))
                px[x, y] = (r, g, b, new_a)
    return img


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("input", help="Path to source image")
    p.add_argument("output", nargs="?", help="Path to output PNG (default: input with .png extension)")
    p.add_argument("--threshold", type=int, default=240, help="0-255; pixels at/above this are transparent (default 240)")
    p.add_argument("--soft", type=int, default=16, help="Soft-edge width below threshold (default 16)")
    args = p.parse_args()

    if not os.path.isfile(args.input):
        print(f"input not found: {args.input}", file=sys.stderr)
        return 2

    output = args.output
    if not output:
        base, _ = os.path.splitext(args.input)
        output = base + ".transparent.png"

    img = Image.open(args.input)
    out = strip_white(img, threshold=args.threshold, soft=args.soft)
    out.save(output, optimize=True)
    print(f"wrote {output} ({out.size[0]}x{out.size[1]} RGBA)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
