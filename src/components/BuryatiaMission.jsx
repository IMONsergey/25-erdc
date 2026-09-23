import { useState } from "react";
import { asset } from "../data.js";
import Icon from "./Icon.jsx";
const principles = [
  [
    "housing",
    "Город двух рек",
    "Улан-Удэ расположен в горной долине Селенги и Уды, к востоку от Байкала. Культурный и административный центр Республики Бурятия.",
  ],
  [
    "economy",
    "Экономика города",
    "Промышленность, сервисы, малые и средние предприятия формируют экономику Улан-Удэ и прилегающих территорий.",
  ],
  [
    "globe",
    "Восток — Запад",
    "Транссиб, федеральные дороги и международный аэропорт связывают город с российскими регионами и странами Азии.",
  ],
];
const connections = [
  {
    icon: "train",
    title: "Транссиб",
    sub: "железная дорога",
    image: "mission-ulan-ude-map.webp",
    alt: "Схема транспортных связей Улан-Удэ",
    text: "Узловая точка Транссибирской магистрали. Через Улан-Удэ проходят железнодорожные маршруты между Восточной Сибирью и Дальним Востоком.",
    map: true,
  },
  {
    icon: "route",
    title: "Байкал",
    sub: "федеральная трасса",
    image: "concept-bridge.webp",
    alt: "Транспортные связи и природного ландшафта",
    text: "Федеральная трасса «Байкал» связывает Улан-Удэ с Иркутском и Читой, объединяя города и территории региона.",
    concept: true,
  },
  {
    icon: "plane",
    title: "Аэропорт",
    sub: "воздушные связи",
    image: "mission-buryatia-airport.webp",
    alt: "Региональный аэропорт в горной долине",
    text: "Международный аэропорт «Байкал» обеспечивает воздушные связи республики с другими городами и странами.",
    concept: true,
  },
  {
    icon: "globe",
    title: "Азия",
    sub: "международные связи",
    image: "mission-buryatia-asia.webp",
    alt: "Грузовой поезд в степном ландшафте",
    text: "Географическое положение Бурятии создаёт возможности для международных торговых, культурных и образовательных связей.",
    concept: true,
  },
];
export default function BuryatiaMission() {
  const [active, setActive] = useState(0);
  const item = connections[active];
  return (
    <section
      className="mission-section"
      id="mission"
      aria-labelledby="mission-title"
    >
      <div className="shell mission-layout">
        <div className="mission-copy reveal">
          <span className="section-kicker">02 / Миссия города</span>
          <h2 id="mission-title">
            Улан-Удэ —<br />
            точка встречи <span>Востока и Запада.</span>
          </h2>
          <div className="mission-principles">
            {principles.map(([icon, title, text]) => (
              <article
                className="mission-principle"
                key={title}
                data-icon-trigger
              >
                <div className="mission-emblem">
                  <Icon name={icon} hoverName="arrow" size={32} />
                </div>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="mission-strategy reveal">
          <div className={`strategy-visual ${item.map ? "is-map" : ""}`}>
            <img
              key={item.image}
              src={asset(item.image)}
              alt={item.alt}
              loading="lazy"
            />
            <span className="strategy-label">
              <Icon name={item.icon} size={18} />
              {item.title}
            </span>
          </div>
          <div className="strategy-body">
            <div className="strategy-heading">
              <h3>Стратегическое положение</h3>
              <span>0{active + 1} / 04</span>
            </div>
            <div
              className="strategy-tabs"
              aria-label="Транспортные связи Улан-Удэ"
            >
              {connections.map((c, i) => (
                <button
                  key={c.title}
                  aria-pressed={i === active}
                  onClick={() => setActive(i)}
                  className={active === i ? "is-active" : ""}
                >
                  <Icon name={c.icon} size={32} />
                  <strong>{c.title}</strong>
                  <small>{c.sub}</small>
                </button>
              ))}
            </div>
            <p className="strategy-description" key={active} aria-live="polite">
              {item.text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
