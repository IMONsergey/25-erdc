# Regional atlases and approved blue cards — 23 September 2026

The restored Vladivostok page remains the historical application from
`5203d67dd8ac8da6520f3f80ecfdb091e2418b53`. At the user's request, its city-card
colours now use the exact later approved `refinements.css` from
`4d0d45b0dffd846defb1337bf76ef863859a026d`. The restoration manifest records this
one explicit exception; the other historical sources and all 78 images remain
protected by their existing SHA-256 checks.

## Regional pages

All 11 regions now share the existing territory composition and container grid,
with an interactive regional atlas in the projects section. The atlas supports
city, category and stage filters; search; geographic clustering; object cards;
zoom and fit controls; light and dark basemaps; fullscreen; object navigation;
shareable object URLs; and links back to the territory master plan. A city's
"Объекты на карте" button opens that city's objects within the region.

Desktop panels align with the same 1720 px shell and responsive gutters as the
rest of the site. On smaller screens the map, filters and object details stack
vertically. Reduced motion, Escape, fullscreen focus containment, loading and
retry states, and empty search results are handled.

The original Vladivostok illustrated atlas, its 27 selected projects and its
historical page content are not replaced by the regional map component.

## Data provenance

`scripts/prepare-regional-atlas.mjs` partitions the existing
`src/map-lab/isupSnapshot.js` snapshot, generated 18 August 2026, into 11 lazy-loaded
regional JSON files. It retains all 1,753 records and assigns the 22 master plans
to the 23 catalogue cities. Vladivostok and Artyom share one source master plan.
No new project coordinates, completion dates or budgets are invented. This is a
presentation update, not a refresh of the underlying project data.

| Region ID | Objects | Master plans |
| --- | ---: | ---: |
| primkrai | 692 | 5 |
| khabkrai | 91 | 2 |
| kamchatka | 65 | 1 |
| buryatia | 106 | 2 |
| yakutia | 164 | 2 |
| chukot | 65 | 1 |
| zabaikal | 116 | 2 |
| amurskaya | 271 | 4 |
| sakhalin | 11 | 1 |
| eao | 116 | 1 |
| magadan | 56 | 1 |

The fleet procurement record `89c29557-7303-44ae-acef-a9b3e0412455` remains in the
Magadan list. Its supplied point lies far outside Magadan and does not identify a
single fixed project site, so it is not drawn on the map. Thus 1,752 records have
map points. Other coordinates are unchanged.

Project photographs and catalogue links are attached only for a unique exact
normalized title match within the same region. Otherwise the image is the
territory panorama, explicitly captioned as the city. Ruble amounts retain the
source values and are formatted as millions or billions only for display.

OpenLayers uses OpenStreetMap's standard HTTPS tiles with visible attribution,
normal browser requests and HTTP caching. The former CARTO endpoint rendered
"API KEY REQUIRED" during visual verification and has been replaced in both
the regional and shared portal maps. A bundled public-domain Natural Earth
110m land layer supplies geography if raster tiles are unavailable:
https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson

## Verification

`npm run build` passes the historical integrity checks, all 34 territory renders,
all 11 region/data ownership checks, record uniqueness and coordinate validation,
and the existing 782-route, 507-catalogue-project, 165-article and 1,093-image checks.

Browser verification before the access-service error confirmed the approved blue
Vladivostok cards and a rendered Primorye atlas with real street tiles, all 692
records, city filtering to Nakhodka's 159 records, search reducing that list to
three viewpoints, object selection, financing/deadline details and fullscreen.
The saved preview is `docs/previews/region-atlas-primorye-20260923.jpg`.

A subsequent read-only browser action was denied because automatic approval
review failed to initialize its session (internal HTTP 500). The denial was not
bypassed. The final responsive-toolbar, shared-grid map-padding and deep-link
scroll adjustments were reviewed in source and passed the complete build;
additional browser checks of those adjustments remain unperformed.
