# Approved territory layouts — 23 September 2026

## Scope

Restored the approved Vladivostok composition: Hero → Regions → Mission → Projects.
The original content components, blue design styles and 27-point illustrated atlas
are unchanged. The portal header and footer are shared in separately scoped wrappers;
portal body resets no longer cascade into the approved page.

All 11 regions and 22 other city/agglomeration pages now use the same composition:
photographic hero and statistics, blue territory cards with selectable city story,
mission, and project explorer. Source-specific text, photographs and indicators come
from the existing imported catalog. City plans retain expandable source materials.
The project explorer reuses the approved sidebar and project navigation patterns;
other cities do not display Vladivostok's map or fabricated project coordinates.

The homepage, catalog, programs, news and individual project pages keep their
existing implementation. No source statistics were refreshed in this change.

## Verification

- Production build: all 781 emitted routes and 1,093 local source images pass.
- Server rendering: all 11 regions and 23 city/agglomeration routes render the
  approved hero, territories, mission and projects sections.
- Protected-file hashes: 12 content, styling and atlas files are unchanged.
- Vladivostok renders 27 atlas markers and the original hero photograph.
- Browser: Vladivostok hero and content; Primorye hero, six city cards, selecting
  Nakhodka and following its master-plan link; project selection on Nakhodka.
- Responsive browser previews: Petropavlovsk-Kamchatsky at 390 px; Primorye and
  Yuzhno-Sakhalinsk at 320 px; Yuzhno-Sakhalinsk at 768 px.
- Mobile long names wrap; metric labels retain their source year.
- The preview's Chromium extension reports metadata errors unrelated to page code.

`docs/approved-vladivostok.json` records the protected file hashes. Intentional
future edits to that approved content require updating the baseline explicitly.
Header/footer work does not require changing protected files.
