#!/usr/bin/env python3
"""Generate transparent Android launcher icons from Kitty's aligned PNG layers.

The icon is composed from tail + body + head only. The separate floor-shadow
asset is deliberately never opened or included. Both raster and adaptive-icon
backgrounds remain transparent.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
RES = ROOT / "android" / "app" / "src" / "main" / "res"
ASSETS = ROOT / "public" / "kitty"


def load_rgba(path: Path) -> Image.Image:
    image = Image.open(path).convert("RGBA")
    alpha = image.getchannel("A")
    if alpha.getextrema()[0] != 0 or alpha.getextrema()[1] == 0:
        raise SystemExit(f"{path} must contain visible artwork and transparent pixels.")
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
    return canvas


body = load_rgba(ASSETS / "body" / "kitty-body.png")
head = load_rgba(ASSETS / "kepala" / "kitty-head.png")
tail = load_rgba(ASSETS / "ekor" / "kitty-tail.png")
if body.size != head.size or body.size != tail.size:
    raise SystemExit("Kitty body, head, and tail must share the same aligned canvas.")

# Preserve layer alignment. The shadow layer is intentionally not loaded.
art = Image.new("RGBA", body.size, (0, 0, 0, 0))
for layer in (tail, body, head):
    art = Image.alpha_composite(art, layer)

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

# Capacitor's Android template can ship a vector foreground in a version-
# qualified drawable folder. Android gives that vector precedence over the
# generated PNG, which can leave the default black-and-white Android robot
# visible even though our Kitty PNGs were generated correctly. Remove every
# stale vector with this resource name, regardless of its qualifier directory.
for legacy_vector in RES.rglob("ic_launcher_foreground.xml"):
    legacy_vector.unlink()

drawable = RES / "drawable-nodpi"
drawable.mkdir(parents=True, exist_ok=True)
foreground = drawable / "ic_launcher_foreground.png"
fit_centered(art, 432, 0.64).save(foreground, optimize=True)

stale_vectors = list(RES.rglob("ic_launcher_foreground.xml"))
if stale_vectors:
    raise SystemExit(
        "Stale Android launcher foreground vector still overrides Kitty's PNG: "
        + ", ".join(str(path) for path in stale_vectors)
    )

# A transparent background is deliberate: the launcher must show Kitty alone,
# not a dark square/circle behind her. Kitty stays within the adaptive safe zone.
adaptive = RES / "mipmap-anydpi-v26"
adaptive.mkdir(parents=True, exist_ok=True)
xml = '''<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@android:color/transparent" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>
'''
(adaptive / "ic_launcher.xml").write_text(xml, encoding="utf-8")
(adaptive / "ic_launcher_round.xml").write_text(xml, encoding="utf-8")

# Verify every raster has visible Kitty artwork and transparent corner pixels.
generated = list(RES.glob("mipmap-*/ic_launcher*.png")) + [foreground]
for path in generated:
    with Image.open(path) as check:
        if check.mode != "RGBA" or check.getchannel("A").getextrema()[0] != 0:
            raise SystemExit(f"Transparency verification failed: {path}")
        alpha = check.getchannel("A")
        if alpha.getextrema()[1] == 0 or any(alpha.getpixel(point) != 0 for point in (
            (0, 0), (check.width - 1, 0), (0, check.height - 1), (check.width - 1, check.height - 1)
        )):
            raise SystemExit(f"Transparent padding verification failed: {path}")

for path in (adaptive / "ic_launcher.xml", adaptive / "ic_launcher_round.xml"):
    content = path.read_text(encoding="utf-8")
    if '@android:color/transparent' not in content:
        raise SystemExit(f"Adaptive icon background is not transparent: {path}")
    if '@drawable/ic_launcher_foreground' not in content:
        raise SystemExit(f"Adaptive icon does not reference Kitty's PNG foreground: {path}")

print(
    f"Generated {len(generated)} transparent Kitty launcher PNGs; "
    "all stale foreground vectors removed; adaptive backgrounds are transparent; "
    "no shadow layer included."
)
