# Canonical agglomeration and regional template

`/vladivostok/` is the main Vladivostok agglomeration page. It needs no recovery
query parameter. The historical source is the publication from 22 September
2026, 15:00 Moscow (`5203d67`). Keep its dedicated Vite entry and the entire
`src/vladivostok-20260922/` dependency graph unchanged. Its source, CSS, 27
projects and 78 assets remain protected by the integrity manifest.

The portal's `VladivostokPage` is only a redirect to this canonical page. The
former second composition of Vladivostok blocks was removed to prevent a
future accidental substitution. Search identifies it as an agglomeration.
The city alias (including a URL without a trailing slash), old shared links,
Primorye's city-map action and Vladivostok's regional map marker reach the same
approved page. `/primorye/` is the whole region, not another version of the
Vladivostok agglomeration.

All 11 regions share `TerritoryPage` and `RegionalAtlas`: photographic hero,
metrics, selectable territories, city story, mission, illustrated atlas and
project detail. The content container remains 1720 px with the same responsive
gutters. City cards use the approved deep-teal surfaces and protected text
area. Existing local crests are reused where available. No new imagery or
project data was invented in this pass.

The regional atlases now follow the approved visual hierarchy: transparent
330 px sidebar, one-column direction list, project list, restrained numbered
territory markers, category invitation and a floating project card. Search and
filters expand from the sidebar header, preserving a clear default view.
Regions retain their own artwork and all 1753 previously imported objects.
Marker numbers are counts for a territory, not fabricated individual project
coordinates. Choosing an object focuses its territory and opens the complete
card. A shared object link restores the correct category. The fixed header
cannot obscure a newly opened card; mobile cards keep their navigation visible
while their contents scroll.

Validation for this pass:

- Source and asset integrity check for the canonical page.
- SSR of all 11 regions and 23 city/agglomeration routes.
- Canonical metadata and city-alias redirect in the production output.
- 782 built routes and existing project/media validation.
- Desktop: region cards, category selection, project navigation and search.
- Phone: long regional heading, map, complete project card at 390 and 320 px.
