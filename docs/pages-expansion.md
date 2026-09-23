# Home and regional pages — 22 September 2026

## Scope

- `/`: home page reconstructed from https://xn--25-flcdf3dabp.xn--p1ai/ using the current visual language. Includes 25-city introduction, master-plan explanation, interactive selection of all 11 regions, Far Eastern Quarter, 14 partners and the three newest articles shown on the source home page.
- `/primorye/`: Figma Page 12 frame `947:6810`, including regional hero, four city groups, regional potential and development directions.
- `/buryatia/`: Page 12 frame `947:5568`, including two cities, Ulan-Ude mission, transport connections, four development directions and illustrated project atlas.
- `/vladivostok/`: existing city page, moved into its own route. Its approved 27-project dataset, source rows, details, map positions and camera behavior are unchanged.
- Other home regions, news articles and the Far Eastern Quarter link to the original portal. No unavailable regional content is invented.

Figma: https://www.figma.com/design/lQfOm1SOxe7rAnLQdeCfpA/GPT-ASTRA-TEST?node-id=947-5326

## Visual system

Shared 1720 px maximum grid, blue city illustration tiles, white/cyan type, Morphicons, animated imagery and selection states. Hero fades end in the exact following section background. Map imagery starts inside each atlas; the transformation introduction remains a solid background. No floating bottom navigation has been restored.

Generated assets: city illustrations for Nakhodka, Ussuriysk, Arsenyev, Ulan-Ude and Severobaikalsk; Buryatia airport and Asian transport scenes; expanded Ulan-Ude terrain; riverfront illustration based on the small Figma image. Generated project imagery is labelled conceptual.

Original portal photographs and logos are preserved in WebP; source URLs are recorded in `home-source-assets.json`. Figma export provenance is recorded in `region-figma-assets.json`.

## Content corrections and boundaries

- Buryatia area is 351.3 thousand km², verified against https://03.mchs.gov.ru/glavnoe-upravlenie/harakteristika-subekta and https://hural-buryatia.ru/obshchie-svedeniya/obshchie-svedeniya/. The Figma/source portal value of 974.6 is not reproduced.
- Primorye headline statistics use the project portal values: 164.7 thousand km², 1,807.5 thousand residents, six cities grouped into four master-plan cards. The unverified Figma investment total is omitted.
- Ulan-Ude project content is a separate dataset from the approved Vladivostok spreadsheet. Figma repeats the historical center as source numbers 05/06; this is represented once, producing 11 unique projects while retaining source numbering. No new budget, completion percentage, implementation date or construction stage is asserted.
- All atlas positions are approximate on an artistic visualization, as stated on the page.

## Validation

`npm run build` succeeds for all four pages and existing map-lab/QA routes. Static source image references resolve. Browser validation and screenshots are recorded separately after publication.
