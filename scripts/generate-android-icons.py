#!/usr/bin/env python3
"""Generate transparent Android launcher icons from Kitty's aligned PNG layers.

The icon is composed from tail + body + head only. The separate floor-shadow
asset is deliberately never opened or included.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
RES = ROOT / "android" / "app" / "src" / "main" / "res"
ASSETS = ROOT / "public" / "kitty"

def load_rgba(path: Path) -> Image.Image:
    image = Image.open(path).convert("RGBA")
    if image.getchannel("A").getextrema()[0] != 0:
        raise SystemExit(f"{path} must retain transparent pixels; refusing opaque artwork.")
    return image

def fit_centered(source: Image.Image, size: int, fraction: float) -> Image.Image:
    alpha = source.getchannel("A")
    bounds = alpha.getbbox()
    if not bounds:
        raise SystemExit("Kitty icon composition is fully transparent.")
    artwork = source.crop(bounds)
    target = max(1, round(size * fraction))
    artwork.thumbnail((target, target), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    x = (size - artwork.width) // 2
    y = (size - artwork.height) // 2
    canvas.alpha_composite(artwork, (x, y))
    if canvas.getchannel("A").getextrema()[0] != 0:
        raise SystemExit("Generated icon lost its transparent background.")
    return canvas

body = load_rgba(ASSETS / "body" / "kitty-body.png")
head = load_rgba(ASSETS / "kepala" / "kitty-head.png")
tail = load_rgba(ASSETS / "ekor" / "kitty-tail.png")
if body.size != head.size or body.size != tail.size:
    raise SystemExit("Kitty body, head, and tail must share the same aligned canvas.")

# Keep the original layer alignment. No floor shadow is composited.
art = Image.new("RGBA", body.size, (0, 0, 0, 0))
for layer in (tail, body, head):
    art = Image.alpha_composite(art, layer)

# Legacy launcher PNGs keep full alpha. Adaptive foreground stays inside the
# Android adaptive-icon safe zone so launcher masks do not clip Kitty.
for density, pixels in {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}.items():
    folder = RES / density
    folder.mkdir(parents=True, exist_ok=True)
    icon = fit_centered(art, pixels, 0.84)
    icon.save(folder / "ic_launcher.png", optimize=True)
    icon.save(folder / "ic_launcher_round.png", optimize=True)

drawable = RES / "drawable-nodpi"
drawable.mkdir(parents=True, exist_ok=True)
fit_centered(art, 432, 0.64).save(drawable / "ic_launcher_foreground.png", optimize=True)

adaptive = RES / "mipmap-anydpi-v26"
adaptive.mkdir(parents=True, exist_ok=True)
xml = '''<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>
'''
(adaptive / "ic_launcher.xml").write_text(xml, encoding="utf-8")
(adaptive / "ic_launcher_round.xml").write_text(xml, encoding="utf-8")

values = RES / "values"
values.mkdir(parents=True, exist_ok=True)
color = '''<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#171513</color>
</resources>
'''
(values / "ic_launcher_background.xml").write_text(color, encoding="utf-8")

# Verify transparent pixels survive in every generated raster asset.
generated = list(RES.glob("mipmap-*/ic_launcher*.png")) + [drawable / "ic_launcher_foreground.png"]
for path in generated:
    with Image.open(path) as check:
        if check.mode != "RGBA" or check.getchannel("A").getextrema()[0] != 0:
            raise SystemExit(f"Transparency verification failed: {path}")
print(f"Generated {len(generated)} transparent Kitty launcher PNGs (no shadow).")
