import { useState } from "react";
import { asset } from "../data.js";
import { siteHref } from "../site.js";
import { regions, primoryeCities } from "../regionData.jsx";
import RegionalHero from "../components/RegionalHero.jsx";
import TerritorySelector from "../components/TerritorySelector.jsx";
import Icon from "../components/Icon.jsx";

const potential = [
  {
    icon: "ship",
    title: "Выход к океану",
    text: "Морские порты и международные маршруты. Приморье связывает российскую экономику со странами Азиатско-Тихоокеанского региона.",
  },
  {
    icon: "route",
    title: "Пересечение маршрутов",
    text: "Морские, железнодорожные и автомобильные связи объединяют города края и формируют основу для развития логистики.",
  },
  {
    icon: "economy",
    title: "Экономика возможностей",
    text: "Промышленность, наука и новые индустрии. Развитие территорий создаёт пространство для работы, предпринимательства и самореализации.",
  },
  {
    icon: "ecology",
    title: "Природа рядом",
    text: "Побережье, острова и горные ландшафты — часть характера региона. Туризм и городская среда раскрывают этот потенциал для жителей и гостей.",
  },
];
const changes = [
  [
    "housing",
    "Комфортные города",
    "Жильё, общественные пространства и повседневные сервисы — рядом с человеком.",
    "concept-waterfront.webp",
  ],
  [
    "route",
    "Связанные территории",
    "Транспорт соединяет городские центры и открывает новые маршруты для жизни и работы.",
    "concept-bridge.webp",
  ],
  [
    "economy",
    "Новые центры экономики",
    "Индустрии, логистика и наука создают возможности для развития всего региона.",
    "concept-logistics.webp",
  ],
];
export default function PrimoryePage() {
  const [active, setActive] = useState(0);
  return (
    <>
      <div className="ocean-zone">
        <RegionalHero region={regions.primorye} />
        <TerritorySelector
          cities={primoryeCities}
          regionName="Приморский край"
        />
      </div>
      <section
        className="regional-potential light-section"
        id="potential"
        aria-labelledby="potential-title"
      >
        <div className="shell">
          <div className="section-head reveal">
            <span className="section-kicker">02 / Потенциал региона</span>
            <span className="section-aside">Россия — Тихий океан</span>
          </div>
          <div className="potential-layout">
            <div className="reveal">
              <h2 className="section-title" id="potential-title">
                Приморье —<br />
                <span>ворота в АТР.</span>
              </h2>
              <p className="section-lead">
                Место, где география становится возможностью.
              </p>
              <div className="potential-tabs" aria-label="Преимущества региона">
                {potential.map((p, i) => (
                  <button
                    key={p.title}
                    aria-pressed={active === i}
                    onClick={() => setActive(i)}
                  >
                    <Icon name={p.icon} size={26} />
                    <span>{p.title}</span>
                    <Icon
                      name="arrow"
                      activeName="right"
                      active={active === i}
                      size={22}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="potential-panel reveal">
              <div className="potential-map">
                <span className="section-kicker">Приморский край / 25</span>
                <img
                  src={asset("region-primorye-map.webp")}
                  alt="Схема Приморского края из мастер-плана"
                  loading="lazy"
                />
              </div>
              <div className="potential-copy" key={active} aria-live="polite">
                <span>0{active + 1} / 04</span>
                <h3>{potential[active].title}</h3>
                <p>{potential[active].text}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="regional-changes light-section"
        id="changes"
        aria-labelledby="changes-title"
      >
        <div className="shell">
          <div className="section-head reveal">
            <span className="section-kicker">03 / Будущий облик</span>
            <span className="section-aside">От мастер-плана — к переменам</span>
          </div>
          <h2 className="section-title reveal" id="changes-title">
            Новые возможности.
            <br />
            <span>Знакомые города.</span>
          </h2>
          <div className="changes-grid reveal">
            {changes.map(([icon, title, text, image], i) => (
              <article className="change-card" key={title} data-icon-trigger>
                <div className="change-image">
                  <img
                    src={asset(image)}
                    alt={title}
                    loading="lazy"
                  />
                  <span>0{i + 1}</span>
                </div>
                <div className="change-copy">
                  <Icon name={icon} hoverName="arrow" size={30} />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="region-next">
        <div className="shell">
          <span className="section-kicker">Продолжить путешествие</span>
          <a href={siteHref("buryatia")}>
            <span>
              От океана
              <br />к Байкалу.
            </span>
            <Icon name="arrow" hoverName="right" size={64} />
          </a>
          <span>Следующий регион — Республика Бурятия</span>
        </div>
      </section>
    </>
  );
}
