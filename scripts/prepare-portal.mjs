import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
const portal = JSON.parse(await readFile("src/content/portal.json", "utf8"));
const news = JSON.parse(await readFile("src/content/news.json", "utf8"));
for (const p of [
  "public/content/cities",
  "public/content/programs",
  "public/content/news",
  "public/content/materials",
])
  await mkdir(p, { recursive: true });
for (const c of portal.cities)
  await writeFile(
    `public/content/cities/${c.id}.json`,
    JSON.stringify(c.blocks),
  );
for (const r of portal.regions)
  for (const [id, p] of Object.entries(r.programs))
    await writeFile(
      `public/content/programs/${r.id}-${id}.json`,
      JSON.stringify(p.blocks),
    );
for (const n of news)
  await writeFile(`public/content/news/${n.id}.json`, JSON.stringify(n));
// Unique material from the experimental Buryatia pages is retained as a supplementary document.
for (const e of portal.extras.filter((e) =>
  ["page144867796", "test-sev-ulan1"].includes(e.id),
))
  await writeFile(`public/content/materials/${e.id}.json`, JSON.stringify(e));
const catalog = {
  snapshotDate: portal.snapshotDate,
  regions: portal.regions.map((r) => ({
    ...r,
    programs: Object.fromEntries(
      Object.entries(r.programs).map(([id, p]) => [
        id,
        { name: p.name, projects: p.projects },
      ]),
    ),
  })),
  cities: portal.cities.map(({ blocks, ...c }) => c),
  projects: portal.projects,
  quarter: portal.quarter,
};
// The published Buryatia source contains a transcription error. Preserve the approved design value.
catalog.regions
  .find((r) => r.id === "buryatia")
  .stats.find((s) => s.label.includes("площадь")).value = "351,3 тыс. км²";
await writeFile("src/content/catalog.json", JSON.stringify(catalog));
await writeFile(
  "src/content/news-index.json",
  JSON.stringify(news.map(({ body, ...n }) => n)),
);
const used = [
  catalog,
  ...portal.cities.map((c) => c.blocks),
  ...portal.regions.flatMap((r) =>
    Object.values(r.programs).map((p) => p.blocks),
  ),
  ...news,
  ...portal.extras.filter((e) =>
    ["page144867796", "test-sev-ulan1"].includes(e.id),
  ),
];
const images = new Set();
function walk(o, key = "") {
  if (typeof o === "string") {
    if (["image", "images"].includes(key) && /^https:\/\//.test(o))
      images.add(o);
    if (key === "body")
      for (const m of o.matchAll(/(?:src|data-original)="(https:[^"]+)"/g))
        images.add(m[1]);
  } else if (Array.isArray(o)) o.forEach((v) => walk(v, key));
  else if (o) for (const [k, v] of Object.entries(o)) walk(v, k);
}
used.forEach((o) => walk(o));
const manifest = Object.fromEntries(
  [...images]
    .sort()
    .map((url) => [
      url,
      `source/${createHash("sha1").update(url).digest("hex").slice(0, 16)}.webp`,
    ]),
);
await writeFile("src/content/media.json", JSON.stringify(manifest));
console.log(
  `Prepared ${portal.cities.length} city documents, ${news.length} articles, ${images.size} media sources.`,
);
