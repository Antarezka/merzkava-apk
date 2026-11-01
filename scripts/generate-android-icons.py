#!/usr/bin/env python3
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
RES = ROOT / "android/app/src/main/res"
ASSETS = ROOT / "public/kitty"
LEGACY_ZOOM = 0.96
ADAPTIVE_ZOOM = 0.88

def load(path):
    im = Image.open(path).convert("RGBA")
    if im.getchannel("A").getextrema()[0] != 0 or im.getchannel("A").getextrema()[1] == 0:
        raise SystemExit(f"Invalid transparent Kitty layer: {path}")
    return im

def fit(source, size, zoom):
    bounds = source.getchannel("A").getbbox()
    if not bounds:
        raise SystemExit("Kitty icon is empty")
    art = source.crop(bounds)
    art.thumbnail((round(size * zoom), round(size * zoom)), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.alpha_composite(art, ((size-art.width)//2, (size-art.height)//2))
    return canvas

body = load(ASSETS / "body/kitty-body.png")
head = load(ASSETS / "kepala/kitty-head.png")
tail = load(ASSETS / "ekor/kitty-tail.png")
if body.size != head.size or body.size != tail.size:
    raise SystemExit("Kitty layers do not share an aligned canvas")
art = Image.new("RGBA", body.size, (0, 0, 0, 0))
for layer in (tail, body, head):
    art = Image.alpha_composite(art, layer)

for density, size in {"mipmap-mdpi":48,"mipmap-hdpi":72,"mipmap-xhdpi":96,"mipmap-xxhdpi":144,"mipmap-xxxhdpi":192}.items():
    folder = RES / density
    folder.mkdir(parents=True, exist_ok=True)
    icon = fit(art, size, LEGACY_ZOOM)
    icon.save(folder / "ic_launcher.png", optimize=True)
    icon.save(folder / "ic_launcher_round.png", optimize=True)

for old in RES.rglob("ic_launcher_foreground.xml"):
    old.unlink()

drawable = RES / "drawable-nodpi"
drawable.mkdir(parents=True, exist_ok=True)
fit(art, 432, ADAPTIVE_ZOOM).save(drawable / "ic_launcher_foreground.png", optimize=True)
Image.new("RGBA", (432,432), (0,0,0,0)).save(drawable / "ic_launcher_background.png", optimize=True)

adaptive = RES / "mipmap-anydpi-v26"
adaptive.mkdir(parents=True, exist_ok=True)
xml = '''<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>
'''
for name in ("ic_launcher.xml", "ic_launcher_round.xml"):
    (adaptive / name).write_text(xml, encoding="utf-8")

for path in list(RES.glob("mipmap-*/ic_launcher*.png")) + [drawable/"ic_launcher_foreground.png", drawable/"ic_launcher_background.png"]:
    with Image.open(path) as im:
        alpha = im.getchannel("A")
        if im.mode != "RGBA" or alpha.getextrema()[0] != 0:
            raise SystemExit(f"Transparency check failed: {path}")
        if path.name == "ic_launcher_background.png" and alpha.getextrema() != (0,0):
            raise SystemExit("Adaptive background must be fully transparent")
        if path.name != "ic_launcher_background.png" and alpha.getextrema()[1] == 0:
            raise SystemExit(f"Kitty missing from icon: {path}")
print(f"Kitty launcher icons generated: {LEGACY_ZOOM:.0%} legacy / {ADAPTIVE_ZOOM:.0%} adaptive; transparent background; no shadow.")
