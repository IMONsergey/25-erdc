import { readFile, writeFile, mkdir } from "node:fs/promises";
const c = JSON.parse(await readFile("src/content/catalog.json", "utf8"));
const news = JSON.parse(await readFile("src/content/news-index.json", "utf8"));
const template = await readFile("dist/index.html", "utf8");
const regionPath = (r) => (r.id === "primkrai" ? "primorye" : r.id);
const cityPath = (c) =>
  c.id === "vladivostok" ? "vladivostok" : `cities/${c.id}`;
const routes = [
  { path: "", title: "Новый облик Дальнего Востока", type: "home" },
  { path: "about", title: "О проекте", type: "about" },
  { path: "regions", title: "Все регионы", type: "regions" },
  { path: "projects", title: "Каталог проектов", type: "projects" },
  { path: "news", title: "Новости", type: "news" },
  { path: "dvkvartal", title: "Дальневосточный квартал", type: "quarter" },
  { path: "map", title: "Интерактивная карта проектов", type: "map" },
  { path: "sitemap", title: "Карта сайта", type: "sitemap" },
  {
    path: "materials/ulan-ude",
    title: "Улан-Удэ и Северобайкальск — материалы мастер-планов",
    type: "materials",
  },
];
for (const r of c.regions) {
  routes.push({ path: regionPath(r), title: r.name, type: "region" });
  for (const [id, p] of Object.entries(r.programs))
    routes.push({
      path: `${regionPath(r)}/${id}`,
      title: `${p.name} — ${r.name}`,
      type: "program",
    });
}
for (const city of c.cities)
  routes.push({ path: cityPath(city), title: city.name, type: "city" });
for (const p of c.projects)
  routes.push({ path: `projects/${p.id}`, title: p.title, type: "project" });
for (const p of c.quarter.projects)
  routes.push({
    path: `dvkvartal/${p.id}`,
    title: p.name + " — Дальневосточный квартал",
    type: "housing",
  });
for (const n of news)
  routes.push({
    path: `news/tpost/${n.id}`,
    title: n.title,
    description: n.excerpt,
    type: "article",
  });
const approved = (await import("../src/selectedProjects.js")).selectedProjects;
for (const p of approved)
  routes.push({
    path: `vladivostok/projects/${p.id}`,
    title: p.title,
    type: "approved-project",
  });
const aliases = {
  primkrai: "primorye",
  "page144867266.html": "primorye",
  "page144867796.html": "materials/ulan-ude",
  "test-sev-ulan1": "materials/ulan-ude",
  "page167973009.html": "materials/ulan-ude",
  "page152744266.html": "primorye",
  "page144706796.html": "sitemap",
  "page146812156.html": "sitemap",
  newtemplate: "sitemap",
  "page152745516.html": "sitemap",
  "page152844266.html": "sitemap",
};
for (const [path, target] of Object.entries(aliases))
  routes.push({
    path,
    title: routes.find((r) => r.path === target).title,
    type: "alias",
    canonical: target,
  });
const esc = (s) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const base = "https://imonsergey.github.io/25-erdc/";
for (const r of routes) {
  const file = r.path.endsWith(".html")
    ? `dist/${r.path}`
    : `dist/${r.path ? r.path + "/" : ""}index.html`;
  const depth = r.path.endsWith(".html")
    ? r.path.split("/").length - 1
    : r.path
      ? r.path.split("/").length
      : 0;
  const prefix = depth ? "../".repeat(depth) : "./";
  const canonical =
    base + (r.canonical ?? r.path) + ((r.canonical ?? r.path) ? "/" : "");
  const title = esc(r.title + " — 25 городов");
  const description = esc(
    r.description ||
      `${r.title}. Мастер-планы развития городов Дальнего Востока, проекты, программы и материалы.`,
  );
  let h = template
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /name="app-base" content="[^"]*"/,
      `name="app-base" content="${prefix}"`,
    )
    .replace(/(href|src)="\.\/assets\//g, `$1="${prefix}assets/`)
    .replace(/url\("\.\/assets\//g, `url("${prefix}assets/`)
    .replace(
      /(<meta\s+name="description"\s+content=")[^"]*(")/,
      `$1${description}$2`,
    )
    .replace(
      "</head>",
      `<link rel="canonical" href="${canonical}"/><meta property="og:title" content="${title}"/><meta property="og:description" content="${description}"/><meta property="og:type" content="${r.type === "article" ? "article" : "website"}"/><meta property="og:url" content="${canonical}"/></head>`,
    )
    .replace(
      '<div id="root"></div>',
      `<div id="root"></div><noscript><main><h1>${esc(r.title)}</h1><p>Для работы карты и фильтров включите JavaScript.</p><a href="${prefix}">Главная</a> · <a href="${prefix}regions/">Регионы</a> · <a href="${prefix}projects/">Проекты</a> · <a href="${prefix}news/">Новости</a></main></noscript>`,
    );
  await mkdir(file.slice(0, file.lastIndexOf("/")), { recursive: true });
  await writeFile(file, h);
}
await writeFile("dist/routes.json", JSON.stringify(routes));
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes
    .filter((r) => r.type !== "alias")
    .map((r) => `<url><loc>${base}${r.path}${r.path ? "/" : ""}</loc></url>`)
    .join("")}</urlset>`,
);
await writeFile(
  "dist/robots.txt",
  `User-agent: *\nAllow: /\nSitemap: ${base}sitemap.xml\n`,
);
await writeFile(
  "dist/404.html",
  template
    .replaceAll("./assets/", "/25-erdc/assets/")
    .replace(
      'name="app-base" content="./"',
      'name="app-base" content="/25-erdc/"',
    )
    .replace(
      "<title>25 городов — Новый облик Дальнего Востока</title>",
      "<title>Страница не найдена — 25 городов</title>",
    ),
);
console.log(
  `Emitted ${routes.length} static routes; ${routes.filter((r) => r.type !== "alias").length} canonical pages.`,
);
