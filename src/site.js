const nested =
  /\/(primorye|buryatia|vladivostok|map-lab)\/(?:index\.html)?$/.test(
    location.pathname,
  );
export const siteRoot = new URL(nested ? "../" : "./", document.baseURI);
export const siteHref = (page = "", hash = "") =>
  new URL(`${page ? `${page}/` : ""}${hash}`, siteRoot).href;
export const currentPage =
  location.pathname.match(
    /\/(primorye|buryatia|vladivostok)\/(?:index\.html)?$/,
  )?.[1] || "home";
export const officialRoot = "https://xn--25-flcdf3dabp.xn--p1ai";
