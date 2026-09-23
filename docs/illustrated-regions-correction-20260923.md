# Restore the illustrated atlas design

The user rejected the street-map renderer introduced in the previous regional
update. Its technical accuracy did not satisfy the approved visual direction.
Regional atlases now render a single local landscape image, with the scene and
its interactive territory markers moving together. No tile provider, geographic
map library, light/dark basemap switch or street labels are used in these atlases.

All eleven regions have distinct editorial landscape assets in
`assets/atlas-region-*.webp`. They were generated separately with the built-in
ImageGen tool using the approved Vladivostok artwork only as a style reference.
The prompt set and source asset paths are recorded in `illustrated-regional-art.json`.
PNG-to-WebP conversion preserves the generated image content and dimensions.

Selecting the Vladivostok/Artyom plan opens the existing
`assets/atlas-vladivostok.webp`; selecting Ulan-Ude opens the existing
`assets/atlas-ulan-ude.webp`. The dedicated historical Vladivostok application,
its approved 27 project anchors, artwork, blue cards and other protected sources
are unchanged by this correction.

The new regional images are artistic compositions, not geographic maps. Image
anchors in `src/content/illustrated-atlases.js` locate **territory selectors**;
they do not claim a precise project location. Clicking a marker filters the list
to its master plan. Selecting an individual source record shows its details and
focuses the territory. No arbitrary individual-project pins are invented for
the 1,753 records. Existing source addresses, financing, deadlines and ownership
remain available in the cards.

Interaction includes image panning, zoom, overview reset, city selection,
category/stage filters, search, project cards, previous/next record, fullscreen,
Escape, and keyboard controls. The desktop camera keeps the active territory
clear of both side panels. At mobile widths the image, filters and card stack;
fullscreen panels retain their natural height so all controls remain scrollable.

## Verification

- Full production build passes, including all 782 routes and the protected
  historical page. Every regional render must contain its own artwork and
  interactive territory markers, and must not contain OpenStreetMap attribution.
- Build output contains all eleven artwork files.
- 4,032 camera combinations verify image coverage and that selected territory
  anchors remain visible between panels, from 320 px to 2560 px widths.
- Desktop browser: Primorye overview, territory click, original Vladivostok image,
  object card, next object, zoom change, fullscreen and overview reset verified.
- Phone preview at 390 × 844: Buryatia → Ulan-Ude original image, lower category
  filter, selected object card, fullscreen scrolling and Escape verified.
- Browser snapshots show zero map canvases in the regional atlas.

Proofs: `previews/illustrated-regions-desktop-20260923.jpg` and
`previews/illustrated-regions-mobile-20260923.jpg`.
