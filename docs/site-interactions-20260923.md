# Site cleanup and interaction pass — 23 September 2026

The user's requested reference for Vladivostok is commit `4d0d45b`,
22 September 2026, 15:02:55 Moscow. The seven key images (hero, atlas,
transport map, ATR port and three city illustrations) are byte-identical to
that revision. Project data, map coordinates, camera logic and original design
styles also match it. The expanded Rudnevsky Bridge view was compared with
`docs/previews/atlas-fullscreen-rudnevsky-v3.jpg`.

Saved root URLs with `?v=20260922…` now lead to `/vladivostok/`; previously
they displayed the new homepage. `/cities/vladivostok/` also works. The header
on the Vladivostok page opens its own illustrated atlas. Shared directory cards
show the approved 27-project count. All other city/agglomeration content and
layouts are unchanged by this pass.

Production notes about illustrations, approximate positions and source snapshots
have been removed from rendered pages and project cards. The added standalone
project link in the Vladivostok atlas has been removed to match the reference.
The data files keep their provenance metadata; it is not shown in the interface.
`approved-vladivostok.json` records the timed reference and the authorized cleanup.

## New behaviour

- All seven housing projects are fully visible on `/dvkvartal/`, with investments,
  stage, year, residents, housing and social housing, schools, kindergartens,
  parking, first delivery date and delivery area. The absent parking value for
  Baykala is rendered as a dash. Anchor navigation, comparison table, image zoom
  and project links are available. Old subpage addresses redirect to their blocks.
- News opens in a native modal from the homepage, catalog and global search.
  It supports full article content, previous/next articles, reading progress,
  sharing, Escape, history back/forward, body scroll lock and restored focus.
  Old article URLs redirect to `/news/?news=<id>` and open the modal.
- Region/city directory switch and shared search; homepage section navigation
  and region search; URL-persisted searches, filters and pagination in catalogs;
  chronological news sorting; regional program search; keyboard `/` search;
  consistent share feedback and return-to-top on portal pages.
- Source placement tags “Главная” and “Новости” no longer appear as article topics.

## Verification

- Production build, 782 emitted addresses, 507 catalog projects, 165 full news
  documents, 1,093 source images; 19 protected files/images checked.
- All 34 region/city layouts still render; no editorial production notes remain
  in the checked pages. All seven housing blocks and their numeric metrics render.
- Browser: all housing blocks, comparison, anchor jumps, zoom, old housing URL;
  news content, next article, close, Escape, history forward, focus/scroll restore,
  search-to-modal flow, direct old article URL; directory switch and search;
  project filters survive reload; old Vladivostok URL and Rudnevsky atlas card.
- Mobile: full housing block at 320 px, news modal at 390 px. Desktop: 1,363 px.
- Existing large-bundle warning is unchanged; no application errors were observed.
