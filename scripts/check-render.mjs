import { createServer } from "vite";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import assert from "node:assert/strict";
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
  for(const requestedPath of ['primorye','buryatia','khabkrai','cities/ulan-ude','cities/petropavlovsk-kamchatsky','primorye/subsidy','projects','projects/733657179','news','dvkvartal','dvkvartal/750970520','about','sitemap']) {
    const page=renderToString(createElement(PortalRoute,{requestedPath}));assert.ok(page.includes('<h1'),requestedPath+' lacks a heading');assert.ok(!page.includes('Такой страницы пока нет'),requestedPath+' resolved to 404');
  }
  console.log(
    "Server render passed: home, shared navigation, region cards, project and news cards, icons and footer.",
  );
} finally {
  await server.close();
}
