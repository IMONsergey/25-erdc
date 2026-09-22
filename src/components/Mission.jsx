import { useState } from "react";
import { asset } from "../data.js";
import Icon from "./Icon.jsx";
const items = [
  {
    icon: "housing",
    title: "Город у моря",
    text: "Владивосток — административный центр Приморского края и крупнейший морской город Дальнего Востока. Он расположен на полуострове Муравьёва-Амурского и островах залива Петра Великого, на побережье Японского моря.",
  },
  {
    icon: "anchor",
    title: "Экономика притяжения",
    text: "Город объединяет портовую экономику, международную торговлю, образование, науку, туризм и высокотехнологичные отрасли.",
  },
  {
    icon: "globe",
    title: "Связь с миром",
    text: "Город занимает стратегическое положение между Россией и странами Азиатско-Тихоокеанского региона. Здесь завершается Транссибирская магистраль, действует морской порт и расположен международный аэропорт Владивосток.",
  },
];
const connections = [
  {
    icon: "train",
    title: "Транссиб",
    sub: "железная дорога",
    text: "Владивосток — конечная точка Транссибирской магистрали. Железная дорога соединяет город с регионами России.",
    image: "mission-map.webp",
  },
  {
    icon: "route",
    title: "Уссури",
    sub: "федеральная трасса",
    text: "Федеральная трасса «Уссури» связывает Владивосток с Хабаровском и территориями Приморского края.",
    image: "concept-bridge.webp",
  },
  {
    icon: "plane",
    title: "Аэропорт",
    sub: "международный",
    text: "Международный аэропорт Владивосток находится в Артёме — одной из территорий агломерации.",
    image: "city-artem.webp",
  },
  {
    icon: "globe",
    title: "АТР",
    sub: "международные связи",
    text: "Морские ворота России в Азиатско-Тихоокеанский регион. Порт, образование и торговля формируют международные связи города.",
    image: "mission-map.webp",
  },
];
export default function Mission() {
  const [active, setActive] = useState(3);
  const connection = connections[active];
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
            Владивосток —<br />
            морские ворота России <span>в Азиатско-Тихоокеанский регион.</span>
          </h2>
          <div className="mission-principles">
            {items.map((item, index) => (
              <article
                className="mission-principle"
                key={item.title}
                data-icon-trigger
              >
                <div className="mission-emblem">
                  <Icon
                    name={item.icon}
                    hoverName={
                      index === 0 ? "waves" : index === 1 ? "ship" : "plane"
                    }
                    size={32}
                  />
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="mission-strategy reveal">
          <div
            className={`strategy-visual ${active === 0 || active === 3 ? "is-map" : ""}`}
          >
            <img
              key={connection.image}
              src={asset(connection.image)}
              alt={
                active === 0 || active === 3
                  ? "Схема связей Владивостока с Москвой, Хабаровском, Пекином, Сеулом и Токио"
                  : active === 1
                    ? "Концептуальная иллюстрация дорожной инфраструктуры"
                    : "Панорама Артёма — города международного аэропорта"
              }
              loading="lazy"
            />
            <span className="strategy-label">
              <Icon name={connection.icon} size={18} /> {connection.title}
            </span>
            {active === 1 && (
              <span className="image-caption">Концептуальная иллюстрация</span>
            )}
            {(active === 0 || active === 3) && (
              <span className="strategy-beacon" aria-hidden="true" />
            )}
          </div>
          <div className="strategy-body">
            <div className="strategy-heading">
              <h3>Стратегическое положение</h3>
              <span>0{active + 1} / 04</span>
            </div>
            <div className="strategy-tabs" aria-label="Транспортные связи">
              {connections.map((item, index) => (
                <button
                  key={item.title}
                  aria-pressed={active === index}
                  onClick={() => setActive(index)}
                  className={active === index ? "is-active" : ""}
                >
                  <Icon name={item.icon} size={32} />
                  <strong>{item.title}</strong>
                  <small>{item.sub}</small>
                </button>
              ))}
            </div>
            <p className="strategy-description" key={active} aria-live="polite">
              {connection.text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
