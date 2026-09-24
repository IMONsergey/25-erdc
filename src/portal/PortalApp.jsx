import UnifiedFooter from '../editorial/UnifiedFooter.jsx';
import {EditorialHome,EditorialRegions} from '../editorial/EditorialPages.jsx';
import EditorialMotion from '../editorial/Motion.jsx';
import { useState, useEffect, useRef, useMemo, lazy, Suspense } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  Search,
  Menu,
  X,
  Plus,
  Minus,
  MapPin,
  Map as MapIcon,
  Grid2X2,
  List,
  Building2,
  Trees,
  School,
  ChevronDown,
  ExternalLink,
  SlidersHorizontal,
  Copy,
  Check,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
} from "./icons.jsx";
import { siteHref, currentPath, siteRoot } from "../site.js";
import { asset } from "../data.js";
import { selectedProjects } from "../selectedProjects.js";
import { NewsProvider, NewsLink } from "./NewsModal.jsx";
import { useQueryState, ShareButton, BackToTop } from "./interactions.jsx";
import { MasterplanFinder, ProjectJourney } from "./Experience.jsx";
import { filterNews } from "./news-filter.js";
import TerritoryPage from "../pages/TerritoryPage.jsx";
import VladivostokPage from "../pages/VladivostokPage.jsx";
import {parentTerritory,territoryName,projectDestination} from '../content/territory-model.js';
import CatalogProjectDialog from './CatalogProjectDialog.jsx';
import {
  regions,
  cities,
  projects,
  quarter,
  news,
  regionById,
  cityById,
  projectById,
  media,
  regionPath,
  cityPath,
  projectHref,
  dateText,
  normalize,
  programNames,
  regionShort,
  regionMood,
} from "./data.js";
const ApprovedProjectPage = lazy(() => import("./ApprovedProjectPage.jsx"));
const PortalMap = lazy(() => import("./PortalMap.jsx"));
const legacyVladivostok = !currentPath && /^20260922(?:-|$)/.test(new URLSearchParams(location.search).get("v") || "");
const fmt = (n) => String(n).padStart(2, "0");
const Arrow = ({ size = 22, ...p }) => (
  <ArrowUpRight size={size} strokeWidth={1.6} {...p} />
);
const LinkButton = ({ href, children, light = false, ...rest }) => (
  <a
    className={`p-button ${light ? "p-button-light" : ""}`}
    href={href}
    {...rest}
  >
    {children}
    <Arrow />
  </a>
);
function Image({ src, alt = "", className = "", priority = false, ...rest }) {
  return src ? (
    <img
      src={media(src)}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      {...rest}
    />
  ) : null;
}
function Eyebrow({ children, number }) {
  return (
    <div className="p-eyebrow">
      {number && <span>{number}</span>}
      {children}
    </div>
  );
}
function Breadcrumbs({ items = [] }) {
  return (
    <nav className="p-breadcrumbs" aria-label="Хлебные крошки">
      <a href={siteHref()}>Главная</a>
      {items.map(([label, path], i) => (
        <span key={i}>
          <span aria-hidden="true">/</span>
          {path ? (
            <a href={siteHref(path)}>{label}</a>
          ) : (
            <span aria-current="page">{label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
function SectionHead({
  number,
  title,
  children,
  href,
  label = "Смотреть все",
}) {
  return (
    <div className="p-section-head">
      <div>
        <Eyebrow number={number}>{children}</Eyebrow>
        <h2>{title}</h2>
      </div>
      {href && (
        <a className="p-text-link" href={href}>
          {label}
          <Arrow />
        </a>
      )}
    </div>
  );
}
function Stats({ items, className = "" }) {
  return (
    <dl className={`p-stats ${className}`}>
      {items.map((s, i) => (
        <div key={i}>
          <dd>
            {s.value.replaceAll(" км 2", " км²").replaceAll(" м 2", " м²")}
          </dd>
          <dt>{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}
function useDocument(path) {
  const [state, set] = useState({ loading: true, data: null, error: false });
  useEffect(() => {
    const controller = new AbortController();
    set({ loading: true, data: null, error: false });
    fetch(new URL(`content/${path}.json`, siteRoot), {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => set({ loading: false, data, error: false }))
      .catch((e) => {
        if (e.name !== "AbortError")
          set({ loading: false, data: null, error: true });
      });
    return () => controller.abort();
  }, [path]);
  return state;
}
function Loading() {
  return (
    <div className="p-loading" role="status">
      <span />
      Загружаем материалы…
    </div>
  );
}
function DocError() {
  return (
    <div className="p-empty">
      <h3>Не удалось загрузить материалы</h3>
      <button className="p-button" onClick={() => location.reload()}>
        Попробовать ещё раз <ArrowRight size={20} />
      </button>
    </div>
  );
}
function Header() {
  const vladivostok = legacyVladivostok || ["vladivostok", "cities/vladivostok"].includes(currentPath);
  const regionalMap = regions.some(r => regionPath(r) === currentPath);
  const cityMap = currentPath.startsWith("cities/");
  useEffect(() => {
    const shortcut = e => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !document.querySelector("dialog[open]") && !["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName) && !e.target.isContentEditable) { e.preventDefault(); setSearch(true); setOpen(false); }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  const [open, setOpen] = useState(false),
    [search, setSearch] = useState(false),
    [q, setQ] = useState(""),
    [scroll, setScroll] = useState(window.scrollY > 20);
  const dialog = useRef(null);
  const trigger = useRef(null);
  const searchTrigger = useRef(null);
  const restoreFocus = () =>
    (search ? searchTrigger : trigger).current?.focus();
  useEffect(() => {
    const fn = () => setScroll(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    if (!open && !search) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSearch(false);
        restoreFocus();
      }
      if (e.key === "Tab") {
        const nodes = [
          ...dialog.current.querySelectorAll("a[href],button,input"),
        ].filter((n) => n.getClientRects().length);
        const first = nodes[0],
          last = nodes.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", close);
    requestAnimationFrame(() =>
      dialog.current?.querySelector(search ? "input" : "button")?.focus(),
    );
    return () => {
      document.body.style.overflow = old;
      window.removeEventListener("keydown", close);
    };
  }, [open, search]);
  const term = normalize(q.trim());
  const matches =
    term.length > 1
      ? [
          ...regions.map((r) => ({
            name: r.name,
            path: regionPath(r),
            kind: "Регион",
          })),
          ...cities.map((c) => ({
            name: c.id === "vladivostok" ? "Владивостокская агломерация" : c.name,
            path: cityPath(c),
            hash: parentTerritory(c.id)!==c.id ? `?city=${c.id}#regions` : '',
            kind: c.id === "vladivostok" ? "Агломерация" : "Город",
          })),
          ...projects.map((p) => ({
            name: p.title,
            path: "",
            absolute: projectHref(p),
            kind: cityById[p.city]?.name || regionShort[p.region],
          })),
          ...quarter.projects.map(p => ({ name: `${p.name} — ${quarterRegion(p.region)}`, path: "dvkvartal", hash: `#quarter-${p.id}`, kind: "ДВ Квартал" })),
          ...news.map((n) => ({
            name: n.title,
            path: `news/tpost/${n.id}`,
            kind: "Новость",
            post: n,
          })),
        ]
          .filter((x) => normalize(x.name).includes(term))
          .slice(0, 35)
      : [];
  return (
    <>
      <header className={`p-header ${scroll ? "p-header-scrolled" : ""}`}>
        <a
          className="p-brand"
          href={siteHref()}
          aria-label="25 городов — главная"
        >
          <img
            src={asset("logo-25-cities.svg")}
            alt="25 городов"
            width="126"
            height="30"
          />
        </a>
        <span className="p-brand-caption">
          Новый облик
          <br />
          Дальнего Востока
        </span>
        <nav aria-label="Основная навигация">
          <a href={siteHref("about")}>О проекте</a>
          <a href={siteHref("regions")}>Регионы</a>
          <a href={siteHref("dvkvartal")}>ДВ Квартал</a>
          <a href={siteHref("news")}>Новости</a>
        </nav>
        <a className="p-header-map" href={vladivostok || cityMap ? "#projects" : regionalMap ? "#masterplans" : siteHref("regions")}>
          <MapIcon size={17} />
          {vladivostok || cityMap ? "Проекты на карте" : "Выбрать мастер-план"}
        </a>
        <button
          ref={searchTrigger}
          aria-label="Поиск по сайту"
          className="p-icon-button"
          onClick={() => {
            setSearch(true);
            setOpen(false);
          }}
        >
          <Search size={21} />
        </button>
        <button
          ref={trigger}
          className="p-icon-button p-menu-trigger"
          aria-label="Открыть меню"
          aria-expanded={open}
          onClick={() => {
            setOpen(true);
            setSearch(false);
          }}
        >
          <Menu size={24} />
        </button>
      </header>
      {(open || search) && (
        <div
          ref={dialog}
          className="p-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={search ? "Поиск по сайту" : "Меню сайта"}
        >
          <div className="p-overlay-top">
            <a href={siteHref()}>
              <img
                src={asset("logo-25-cities.svg")}
                alt="25 городов"
                width="140"
              />
            </a>
            <button
              className="p-icon-button"
              aria-label="Закрыть"
              onClick={() => {
                setOpen(false);
                setSearch(false);
                restoreFocus();
              }}
            >
              <X size={30} />
            </button>
          </div>
          {search ? (
            <div className="p-search-panel">
              <Eyebrow>Найти на сайте</Eyebrow>
              <label className="p-global-search">
                <Search size={30} />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Город, проект или новость"
                  aria-label="Поиск по сайту"
                />
                <button
                  className="p-icon-button"
                  aria-label="Очистить поиск"
                  onClick={() => setQ("")}
                >
                  <X size={22} />
                </button>
              </label>
              {term.length < 2 ? (
                <div className="p-search-hints">
                  Попробуйте:{" "}
                  {["Улан-Удэ", "набережная", "школа", "Байкал"].map((s) => (
                    <button key={s} onClick={() => setQ(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-search-results" aria-live="polite">
                  {matches.length ? (
                    matches.map((m, i) => (
                      m.post ? <NewsLink post={m.post} key={i} onOpen={() => { setSearch(false); setOpen(false); }}><span>{m.kind}</span><strong>{m.name}</strong><Arrow /></NewsLink> : <a href={m.absolute||siteHref(m.path, m.hash || "")} key={i}><span>{m.kind}</span><strong>{m.name}</strong><Arrow /></a>
                    ))
                  ) : (
                    <p>
                      По запросу «{q}» ничего не найдено. Попробуйте другое
                      название.
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-mega-layout">
              <nav aria-label="Разделы сайта">
                {[
                  ["", "Главная"],
                  ["about", "О проекте"],
                  ["regions", "Все регионы"],
                  ["projects", "Проекты"],
                  ["dvkvartal", "ДВ Квартал"],
                  ["news", "Новости"],
                  ["map", "Интерактивная карта"],
                ].map(([p, t], i) => (
                  <a key={p} href={siteHref(p)}>
                    <small>{fmt(i + 1)}</small>
                    {t}
                    <Arrow />
                  </a>
                ))}
              </nav>
              <div className="p-mega-regions">
                <Eyebrow>11 регионов Дальнего Востока</Eyebrow>
                {regions.map((r) => (
                  <a href={siteHref(regionPath(r))} key={r.id}>
                    {r.name}
                    <Arrow size={18} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
function Footer(){ return <UnifiedFooter/>; }
function RegionCard({ region: r, index = 0 }) {
  return (
    <a
      className={`p-region-card p-region-card-${index}`}
      href={siteHref(regionPath(r))}
    >
      <Image src={r.image} alt={r.name} />
      <div className="p-card-shade" />
      <span className="p-card-number">{fmt(r.index)}</span>
      <span className="p-card-circle">
        <Arrow />
      </span>
      <div className="p-region-card-copy">
        <small>{r.cities.map((id) => cityById[id].name).join(" · ")}</small>
        <h3>{r.name}</h3>
      </div>
    </a>
  );
}
function CityCard({ city: c, index = 0 }) {
  return (
    <a className="p-city-card" href={siteHref(cityPath(c))}>
      <div className="p-city-image">
        <Image src={c.image} alt={c.name} />
        <span className="p-card-circle">
          <Arrow />
        </span>
        <span className="p-city-index">{fmt(index + 1)}</span>
      </div>
      <div className="p-city-card-text">
        <h3>{territoryName(c)}</h3>
        <span>{c.id === "vladivostok" ? selectedProjects.length : c.projects.length} проектов</span>
      </div>
      <p>{c.mission}</p>
    </a>
  );
}
function ProjectCard({ project: p, index = 0 }) {
  const image = p.images[0];
  return (
    <a
      className={`p-project-card ${!image ? "p-project-card-text" : ""}`}
      href={projectHref(p)}
    >
      {image ? (
        <div className="p-project-image">
          <Image src={image} alt="" />
          <span className="p-card-circle">
            <Arrow />
          </span>
        </div>
      ) : (
        <div className="p-project-noimage">
          <span>{fmt(index + 1)}</span>
          <Arrow size={30} />
        </div>
      )}
      <div className="p-project-body">
        <div className="p-project-meta">
          <span>
            {cityById[p.city]?.name || p.place || regionShort[p.region]}
          </span>
          <span>{programNames[p.program]}</span>
        </div>
        <h3>{p.title}</h3>
        {p.stats.length > 0 && <p>{p.stats.map((s) => s.value).join(" / ")}</p>}
      </div>
    </a>
  );
}
function NewsCard({ post: n, featured = false, collection }) {
  return (
    <NewsLink
      post={n}
      collection={collection}
      className={`p-news-card ${featured ? "p-news-featured" : ""}`}
    >
      <div className="p-news-image">
        <Image src={n.image} alt="" />
        <span className="p-card-circle">
          <Arrow />
        </span>
      </div>
      <time dateTime={n.date}>{dateText(n.date)}</time>
      <h3>{n.title}</h3>
    </NewsLink>
  );
}
function Home(){ return <EditorialHome/>; }
function QuarterTeaser() {
  return (
    <section className="p-quarter-teaser p-shell" id="quarter">
      <div className="p-quarter-teaser-heading">
        <Eyebrow number="04">Дальневосточный квартал</Eyebrow>
        <h2>
          Дом начинается
          <br />
          <em>с города.</em>
        </h2>
        <p>
          Современное жильё, школы, детские сады и общественные пространства
          рядом с домом.
        </p>
        <LinkButton href={siteHref("dvkvartal")}>О программе</LinkButton>
      </div>
      <div className="p-quarter-teaser-image">
        <Image
          src={quarter.projects[0].image}
          alt="Визуализация жилищного проекта в Амурской области"
        />
        <div className="p-quarter-image-caption">
          Дальневосточный квартал<span>07 проектов</span>
        </div>
      </div>
    </section>
  );
}
function Partners() {
  return (
    <section className="p-partners p-shell">
      <Eyebrow>Проекты реализуются при участии</Eyebrow>
      <div>
        {[
          "Минвостокразвития России",
          "Правительство Приморского края",
          "ДОМ.РФ",
          "Корпорация развития Дальнего Востока и Арктики",
          ...regions.slice(4).map((r) => r.name),
        ].map((label, i) => (
          <Image key={i} src={`partner-${i + 1}.webp`} alt={label} />
        ))}
        {[12, 13, 14].map((i) => (
          <Image key={i} src={`partner-${i}.webp`} alt="Партнёр проекта" />
        ))}
      </div>
    </section>
  );
}
function PageHero({
  image,
  title,
  eyebrow,
  crumbs = [],
  children,
  compact = false,
}) {
  return (
    <section
      className={`p-page-hero ${compact ? "p-page-hero-compact" : ""} ${!image ? "p-page-hero-solid" : ""}`}
    >
      {image && (
        <>
          <Image src={image} className="p-hero-photo" alt="" priority />
          <div className="p-hero-shade" />
        </>
      )}
      <div className="p-shell">
        <Breadcrumbs items={crumbs} />
        <div className="p-page-hero-copy">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1>{title}</h1>
          {children}
        </div>
      </div>
    </section>
  );
}
function RegionsPage(){ return <EditorialRegions/>; }
function NextRegion({ region: r }) {
  const next = regions[r.index % regions.length];
  return (
    <a className="p-next-region" href={siteHref(regionPath(next))}>
      <Image src={next.image} alt="" />
      <div className="p-card-shade" />
      <div className="p-shell">
        <Eyebrow>Продолжить путешествие</Eyebrow>
        <h2>{next.name}</h2>
        <span className="p-next-circle">
          <Arrow size={40} />
        </span>
      </div>
    </a>
  );
}
function ProjectRows({ items }) {
  return (
    <div className="p-project-rows">
      {items.map((p, i) => (
        <a key={p.id} href={projectHref(p)}>
          <span>{fmt(i + 1)}</span>
          <div>
            <h3>{p.title}</h3>
            <p>
              {p.texts[0] ||
                p.stats.map((s) => `${s.label}: ${s.value}`).join(" · ")}
            </p>
          </div>
          <Arrow />
        </a>
      ))}
    </div>
  );
}
function CityMaterials({ city }) {
  const state = useDocument(`cities/${city.id}`);
  if (state.loading) return <Loading />;
  if (state.error) return <DocError />;
  const blocks = state.data;
  const materials = [];
  let section = "";
  for (const b of blocks) {
    if (b.type === "255") section = b.title;
    if (
      (section.includes("содержание") ||
        section.includes("Содержание") ||
        section.includes("Визуализац")) &&
      !["255", "396", "995", "1050"].includes(b.type)
    )
      materials.push(b);
  }
  return <ContentBlocks blocks={materials} />;
}
function Gallery({ items }) {
  const [index, setIndex] = useState(null);
  const dialog = useRef(null);
  const button = useRef(null);
  const pics = items.filter((it) => it.url);
  useEffect(() => {
    if (index === null) return;
    dialog.current?.showModal();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      dialog.current?.close();
      button.current?.focus();
    };
  }, [index !== null]);
  const close = () => setIndex(null);
  return (
    <>
      <div
        className={`p-gallery ${pics.length === 1 ? "p-gallery-single" : ""}`}
      >
        {pics.map((it, i) => (
          <button
            key={it.url + i}
            className="p-gallery-item"
            onClick={(e) => {
              button.current = e.currentTarget;
              setIndex(i);
            }}
            aria-label={`Увеличить: ${it.title || "изображение " + (i + 1)}`}
          >
            <Image src={it.url} alt={it.title || "Материалы мастер-плана"} />
            <span className="p-gallery-zoom">
              <ZoomIn size={21} />
            </span>
            {it.title && <span className="p-gallery-caption">{it.title}</span>}
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="p-lightbox"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") setIndex((index + 1) % pics.length);
          if (e.key === "ArrowLeft")
            setIndex((index - 1 + pics.length) % pics.length);
        }}
      >
        {index !== null && (
          <>
            <button
              className="p-lightbox-close p-icon-button"
              aria-label="Закрыть изображение"
              onClick={close}
            >
              <X size={30} />
            </button>
            <Image
              src={pics[index].url}
              alt={pics[index].title || "Материалы мастер-плана"}
              priority
            />
            <div className="p-lightbox-bottom">
              <button
                aria-label="Предыдущее изображение"
                onClick={() =>
                  setIndex((index - 1 + pics.length) % pics.length)
                }
              >
                <ChevronLeft />
              </button>
              <span>
                {pics[index].title}
                <small>
                  {index + 1} / {pics.length}
                </small>
              </span>
              <button
                aria-label="Следующее изображение"
                onClick={() => setIndex((index + 1) % pics.length)}
              >
                <ChevronRight />
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
function ContentBlocks({ blocks, compact = false }) {
  const seen = new Set();
  const out = [];
  for (const b of blocks) {
    if (["395", "995", "18", "484"].includes(b.type)) continue;
    if (
      b.type === "396" &&
      (!b.texts.length || b.texts.some((t) => t === "Главная"))
    )
      continue;
    const imgs = b.images.filter((u) => {
      if (seen.has(u)) return false;
      seen.add(u);
      return true;
    });
    const entries = b.items.filter((it) => it.title || it.text);
    out.push(
      <div className={`p-material-block p-material-${b.type}`} key={b.id}>
        {b.title && <h3>{b.title}</h3>}
        {b.texts.map((t, i) => (
          <p key={i}>{t}</p>
        ))}
        {b.stats.length > 0 && <Stats items={b.stats} />}{" "}
        {entries.length > 0 && (
          <div className="p-material-items">
            {entries.map((it, i) => (
              <article key={i}>
                <h4>{it.title}</h4>
                {it.text && <p>{it.text}</p>}
              </article>
            ))}
          </div>
        )}
        {imgs.length > 0 && (
          <Gallery
            items={imgs.map((url) => ({
              url,
              title: entries.find((it) => it.images.includes(url))?.title || "",
            }))}
          />
        )}{" "}
        {b.links.length > 0 && (
          <div className="p-document-links">
            {b.links.map((a, i) => (
              <a key={i} href={a.url} target="_blank" rel="noreferrer">
                {a.title}
                <ExternalLink size={17} />
              </a>
            ))}
          </div>
        )}
      </div>,
    );
  }
  return (
    <div className={`p-materials ${compact ? "p-materials-compact" : ""}`}>
      {out}
    </div>
  );
}
function ProgramPage({ region: r, program: id }) {
  const program = r.programs[id],
    ps = program.projects.map((id) => projectById[id]);
  const state = useDocument(`programs/${r.id}-${id}`);
  const [place, setPlace] = useQueryState("place"), [query, setQuery] = useQueryState("q");
  const places = [...new Set(ps.map((p) => p.place).filter(Boolean))];
  const shown = ps.filter(p => (!place || p.place === place) && normalize(p.title + " " + p.place).includes(normalize(query)));
  return (
    <>
      <PageHero
        image={r.image}
        title={program.name}
        eyebrow={r.name}
        crumbs={[[r.name, regionPath(r)], [program.name]]}
        compact
      />
      <section className="p-shell p-section">
        <div className="p-program-intro">
          <Eyebrow>{r.name}</Eyebrow>
          {state.data
            ?.filter((b) => ["677", "921"].includes(b.type))
            .slice(0, 1)
            .map((b) => (
              <div key={b.id}>
                {b.texts.map((t, i) => (
                  <p key={i}>{t}</p>
                ))}
              </div>
            ))}
        </div>
        <div className="p-filter-bar">
          <h2>
            Объекты программы <sup>{ps.length}</sup>
          </h2>
          {places.length > 1 && (
            <label className="p-select-field">
              Населённый пункт
              <select value={place} onChange={(e) => setPlace(e.target.value)}>
                <option value="">Все территории</option>
                {places.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
          )}
        </div>
        <div className="p-filter-bar"><label className="p-search-field"><Search size={20} /><input aria-label="Поиск объектов программы" placeholder="Название объекта" value={query} onChange={e => setQuery(e.target.value)} /></label><span className="p-directory-count" aria-live="polite">Найдено: {shown.length}</span></div>
        {!shown.length && <Empty onReset={() => { setQuery(""); setPlace(""); }} />}
        <div className="p-project-grid">
          {shown.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
        {state.error && <DocError />}
      </section>
    </>
  );
}
function Empty({ onReset }) {
  return (
    <div className="p-empty">
      <Search size={38} />
      <h3>Ничего не найдено</h3>
      <p>Измените запрос или сбросьте фильтры.</p>
      <button className="p-button" onClick={onReset}>
        Сбросить фильтры
        <ArrowRight size={20} />
      </button>
    </div>
  );
}
function ProjectsPage() {
  const [query,setQ]=useQueryState("q"),[region,setR]=useQueryState("region"),[city,setCity]=useQueryState("city"),[program,setP]=useQueryState("program"),[pageValue,setPage]=useQueryState("page","1"),[view,setView]=useQueryState("view","cards");
  const filtered=useMemo(()=>projects.filter(p=>(!region||p.region===region)&&(!city||p.city===city)&&(!program||p.program===program)&&normalize(p.title+" "+(cityById[p.city]?.name||p.place)).includes(normalize(query.trim()))).sort((a,b)=>Number(b.program==="masterplan")-Number(a.program==="masterplan")||Number(Boolean(b.images.length))-Number(Boolean(a.images.length))),[query,region,city,program]);
  const page=Math.min(Math.max(1,Math.ceil(filtered.length/18)),Math.max(1,Number.parseInt(pageValue,10)||1));
  const change=(setter,value)=>{setter(value);setPage(1);};
  const reset=()=>{setQ("");setR("");setCity("");setP("");setPage(1);};
  const cityOptions=cities.filter(c=>!region||c.region===region);
  const chips=[[query,()=>change(setQ,"")],[regionById[region]?.name,()=>{change(setR,"");setCity("");}],[cityById[city]?.name,()=>change(setCity,"")]].filter(([label])=>label);
  return <>
    <CatalogProjectDialog/>
    <PageHero title={<>Проекты,<br/><em>которые меняют города.</em></>} eyebrow="Каталог развития" crumbs={[["Все проекты"]]} compact/>
    <section className="p-shell p-section p-project-catalog" id="project-results">
      <div className="p-catalog-filters">
        <label className="p-search-field"><Search size={20}/><input value={query} onChange={e=>change(setQ,e.target.value)} placeholder="Название проекта или город" aria-label="Поиск проектов"/>{query&&<button aria-label="Очистить поиск проектов" onClick={()=>change(setQ,"")}><X size={18}/></button>}</label>
        <label className="p-select-field">Регион<select value={region} onChange={e=>{change(setR,e.target.value);setCity("");}}><option value="">Все регионы</option>{regions.map(r=><option value={r.id} key={r.id}>{r.name}</option>)}</select></label>
        <label className="p-select-field">Город<select value={city} onChange={e=>{change(setCity,e.target.value);}}><option value="">Все города</option>{cityOptions.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select></label>
      </div>
      <div className="p-catalog-programs" aria-label="Программы развития">{[["","Все программы"],...Object.entries(programNames)].map(([id,label])=><button key={id} aria-pressed={program===id} onClick={()=>change(setP,id)}>{label}</button>)}</div>
      {chips.length>0&&<div className="p-catalog-chips" aria-label="Выбранные фильтры">{chips.map(([label,remove])=><button key={label} onClick={remove} aria-label={`Убрать фильтр: ${label}`}>{label}<X size={14}/></button>)}</div>}
      <div className="p-catalog-summary"><div className="p-results-count" aria-live="polite"><span>Найдено: {filtered.length}</span><button onClick={reset} disabled={!query&&!region&&!city&&!program}>Сбросить<X size={16}/></button></div><div className="p-catalog-actions">{cityById[city]&&<a className="p-text-link" href={siteHref(cityPath(cityById[city]),`?city=${city}#projects`)}><MapIcon size={18}/>Карта мастер-плана<Arrow size={18}/></a>}<div className="p-view-toggle" aria-label="Вид каталога"><button aria-label="Показать карточками" aria-pressed={view!=="list"} onClick={()=>setView("cards")}><Grid2X2 size={19}/></button><button aria-label="Показать списком" aria-pressed={view==="list"} onClick={()=>setView("list")}><List size={20}/></button></div></div></div>
      {filtered.length?<>
        {view==="list"?<div className="p-project-list-view">{filtered.slice((page-1)*18,page*18).map((p,i)=><a className="p-project-list-row" key={p.id} href={projectHref(p)}><span>{fmt((page-1)*18+i+1)}</span><div><h3>{p.title}</h3><small>{cityById[p.city]?.name||p.place||regionShort[p.region]}</small></div><span>{programNames[p.program]}</span><Arrow size={20}/></a>)}</div>:<div className="p-project-grid">{filtered.slice((page-1)*18,page*18).map((p,i)=><ProjectCard key={p.id} project={p} index={(page-1)*18+i}/>)}</div>}
        <Pagination page={page} count={Math.ceil(filtered.length/18)} onChange={n=>{setPage(n);document.getElementById("project-results").scrollIntoView({behavior:"instant"});}}/>
      </>:<Empty onReset={reset}/>}
    </section>
  </>;
}
function Pagination({ page, count, onChange }) {
  if (count < 2) return null;
  const list = [
    ...new Set([
      1,
      ...Array.from({ length: 5 }, (_, i) => page + i - 2).filter(
        (n) => n > 1 && n < count,
      ),
      count,
    ]),
  ].sort((a, b) => a - b);
  return (
    <nav className="p-pagination" aria-label="Страницы результатов">
      <button
        disabled={page === 1}
        aria-label="Предыдущая страница"
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeft />
      </button>
      {list.map((n, i) => (
        <span key={n}>
          {i > 0 && n > list[i - 1] + 1 && (
            <span className="p-pagination-gap">…</span>
          )}
          <button
            onClick={() => onChange(n)}
            aria-label={`Страница ${n}`}
            aria-current={n === page ? "page" : undefined}
          >
            {n}
          </button>
        </span>
      ))}
      <button
        disabled={page === count}
        aria-label="Следующая страница"
        onClick={() => onChange(page + 1)}
      >
        <ChevronRight />
      </button>
    </nav>
  );
}
function ProjectPage({ project: p }) {
  const r = regionById[p.region],
    c = cityById[p.city];
  return (
    <>
      <PageHero
        image={p.images[0]}
        title={p.title}
        eyebrow={programNames[p.program]}
        crumbs={[
          [r.name, regionPath(r)],
          ...(c ? [[c.name, cityPath(c)]] : []),
          ["Проект"],
        ]}
        compact
      />
      <section className="p-shell p-section">
        <div className="p-project-detail-grid">
          <aside>
            <Eyebrow>Паспорт проекта</Eyebrow>
            <dl className="p-detail-meta">
              <div>
                <dt>Регион</dt>
                <dd>
                  <a href={siteHref(regionPath(r))}>
                    {r.name}
                    <Arrow size={16} />
                  </a>
                </dd>
              </div>
              {(c || p.place) && (
                <div>
                  <dt>Территория</dt>
                  <dd>{c ? c.name : p.place}</dd>
                </div>
              )}
              <div>
                <dt>Программа</dt>
                <dd>{programNames[p.program]}</dd>
              </div>
              {p.category && (
                <div>
                  <dt>Направление</dt>
                  <dd>{p.category}</dd>
                </div>
              )}
              {p.status && (
                <div>
                  <dt>Статус</dt>
                  <dd>{p.status}</dd>
                </div>
              )}
            </dl>
            {c && <a className="p-project-atlas-link" href={siteHref(cityPath(c), c.id === "vladivostok" || p.program !== "masterplan" ? "#projects" : `?project=${p.id}#projects`)}><MapIcon size={21}/>На карте мастер-плана<Arrow size={18}/></a>}
            <ShareButton />
          </aside>
          <div className="p-project-description">
            {p.stats.length > 0 && <Stats items={p.stats} />}
            <h2>О проекте</h2>
            {p.texts.length ? (
              p.texts.map((t, i) => <p key={i}>{t}</p>)
            ) : (
              <p>
                {p.title} — проект программы «{programNames[p.program]}»
                {c ? ` города ${c.name}` : ` в регионе «${r.name}»`}.
              </p>
            )}
            {p.images.length > 1 && (
              <Gallery
                items={p.images.slice(1).map((url) => ({ url, title: "" }))}
              />
            )}
          </div>
        </div>
        <a
          className="p-back-link"
          href={siteHref(c ? cityPath(c) : `${regionPath(r)}/${p.program}`)}
        >
          <ArrowLeft size={21} />
          {c ? "Все проекты города" : "Все объекты программы"}
        </a>
      </section>
      <section className="p-section p-related-cities">
        <div className="p-shell">
          <SectionHead title="Другие проекты рядом">
            Продолжить изучение
          </SectionHead>
          <div className="p-project-grid">
            {projects
              .filter(
                (x) =>
                  x.id !== p.id && x.region === p.region && x.images.length,
              )
              .sort((a,b) => Number(b.city === p.city) - Number(a.city === p.city))
              .slice(0, 3)
              .map((x) => (
                <ProjectCard project={x} key={x.id} />
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
function NewsPage() {
  const [q,setQ]=useQueryState("q"),[sort,setSort]=useQueryState("sort","newest"),[year,setYear]=useQueryState("year"),[territory,setTerritory]=useQueryState("news-region"),[pageValue,setPage]=useQueryState("page","1");
  const filtered=filterNews(news,{query:q,sort,year,territory});
  const page=Math.min(Math.max(1,Math.ceil(filtered.length/12)),Math.max(1,Number.parseInt(pageValue,10)||1));
  const change=(setter,value)=>{setter(value);setPage(1);};
  const reset=()=>{setQ("");setSort("newest");setYear("");setTerritory("");setPage(1);};
  return <>
    <PageHero title={<>Перемены.<br/><em>День за днём.</em></>} eyebrow="Новости проекта" crumbs={[["Новости"]]} compact/>
    <section className="p-shell p-section p-news-catalog-section" id="news-results">
      <div className="p-catalog-filters">
        <label className="p-search-field"><Search size={20}/><input aria-label="Поиск новостей" placeholder="Поиск по новостям" value={q} onChange={e=>change(setQ,e.target.value)}/>{q&&<button aria-label="Очистить поиск новостей" onClick={()=>change(setQ,"")}><X size={18}/></button>}</label>
        <label className="p-select-field">Территория<select value={territory} onChange={e=>change(setTerritory,e.target.value)}><option value="">Все территории</option>{regions.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select></label>
        <label className="p-select-field">Год<select value={year} onChange={e=>change(setYear,e.target.value)}><option value="">За всё время</option>{[...new Set(news.map(n=>n.date.slice(0,4)))].map(y=><option key={y}>{y}</option>)}</select></label>
        <label className="p-select-field">Порядок<select value={sort} onChange={e=>change(setSort,e.target.value)}><option value="newest">Сначала новые</option><option value="oldest">Сначала ранние</option></select></label>
      </div>
      <div className="p-results-count" aria-live="polite"><span>{filtered.length} публикаций</span><button onClick={reset} disabled={!q&&sort==="newest"&&!year&&!territory}>Сбросить фильтры<X size={16}/></button></div>
      {filtered.length?<><div className="p-news-grid p-news-catalog">{filtered.slice((page-1)*12,page*12).map(n=><NewsCard post={n} key={n.id} collection={filtered.map(p=>p.id)}/>)}</div><Pagination page={page} count={Math.ceil(filtered.length/12)} onChange={p=>{setPage(p);document.getElementById("news-results").scrollIntoView({behavior:"instant"});}}/></>:<Empty onReset={reset}/>}
    </section>
  </>;
}
function LegacyArticle({ post }) {
  useEffect(() => { location.replace(siteHref("news", `?news=${encodeURIComponent(post.id)}`)); }, [post.id]);
  return <NewsPage />;
}
const quarterRegion = name => ({ "Еврейская АО": "Еврейская автономная область", "Сахалинская обл.": "Сахалинская область", "Забайкальский кр.": "Забайкальский край" }[name] || name);
const quarterFacts = p => [
  { label: "Инвестиции", value: p.investment },
  { label: "Год реализации", value: p.year },
  ...p.stats.map(s => ({ ...s, value: /\d/.test(s.value) ? s.value : "—" })),
];
function QuarterPage({ initialProject }) {
  const [compareFirst,setCompareFirst]=useState(quarter.projects[0].id),[compareSecond,setCompareSecond]=useState(quarter.projects[1].id);
  const compared=[compareFirst,compareSecond].map(id=>quarter.projects.find(p=>p.id===id));
  const [active, setActive] = useState(initialProject || quarter.projects[0].id);
  const [compare, setCompare] = useState(false);
  useEffect(() => {
    if (initialProject) {
      history.replaceState(history.state, "", siteHref("dvkvartal", `#quarter-${initialProject}`));
      document.getElementById(`quarter-${initialProject}`)?.scrollIntoView();
    }
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActive(visible[0].target.dataset.quarter);
    }, { rootMargin: "-100px 0px -45% 0px", threshold: [0, 0.2, 0.5] });
    document.querySelectorAll("[data-quarter]").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [initialProject]);
  return <>
    <PageHero image={quarter.projects[0].image} title={<span className="p-quarter-title">Дальневосточный<br />квартал.</span>} eyebrow="Новый стандарт повседневной жизни" crumbs={[["ДВ Квартал"]]}>
      <p>Комфортное и доступное жильё на территориях опережающего развития Дальнего Востока.</p>
      <a className="p-button p-button-light" href="#quarter-projects">Все семь проектов <ArrowDown size={20} /></a>
    </PageHero>
    <div className="p-region-stats"><div className="p-shell"><Stats items={quarter.stats} /></div></div>
    <section className="p-section p-shell" id="quarter-projects">
      <SectionHead number="01" title={<>Семь проектов.<br /><em>Новая среда.</em></>}>Дальневосточный квартал</SectionHead>
      <div className="p-quarter-tools">
        <p>Жильё, социальная инфраструктура и сроки реализации.</p>
        <button className="p-text-link" aria-expanded={compare} aria-controls="quarter-comparison" onClick={() => setCompare(!compare)}>{compare ? "Закрыть сравнение" : "Сравнить проекты"}{compare ? <X size={19} /> : <Grid2X2 size={19} />}</button>
      </div>
      {compare && <div id="quarter-comparison" className="p-quarter-comparison p-quarter-comparison-pair" role="region" aria-label="Сравнение проектов ДВ квартала">
        <div className="p-quarter-compare-selects"><label className="p-select-field">Первый проект<select value={compareFirst} onChange={e=>setCompareFirst(e.target.value)}>{quarter.projects.map(p=><option value={p.id} key={p.id} disabled={p.id===compareSecond}>{p.name}</option>)}</select></label><label className="p-select-field">Второй проект<select value={compareSecond} onChange={e=>setCompareSecond(e.target.value)}>{quarter.projects.map(p=><option value={p.id} key={p.id} disabled={p.id===compareFirst}>{p.name}</option>)}</select></label></div>
        <table><caption>Сравнение проектов</caption><thead><tr><th scope="col">Показатель</th>{compared.map(p=><th scope="col" key={p.id}><a href={`#quarter-${p.id}`}>{p.name}<ArrowDown size={14}/></a><small>{quarterRegion(p.region)}</small></th>)}</tr></thead><tbody><tr><th scope="row">Стадия</th>{compared.map(p=><td key={p.id}>{p.status}</td>)}</tr>{quarterFacts(compared[0]).map(s=><tr key={s.label}><th scope="row">{s.label}</th>{compared.map(p=><td key={p.id}>{quarterFacts(p).find(f=>f.label===s.label)?.value||"—"}</td>)}</tr>)}</tbody></table>
      </div>}
      <div className="p-quarter-layout">
        <div className="p-quarter-jump"><label className="p-select-field"><span className="visually-hidden">Перейти к кварталу</span><select aria-label="Перейти к кварталу" value={active} onChange={e=>{setActive(e.target.value);history.replaceState(history.state,"",`#quarter-${e.target.value}`);document.getElementById(`quarter-${e.target.value}`)?.scrollIntoView({behavior:"instant"});}}>{quarter.projects.map(p=><option key={p.id} value={p.id}>{p.name} · {quarterRegion(p.region)}</option>)}</select></label></div>
        <nav className="p-quarter-nav" aria-label="Проекты ДВ квартала">
          {quarter.projects.map((p,i) => <a key={p.id} href={`#quarter-${p.id}`} aria-current={active === p.id ? "location" : undefined} onClick={() => setActive(p.id)}><span>{fmt(i+1)}</span><div><strong>{p.name}</strong><small>{quarterRegion(p.region)}</small></div><ArrowDown size={16} /></a>)}
        </nav>
        <div className="p-quarter-details">
          {quarter.projects.map((p,i) => <article className="p-quarter-detail" key={p.id} id={`quarter-${p.id}`} data-quarter={p.id} aria-labelledby={`quarter-title-${p.id}`}>
            <div className="p-quarter-detail-heading"><div><Eyebrow number={fmt(i+1)}>{quarterRegion(p.region)}</Eyebrow><h2 id={`quarter-title-${p.id}`}>{p.name}</h2></div><span className="p-status">{p.status}</span></div>
            <Gallery items={[{ url: p.image, title: p.name }]} />
            <Stats className="p-quarter-detail-stats" items={quarterFacts(p)} />
            <div className="p-quarter-detail-footer"><ShareButton url={siteHref("dvkvartal", `#quarter-${p.id}`)} label="Ссылка на проект" /><a className="p-text-link" href="#quarter-projects">К списку проектов <ArrowUpRight size={17} /></a></div>
          </article>)}
        </div>
      </div>
    </section>
    <section className="p-section p-shell p-quarter-lifestyle"><SectionHead number="02" title={<>Всё, что нужно.<br /><em>Рядом с домом.</em></>}>Комплексное развитие</SectionHead>
      <div className="p-quarter-features">{quarter.features.map((f,i) => <article key={f.id}><Image src={f.images[0]} alt="" /><span>{fmt(i+1)}</span><h3>{f.title}</h3><p>{f.text}</p></article>)}</div>
    </section>
  </>;
}
function AboutPage() {
  const questions = [
    [
      "Чем мастер-план отличается от генерального плана?",
      "Генеральный план отвечает на вопрос, что и где будет построено. Мастер-план объясняет, как и зачем будет развиваться город: в контексте социальных, экономических и пространственных задач. Он описывает управленческие механизмы и источники финансирования.",
    ],
    [
      "Для кого создаются мастер-планы?",
      "Мастер-план — публичный документ для жителей, бизнеса и власти. Он определяет общие принципы и стратегию пространственного развития города. Генеральный план служит профессиональным инструментом территориального планирования.",
    ],
    [
      "Как учитывается мнение жителей?",
      "Мастер-планы создаются с учётом мнения жителей. Они помогают определить общие цели развития, актуальные для горожан, бизнеса и власти, и приоритетные проекты, направленные на качественные изменения городской среды.",
    ],
  ];
  return (
    <>
      <PageHero
        image="masterplan-editorial-v1.webp"
        title={
          <>
            Будущее города
            <br />
            начинается с людей.
          </>
        }
        eyebrow="О проекте «25 городов»"
        crumbs={[["О проекте"]]}
      ><a className="p-button p-button-light" href="#masterplan-finder">Найти свой город<ArrowDown size={20}/></a></PageHero>
      <section className="p-shell p-section p-about-body">
        <Eyebrow>Стратегические мастер-планы</Eyebrow>
        <h2>
          Повышать качество жизни.
          <br />
          <em>Раскрывать возможности.</em>
        </h2>
        <p className="p-lead">
          Мастер-планы развития городов Дальнего Востока разрабатываются с целью
          повышения качества жизни людей, развития перспективных отраслей
          экономики, создания новых рабочих мест и дополнительных возможностей
          для самореализации, раскрытия уникальных природных преимуществ
          дальневосточных регионов.
        </p>
        <Stats
          items={[
            { value: "11", label: "региональных центров" },
            { value: "9", label: "городов с населением свыше 50 тыс. жителей" },
            { value: "3", label: "города с населением менее 50 тыс. жителей" },
            { value: "2", label: "столицы БАМа" },
          ]}
        />
        <div className="p-about-impact">
          <strong>4 млн+</strong>
          <h3>
            дальневосточников —<br />в центре преобразований
          </h3>
        </div>
        <ProjectJourney />
        <SectionHead title="Новые слова или новые смыслы?">
          Мастер-план и генеральный план
        </SectionHead>
        <div className="p-faq">
          {questions.map(([q, a], i) => (
            <details key={q} name="about-questions">
              <summary>
                <span>{fmt(i + 1)}</span>
                <h3>{q}</h3>
                <Plus size={24} />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <MasterplanFinder />
      <Partners />
    </>
  );
}
function MaterialsPage() {
  const a = useDocument("materials/page144867796"),
    b = useDocument("materials/test-sev-ulan1");
  return (
    <>
      <PageHero
        title="Улан-Удэ и Северобайкальск"
        eyebrow="Дополнительные материалы мастер-планов"
        crumbs={[["Бурятия", "buryatia"], ["Материалы"]]}
        compact
      />
      <section className="p-shell p-section">
        {a.loading || b.loading ? (
          <Loading />
        ) : a.error || b.error ? (
          <DocError />
        ) : (
          <>
            <details className="p-document-accordion" open>
              <summary>
                Концепция развития городов Бурятии
                <ChevronDown />
              </summary>
              <ContentBlocks
                blocks={a.data.blocks.filter(
                  (b) => !["18", "1050", "244"].includes(b.type),
                )}
              />
            </details>
            <details className="p-document-accordion">
              <summary>
                Проекты и схемы Улан-Удэ
                <ChevronDown />
              </summary>
              <ContentBlocks
                blocks={b.data.blocks.filter(
                  (b) => !["18", "1050", "244"].includes(b.type),
                )}
              />
            </details>
          </>
        )}
      </section>
    </>
  );
}
function Sitemap() {
  return (
    <>
      <PageHero
        title="Весь сайт"
        eyebrow="Карта разделов"
        crumbs={[["Карта сайта"]]}
        compact
      />
      <section className="p-shell p-section p-sitemap">
        <div className="p-sitemap-main">
          {[
            ["", "Главная"],
            ["about", "О проекте"],
            ["regions", "Регионы"],
            ["projects", "Проекты"],
            ["dvkvartal", "ДВ Квартал"],
            ["news", "Новости"],
            ["map", "Интерактивная карта"],
          ].map(([p, n]) => (
            <a key={p} href={siteHref(p)}>
              {n}
              <Arrow />
            </a>
          ))}
        </div>
        {regions.map((r) => (
          <div className="p-sitemap-region" key={r.id}>
            <h2>
              <a href={siteHref(regionPath(r))}>
                {r.name}
                <Arrow />
              </a>
            </h2>
            <nav aria-label={r.name}>
              {r.cities.filter(id=>parentTerritory(id)===id).map((id) => (
                <a href={siteHref(cityPath(cityById[id]))} key={id}>
                  {territoryName(cityById[id])}
                </a>
              ))}
              {Object.entries(r.programs).map(([id, p]) => (
                <a key={id} href={siteHref(regionPath(r),`#program-${id}`)}>
                  {p.name}
                </a>
              ))}
            </nav>
          </div>
        ))}
      </section>
    </>
  );
}
function NotFound() {
  return (
    <>
      <PageHero
        title="Такой страницы пока нет"
        eyebrow="404"
        crumbs={[["Страница не найдена"]]}
        compact
      />
      <section className="p-shell p-section">
        <p className="p-lead">
          Продолжите с главной страницы или найдите нужный раздел на карте
          сайта.
        </p>
        <LinkButton href={siteHref("sitemap")}>Карта сайта</LinkButton>
      </section>
    </>
  );
}
function LegacyDestination({href,label}){
 useEffect(()=>{location.replace(href);},[href]);
 return <div className="p-shell p-section"><h1>{label}</h1><a className="p-button" href={href}>Открыть<Arrow/></a></div>;
}
export function PortalRoute({requestedPath=currentPath}={}) {
  let path = requestedPath;
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
  path = aliases[path] || path;
  const [first, second, third] = path.split("/");
  const region = regions.find((r) => regionPath(r) === first || r.id === first);
  if (!path) return legacyVladivostok ? <VladivostokPage /> : <Home />;
  if (path === "regions") return <RegionsPage />;
  if (path === "about") return <AboutPage />;
  if (path === "sitemap") return <Sitemap />;
  if (path === "projects") return <ProjectsPage />;
  if (first === "projects" && projectById[second])
    return <LegacyDestination href={projectHref(projectById[second])} label={projectById[second].title}/>;
  if (path === "news") return <NewsPage />;
  if (first === "news" && second === "tpost") {
    const n = news.find((n) => n.id === third);
    return n ? <LegacyArticle post={n} /> : <NotFound />;
  }
  if (
    first === "vladivostok" &&
    second === "projects" &&
    /^project-\d{2}$/.test(third || "")
  )
    return (
      <LegacyDestination href={siteHref('vladivostok',`?project=${third}#projects`)} label="Проект Владивостокской агломерации"/>
    );
  if (path === "vladivostok" || path === "cities/vladivostok") return <VladivostokPage />;
  if(first==='cities'&&['artem','bolshoy-kamen'].includes(second))return <LegacyDestination href={siteHref('vladivostok',`?city=${second}${location.search.includes('project=')?'&project='+new URLSearchParams(location.search).get('project'):''}#regions`)} label={cityById[second].name}/>;
  if (first === "cities" && cityById[second])
    return <TerritoryPage city={cityById[second]} materials={<CityMaterials city={cityById[second]} />} />;
  if (region) {
    if (second && region.programs[second])
      return <LegacyDestination href={siteHref(regionPath(region),`#program-${second}`)} label={region.programs[second].name}/>;
    if (!second) return <TerritoryPage region={region} />;
  }
  if (path === "dvkvartal") return <QuarterPage />;
  if (first === "dvkvartal") {
    const p = quarter.projects.find((p) => p.id === second);
    return p ? <QuarterPage initialProject={p.id} /> : <NotFound />;
  }
  if (path === "materials/ulan-ude") return <LegacyDestination href={siteHref('cities/ulan-ude','#materials')} label="Материалы мастер-плана Улан-Удэ"/>;
  if (path === "map")
    return (
      <Suspense fallback={<Loading />}>
        <PortalMap />
      </Suspense>
    );
  return <NotFound />;
}
export default function PortalApp() {
  const isTerritory = legacyVladivostok || currentPath === "cities/vladivostok" || cities.some(c => cityPath(c) === currentPath) || regions.some(r => [r.id, regionPath(r)].includes(currentPath)) || ["page144867266.html", "page152744266.html"].includes(currentPath);
  useEffect(() => {
    if (legacyVladivostok) location.replace(siteHref("vladivostok", location.search + location.hash));
    document.body.classList.toggle("portal", !isTerritory);
    if (location.hash) {
      requestAnimationFrame(() =>
        document
          .getElementById(decodeURIComponent(location.hash.slice(1)))
          ?.scrollIntoView(),
      );
    }
    return () => document.body.classList.remove("portal");
  }, []);
  const isCity = currentPath.startsWith("cities/") || currentPath === "vladivostok";
  return (
    <NewsProvider><div className={`ed-site ${isCity ? "ed-preserve-city" : ""}`}>
      <a className="skip-link" href="#content">
        Перейти к содержанию
      </a>
      <div id="top" />
      <div className="portal portal-navigation"><Header /></div>
      <main id="content" className={isTerritory ? "approved-territory-page" : undefined}>
        <PortalRoute />
      </main>
      <div className="portal portal-navigation"><Footer /></div>
      {!isTerritory && <BackToTop />}
      {!isCity && <EditorialMotion/>}
    </div></NewsProvider>
  );
}
