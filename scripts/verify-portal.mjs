import { readFile, access } from "node:fs/promises";
import assert from "node:assert/strict";
import path from "node:path";
const c = JSON.parse(await readFile("src/content/catalog.json", "utf8")),
  news = JSON.parse(await readFile("src/content/news-index.json", "utf8")),
  media = JSON.parse(await readFile("src/content/media.json", "utf8")),
  routes = JSON.parse(await readFile("dist/routes.json", "utf8"));
const checkUnique = (items, key, label) =>
  assert.equal(
    new Set(items.map((i) => i[key])).size,
    items.length,
    `${label} contain duplicate ${key}`,
  );
checkUnique(routes, "path", "Routes");
checkUnique(c.projects, "id", "Projects");
checkUnique(news, "id", "News");
assert.equal(c.regions.length, 11);
assert.equal(c.cities.length, 23);
assert.equal(news.length, 165);
assert.equal(c.quarter.projects.length, 7);
const yards = c.projects.filter(
  (p) => p.region === "primkrai" && p.title === "1000 Дворов",
);
assert.deepEqual(
  Object.fromEntries(
    yards.map((p) => [
      p.place,
      p.stats.find((s) => s.label === "Отремонтированных дворов").value,
    ]),
  ),
  {
    "г. Артем": "3 двора",
    "г. Владивосток": "16 дворов",
    "г. Находка": "4 двора",
    "г. Уссурийск": "5 дворов",
  },
  "Yard funding must remain attached to the correct city",
);
for (const p of c.projects) {
  const labels = p.stats.map((s) => s.label);
  assert.equal(
    labels.length,
    new Set(labels).size,
    "Duplicate metric fields: " + p.id,
  );
}
const ids = new Set(c.projects.map((p) => p.id));
for (const city of c.cities) {
  assert.ok(city.image && city.mission, city.id);
  for (const id of city.projects) assert.ok(ids.has(id), id);
  await access(`dist/content/cities/${city.id}.json`);
}
for (const r of c.regions)
  for (const [id, p] of Object.entries(r.programs)) {
    for (const pid of p.projects) assert.ok(ids.has(pid));
    await access(`dist/content/programs/${r.id}-${id}.json`);
  }
for (const [url, file] of Object.entries(media))
  await access(`dist/assets/${file}`).catch(() => {
    throw new Error(`Missing media ${file} ${url}`);
  });
for (const r of routes) {
  const file = r.path.endsWith(".html")
    ? `dist/${r.path}`
    : `dist/${r.path ? r.path + "/" : ""}index.html`;
  const h = await readFile(file, "utf8");
  assert.ok(h.includes("<title>"));
  for (const m of h.matchAll(
    /(?:src|href)="([^"#?]+(?:\.js|\.css|\.woff2|\.png))"/g,
  )) {
    const target = m[1];
    if (!target.startsWith("http") && !target.startsWith("/"))
      await access(path.resolve(path.dirname(file), target));
  }
  if (r.type === "article")
    await access(`dist/content/news/${r.path.split("/").at(-1)}.json`);
}
const approved = (await import("../src/selectedProjects.js")).selectedProjects;
assert.equal(approved.length, 27, "Approved Vladivostok atlas changed");
console.log(
  `Verified ${routes.length} routes, ${c.projects.length} source projects, 27 approved atlas projects, ${news.length} complete articles and ${Object.keys(media).length} local source images.`,
);
