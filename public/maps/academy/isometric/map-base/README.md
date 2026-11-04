# Isometric Map Base

Each isometric map uses **one complete JPG/PNG image** as its Map Base.

For the current Tianhai Academy exterior, the checked-in source image is:

- `public/maps/academy/full-map/1_academy.jpg`

The app converts the loaded source into a PNG data URL at runtime before using it for the main map and minimap. The checked-in source is still a JPG; do not rename JPG bytes to a .png filename. A verified full-map PNG source is needed to replace the committed JPG asset itself.

Do not split roofs, canopies, gates, or foreground architecture into separate image fragments. The editor stores cell metadata only; it never modifies or crops the source image file.

At runtime, the full image stays below Player/NPC. When a cell is marked `○ Foreground`, the renderer clips that cell's portion from the same Map Base image and redraws only that portion above the characters.

Every isometric map must have a stable map ID and its own saved editor data. A map renderer can provide its image path, grid dimensions, and map ID when creating the isometric board.
