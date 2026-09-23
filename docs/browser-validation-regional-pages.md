# Home and regional pages — 23 September 2026

Published source: `96557f1b2e870732e98c1cdb3f15687f2f3a27b4`.
Successful Pages workflow: https://github.com/IMONsergey/25-erdc/actions/runs/35834636107

## Scope and sources

Four public pages now share the established blue visual system:

- `/25-erdc/` — home, based on the original project portal;
- `/25-erdc/primorye/` — Primorye;
- `/25-erdc/buryatia/` — Buryatia, including the Ulan-Ude master plan;
- `/25-erdc/vladivostok/` — existing Vladivostok page.

Figma Page 12 contains three frames: Buryatia `947:5568`, Vladivostok
`947:6239`, Primorye `947:6810`. Ulan-Ude is part of Buryatia rather than a
fourth Figma frame. Home links for the other nine regions lead to the original
portal. The approved Vladivostok project dataset and camera implementation
are byte-for-byte unchanged from the preceding version.

## Verification

- Production build succeeds for the four public pages and existing QA/map-lab.
- GitHub Actions completed build, deployment and external page/asset checks.
- All 64 literal source asset references resolve to committed files.
- Browser navigation: home → Buryatia; Buryatia → Primorye; Primorye →
  Vladivostok; logo → home.
- Selecting Buryatia on home updates the photo, title and local destination.
- Home FAQ opens; Quarter links to the original programme page.
- Primorye city selection updates the detail panel (Находка tested).
- Ulan-Ude: project 02 opens; Next switches to project 03; fullscreen opens
  an accessible dialog; Escape exits and restores focus.
- Vladivostok renders all 27 project markers, with no failed loaded images
  and no document overflow at the inspected desktop width (1348 px).
- Phone previews inspected at 390 and 320 px. Menu opens and closes on
  anchor selection; city tiles remain a horizontal rail.
- Primorye at 768 px uses a two-column city grid.

## Fixes from browser inspection

- Add an explicit space around hidden hero CTA line breaks on home/regions.
- Keep regional hero numbers on one line and reduce their size at 320 px.
- Reduce the Primorye headline and Quarter heading at the narrow breakpoint
  to avoid clipping.
- Retry all public routes/assets while Pages is propagating, instead of
  failing immediately when the first returned page is still cached.

Published desktop preview: `previews/home-published-20260923.jpg`.

## Final mobile follow-up

Mobile fixes published in `7d7a35520957dcd817b6643f514e83f615ed65de`;
workflow https://github.com/IMONsergey/25-erdc/actions/runs/35835490105
completed successfully. In the refreshed 320 px preview, the Primorye title
fits, `1 807,5` stays on one line and the CTA reads «Открыть мастер-планы».
The Quarter heading's measured client and scroll widths are both 215 px.
Its source map image is decorative and has empty alternative text.
