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
} from "lucide";
import { siteHref, currentPath, siteRoot } from "../site.js";
import { asset } from "../data.js";
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
  dateText,
  normalize,
  programNames,
  regionShort,
  regionMood,
} from "./data.js";
const Atlas = lazy(() => import("../components/Projects.jsx"));
const PortalMap = lazy(() => import("./PortalMap.jsx"));
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
function SourceNote({ url, label = "Материалы мастер-плана" }) {
  return (
    <div className="p-source-note">
      <span>{label} · сведения исходного портала на 23 сентября 2026 года</span>
      {url && (
        <a href={url} target="_blank" rel="noreferrer">
          Источник <ExternalLink size={14} />
        </a>
      )}
    </div>
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
  const [open, setOpen] = useState(false),
    [search, setSearch] = useState(false),
    [q, setQ] = useState(""),
    [scroll, setScroll] = useState(window.scrollY > 20);
  const dialog = useRef(null);
  const trigger = useRef(null);
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
        trigger.current?.focus();
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
            name: c.name,
            path: cityPath(c),
            kind: "Город",
          })),
          ...projects.map((p) => ({
            name: p.title,
            path: `projects/${p.id}`,
            kind: cityById[p.city]?.name || regionShort[p.region],
          })),
          ...news.map((n) => ({
            name: n.title,
            path: `news/tpost/${n.id}`,
            kind: "Новость",
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
        <a className="p-header-map" href={siteHref("map")}>
          <MapIcon size={17} />
          Карта проектов
        </a>
        <button
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
                trigger.current?.focus();
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
                      <a href={siteHref(m.path)} key={i}>
                        <span>{m.kind}</span>
                        <strong>{m.name}</strong>
                        <Arrow />
                      </a>
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
function Footer() {
  return (
    <footer className="p-footer">
      <div className="p-shell">
        <div className="p-footer-title">
          <p>
            Дальний Восток.
            <br />
            <span>Ближе, чем кажется.</span>
          </p>
          <a href="#top" aria-label="Наверх" className="p-top-button">
            <Arrow size={34} />
          </a>
        </div>
        <div className="p-footer-grid">
          <div>
            <a href={siteHref()}>
              <img
                src={asset("logo-25-cities.svg")}
                alt="25 городов"
                width="166"
              />
            </a>
            <p>
              Мастер-планы развития городов
              <br />
              Дальнего Востока
            </p>
            <a className="p-footer-phone" href="tel:88007075558">
              8 (800) 707-55-58
            </a>
          </div>
          <nav aria-label="Разделы в подвале">
            <h2>Проект</h2>
            {[
              ["about", "О проекте"],
              ["regions", "Регионы"],
              ["projects", "Все проекты"],
              ["dvkvartal", "ДВ Квартал"],
              ["news", "Новости"],
              ["map", "Карта проектов"],
            ].map(([p, n]) => (
              <a key={p} href={siteHref(p)}>
                {n}
              </a>
            ))}
          </nav>
          <nav className="p-footer-regions" aria-label="Регионы в подвале">
            <h2>Регионы</h2>
            {regions.map((r) => (
              <a href={siteHref(regionPath(r))} key={r.id}>
                {r.name}
              </a>
            ))}
          </nav>
        </div>
        <div className="p-footer-bottom">
          <span>Корпорация развития Дальнего Востока и Арктики · 2026</span>
          <a href={siteHref("sitemap")}>Карта сайта</a>
        </div>
      </div>
    </footer>
  );
}
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
        <h3>{c.name}</h3>
        <span>{c.projects.length} проектов</span>
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
      href={siteHref(`projects/${p.id}`)}
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
function NewsCard({ post: n, featured = false }) {
  return (
    <a
      href={siteHref(`news/tpost/${n.id}`)}
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
    </a>
  );
}
function Home() {
  const featured = projects.filter(
    (p) =>
      p.images.length &&
      p.program === "masterplan" &&
      [
        "Благоустройство набережной Амурского залива",
        "Строительство межвузовского кампуса мирового уровня",
        "Реконструкция Национального музея Республики Бурятия",
      ].includes(p.title),
  );
  const picks =
    featured.length >= 3
      ? featured.slice(0, 3)
      : [
          projects.find((p) => p.city === "vladivostok" && p.images.length),
          projects.find((p) => p.city === "ulan-ude" && p.images.length),
          projects.find(
            (p) => p.city === "petropavlovsk-kamchatsky" && p.images.length,
          ),
        ];
  return (
    <>
      <section className="p-home-hero">
        <Image
          src="home-hero.webp"
          className="p-hero-photo"
          alt="Русский мост во Владивостоке"
          priority
        />
        <div className="p-hero-shade" />
        <div className="p-shell p-home-hero-inner">
          <div className="p-hero-top">
            <Eyebrow>Стратегические мастер-планы</Eyebrow>
            <span>
              От Байкала
              <br />
              до Тихого океана
            </span>
          </div>
          <div className="p-home-hero-title">
            <h1>
              Новый облик
              <br />
              Дальнего Востока<span className="p-title-dot">.</span>
            </h1>
            <span className="p-hero-25" aria-hidden="true">
              25
            </span>
          </div>
          <div className="p-hero-bottom">
            <p>
              Города для жизни, работы
              <br />и будущего.
            </p>
            <a className="p-hero-cta" href="#regions">
              Исследовать регионы
              <span>
                <ArrowDown size={27} />
              </span>
            </a>
            <span className="p-hero-coordinate">
              11 регионов
              <br />4 млн+ жителей
            </span>
          </div>
        </div>
      </section>
      <section className="p-home-intro p-shell" id="about">
        <div className="p-intro-side">
          <Eyebrow number="01">О проекте</Eyebrow>
          <div className="p-intro-number">
            25
            <span>
              городов.
              <br />
              Одно большое будущее.
            </span>
          </div>
        </div>
        <div className="p-intro-copy">
          <h2>
            Перемены начинаются
            <br />с <em>мастер-плана.</em>
          </h2>
          <p>
            Мастер-планы создаются с учётом мнения жителей. Они определяют
            принципы развития городов, приоритетные проекты и источники их
            финансирования.
          </p>
          <a className="p-text-link" href={siteHref("about")}>
            Как устроен проект
            <Arrow />
          </a>
        </div>
      </section>
      <section className="p-home-regions" id="regions">
        <div className="p-shell">
          <SectionHead
            number="02"
            title={
              <>
                Разные города.
                <br />
                <em>Общие возможности.</em>
              </>
            }
            href={siteHref("regions")}
            label="Все регионы"
          >
            География развития
          </SectionHead>
          <div className="p-region-grid">
            {regions.map((r, i) => (
              <RegionCard region={r} index={i} key={r.id} />
            ))}
          </div>
        </div>
      </section>
      <section className="p-home-projects p-shell">
        <SectionHead
          number="03"
          title={
            <>
              Будущее обретает
              <br />
              <em>очертания.</em>
            </>
          }
          href={siteHref("projects")}
          label="Все проекты"
        >
          От замысла к городу
        </SectionHead>
        <div className="p-project-grid">
          {picks.filter(Boolean).map((p, i) => (
            <ProjectCard project={p} index={i} key={p.id} />
          ))}
        </div>
        <a className="p-map-band" href={siteHref("map")}>
          <MapIcon size={34} />
          <div>
            <h3>Все перемены — на одной карте</h3>
            <p>Города, направления развития и объекты мастер-планов</p>
          </div>
          <Arrow size={32} />
        </a>
      </section>
      <section className="p-editorial">
        <div className="p-editorial-image">
          <Image
            src="masterplan-editorial-v1.webp"
            alt="Концептуальная иллюстрация городского развития"
          />
          <span>Концептуальная иллюстрация</span>
        </div>
        <div className="p-editorial-copy">
          <Eyebrow>В центре — человек</Eyebrow>
          <h2>
            Не просто планы.
            <br />
            <em>Среда для жизни.</em>
          </h2>
          <p>
            Реализация мастер-планов позволит улучшить условия жизни более чем 4
            миллионов дальневосточников.
          </p>
          <div className="p-editorial-facts">
            <div>
              <strong>11</strong>
              <span>региональных центров</span>
            </div>
            <div>
              <strong>2</strong>
              <span>столицы БАМа</span>
            </div>
          </div>
          <LinkButton href={siteHref("about")} light>
            О мастер-планах
          </LinkButton>
        </div>
      </section>
      <QuarterTeaser />
      <section className="p-shell p-home-news">
        <SectionHead
          number="05"
          title={
            <>
              Города меняются.
              <br />
              <em>Следите за событиями.</em>
            </>
          }
          href={siteHref("news")}
          label="Все новости"
        >
          Новости проекта
        </SectionHead>
        <div className="p-news-grid">
          {news.slice(0, 3).map((n, i) => (
            <NewsCard post={n} key={n.id} featured={i === 0} />
          ))}
        </div>
      </section>
      <Partners />
    </>
  );
}
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
function RegionsPage() {
  const [q, setQ] = useState("");
  const matches = regions.filter((r) =>
    normalize(
      r.name + " " + r.cities.map((id) => cityById[id].name).join(" "),
    ).includes(normalize(q)),
  );
  return (
    <>
      <PageHero
        title={
          <>
            Один Дальний Восток.
            <br />
            <em>11 характеров.</em>
          </>
        }
        eyebrow="Регионы-участники"
        crumbs={[["Регионы"]]}
        compact
      />
      <section className="p-shell p-section">
        <div className="p-filter-bar">
          <p>Выберите регион, чтобы познакомиться с городами и проектами.</p>
          <label className="p-search-field">
            <Search size={20} />
            <input
              aria-label="Найти регион или город"
              placeholder="Регион или город"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
        </div>
        <div className="p-region-grid p-regions-catalog">
          {matches.map((r, i) => (
            <RegionCard key={r.id} region={r} index={i} />
          ))}
        </div>
        {!matches.length && <Empty onReset={() => setQ("")} />}
      </section>
    </>
  );
}
function RegionPage({ region: r }) {
  const cs = r.cities.map((id) => cityById[id]);
  const ps = projects.filter((p) => p.region === r.id);
  const regionalNews = news
    .filter((n) =>
      n.tags.some(
        (t) =>
          normalize(r.name).includes(normalize(t)) ||
          normalize(t).includes(normalize(regionShort[r.id])),
      ),
    )
    .slice(0, 3);
  return (
    <>
      <PageHero
        image={r.image}
        title={r.name}
        eyebrow={regionMood[r.id]}
        crumbs={[["Регионы", "regions"], [r.name]]}
      >
        <a className="p-hero-inline-link" href="#cities">
          Открыть мастер-планы
          <ArrowDown size={24} />
        </a>
      </PageHero>
      <div className="p-region-stats">
        <div className="p-shell">
          <Stats
            items={[
              ...r.stats,
              {
                value: String(cs.length),
                label: "мастер-планов городов и агломераций",
              },
            ]}
          />
        </div>
      </div>
      <section className="p-section p-shell" id="cities">
        <SectionHead number="01" title="Города и агломерации">
          Мастер-планы региона
        </SectionHead>
        <div
          className={`p-city-grid ${cs.length === 1 ? "p-city-grid-single" : ""}`}
        >
          {cs.map((c, i) => (
            <CityCard city={c} index={i} key={c.id} />
          ))}
        </div>
      </section>
      <section className="p-program-section">
        <div className="p-shell">
          <SectionHead
            number="02"
            title={
              <>
                Перемены
                <br />
                <em>в масштабе региона.</em>
              </>
            }
          >
            Программы развития
          </SectionHead>
          <div className="p-program-grid">
            {Object.entries(r.programs).map(([id, p], i) => (
              <a
                href={siteHref(`${regionPath(r)}/${id}`)}
                className="p-program-card"
                key={id}
              >
                <span className="p-program-icon">
                  {id === "subsidy" ? (
                    <Building2 size={35} />
                  ) : (
                    <Trees size={35} />
                  )}
                </span>
                <div>
                  <Eyebrow>
                    {fmt(i + 1)} / {p.projects.length} объектов
                  </Eyebrow>
                  <h3>
                    {id === "subsidy"
                      ? "Президентская субсидия"
                      : "Конкурс благоустройства"}
                  </h3>
                  <p>
                    {id === "subsidy"
                      ? "Школы, больницы, спортивные и культурные объекты."
                      : "Парки, набережные и новые общественные пространства."}
                  </p>
                </div>
                <Arrow size={30} />
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="p-section p-shell">
        <SectionHead
          number="03"
          title="Проекты региона"
          href={siteHref("projects", `?region=${r.id}`)}
          label={`Все ${ps.length} проектов`}
        >
          Качество повседневной жизни
        </SectionHead>
        <div className="p-project-grid">
          {ps
            .filter((p) => p.images.length)
            .slice(0, 3)
            .map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
        </div>
      </section>
      {regionalNews.length > 0 && (
        <section className="p-section p-shell">
          <SectionHead title="Новости региона" href={siteHref("news")}>
            События
          </SectionHead>
          <div className="p-news-grid">
            {regionalNews.map((n) => (
              <NewsCard post={n} key={n.id} />
            ))}
          </div>
        </section>
      )}
      <NextRegion region={r} />
    </>
  );
}
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
function CityPage({ city: c }) {
  const r = regionById[c.region];
  const ps = c.projects.map((id) => projectById[id]);
  const primary = ps.filter((p) => !p.section.includes("Другие"));
  const other = ps.filter((p) => p.section.includes("Другие"));
  const [all, setAll] = useState(false);
  return (
    <>
      <PageHero
        image={c.image}
        title={c.name}
        eyebrow="Мастер-план развития"
        crumbs={[[r.name, regionPath(r)], [c.name]]}
      >
        <a className="p-hero-inline-link" href="#projects">
          Проекты города
          <ArrowDown size={24} />
        </a>
      </PageHero>
      <div className="p-region-stats">
        <div className="p-shell">
          <Stats
            items={[
              ...c.stats,
              {
                value: String(c.id === "vladivostok" ? 27 : c.projects.length),
                label:
                  c.id === "vladivostok"
                    ? "проектов в согласованном атласе"
                    : "проектов в мастер-плане",
              },
            ]}
          />
        </div>
      </div>
      <div className="p-city-subnav">
        <div className="p-shell">
          <a href="#mission">Миссия города</a>
          <a href="#projects">Ключевые проекты</a>
          <a href="#materials">Материалы и визуализации</a>
          <a href={siteHref(regionPath(r))}>
            Все города региона <Arrow size={16} />
          </a>
        </div>
      </div>
      <section className="p-city-mission p-shell p-section" id="mission">
        <Eyebrow number="01">Миссия города</Eyebrow>
        <h2>{c.mission}</h2>
        <div className="p-city-about">
          {c.about.map((t, i) => (
            <p key={i} className={!all ? "p-line-clamp" : ""}>
              {t}
            </p>
          ))}
        </div>
        {c.about.some((t) => t.length > 800) && (
          <button className="p-text-link" onClick={() => setAll(!all)}>
            {all ? "Свернуть" : "Читать о городе полностью"}
            {all ? <Minus size={20} /> : <Plus size={20} />}
          </button>
        )}
      </section>
      {c.id === "vladivostok" ? (
        <div className="p-legacy-atlas" id="projects">
          <Suspense fallback={<Loading />}>
            <Atlas />
          </Suspense>
        </div>
      ) : null}
      <section
        className="p-city-projects p-section"
        id={c.id === "vladivostok" ? "source-projects" : "projects"}
      >
        <div className="p-shell">
          <SectionHead
            number="02"
            title={
              c.id === "vladivostok"
                ? "Проекты исходного мастер-плана"
                : "Ключевые проекты"
            }
          >
            Развитие города
          </SectionHead>
          <div className="p-project-grid">
            {primary.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </div>
      </section>
      {other.length > 0 && (
        <section className="p-shell p-section">
          <SectionHead number="03" title="Другие проекты">
            Мастер-план в деталях
          </SectionHead>
          <ProjectRows items={other} />
        </section>
      )}
      <section className="p-shell p-section" id="materials">
        <SectionHead number="04" title="Материалы мастер-плана">
          Схемы и визуализации
        </SectionHead>
        <CityMaterials city={c} />
        {c.id === "ulan-ude" && (
          <a className="p-map-band" href={siteHref("materials/ulan-ude")}>
            <Building2 size={30} />
            <div>
              <h3>Обновлённая концепция Улан-Удэ</h3>
              <p>Дополнительные описания, направления развития и схемы</p>
            </div>
            <Arrow />
          </a>
        )}
        <SourceNote url={`${r.source}#${c.sourceRecord}`} />
      </section>
      <section className="p-related-cities p-section">
        <div className="p-shell">
          <SectionHead title="Ещё в регионе" href={siteHref(regionPath(r))}>
            {r.name}
          </SectionHead>
          <div className="p-city-grid">
            {r.cities
              .filter((id) => id !== c.id)
              .slice(0, 2)
              .map((id) => (
                <CityCard key={id} city={cityById[id]} />
              ))}
          </div>
          {r.cities.length === 1 && (
            <LinkButton href={siteHref("regions")}>Все регионы</LinkButton>
          )}
        </div>
      </section>
    </>
  );
}
function ProjectRows({ items }) {
  return (
    <div className="p-project-rows">
      {items.map((p, i) => (
        <a key={p.id} href={siteHref(`projects/${p.id}`)}>
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
  const [place, setPlace] = useState("");
  const places = [...new Set(ps.map((p) => p.place).filter(Boolean))];
  const shown = ps.filter((p) => !place || p.place === place);
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
        <div className="p-project-grid">
          {shown.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
        {state.error && <DocError />}
        <SourceNote url={r.source} label={program.name} />
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
  const params = new URLSearchParams(location.search);
  const [query, setQ] = useState(params.get("q") || ""),
    [region, setR] = useState(params.get("region") || ""),
    [program, setP] = useState(""),
    [page, setPage] = useState(1);
  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (!region || p.region === region) &&
          (!program || p.program === program) &&
          normalize(
            p.title + " " + (cityById[p.city]?.name || p.place),
          ).includes(normalize(query)),
      ),
    [query, region, program],
  );
  useEffect(() => setPage(1), [query, region, program]);
  const reset = () => {
    setQ("");
    setR("");
    setP("");
  };
  return (
    <>
      <PageHero
        title={
          <>
            Проекты,
            <br />
            <em>которые меняют города.</em>
          </>
        }
        eyebrow="Каталог развития"
        crumbs={[["Все проекты"]]}
        compact
      />
      <section className="p-shell p-section">
        <div className="p-catalog-filters">
          <label className="p-search-field">
            <Search size={20} />
            <input
              value={query}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Название проекта или город"
              aria-label="Поиск проектов"
            />
          </label>
          <label className="p-select-field">
            Регион
            <select value={region} onChange={(e) => setR(e.target.value)}>
              <option value="">Все регионы</option>
              {regions.map((r) => (
                <option value={r.id} key={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
          <label className="p-select-field">
            Программа
            <select value={program} onChange={(e) => setP(e.target.value)}>
              <option value="">Все программы</option>
              {Object.entries(programNames).map(([id, n]) => (
                <option value={id} key={id}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="p-results-count" aria-live="polite">
          Найдено: {filtered.length}
          <button onClick={reset}>
            Сбросить фильтры
            <X size={16} />
          </button>
        </div>
        {filtered.length ? (
          <>
            <div className="p-project-grid">
              {filtered.slice((page - 1) * 18, page * 18).map((p, i) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  index={(page - 1) * 18 + i}
                />
              ))}
            </div>
            <Pagination
              page={page}
              count={Math.ceil(filtered.length / 18)}
              onChange={(p) => {
                setPage(p);
                document
                  .getElementById("content")
                  .scrollIntoView({ behavior: "instant" });
              }}
            />
          </>
        ) : (
          <Empty onReset={reset} />
        )}
      </section>
    </>
  );
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
  const [copy, setCopy] = useState(false);
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
                  <dt>Статус в исходных материалах</dt>
                  <dd>{p.status}</dd>
                </div>
              )}
            </dl>
            <button
              className="p-text-link"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(location.href);
                  setCopy(true);
                } catch {
                  setCopy(false);
                }
              }}
            >
              {copy ? "Ссылка скопирована" : "Копировать ссылку"}
              {copy ? <Check size={18} /> : <Copy size={18} />}
            </button>
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
            <SourceNote url={`${r.source}#${p.sourceRecord}`} />
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
  const [q, setQ] = useState(""),
    [tag, setTag] = useState(""),
    [year, setYear] = useState(""),
    [page, setPage] = useState(1);
  const tags = [...new Set(news.flatMap((n) => n.tags))].sort();
  const filtered = news.filter(
    (n) =>
      (!tag || n.tags.includes(tag)) &&
      (!year || n.date.startsWith(year)) &&
      normalize(n.title + " " + n.excerpt).includes(normalize(q)),
  );
  useEffect(() => setPage(1), [q, tag, year]);
  const reset = () => {
    setQ("");
    setTag("");
    setYear("");
  };
  return (
    <>
      <PageHero
        title={
          <>
            Перемены.
            <br />
            <em>День за днём.</em>
          </>
        }
        eyebrow="Новости проекта"
        crumbs={[["Новости"]]}
        compact
      />
      <section className="p-shell p-section">
        <div className="p-catalog-filters">
          <label className="p-search-field">
            <Search size={20} />
            <input
              aria-label="Поиск новостей"
              placeholder="Поиск по новостям"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
          <label className="p-select-field">
            Тема
            <select value={tag} onChange={(e) => setTag(e.target.value)}>
              <option value="">Все темы</option>
              {tags.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="p-select-field">
            Год
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">За всё время</option>
              {[...new Set(news.map((n) => n.date.slice(0, 4)))].map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="p-results-count" aria-live="polite">
          {filtered.length} публикаций
          <button onClick={reset}>
            Сбросить фильтры
            <X size={16} />
          </button>
        </div>
        {filtered.length ? (
          <>
            <div className="p-news-grid p-news-catalog">
              {filtered.slice((page - 1) * 12, page * 12).map((n) => (
                <NewsCard post={n} key={n.id} />
              ))}
            </div>
            <Pagination
              page={page}
              count={Math.ceil(filtered.length / 12)}
              onChange={(p) => {
                setPage(p);
                document
                  .getElementById("content")
                  .scrollIntoView({ behavior: "instant" });
              }}
            />
          </>
        ) : (
          <Empty onReset={reset} />
        )}
      </section>
    </>
  );
}
function ArticlePage({ post: n }) {
  const state = useDocument(`news/${n.id}`);
  const body = state.data?.body.replace(
    /src="(https:[^"]+)"/g,
    (_, url) => `src="${media(url)}"`,
  );
  return (
    <>
      <section className="p-article-heading p-shell">
        <Breadcrumbs items={[["Новости", "news"], ["Публикация"]]} />
        <div className="p-article-meta">
          <time dateTime={n.date}>{dateText(n.date)}</time>
          {n.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <h1>{n.title}</h1>
      </section>
      {n.image && (
        <div className="p-article-cover p-shell">
          <Image src={n.image} alt="" priority />
        </div>
      )}
      <div className="p-article-body p-shell">
        {state.loading ? (
          <Loading />
        ) : state.error ? (
          <DocError />
        ) : (
          <div className="p-prose" dangerouslySetInnerHTML={{ __html: body }} />
        )}
        <SourceNote url={n.source} label="Публикация портала «25 городов»" />
        <a className="p-back-link" href={siteHref("news")}>
          <ArrowLeft size={20} />
          Все новости
        </a>
      </div>
      <section className="p-section p-related-cities">
        <div className="p-shell">
          <SectionHead title="Продолжить чтение">Другие новости</SectionHead>
          <div className="p-news-grid">
            {news
              .filter((x) => x.id !== n.id)
              .slice(0, 3)
              .map((x) => (
                <NewsCard post={x} key={x.id} />
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
function QuarterPage() {
  return (
    <>
      <PageHero
        image={quarter.projects[0].image}
        title={
          <>
            Дальневосточный
            <br />
            квартал.
          </>
        }
        eyebrow="Новый стандарт повседневной жизни"
        crumbs={[["ДВ Квартал"]]}
      >
        <p>
          Комфортное и доступное жильё на территориях опережающего развития
          Дальнего Востока.
        </p>
      </PageHero>
      <div className="p-region-stats">
        <div className="p-shell">
          <Stats items={quarter.stats} />
        </div>
      </div>
      <section className="p-section p-shell">
        <SectionHead
          number="01"
          title={
            <>
              Всё, что нужно.
              <br />
              <em>Рядом с домом.</em>
            </>
          }
        >
          Комплексное развитие
        </SectionHead>
        <div className="p-quarter-features">
          {quarter.features.map((f, i) => (
            <article key={i}>
              <Image src={f.images[0]} alt="" />
              <span>{fmt(i + 1)}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="p-quarter-projects p-section">
        <div className="p-shell">
          <SectionHead number="02" title="Семь проектов. Новая среда.">
            Проекты жилищного строительства
          </SectionHead>
          <div className="p-housing-grid">
            {quarter.projects.map((p, i) => (
              <a
                className="p-housing-card"
                href={siteHref(`dvkvartal/${p.id}`)}
                key={p.id}
              >
                <div className="p-housing-image">
                  <Image src={p.image} alt="" />
                  <span className="p-card-circle">
                    <Arrow />
                  </span>
                </div>
                <div>
                  <Eyebrow>{p.region}</Eyebrow>
                  <h3>{p.name}</h3>
                  <div className="p-housing-facts">
                    <span>
                      <strong>{p.investment}</strong>инвестиции
                    </span>
                    <span>
                      <strong>{p.year}</strong>год реализации
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <SourceNote
            url="https://xn--25-flcdf3dabp.xn--p1ai/dvkvartal"
            label="Дальневосточный квартал"
          />
        </div>
      </section>
    </>
  );
}
function HousingPage({ project: p }) {
  return (
    <>
      <PageHero
        image={p.image}
        title={p.name}
        eyebrow={p.region}
        crumbs={[["ДВ Квартал", "dvkvartal"], [p.name]]}
      />
      <section className="p-shell p-section">
        <div className="p-housing-lead">
          <h2>
            Дальневосточный квартал
            <br />
            <em>{p.region}</em>
          </h2>
          <span className="p-status">{p.status}</span>
        </div>
        <Stats
          items={[
            { label: "Инвестиции", value: p.investment },
            { label: "Год реализации проекта", value: p.year },
            ...p.stats,
          ]}
        />
        <SourceNote
          url="https://xn--25-flcdf3dabp.xn--p1ai/dvkvartal"
          label="Показатели проекта"
        />
        <a className="p-back-link" href={siteHref("dvkvartal")}>
          <ArrowLeft size={20} />
          Все жилищные проекты
        </a>
      </section>
    </>
  );
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
      >
        <span className="p-concept-label">Концептуальная иллюстрация</span>
      </PageHero>
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
        <SectionHead title="Новые слова или новые смыслы?">
          Мастер-план и генеральный план
        </SectionHead>
        <div className="p-faq">
          {questions.map(([q, a], i) => (
            <details key={q}>
              <summary>
                <span>{fmt(i + 1)}</span>
                <h3>{q}</h3>
                <Plus size={24} />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
        <SourceNote
          url="https://xn--25-flcdf3dabp.xn--p1ai/"
          label="О проекте"
        />
      </section>
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
        <SourceNote
          url="https://xn--25-flcdf3dabp.xn--p1ai/test-sev-ulan1"
          label="Дополнительные материалы"
        />
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
            ["materials/ulan-ude", "Материалы Улан-Удэ и Северобайкальска"],
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
              {r.cities.map((id) => (
                <a href={siteHref(cityPath(cityById[id]))} key={id}>
                  {cityById[id].name}
                </a>
              ))}
              {Object.entries(r.programs).map(([id, p]) => (
                <a key={id} href={siteHref(`${regionPath(r)}/${id}`)}>
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
function Route() {
  let path = currentPath;
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
  if (!path) return <Home />;
  if (path === "regions") return <RegionsPage />;
  if (path === "about") return <AboutPage />;
  if (path === "sitemap") return <Sitemap />;
  if (path === "projects") return <ProjectsPage />;
  if (first === "projects" && projectById[second])
    return <ProjectPage project={projectById[second]} />;
  if (path === "news") return <NewsPage />;
  if (first === "news" && second === "tpost") {
    const n = news.find((n) => n.id === third);
    return n ? <ArticlePage post={n} /> : <NotFound />;
  }
  if (path === "vladivostok") return <CityPage city={cityById.vladivostok} />;
  if (first === "cities" && cityById[second])
    return <CityPage city={cityById[second]} />;
  if (region) {
    if (second && region.programs[second])
      return <ProgramPage region={region} program={second} />;
    if (!second) return <RegionPage region={region} />;
  }
  if (path === "dvkvartal") return <QuarterPage />;
  if (first === "dvkvartal") {
    const p = quarter.projects.find((p) => p.id === second);
    return p ? <HousingPage project={p} /> : <NotFound />;
  }
  if (path === "materials/ulan-ude") return <MaterialsPage />;
  if (path === "map")
    return (
      <Suspense fallback={<Loading />}>
        <PortalMap />
      </Suspense>
    );
  return <NotFound />;
}
export default function PortalApp() {
  useEffect(() => {
    document.body.classList.add("portal");
    if (location.hash) {
      requestAnimationFrame(() =>
        document
          .getElementById(decodeURIComponent(location.hash.slice(1)))
          ?.scrollIntoView(),
      );
    }
    return () => document.body.classList.remove("portal");
  }, []);
  return (
    <>
      <a className="skip-link" href="#content">
        Перейти к содержанию
      </a>
      <div id="top" />
      <Header />
      <main id="content">
        <Route />
      </main>
      <Footer />
    </>
  );
}
