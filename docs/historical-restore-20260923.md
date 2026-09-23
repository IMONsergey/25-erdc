# Vladivostok restored at the requested historical cutoff

The requested cutoff is 22 September 2026, 15:00 Moscow (12:00 UTC).

The latest September 23 instruction requires the exact 15:00 version, overriding
the subsequent city-card palette request. Both stylesheets now match `5203d67`
byte for byte; the later palette exception has been removed.

The dedicated page is `/vladivostok/`, with its original 27-point image atlas.
The regional `/primorye/` panorama is a separate page and must not be presented
as the restored agglomeration. Choosing Vladivostok in regional map navigation
opens `/vladivostok/#projects`; the regional renderer no longer borrows the
original city artwork for a different atlas.
GitHub Actions run 35724312094 published source commit
`5203d67dd8ac8da6520f3f80ecfdb091e2418b53` successfully at 11:57:29 UTC.
The next publication, source `4d0d45b`, did not finish until 12:03:37 UTC.
The previous partial restoration used that later revision and the portal shell.

`src/vladivostok-20260922/` now contains the complete application dependency
graph from `5203d67`: App, header, footer, every content component, project data,
camera logic, typography, motion and both original stylesheets. All 17 source
files were extracted from Git. Only the asset base in data.js is adapted to the
new /vladivostok/ location. All 78 historical assets are byte-identical. The
manifest records both original and restored checksums.

Vladivostok has a separate Vite entry. The route emitter must not overwrite it
with the portal template. Portal styles, layout and content modules are not
loaded on this page. This restores the whole historical page, including its
original copy, as requested in the latest instruction. The city alias and old
root URLs with `?v=20260922…` lead to the same historical entry and retain hashes.

The other portal pages now use the same outer grid as the restored page:
1720 px maximum content width and responsive gutters of 20–48 px. Shared header
padding follows that grid. Inner text measures, dialog widths and map canvases
remain appropriate to their contents.

Validation:

- Production build and all 782 emitted route checks passed.
- Historical source/asset checksums and CSS isolation checks passed.
- Desktop map: 27 points, category selection, Rudnevsky Bridge card, next
  project, fullscreen and Escape work.
- Desktop content containers on the restored page, homepage, Primorye and
  DV Quarter all measure 1279.84375 px with x=34.078125 at the same viewport.
- Phone preview at 390 × 844 retains the original mobile layout.

Screenshot: `previews/vladivostok-restored-1500-20260923.jpg`.
