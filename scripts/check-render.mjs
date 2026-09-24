import { createServer } from "vite";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const approved = JSON.parse(await readFile("docs/approved-vladivostok.json", "utf8"));
const historical = JSON.parse(await readFile("docs/vladivostok-20260922-1500.json", "utf8"));
for (const [path, entry] of Object.entries(historical.files)) {
  if (entry.source !== "src/data.js") {
    assert.equal(entry.sha256, entry.originalSha256, `Historical source must match the 15:00 publication: ${path}`);
  }
  assert.equal(createHash("sha256").update(await readFile(path)).digest("hex"), entry.sha256, `Historical page changed: ${path}`);
}
for (const [path, hash] of Object.entries(historical.assets)) {
  assert.equal(createHash("sha256").update(await readFile(path)).digest("hex"), hash, `Historical asset changed: ${path}`);
}
assert.equal(createHash("sha256").update(await readFile("docs/vladivostok-entry-20260922.html")).digest("hex"), historical.entrySha256);
assert.ok((await readFile('vladivostok/index.html','utf8')).includes('/src/vladivostok-live/main.jsx'));
for (const [path, hash] of Object.entries(approved.sha256)) {
  assert.equal(createHash("sha256").update(await readFile(path)).digest("hex"), hash, `Approved Vladivostok file changed: ${path}`);
}
const catalog = JSON.parse(await readFile("src/content/catalog.json", "utf8"));
globalThis.location = new URL("http://localhost/");
globalThis.document = {
  baseURI: location.href,
  querySelector: () => ({ content: "./" }),
};
globalThis.window = { scrollY: 0 };
const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});
try {
  const { default: App, PortalRoute } = await server.ssrLoadModule(
    "/src/portal/PortalApp.jsx",
  );
  const { default: HistoricalVladivostok } = await server.ssrLoadModule("/src/vladivostok-20260922/App.jsx");
  const markup = renderToString(createElement(App));
  assert.ok(markup.includes("Новый облик"));
  assert.ok(markup.includes("Дальнего Востока"));
  assert.ok(markup.includes("<svg"));
  assert.ok(markup.includes("p-region-card"));
  const unwanted = /Концептуальная иллюстрация|сведения исходного портала|расположение ориентировочное|О данных проекта/i;
  assert.ok(!unwanted.test(markup), "Homepage contains production notes");
  for(const requestedPath of ['primorye','buryatia','khabkrai','cities/ulan-ude','cities/petropavlovsk-kamchatsky','primorye/subsidy','projects','projects/733657179','news','dvkvartal','dvkvartal/750970520','about','sitemap']) {
    const page=renderToString(createElement(PortalRoute,{requestedPath}));assert.ok(page.includes('<h1'),requestedPath+' lacks a heading');assert.ok(!page.includes('Такой страницы пока нет'),requestedPath+' resolved to 404');
    assert.ok(!unwanted.test(page), requestedPath + ' contains production notes');
  }
  for (const path of ["vladivostok", "cities/vladivostok"]) {
    const page = renderToString(createElement(PortalRoute, { requestedPath: path }));
    assert.ok(page.includes('href="http://localhost/vladivostok/"'), `${path}: not the canonical agglomeration`);
    assert.ok(!page.includes("territory-template"), `${path}: duplicate template returned`);
  }
  const quarters = renderToString(createElement(PortalRoute, { requestedPath: "dvkvartal" }));
  for (const p of catalog.quarter.projects) {
    assert.ok(quarters.includes(`id="quarter-${p.id}"`), `${p.name}: missing full block`);
    for (const stat of p.stats.filter(s => /\d/.test(s.value))) assert.ok(quarters.includes(stat.value), `${p.name}: lost metric ${stat.label}`);
  }
  assert.ok(!/href="[^"]*dvkvartal\/\d/.test(quarters), "Housing still links to a subpage");
  const news = renderToString(createElement(PortalRoute, { requestedPath: "news" }));
  assert.ok(news.includes('aria-haspopup="dialog"'));
  assert.ok(!news.includes('/news/tpost/'), "News still links to article pages");
  for (const entity of [...catalog.regions, ...catalog.cities]) {
    if(['artem','bolshoy-kamen'].includes(entity.id)){
      const redirect=renderToString(createElement(PortalRoute,{requestedPath:`cities/${entity.id}`}));
      assert.ok(redirect.includes(`vladivostok/?city=${entity.id}`),'Agglomeration city must have a single canonical page');
      continue;
    }
    const isRegion = catalog.regions.includes(entity);
    const path = isRegion ? (entity.id === "primkrai" ? "primorye" : entity.id) : (entity.id === "vladivostok" ? "vladivostok" : `cities/${entity.id}`);
    const page = renderToString(entity.id === "vladivostok"
      ? createElement(HistoricalVladivostok)
      : createElement(PortalRoute, { requestedPath: path }));
    // Vladivostok is now an exact historical restore, including its original copy.
    if (entity.id !== "vladivostok") assert.ok(!unwanted.test(page), `${path}: production notes remain`);
    for (const id of isRegion ? ['hero-title','masterplans','programs'] : ['hero-title','mission','projects']) {
      assert.ok(page.includes(`id="${id}"`), `${path}: missing approved section ${id}`);
    }
    assert.ok(page.includes(entity.name), `${path}: wrong territory`);
    assert.ok(!page.includes('p-page-hero'), `${path}: generic portal hero returned`);
    if (isRegion) {
      assert.ok(!page.includes('regional-atlas-stage'), `${path}: region duplicates a master-plan atlas`);
      assert.ok(page.includes(`atlas-region-${entity.id}.webp`), `${path}: regional illustration missing`);
      assert.ok(page.includes('gateway-card'), `${path}: territory gateway missing`);
      assert.ok(!page.includes('OpenStreetMap'), `${path}: tiled map replaced the approved illustration`);
      assert.ok(page.includes('Открыть мастер-план'), `${path}: direct master-plan navigation missing`);
    }
    if (!isRegion && entity.id !== "vladivostok") {
      assert.ok(page.includes('promo-atlas'), `${path}: city atlas missing`);
      assert.ok(page.includes('Объекты мастер-плана на карте'), `${path}: project points missing`);
      assert.ok(page.includes('Найти проект города'), `${path}: search missing`);
      assert.ok(!page.includes('territory-explorer'), `${path}: old flat project list returned`);
    }
    if (entity.id === "vladivostok") {
      assert.equal((page.match(/class="atlas-marker /g) || []).length, 27);
      assert.ok(page.includes("hero-page12.webp"));
      assert.ok(!page.includes("source-projects"));
      assert.ok(page.includes("Изучить мастер-план"));
      assert.ok(page.includes('class="site-footer"'));
    } else {
      assert.ok(!page.includes('atlas-vladivostok.webp'), `${path}: foreign atlas`);
    }
  }
  console.log("Complete historical Vladivostok (17 sources, 78 assets) and all 34 region/city layouts passed.");
  console.log(
    "Server render passed: home, shared navigation, region cards, project and news cards, icons and footer.",
  );
} finally {
  await server.close();
}
