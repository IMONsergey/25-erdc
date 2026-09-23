import { useEffect } from "react";
import { siteHref } from "../site.js";

// Always open the isolated approved application at its canonical URL.
// Never compose another Vladivostok page with the shared portal stylesheet.
export default function VladivostokPage() {
  const target = siteHref("vladivostok", location.search + location.hash);
  useEffect(() => { location.replace(target); }, [target]);
  return <a href={target}>Владивостокская агломерация</a>;
}
