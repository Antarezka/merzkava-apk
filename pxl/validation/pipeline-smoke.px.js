// Small original validation asset: confirms that the pinned PXL CLI can build a sheet.
use("sweetie16")
pal({ k: 0, p: 1, r: 2, o: 3, y: 4, G: 5, g: 6, t: 7, n: 8, b: 9, B: 10, c: 11, w: 12, l: 13, s: 14, d: 15 })
sprite("merzkava-pxl-smoke", { w: 16, h: 16, outline: "k" }, (c) => {
  c.rect(3, 5, 10, 8, "b")
  c.rect(5, 2, 6, 4, "c")
  c.hline(5, 9, 6, "w")
  c.px(6, 7, "k")
  c.px(10, 7, "k")
  c.hline(6, 11, 4, "p")
})
sheet("merzkava-pxl-validation", ["merzkava-pxl-smoke"], { cols: 1, pad: 1 })
