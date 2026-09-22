# Page 12 refinement — 22 September 2026

Published design and 27-point atlas: `0936849d236b793e2c5d513ce1ee8083f8dbbfc6`.
Final successful Pages run: https://github.com/IMONsergey/25-erdc/actions/runs/35718946918
Earlier successful Pages run: https://github.com/IMONsergey/25-erdc/actions/runs/35717717204

## Approved scope

The main site uses exactly 27 entries from the workbook sheet «ВЫБРАНО».
No project was added. At the client’s subsequent request, every approved entry now
has an approximate illustration anchor (27 distinct positions). Category counts are
2 housing, 6 social, 5 transport, 4 engineering, 5 ecology, 4 tourism and 1 economy.
The 9 clinics, 20 trolleybuses and more than 100 sports facilities describe three
approved programme entries; they are not additional project records or markers.

## Design and content

- Shared shell widened to 1720 px, with consistent responsive gutters.
- Mission rebuilt around Figma Page 12 node 947:6379: three visible text rows,
  circular icons, strategic diagram and four transport selectors.
- All interface icons rendered through Morphicons; brand marks and city crests
  remain supplied artwork.
- Three interactive city tiles update their city story and thematic tab.
- All 27 project cards have an image, expanded description, programme and source
  disclosure. Generated images are explicitly labelled conceptual illustrations.
- Kungasny image is the exact artwork from Figma node 947:6484, exported at 1440 px.
  The screenshot's figures are labelled concept figures. Unavailable budgets,
  schedules and construction percentages were not invented for other projects.
- Cinematic map displays all 27 approved project points. The active category is
  highlighted; other categories remain visible and clickable. Selecting any point
  updates the category and centres the camera on it. Programmes carry an explicit
  note that their point is representative, not a single construction site.
- Section 03 uses the same coastal panorama with matching gradients at the join
  so its heading transitions smoothly into the atlas.

## Browser verification

- Opened all 27 unique project cards across all seven categories through the UI;
  checked titles, image paths and programme content.
- Verified city selection and the city theme tab, mission transport switching,
  card previous/next navigation, source disclosure and expanded reading mode.
- Verified fullscreen close, Escape and focus return to the fullscreen button.
- Visually checked desktop (1363 px), phone (390 and 320 px), and tablet (768 px).
- Corrected mobile category overflow: at a 320 px iframe, document and scroll
  width both measured 305 px (remaining 15 px is browser scrollbar), sidebar
  scrollLeft was zero, and each category's scroll width equalled its client width.
- Corrected tablet invitation overflow: at 768 px, document and scroll width
  both measured 753 px; the full caption ended at x=733, within its panel.
- Verified the Kungasny image loaded with naturalWidth 1440.
- In the desktop fullscreen overview, all 27 marker centres passed viewport
  containment and elementFromPoint hit checks: none was obscured by panels.
- Clicking the economy marker switched the sidebar to Economy and opened the
  correct card; clicking engineering opened the programme card and its location note.
- Camera targeting was verified on desktop and mobile: selected marker centre
  matched the map viewport centre (mobile x=187.49 vs 187.5; y within 0.02 px).
- Direct loading of #projects now scrolls to the section after React mounts.
- Mobile 390 px document width and scroll width both measured 375 px.
- Validated 27 unique, non-null anchors; compared all remaining dataset fields
  against the previous approved version and confirmed they were unchanged.
- Production build passed. The existing map-lab bundle warning is isolated from
  the main page; the main page does not load the old interactive mapping library.

## Visual evidence

- `previews/approved-projects-atlas.png`
- `previews/mobile-approved-projects.png`
- `previews/mission-page12.png`
- `previews/atlas-seamless-transition.png`

Generation prompts and provenance are in `image-prompts-v2.json` and
`image-prompts-v2-extra.json`. Concept imagery supports the approved entries and
does not represent approved architectural plans.
