import { useState } from "react";
import { asset } from "../data.js";
import { siteHref } from "../site.js";
import { regions, buryatiaCities, ulanDirections } from "../regionData.jsx";
import RegionalHero from "../components/RegionalHero.jsx";
import TerritorySelector from "../components/TerritorySelector.jsx";
import BuryatiaMission from "../components/BuryatiaMission.jsx";
import BuryatiaProjects from "../components/BuryatiaProjects.jsx";
import Icon from "../components/Icon.jsx";

export default function BuryatiaPage() {
  const [active, setActive] = useState(0);
  const item = ulanDirections[active];
  return (
    <>
      <div className="ocean-zone">
        <RegionalHero region={regions.buryatia} />
        <TerritorySelector
          cities={buryatiaCities}
          regionName="Республика Бурятия"
        />
      </div>
      <BuryatiaMission />
      <section
        className="regional-directions light-section"
        id="directions"
        aria-labelledby="directions-title"
      >
        <div className="shell">
          <div className="section-head reveal">
            <span className="section-kicker">03 / Направления развития</span>
            <span className="section-aside">Улан-Удэ / Новый облик</span>
          </div>
          <h2 className="section-title reveal" id="directions-title">
            Город для жизни.
            <br />
            <span>Во всех её проявлениях.</span>
          </h2>
          <div
            className="direction-tabs reveal"
            aria-label="Направления развития Улан-Удэ"
          >
            {ulanDirections.map((d, i) => (
              <button
                key={d.id}
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                aria-controls="direction-panel"
              >
                <span>0{i + 1}</span>
                <Icon name={d.icon} size={32} />
                <strong>{d.title}</strong>
                <Icon
                  name="arrow"
                  activeName="right"
                  active={active === i}
                  size={23}
                />
              </button>
            ))}
          </div>
          <article className="direction-panel reveal" id="direction-panel">
            <div className="direction-image">
              <img
                key={item.id}
                src={asset(item.image)}
                alt={item.title}
                loading="lazy"
              />
            </div>
            <div key={item.title} className="direction-copy" aria-live="polite">
              <span className="section-kicker">0{active + 1} / 04</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <ul>
                {item.features.map((f) => (
                  <li key={f}>
                    <Icon name="check" size={20} />
                    {f}
                  </li>
                ))}
              </ul>
              <a className="text-link" href="#projects">
                Исследовать проекты{" "}
                <Icon name="arrow" hoverName="right" size={23} />
              </a>
            </div>
          </article>
        </div>
      </section>
      <BuryatiaProjects />
      <section className="region-next">
        <div className="shell">
          <span className="section-kicker">Продолжить путешествие</span>
          <a href={siteHref("primorye")}>
            <span>
              Следующий горизонт —<br />
              Тихий океан.
            </span>
            <Icon name="arrow" hoverName="right" size={64} />
          </a>
          <span>Следующий регион — Приморский край</span>
        </div>
      </section>
    </>
  );
}
