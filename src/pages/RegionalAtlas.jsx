import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Icon from "../components/Icon.jsx";
import { Search } from "../portal/icons.jsx";
import { media, cityById, cityPath } from "../portal/data.js";
import { siteHref, siteRoot } from "../site.js";
import atlasIndex from "../content/atlas-regions.json";
import "./regional-atlas.css";

const RegionalMap = lazy(() => import("./RegionalMap.jsx"));
const categories = [
  { id: "housing", title: "Жильё и среда", icon: "housing", color: "#79dffa" },
  { id: "social", title: "Социальная среда", icon: "social", color: "#bbcbff" },
  { id: "transport", title: "Транспорт", icon: "transport", color: "#ffd09c" },
  { id: "engineering", title: "Инфраструктура", icon: "engineering", color: "#a3dbed" },
  { id: "ecology", title: "Парки и экология", icon: "ecology", color: "#a0e3b3" },
  { id: "tourism", title: "Туризм", icon: "tourism", color: "#cbb7f8" },
  { id: "economy", title: "Экономика", icon: "economy", color: "#fae5ad" },
];
const stages = { planned: "Запланировано", prep: "Подготовка", design: "Проектирование", build: "Строительство", operation: "Эксплуатация" };
const normalize = s => s.toLowerCase().replaceAll("ё", "е");
const money = n => n >= 1e9 ? `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(n / 1e9)} млрд ₽` : `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 }).format(n / 1e6)} млн ₽`;
const date = value => /^\d{4}-\d{2}-\d{2}/.test(value) ? new Date(`${value.slice(0,10)}T12:00:00Z`).toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "numeric" }) : value;
const projectSearch = () => new URLSearchParams(globalThis.location?.search || "");
const objectWord = n => n % 100 >= 11 && n % 100 <= 14 ? "объектов" : n % 10 === 1 ? "объект" : n % 10 >= 2 && n % 10 <= 4 ? "объекта" : "объектов";

export default function RegionalAtlas({ region, focusCity }) {
  const meta = atlasIndex[region.id];
  const section = useRef(null), stage = useRef(null), api = useRef(null), list = useRef(null), detail = useRef(null), expandButton = useRef(null), previousFocus = useRef(null);
  const [entered, setEntered] = useState(false), [data, setData] = useState(null), [error, setError] = useState(false), [attempt, setAttempt] = useState(0);
  const [planId, setPlanId] = useState(() => meta.plans.some(p => p.id === projectSearch().get("atlas-city")) ? projectSearch().get("atlas-city") : "");
  const [category, setCategory] = useState(""), [query, setQuery] = useState(""), [stageId, setStageId] = useState("");
  const [selected, setSelected] = useState(() => projectSearch().get("object")), [expanded, setExpanded] = useState(false), [light, setLight] = useState(false), [clusterIds, setClusterIds] = useState(null), [limit, setLimit] = useState(40), [imageIndex, setImageIndex] = useState(0), [copied, setCopied] = useState(false), [copyFallback, setCopyFallback] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const onReady = useCallback(value => { api.current = value; setMapReady(Boolean(value)); }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) { setEntered(true); observer.disconnect(); } }, { rootMargin: "900px" });
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!entered) return;
    const controller = new AbortController();
    setError(false);
    fetch(new URL(`content/atlas/${region.id}.json`, siteRoot), { signal: controller.signal }).then(r => { if (!r.ok) throw new Error("Atlas unavailable"); return r.json(); }).then(result => { setData(result); const object = result.objects.find(o => o.id === projectSearch().get("object")); if (object) { setPlanId(object.planId); setSelected(object.id); } }).catch(e => { if (e.name !== "AbortError") setError(true); });
    return () => controller.abort();
  }, [entered, attempt, region.id]);
  useEffect(() => {
    if (!focusCity) return;
    const plan = meta.plans.find(p => p.cityIds.includes(focusCity.city));
    setPlanId(plan?.id || ""); setCategory(""); setQuery(""); setStageId(""); setSelected(null); setClusterIds(null); setEntered(true);
  }, [focusCity]);
  const filtered = useMemo(() => (data?.objects || []).filter(o => (!planId || o.planId === planId) && (!category || o.category === category) && (!stageId || o.stage === stageId) && (!query || normalize(`${o.title} ${o.description} ${o.address} ${o.industry}`).includes(normalize(query)))), [data, planId, category, stageId, query]);
  const shown = clusterIds ? filtered.filter(o => clusterIds.includes(o.id)) : filtered;
  const object = data?.objects.find(o => o.id === selected);
  const objectPlan = meta.plans.find(p => p.id === object?.planId);
  const activeCategory = categories.find(c => c.id === category);
  const changeFilter = fn => { fn(); setSelected(null); setClusterIds(null); setLimit(40); setImageIndex(0); list.current?.scrollTo({ top: 0 }); };
  const choose = useCallback(id => {
    previousFocus.current = document.activeElement;
    setSelected(id); setImageIndex(0); setCopied(false); setCopyFallback(false);
  }, []);
  const closeDetail = () => { setSelected(null); previousFocus.current?.focus({ preventScroll: true }); };
  useEffect(() => {
    if (!selected || expanded) return;
    const onKey = e => { if (e.key === "Escape") { setSelected(null); previousFocus.current?.focus({ preventScroll: true }); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, expanded]);
  const onCluster = useCallback(ids => { setClusterIds(ids); setSelected(null); setLimit(40); list.current?.scrollTo({ top: 0 }); }, []);
  useEffect(() => {
    if (!object) return;
    if (matchMedia("(max-width: 899px)").matches) detail.current?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "nearest" });
  }, [object]);
  useEffect(() => {
    if (!data) return;
    const url = new URL(location.href);
    planId ? url.searchParams.set("atlas-city", planId) : url.searchParams.delete("atlas-city");
    selected ? url.searchParams.set("object", selected) : url.searchParams.delete("object");
    history.replaceState(history.state, "", url);
  }, [planId, selected, data]);
  useEffect(() => {
    if (!expanded) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    expandButton.current?.focus();
    const onKey = e => {
      if (e.key === "Escape") { setExpanded(false); expandButton.current?.focus(); }
      if (e.key === "Tab") {
        const nodes = [...stage.current.querySelectorAll('button:not(:disabled),a[href],input,select,[tabindex="0"]')].filter(n => n.getClientRects().length);
        if (e.shiftKey && document.activeElement === nodes[0]) { e.preventDefault(); nodes.at(-1)?.focus(); }
        if (!e.shiftKey && document.activeElement === nodes.at(-1)) { e.preventDefault(); nodes[0]?.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = before; window.removeEventListener("keydown", onKey); };
  }, [expanded]);
  const reset = () => { changeFilter(() => { setPlanId(""); setCategory(""); setStageId(""); setQuery(""); }); api.current?.fit(data?.objects || []); };
  const share = async () => { try { const url = new URL(location.href); url.hash = "projects"; await navigator.clipboard.writeText(url.href); setCopied(true); } catch { setCopied(false); setCopyFallback(true); } };
  const index = shown.findIndex(o => o.id === selected);
  const next = amount => choose(shown[(index + amount + shown.length) % shown.length].id);
  return <section id="projects" className="projects-section regional-atlas-section" aria-labelledby="projects-title" ref={section}>
    <div className="projects-overture"><div className="projects-intro shell reveal"><div><span className="section-kicker">03 / Масштаб преобразований</span><h2 className="section-title" id="projects-title">Регион меняется.<br /><span>Здесь и сейчас.</span></h2></div><div className="projects-total"><strong>{meta.count}</strong><span>{objectWord(meta.count)} развития<br />в мастер-планах региона</span></div></div></div>
    <div className={`regional-atlas-stage ${expanded ? "is-expanded" : ""} ${object ? "has-selection" : ""}`} ref={stage} role={expanded ? "dialog" : "region"} aria-modal={expanded ? true : undefined} aria-label={`Атлас проектов — ${region.name}`} style={{ "--atlas-accent": activeCategory?.color || "#79dffa" }}>
      {data && <Suspense fallback={null}><RegionalMap objects={filtered} plans={data.plans} selected={selected} expanded={expanded} light={light} onChoose={choose} onCluster={onCluster} onReady={onReady} /></Suspense>}
      {!mapReady && <div className="regional-map-loading" role="status"><Icon name="globe" size={40} /><span>{error ? "Не удалось открыть карту" : "Загружаем карту региона"}</span>{error && <button onClick={() => setAttempt(attempt + 1)}>Попробовать ещё раз</button>}</div>}
      <div className="regional-map-vignette" aria-hidden="true" />
      <aside className="regional-atlas-sidebar">
        <div className="regional-sidebar-head"><span className="section-kicker">Атлас развития</span><h3>{region.name}</h3><span>{meta.count} {objectWord(meta.count)} · {meta.plans.length} {meta.plans.length === 1 ? "мастер-план" : meta.plans.length < 5 ? "мастер-плана" : "мастер-планов"}</span></div>
        <div className="regional-atlas-filters"><label className="regional-atlas-search"><Search size={19} /><input aria-label="Найти объект в регионе" placeholder="Найти объект" value={query} onChange={e => changeFilter(() => setQuery(e.target.value))} /><button aria-label="Очистить поиск" hidden={!query} onClick={() => changeFilter(() => setQuery(""))}><Icon name="close" size={18} /></button></label>
          <div className="regional-atlas-selects"><label><span className="visually-hidden">Город на карте региона</span><select aria-label="Город на карте региона" value={planId} onChange={e => changeFilter(() => setPlanId(e.target.value))}><option value="">Все территории</option>{meta.plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label><span className="visually-hidden">Стадия объекта</span><select aria-label="Стадия объекта" value={stageId} onChange={e => changeFilter(() => setStageId(e.target.value))}><option value="">Все стадии</option>{Object.entries(stages).map(([key,label]) => <option key={key} value={key}>{label}</option>)}</select></label></div>
        </div>
        <div className="regional-atlas-categories" aria-label="Направления развития региона"><button className={!category ? "is-active" : ""} aria-pressed={!category} onClick={() => changeFilter(() => setCategory(""))}><Icon name="globe" size={21} /><span>Все направления</span><small>{(data?.objects || []).filter(o => !planId || o.planId === planId).length || meta.count}</small></button>{categories.filter(c => meta.categories[c.id]).map(c => { const count = data ? data.objects.filter(o => o.category === c.id && (!planId || o.planId === planId)).length : meta.categories[c.id]; return <button key={c.id} className={category === c.id ? "is-active" : ""} aria-pressed={category === c.id} disabled={!count} style={{ "--category-color": c.color }} onClick={() => changeFilter(() => setCategory(c.id))}><Icon name={c.icon} size={20} /><span>{c.title}</span><small>{count}</small></button>; })}</div>
        <div className="regional-list-heading"><span aria-live="polite">{clusterIds ? "Объекты рядом" : "Объекты на карте"} <b>{shown.length}</b></span>{(clusterIds || query || category || planId || stageId) && <button onClick={clusterIds ? () => setClusterIds(null) : reset}>{clusterIds ? "Все объекты" : "Сбросить"}</button>}</div>
        <div className="regional-atlas-list" ref={list} aria-label="Объекты региона">{shown.slice(0,limit).map((o,i) => <button key={o.id} className={selected === o.id ? "is-active" : ""} aria-pressed={selected === o.id} onClick={() => choose(o.id)}><span className="regional-object-number">{String(i + 1).padStart(2,"0")}</span><span><strong>{o.title}</strong><small>{meta.plans.find(p => p.id === o.planId)?.name}</small></span><Icon name="arrow" size={17} /></button>)}{data && !shown.length && <div className="regional-atlas-empty"><strong>Ничего не найдено</strong><p>Попробуйте другое название или измените фильтры.</p><button onClick={reset}>Сбросить фильтры</button></div>}{limit < shown.length && <button className="regional-load-more" onClick={() => setLimit(limit + 40)}>Показать ещё <Icon name="plus" size={18} /></button>}</div>
      </aside>
      <div className="regional-map-toolbar"><span className="regional-map-count">{filtered.filter(o => o.coordinates).length} {objectWord(filtered.filter(o => o.coordinates).length)} на карте</span><button aria-label="Приблизить карту" disabled={!mapReady} onClick={() => api.current?.zoom(1)}><Icon name="plus" size={22} /></button><button aria-label="Отдалить карту" disabled={!mapReady} onClick={() => api.current?.zoom(-1)}><Icon name="minus" size={22} /></button><button aria-label="Общий вид региона" disabled={!mapReady} onClick={() => { setSelected(null); setClusterIds(null); api.current?.fit(); }}><Icon name="reset" size={21} /></button><button aria-label={light ? "Тёмная карта" : "Светлая карта"} aria-pressed={light} onClick={() => setLight(!light)}><Icon name="globe" size={22} /></button><button ref={expandButton} aria-label={expanded ? "Закрыть полный экран" : "Открыть карту на весь экран"} aria-expanded={expanded} onClick={() => setExpanded(!expanded)}><Icon name={expanded ? "close" : "expand"} size={21} /></button></div>
      {object && <article className="regional-object-card" ref={detail} aria-label={object.title} aria-live="polite"><div className="regional-object-top"><span><Icon name={categories.find(c => c.id === object.category)?.icon || "pin"} size={18} />{object.industry}</span><button aria-label="Закрыть карточку объекта" onClick={closeDetail}><Icon name="close" size={22} /></button></div><div className="regional-object-scroll"><figure className="regional-object-image"><img src={media(object.images[imageIndex] || objectPlan.image)} alt={object.images.length ? object.title : objectPlan.name} /><figcaption>{object.images.length ? objectPlan.name : `Город · ${objectPlan.name}`}</figcaption>{object.images.length > 1 && <div className="regional-image-controls"><button aria-label="Предыдущее изображение" onClick={() => setImageIndex((imageIndex - 1 + object.images.length) % object.images.length)}><Icon name="left" size={18} /></button><span>{imageIndex + 1} / {object.images.length}</span><button aria-label="Следующее изображение" onClick={() => setImageIndex((imageIndex + 1) % object.images.length)}><Icon name="right" size={18} /></button></div>}</figure><div className="regional-object-copy"><span className={`regional-object-status stage-${object.stage}`}>{stages[object.stage] || "В мастер-плане"}</span><h3>{object.title}</h3>{object.description && normalize(object.description) !== normalize(object.title) && <p>{object.description}</p>}<dl>{object.budget && <div className="regional-object-budget"><dt>Объём финансирования</dt><dd>{money(object.budget)}</dd></div>}{object.deadline && <div><dt>Срок реализации</dt><dd>{date(object.deadline)}</dd></div>}<div><dt>Территория</dt><dd>{objectPlan.name}</dd></div>{object.address && !/Местоположение установлен/i.test(object.address) && <div><dt>Адрес</dt><dd>{object.address}</dd></div>}</dl><div className="regional-object-links"><a href={siteHref(cityPath(cityById[object.cityId]))}>Мастер-план территории<Icon name="arrow" size={19} /></a>{object.projectId && <a href={siteHref(`projects/${object.projectId}`)}>Подробнее о проекте<Icon name="arrow" size={19} /></a>}<button onClick={share}>{copied ? "Ссылка скопирована" : "Скопировать ссылку"}<Icon name={copied ? "check" : "external"} size={18} /></button>{copyFallback && <input aria-label="Ссылка на объект" readOnly value={location.href.replace(/#.*$/, "") + "#projects"} onFocus={e => e.target.select()} />}</div></div></div><div className="regional-object-navigation"><button aria-label="Предыдущий объект" disabled={shown.length < 2} onClick={() => next(-1)}><Icon name="left" size={22} /></button><span><strong>{index + 1}</strong> / {shown.length}<small>Объекты направления</small></span><button aria-label="Следующий объект" disabled={shown.length < 2} onClick={() => next(1)}><Icon name="right" size={22} /></button></div></article>}
      <div className="regional-map-credit"><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a></div>
    </div>
  </section>;
}
