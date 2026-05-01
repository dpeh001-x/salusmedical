"""Strip the white background off a logo, save as transparent PNG.

Usage:
    py scripts/remove-white-bg.py <input> [<output>] [--threshold N] [--feather N]

If output is omitted, writes alongside input with .transparent.png suffix.
Anti-aliased: pixels darken into transparency near the threshold so edges stay smooth.
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image


def remove_white(
    src: Path,
    dst: Path,
    threshold: int = 235,
    feather: int = 18,
) -> None:
    img = Image.open(src).convert("RGBA")
    pixels = img.load()
    w, h = img.size

    # cutoff range over which alpha fades from 255 -> 0
    fade_start = max(0, threshold - feather)

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            # how "white" is this pixel? min channel as a quick proxy
            min_ch = min(r, g, b)
            if min_ch >= threshold:
                pixels[x, y] = (r, g, b, 0)
            elif min_ch > fade_start:
                # smoothstep alpha fade
                t = (threshold - min_ch) / max(feather, 1)
                pixels[x, y] = (r, g, b, int(255 * t))

    img.save(dst, "PNG", optimize=True)
    print(f"wrote {dst} ({w}x{h})")


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print(__doc__)
        return 1

    threshold = 235
    feather = 18
    args: list[str] = []
    i = 1
    while i < len(argv):
        a = argv[i]
        if a == "--threshold":
            threshold = int(argv[i + 1])
            i += 2
        elif a == "--feather":
            feather = int(argv[i + 1])
            i += 2
        else:
            args.append(a)
            i += 1

    if not args:
        print("error: missing input path")
        return 1

    src = Path(args[0])
    if not src.exists():
        print(f"error: {src} not found")
        return 1

    dst = Path(args[1]) if len(args) > 1 else src.with_suffix(".transparent.png")
    remove_white(src, dst, threshold=threshold, feather=feather)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
