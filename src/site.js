const declaredBase = document.querySelector('meta[name="app-base"]')?.content;
const legacyNested =
  /\/(primorye|buryatia|vladivostok|map-lab|qa)\/(?:index\.html)?$/.test(
    location.pathname,
  );
export const siteRoot = new URL(
  import.meta.env.DEV ? "/" : declaredBase || (legacyNested ? "../" : "./"),
  document.baseURI,
);
export const siteHref = (page = "", hash = "") =>
  new URL(
    `${page ? `${page.replace(/^\/+|\/+$/g, "")}/` : ""}${hash}`,
    siteRoot,
  ).href;
export const currentPath = decodeURI(
  location.pathname.slice(siteRoot.pathname.length),
).replace(/(?:\/index\.html|index\.html|\/$)/, "");
export const currentPage = currentPath.split("/")[0] || "home";
export const officialRoot = "https://xn--25-flcdf3dabp.xn--p1ai";
