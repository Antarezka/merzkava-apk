# Academy Isometric — Map Fragments

Upload separate foreground/occlusion map fragments in this folder.

- Each fragment is a transparent image containing only the foreground object/artwork (for example, a roof or gate canopy).
- Suggested filename pattern: `gate-01.png`, `corridor-roof.png`, etc.
- Keep each fragment aligned to the same isometric map coordinate space as the base map.
- The renderer will place fragments above Player/NPC while keeping the base map below them.
- Trigger circles, labels, and opacity behavior will be configured in the map editor; do not bake trigger circles into the artwork.
