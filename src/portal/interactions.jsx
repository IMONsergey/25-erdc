import { useEffect, useRef, useState } from "react";
import { Check, Copy, ArrowUpRight } from "./icons.jsx";

// Keep each control in the URL without discarding another feature's parameters.
export function useQueryState(key, fallback = "") {
  const read = () => new URLSearchParams(location.search).get(key) ?? fallback;
  const [value, setValue] = useState(read);
  useEffect(() => {
    const sync = () => setValue(read());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [key, fallback]);
  const update = (next) => {
    const text = String(next);
    setValue(text);
    const url = new URL(location.href);
    if (text && text !== String(fallback)) url.searchParams.set(key, text);
    else url.searchParams.delete(key);
    history.replaceState(history.state, "", url);
  };
  return [value, update];
}

export function ShareButton({ url, label = "Скопировать ссылку" }) {
  const [state, setState] = useState("");
  const timer = useRef(null);
  useEffect(() => { setState(""); return () => clearTimeout(timer.current); }, [url]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url || location.href);
      setState("Ссылка скопирована");
      timer.current = setTimeout(() => setState(""), 2500);
    } catch { setState("Выделите и скопируйте ссылку"); }
  };
  return <span className="p-share-control">
    <button className="p-text-link" onClick={copy}>
      {state === "Ссылка скопирована" ? <Check size={18} /> : <Copy size={18} />}
      <span aria-live="polite">{state || label}</span>
    </button>
    {state === "Выделите и скопируйте ссылку" && <input aria-label="Ссылка для копирования" readOnly value={url || location.href} onFocus={e => e.target.select()} />}
  </span>;
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const sync = () => setVisible(window.scrollY > 800);
    sync(); window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);
  return visible && <a className="p-back-top" href="#top" aria-label="Вернуться к началу страницы"><ArrowUpRight size={22} /></a>;
}
