# Client corrections — 22 September 2026

Published source: `f07a86d03eadd8b4d8955a59ecb149b9425043c1`.
Successful Pages deployment: https://github.com/IMONsergey/25-erdc/actions/runs/35721816347

This revision supersedes the section-03 background and unbounded camera behaviour
recorded in browser-validation-v2.md.

## Corrections

- Section 03 has a uniform `#053653` background, no image and no overlay pseudo-element.
  A matching fade is confined to the top of the atlas itself.
- City selection uses the original three blue line-art panoramas from Figma Page 12,
  node 947:6306. Assets are preserved locally as WebP at 1280 px width.
- City metrics use a separate semantic definition-list layout. Icons, labels,
  numbers and units no longer share conflicting grid positions. Narrow phones
  stack the two metric cards. The long city heading scales to the available width.
- Bolshoy Kamen's crest is displayed at the same visible size as the other crests,
  accounting for the extra transparent margins in its supplied source.
- The map image covers the viewport with overscan. Camera movement is clamped to
  available image margins; edge projects stay within the illustration without
  pulling an empty background strip into view.
- The floating bottom chapter navigation and its styles are removed.
- The approved dataset is unchanged: exactly 27 entries, 27 approximate anchors,
  seven categories. No new project or factual figure was added.

## Verification

- Production build passed, as did the GitHub Pages build and deployment.
- `node scripts/check-atlas-camera.mjs`: 38,416 coverage checks across all 27 targets,
  overview and every pair of camera states, sampled at seven transition fractions,
  for seven viewport dimensions from 320 × 435 to 2560 × 1100.
- Live browser: the Rudnevsky bridge selection fills the atlas at desktop width,
  fullscreen, and in a 2048 × 1100 iframe (2033 px content width plus scrollbar).
- Live browser: northern project 22 and southern project 10 retain image coverage
  after their animations settle. Project 10 on the wide iframe was selected via
  the keyboard-accessible sidebar entry because the frame exceeds the browser width.
- In the fullscreen overview, all 27 marker centres are inside the viewport and
  pass elementFromPoint hit checks without obstruction by panels.
- City metric label and value rectangles are separate at 1363, 768, 390 and 320 px.
  Their contents do not overflow their cards. At 320 px the corrected city heading
  has clientWidth = scrollWidth = 227 px.
- All three illustrated tile images load at naturalWidth 1280. Switching Vladivostok,
  Artem and Bolshoy Kamen updates the corresponding city story correctly.
- Section 03 computed background is rgb(5, 54, 83), with no image and no ::after content.
  The page contains zero .chapter-nav elements.

## Evidence

- `previews/city-illustrations-v3.jpg`
- `previews/city-metrics-v3.jpg`
- `previews/solid-projects-intro-v3.jpg`
- `previews/atlas-fullscreen-rudnevsky-v3.jpg`
