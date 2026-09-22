import { useState } from "react";
import { asset } from "../data.js";
const items = [
  {
    title: "Морские ворота",
    text: "Владивосток — административный центр Приморского края и крупнейший морской город Дальнего Востока. Он расположен на полуострове Муравьёва-Амурского и островах залива Петра Великого.",
    image: "mission-city.webp",
    icon: "icon-mission-city.svg",
  },
  {
    title: "Точка притяжения",
    text: "Город объединяет портовую экономику, международную торговлю, образование, науку, туризм и высокотехнологичные отрасли.",
    image: "city-vladivostok.webp",
    icon: "icon-mission-industry.svg",
  },
  {
    title: "Связь с миром",
    text: "Здесь завершается Транссибирская магистраль, действует крупнейший морской порт и расположен международный аэропорт Владивосток. Город связывает Россию со странами Азиатско-Тихоокеанского региона.",
    image: "mission-map.webp",
    icon: "icon-mission-globe.svg",
  },
];
export default function Mission() {
  const [active, setActive] = useState(0);
  return (
    <section
      className="mission-section shell"
      id="mission"
      aria-labelledby="mission-title"
    >
      <div className="section-head reveal">
        <span className="section-kicker">02 / Миссия города</span>
        <span className="section-aside">
          Россия · Азиатско-Тихоокеанский регион
        </span>
      </div>
      <h2 className="section-title reveal" id="mission-title">
        Морские ворота России.
        <br />
        <span>Открыты будущему.</span>
      </h2>
      <div className="mission-composition reveal">
        <div className="mission-accordion">
          {items.map((item, i) => (
            <article
              className={`mission-item ${i === active ? "is-active" : ""}`}
              key={item.title}
            >
              <h3>
                <button
                  aria-expanded={i === active}
                  aria-controls={`mission-panel-${i}`}
                  onClick={() => setActive(i)}
                >
                  <span className="mission-number">0{i + 1}</span>
                  {item.title}
                  <span className="mission-plus">
                    {i === active ? "−" : "+"}
                  </span>
                </button>
              </h3>
              <div id={`mission-panel-${i}`} hidden={i !== active}>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
        <div className={`mission-media ${active === 2 ? "is-diagram" : ""}`}>
          <img
            key={active}
            src={asset(items[active].image)}
            alt={
              active === 2
                ? "Схема международных транспортных связей Владивостока"
                : "Владивосток — город у моря"
            }
            loading="lazy"
          />
          <span className="mission-media-index">
            0{active + 1}
            <span> / 03</span>
          </span>
          <img
            className="mission-media-icon"
            src={asset(items[active].icon)}
            alt=""
          />
        </div>
      </div>
      <div className="connections reveal">
        {[
          ["icon-rail.svg", "Транссибирская", "магистраль"],
          ["icon-highway.svg", "Уссури", "федеральная трасса"],
          ["icon-airport.svg", "Владивосток", "международный аэропорт"],
          ["icon-global.svg", "Китай, Корея, Япония", "международные связи"],
        ].map(([icon, title, text]) => (
          <div key={title}>
            <img src={asset(icon)} alt="" />
            <span>
              <strong>{title}</strong>
              <small>{text}</small>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
