// Keep old shared links on the exact historical application before loading portal CSS.
const path = location.pathname;
const oldRootLink = new URLSearchParams(location.search).get("v")?.startsWith("20260922");
const cityAlias = /\/cities\/vladivostok\/(?:index\.html)?$/.test(path);
if (cityAlias || (oldRootLink && !/\/vladivostok\//.test(path))) {
  const base = import.meta.env.DEV ? "/" : document.querySelector('meta[name="app-base"]')?.content || "./";
  const target = new URL("vladivostok/", new URL(base, document.baseURI));
  target.search = location.search;
  target.hash = location.hash;
  location.replace(target.href);
} else {
  import("./portal-entry.jsx");
}
