import { createContext, useContext, useEffect, useRef, useState } from "react";
import { news, media, dateText } from "./data.js";
import { siteHref, siteRoot } from "../site.js";
import { X, ArrowLeft, ArrowRight } from "./icons.jsx";
import { ShareButton } from "./interactions.jsx";
import { filterNews } from "./news-filter.js";

const NewsContext = createContext(null);
export const newsHref = id => siteHref("news", `?news=${encodeURIComponent(id)}`);
const selectedNews = () => new URLSearchParams(location.search).get("news");

export function NewsLink({ post, children, onOpen, collection, ...props }) {
  const open = useContext(NewsContext);
  return <a {...props} href={newsHref(post.id)} aria-haspopup="dialog" onClick={e => {
    if (!open || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const trigger = e.currentTarget;
    onOpen?.();
    open(post.id, trigger, false, collection);
  }}>{children}</a>;
}

export function NewsProvider({ children }) {
  const [id, setId] = useState(selectedNews);
  const fromURL = () => { const p=new URLSearchParams(location.search); return filterNews(news,{query:p.get("q")||"",year:p.get("year")||"",territory:p.get("news-region")||"",sort:p.get("sort")||"newest"}).map(n=>n.id); };
  const [collection,setCollection] = useState(fromURL);
  const trigger = useRef(null);
  const post = news.find(n => n.id === id);
  useEffect(() => {
    const sync = () => { setId(selectedNews()); setCollection(history.state?.newsCollection || fromURL()); };
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  const open = (next, element, replace = false, order) => {
    if (element) trigger.current = element;
    const nextCollection=order||collection;
    if(order)setCollection(order);
    const url = new URL(location.href);
    url.searchParams.set("news", next);
    if (replace) history.replaceState(history.state, "", url);
    else history.pushState({ ...history.state, newsModal: true, newsCollection:nextCollection }, "", url);
    setId(next);
  };
  const close = () => {
    if (history.state?.newsModal) history.back();
    else {
      const url = new URL(location.href); url.searchParams.delete("news");
      history.replaceState(history.state, "", url); setId(null);
    }
  };
  return <NewsContext.Provider value={open}>
    {children}
    {post && <NewsDialog post={post} collection={collection.includes(post.id)?collection:news.map(n=>n.id)} onClose={close} onChange={next => open(next, null, true)} trigger={trigger} />}
  </NewsContext.Provider>;
}

function NewsBody({ post, onProgress }) {
  const [state, setState] = useState({ loading: true });
  const [attempt, retry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState({ loading: true });
    fetch(new URL(`content/news/${post.id}.json`, siteRoot), { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => setState({ body: data.body.replace(/src="(https:[^"]+)"/g, (_, url) => `src="${media(url)}"`) }))
      .catch(e => { if (e.name !== "AbortError") setState({ error: true }); });
    return () => controller.abort();
  }, [post.id, attempt]);
  useEffect(() => { onProgress(); }, [state]);
  if (state.loading) return <div className="p-loading" role="status"><span />Загружаем новость…</div>;
  if (state.error) return <div className="p-empty"><p>Не удалось загрузить новость</p><button className="p-button" onClick={() => retry(attempt + 1)}>Повторить <ArrowRight size={18} /></button></div>;
  return <div className="p-prose" dangerouslySetInnerHTML={{ __html: state.body }} />;
}

function NewsDialog({ post, collection, onClose, onChange, trigger }) {
  const dialog = useRef(null), scroller = useRef(null), heading = useRef(null);
  const [progress, setProgress] = useState(0);
  const index = collection.indexOf(post.id);
  const updateProgress = () => {
    const el = scroller.current;
    if (el) setProgress(el.scrollHeight <= el.clientHeight ? 100 : Math.min(100, el.scrollTop / (el.scrollHeight - el.clientHeight) * 100));
  };
  useEffect(() => {
    const el = dialog.current;
    const oldOverflow = document.body.style.overflow;
    el.showModal(); document.body.style.overflow = "hidden";
    return () => {
      el.close(); document.body.style.overflow = oldOverflow;
      if (trigger.current?.isConnected) trigger.current.focus({ preventScroll: true });
      else document.querySelector('[aria-label="Поиск по сайту"]')?.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    scroller.current.scrollTop = 0;
    heading.current.focus({ preventScroll: true });
    setProgress(0);
    const oldTitle = document.title; document.title = `${post.title} — 25 городов`;
    return () => { document.title = oldTitle; };
  }, [post.id]);
  return <dialog ref={dialog} className="portal p-news-dialog" aria-labelledby="news-dialog-title"
    onCancel={e => { e.preventDefault(); onClose(); }}
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="p-news-dialog-frame">
      <header className="p-news-dialog-toolbar">
        <span>Новости / {index + 1} из {collection.length}</span>
        <ShareButton url={newsHref(post.id)} label="Поделиться" />
        <button className="p-icon-button" onClick={onClose} aria-label="Закрыть новость"><X size={25} /></button>
        <div className="p-reading-progress" aria-hidden="true"><i style={{ width: `${progress}%` }} /></div>
      </header>
      <div className="p-news-dialog-scroll" ref={scroller} onScroll={updateProgress}>
        <article>
          <div className="p-article-meta"><time dateTime={post.date}>{dateText(post.date)}</time>{post.tags.filter(t => !/^(главная|новости)$/i.test(t)).map(t => <span key={t}>{t}</span>)}</div>
          <h2 ref={heading} tabIndex={-1} id="news-dialog-title">{post.title}</h2>
          {post.image && <img className="p-news-dialog-cover" src={media(post.image)} alt="" onLoad={updateProgress} />}
          <NewsBody key={post.id} post={post} onProgress={updateProgress} />
        </article>
        <footer className="p-news-dialog-next">
          <button disabled={index === 0} onClick={() => onChange(collection[index - 1])}><ArrowLeft size={19} />Предыдущая новость</button>
          <button disabled={index === collection.length - 1} onClick={() => onChange(collection[index + 1])}>Следующая новость<ArrowRight size={19} /></button>
        </footer>
      </div>
    </div>
  </dialog>;
}
