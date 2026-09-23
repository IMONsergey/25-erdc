import { createServer } from "vite";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const approved = JSON.parse(await readFile("docs/approved-vladivostok.json", "utf8"));
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
    const isRegion = catalog.regions.includes(entity);
    const path = isRegion ? (entity.id === "primkrai" ? "primorye" : entity.id) : (entity.id === "vladivostok" ? "vladivostok" : `cities/${entity.id}`);
    const page = renderToString(createElement(PortalRoute, { requestedPath: path }));
    assert.ok(!unwanted.test(page), `${path}: production notes remain`);
    for (const id of ["hero-title", "regions", "mission", "projects"]) {
      assert.ok(page.includes(`id="${id}"`), `${path}: missing approved section ${id}`);
    }
    assert.ok(page.includes(entity.name), `${path}: wrong territory`);
    assert.ok(!page.includes('p-page-hero'), `${path}: generic portal hero returned`);
    if (entity.id === "vladivostok") {
      assert.equal((page.match(/class="atlas-marker /g) || []).length, 27);
      assert.ok(page.includes("hero-page12.webp"));
      assert.ok(!page.includes("source-projects"));
    } else {
      assert.ok(!page.includes('atlas-vladivostok.webp'), `${path}: foreign atlas`);
    }
  }
  console.log("Approved content hashes and all 34 region/city layouts passed.");
  console.log(
    "Server render passed: home, shared navigation, region cards, project and news cards, icons and footer.",
  );
} finally {
  await server.close();
}
