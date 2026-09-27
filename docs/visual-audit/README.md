# Visual audit and image coverage · September 2026

## Scope
This revision affects the editorial v2 branch only. The original main site and the approved city/agglomeration compositions remain preserved. Project media is filled without changing catalogue facts or source photographs.

## Image audit
- 507 project records: 277 already had source images; 230 had empty image arrays.
- Added 19 generated thematic WebP illustrations, selected by project topic and explicit exceptions.
- Generated images are labelled «Иллюстрация» in cards, project headers and details. They are thematic visual context, not verified renderings of individual projects.
- Original city, region, news and housing photographs remain in place.
- `project-image-coverage.json` records the 230 fallback assignments.
- Source cache validation now decodes images and checks WebP length before reuse; new files are written atomically.

## Design changes
- Restored the blue palette and pale blue backgrounds; removed the green cast from shared editorial styles.
- Unified the 12-column / 24px gutter system and common footer.
- Replaced faded header backdrops with clear split image/text compositions.
- Aligned catalogue filters and cards; added visible keyboard focus and restrained hover feedback.
- Named featured-project selectors by city and retained reduced-motion support.
- Wrapped programme filters at narrow widths.

## Verification
Production build checks region baselines, route rendering, original project media preservation, coverage for all 507 projects and complete generated WebP files. Browser checks cover the catalogue search, generated image loading, mobile catalogue and public deployment.

## Expressive design pass · 27 September 2026
- Rebuilt the home page around a full-width panoramic scene with three selectable regions and contextual links.
- Added a sticky chapter navigator, a graphic scale section and a contextual city-life switcher.
- Reworked project stories, housing and news layouts within the shared twelve-column grid.
- Introduced blue page headers, regional cards, a region photo composition and a unified graphic footer.
- All imagery and regional/city facts are retained from the existing catalogue. No extra third-party animation dependency.
- Checked desktop scene switching, mobile navigation and content switching at 320 px; fixed a clipped image title and scroll-position tracking.
