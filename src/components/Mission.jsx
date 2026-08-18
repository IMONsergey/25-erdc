import { asset } from "../data.js";
import { FadeText, MaskedWords } from "./AnimatedText.jsx";

const missionCards = [
  {
    number: "01",
    text: "Владивосток — административный центр Приморского края и крупнейший морской город Дальнего Востока. Он расположен на полуострове Муравьёва-Амурского и островах залива Петра Великого, на побережье Японского моря.",
    icon: "icon-mission-city.svg",
  },
  {
    number: "02",
    text: "Город объединяет портовую экономику, международную торговлю, образование, науку, туризм и высокотехнологичные отрасли.",
    icon: "icon-mission-industry.svg",
  },
  {
    number: "03",
    text: "Город занимает стратегическое положение между Россией и странами Азиатско-Тихоокеанского региона. Здесь завершается Транссибирская магистраль, действует крупнейший морской порт и расположен международный аэропорт Владивосток.",
    icon: "icon-mission-globe.svg",
  },
];

const strategicItems = [
  ["Транссибирская магистраль", "icon-rail.svg"],
  ["Федеральная трасса Уссури", "icon-highway.svg"],
  ["Международный аэропорт Владивосток", "icon-airport.svg"],
  ["Связь с Китаем, Кореей, Японией", "icon-global.svg"],
];

export default function Mission() {
  return (
    <section className="shell mission-section" aria-labelledby="mission-title">
      <div className="section-intro">
        <FadeText as="p" className="section-label">Миссия города</FadeText>
        <h2 id="mission-title"><MaskedWords text="Владивосток — морские ворота России в Азиатско-Тихоокеанский регион" /></h2>
      </div>
      <div className="mission-grid">
        {missionCards.map((card) => (
          <article className="mission-card" key={card.number}>
            <div><span className="card-number">{card.number}</span><FadeText as="p">{card.text}</FadeText></div>
            <img src={asset(card.icon)} alt="" />
          </article>
        ))}
        <img className="mission-visual" src={asset("mission-map.webp")} alt="Схема транспортных связей Владивостока" />
        <img className="mission-visual" src={asset("mission-city.webp")} alt="Городская панорама Владивостока" />
        <article className="strategic-card">
          <h3><MaskedWords text="Стратегическое положение" /></h3>
          <ul>
            {strategicItems.map(([label, icon]) => (
              <li key={label}><span>{label}</span><img src={asset(icon)} alt="" /></li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
