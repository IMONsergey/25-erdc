import { useEffect, useRef, useState } from "react";
import Icon from "../components/Icon.jsx";
import Motion from "../components/Motion.jsx";
import RegionalAtlas from "./RegionalAtlas.jsx";
import CityAtlas from "./CityAtlas.jsx";
import { siteHref } from "../site.js";
import { cities, regions, projects, cityById, regionById, projectById, media, regionPath, cityPath, programNames } from "../portal/data.js";

const padded = (n) => String(n).padStart(2, "0");
const clean = (s = "") => s.replaceAll("км 2", "км²").replaceAll("м 2", "м²").replace(/\*$/, "");
const firstSentence = (s = "") => {
  for (const match of s.matchAll(/[.!?](?=\s|$)/g)) {
    const sentence = s.slice(0, match.index + 1).trim();
    if (!/(?:^|\s)(?:г|ул|им|тыс|руб|оз|о|кв|д|пр)\.$/i.test(sentence)) return sentence;
  }
  return s;
};
const metricLabel = (s) => clean(s)
  .replace(/численность населения/i, "Население")
  .replace(/Индекс качества городской среды на (\d{4})г\./i, "Индекс среды · $1")
  .replace(/площадь территории/i, "Площадь территории");
const splitValue = (s) => {
  const match = clean(s).match(/^([\d\s.,]+)\s*(.*)$/);
  return match ? [match[1].trim(), match[2]] : [s, ""];
};
const pictures = {
  vladivostok: "city-lineart-vladivostok.webp",
  artem: "city-lineart-artem.webp",
  "bolshoy-kamen": "city-lineart-bolshoy-kamen.webp",
  nakhodka: "city-lineart-nakhodka.webp",
  ussuriysk: "city-lineart-ussuriysk.webp",
  arsenyev: "city-lineart-arsenyev.webp",
  "ulan-ude": "city-lineart-ulan-ude-v2.webp",
  severobaykalsk: "city-lineart-severobaikalsk-v2.webp",
};
const crests = {
  vladivostok: "crest-vladivostok.webp",
  artem: "crest-artem.webp",
  "bolshoy-kamen": "crest-bolshoy-kamen.webp",
  "ulan-ude": "crest-ulan-ude.webp",
  severobaykalsk: "crest-severobaikalsk.webp",
};
const heroPicture = (entity) => ({primkrai:"hero-primorye.webp", buryatia:"hero-buryatia.webp"}[entity.id] || entity.image);
const projectGroup = (p) => p.category || (p.program === "masterplan" ? (p.section || "Мастер-план") : programNames[p.program]);
function Photo({ src, alt = "", priority = false, ...props }) {
  return src ? <img src={media(src)} alt={alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} decoding="async" {...props} /> : null;
}
function Metrics({ items, className = "hero-stats" }) {
  return <div className={className}>{items.map((s) => {
    const [number, unit] = splitValue(s.value);
    return <div key={s.label}><span title={clean(s.label)}>{metricLabel(s.label)}</span><strong>{number}<small>{unit}</small></strong></div>;
  })}</div>;
}
function TerritoryHero({ entity, region, isRegion, count }) {
  const ref = useRef(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ref.current?.style.setProperty("--hero-scroll", Math.min(window.scrollY / ref.current.offsetHeight, 1)));
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", update); cancelAnimationFrame(frame); };
  }, []);
  const stats = [...entity.stats, {value: String(count), label: isRegion ? "Мастер-планы городов" : "Проекты мастер-плана"}];
  const name = entity.name;
  return <section className={`hero territory-hero ${name.length > 21 ? "territory-hero-long" : ""}`} ref={ref} id="city" aria-labelledby="hero-title">
    <div className="hero-scene"><Photo className="hero-image" src={heroPicture(entity)} alt={name} priority /></div>
    <div className="hero-shade" aria-hidden="true" />
    <div className="hero-topline shell">
      <a href={siteHref(isRegion ? "regions" : regionPath(region))}><Icon name="left" size={18} />{isRegion ? "Все регионы" : region.name}</a>
      <span>{isRegion ? "Дальний Восток" : "Мастер-план развития"}</span>
    </div>
    <div className="hero-heading">
      <p className="hero-eyebrow">{isRegion ? "Регион" : /агломерация/i.test(name) ? "Мастер-план агломерации" : "Город"}</p>
      <h1 id="hero-title">{name}</h1>
      <p className="hero-subtitle">{isRegion ? region.cities.map(id => cityById[id].name).join(" · ") : entity.mission}</p>
    </div>
    <div className="hero-bottom shell">
      <a className="hero-explore" href={isRegion ? "#regions" : "#projects"}><span className="round-arrow"><Icon name="diagonal" hoverName="down" size={27} /></span><span>Открыть<br />{isRegion ? "мастер-планы" : "будущее города"}</span></a>
      <Metrics items={stats} />
      <a href="#regions" className="scroll-cue" aria-label="Листать к территориям"><span>Листайте вниз</span><Icon name="down" size={24} /></a>
    </div>
  </section>;
}
function Territories({ members, initial, isRegion, onShowMap }) {
  const [selected, setSelected] = useState(initial || members[0].id);
  const [view, setView] = useState("about");
  const city = cityById[selected];
  const directions = [...new Set(city.projects.map(id => projectGroup(projectById[id])))].filter(Boolean);
  const about = firstSentence(city.about.join(" "));
  return <section className="region-section" id="regions" aria-labelledby="regions-title">
    <div className="shell">
      <div className="section-head reveal"><span className="section-kicker">01 / Территории</span><span className="section-aside">{isRegion ? "Города и агломерации региона" : regionById[city.region].name}</span></div>
      <div className="regions-heading reveal"><h2 className="section-title" id="regions-title">Масштаб города.<br /><span>Горизонт региона.</span></h2><span className="regions-hint"><Icon name="pin" size={19} />Выберите территорию</span></div>
      <div className={`city-grid territory-city-grid territory-count-${members.length}`} aria-label="Территории региона">
        {members.map((c, i) => <button key={c.id} className={`city-card ${selected === c.id ? "is-selected is-emphasized" : ""}`} aria-pressed={selected === c.id} aria-controls="city-detail" onClick={() => {setSelected(c.id);setView("about");}}>
          <Photo className={`city-photo ${pictures[c.id] ? "city-illustration" : "territory-city-photo"}`} src={pictures[c.id] || c.image} alt={c.name} />
          <span className="city-card-shade" /><span className="city-card-light" />
          <span className="city-card-top"><span className="city-number">{padded(i + 1)}</span>{crests[c.id] && <span className={`city-crest ${c.id === "bolshoy-kamen" ? "has-wide-source" : ""}`}><Photo src={crests[c.id]} alt="" /></span>}</span>
          <span className="city-card-body"><span className="city-type">Мастер-план развития</span><strong>{c.name}</strong><span className="city-card-description">{c.mission}</span><span className="city-card-link"><span>{selected === c.id ? "Выбранная территория" : "Исследовать город"}</span><span className="city-card-arrow"><Icon name="arrow" active={selected === c.id} activeName="check" size={23} /></span></span></span>
        </button>)}
      </div>
      <article className="city-detail city-story" id="city-detail" aria-label={`О городе ${city.name}`}>
        <Photo className="city-detail-image" src={city.image} alt={city.name} key={city.image} /><div className="city-detail-shade" />
        <div className="city-story-top"><span><Icon name="pin" size={18} />{city.name}</span><div className="city-story-tabs" aria-label="Сведения о территории"><button aria-pressed={view === "about"} onClick={() => setView("about")}>О городе</button><button aria-pressed={view === "directions"} onClick={() => setView("directions")}>Направления</button></div></div>
        <div className="city-story-content" key={`${selected}-${view}`} aria-live="polite"><span className="section-kicker">Мастер-план развития</span><h3>{city.mission}</h3>{view === "about" ? <p>{about}</p> : <div className="city-themes">{directions.map(t => <span key={t}><Icon name="housing" size={20} />{t}</span>)}</div>}</div>
        <div className="city-story-bottom"><Metrics className="territory-story-metrics" items={city.stats} />{onShowMap && <button className="territory-map-link" onClick={() => onShowMap(city.id)}><Icon name="pin" size={20} />Объекты на карте</button>}<a className="city-story-cta" href={city.id === initial && !isRegion ? "#projects" : siteHref(cityPath(city))}><span>{city.id === initial && !isRegion ? "К проектам города" : "Открыть мастер-план"}</span><Icon name="arrow" hoverName="right" size={25} /></a></div>
      </article>
    </div>
  </section>;
}
function Mission({ entity, region, isRegion, items }) {
  const [active, setActive] = useState(0);
  const entries = isRegion
    ? region.cities.map(id => ({name: cityById[id].name, text: cityById[id].mission, image: cityById[id].image, href: siteHref(cityPath(cityById[id]))}))
    : items.filter(p => p.images.length).slice(0, 4).map(p => ({name:p.title, text:p.texts[0] || p.title, image:p.images[0], href:siteHref(`projects/${p.id}`)}));
  const entry = entries[active];
  const paragraphs = isRegion ? [] : entity.about.flatMap(t => t.split(/(?<=[.!?])\s+(?=[А-ЯЁ«])/));
  const lead = isRegion ? "Города региона. Единая стратегия развития." : entity.mission;
  return <section className="mission-section" id="mission" aria-labelledby="mission-title"><div className="shell mission-layout">
    <div className="mission-copy reveal"><span className="section-kicker">02 / {isRegion ? "Развитие региона" : "Миссия города"}</span><h2 id="mission-title">{lead}</h2>
      <div className="mission-principles">{isRegion ? Object.entries(region.programs).map(([id, p]) => <article className="mission-principle" key={id}><div className="mission-emblem"><Icon name={id === "subsidy" ? "social" : "ecology"} size={32} /></div><div><h3><a href={siteHref(`${regionPath(region)}/${id}`)}>{p.name} <Icon name="arrow" size={18} /></a></h3><p>Объектов в программе: {p.projects.length}</p></div></article>) : paragraphs.slice(0,3).map((text,i) => <article className="mission-principle" key={i}><div className="mission-emblem"><Icon name={["housing","economy","globe"][i]} size={32} /></div><div><p>{text}</p></div></article>)}</div>
      {!isRegion && paragraphs.length > 3 && <details className="territory-about-more"><summary>Подробнее о городе<Icon name="plus" size={20} /></summary>{paragraphs.slice(3).map((t,i) => <p key={i}>{t}</p>)}</details>}
    </div>
    {entry && <div className="mission-strategy reveal"><div className="strategy-visual"><Photo src={entry.image} alt={entry.name} key={entry.image} /><span className="strategy-label"><Icon name="pin" size={18} />{entity.name}</span></div><div className="strategy-body"><div className="strategy-heading"><h3>{isRegion ? "Мастер-планы городов" : "Проекты развития"}</h3><span>{padded(active+1)} / {padded(entries.length)}</span></div><div className="strategy-tabs territory-strategy-tabs" aria-label={isRegion ? "Города региона" : "Проекты развития"}>{entries.map((item,i) => <button key={item.name} aria-label={item.name} aria-pressed={active===i} className={active===i ? "is-active" : ""} onClick={() => setActive(i)}><Icon name={isRegion ? "pin" : "housing"} size={26} /><strong>{isRegion ? item.name : padded(i+1)}</strong></button>)}</div><p className="strategy-description" key={active} aria-live="polite">{firstSentence(entry.text)}</p><a className="territory-inline-link" href={entry.href}>{isRegion ? "Открыть мастер-план" : "Подробнее о проекте"}<Icon name="arrow" size={20} /></a></div></div>}
  </div></section>;
}
export default function TerritoryPage({ region, city, materials }) {
  const [atlasCity, setAtlasCity] = useState(null);
  const showCityOnMap = city => {
    if (city === "vladivostok") {
      location.assign(siteHref("vladivostok", "#projects"));
      return;
    }
    setAtlasCity({ city });
    document.getElementById("projects")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  const isRegion = !city;
  const r = region || regionById[city.region];
  const entity = city || r;
  const members = r.cities.map(id => cityById[id]);
  const items = isRegion ? projects.filter(p => p.region === r.id) : city.projects.map(id => projectById[id]);
  const next = regions[(regions.findIndex(item => item.id===r.id)+1)%regions.length];
  return <div className={isRegion ? "territory-template" : "territory-template city-masterplan-page"}>
    <div className="ocean-zone"><TerritoryHero entity={entity} region={r} isRegion={isRegion} count={isRegion ? members.length : items.length} /><Territories members={members} initial={city?.id} isRegion={isRegion} onShowMap={isRegion ? showCityOnMap : undefined} /></div>
    <Mission entity={entity} region={r} isRegion={isRegion} items={items} />
    {isRegion ? <RegionalAtlas region={r} focusCity={atlasCity} /> : <CityAtlas city={city} items={items} />}
    {materials && <section className="territory-materials shell" id="materials"><details><summary><span><span className="section-kicker">Материалы мастер-плана</span><strong>Схемы и визуализации</strong></span><Icon name="plus" size={30} /></summary><div className="portal territory-materials-content">{materials}</div></details></section>}
    <section className="region-next"><div className="shell"><span className="section-kicker">Продолжить путешествие</span><a href={siteHref(regionPath(isRegion ? next : r))}><span>{isRegion ? next.name : r.name}</span><Icon name="arrow" hoverName="right" size={60} /></a><span>{isRegion ? "Следующий регион" : "Все города региона"}</span></div></section>
    <Motion />
  </div>;
}
