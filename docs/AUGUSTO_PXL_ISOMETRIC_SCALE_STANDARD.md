# Augusto PXL — Isometric Scale Standard

Status: locked baseline for pink World Atlas maps.

| Property | Standard |
| --- | ---: |
| Runtime canvas | 2816 × 1536 px |
| Grid | 24 × 20 |
| Tile width × height | 128 × 69.5 px |
| Tile ratio | 1.8417 : 1 |
| Player/NPC frame | 32 × 48 px |
| Ground pivot | (16, 46), bottom-centre |
| Directions / frames | 8 / 4 |
| Player/NPC scale | 1.00 / 1.00 |
| Camera | pitch −44°, FOV 34, 18 px/model unit |

## Rules

1. Approved map canvas, grid, offsets, walkable cells, blocked edges, foreground/opacity sectors and saved coordinates are gameplay authority. Artwork adapts to them.
2. Default to the Academy tile ratio. Scale width and height together for other resolutions unless separately approved.
3. Keep player/NPC at one 32 × 48 frame, scale 1.00 and bottom-centre pivot (16,46). Never split or mirror character halves across a tile.
4. Use readable isometric top surfaces, side faces, contact shadows and walkable lanes. Characters remain separate 2D sprite layers.
5. Record canvas, grid, tile W/H, actor frame, pivot, scale and camera values in each future map handoff. Never guess by eye.
6. PXL is build-time only; runtime stays local assets plus DOM/CSS/SVG/Web Animations.

Academy visible alignment still needs manual comparison on TECNO Spark Go 1 KL4 before it can be called final.
