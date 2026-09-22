import { useState } from "react";
import { asset, cities } from "../data.js";
import Icon from "./Icon.jsx";
const stories = {
  vladivostok: {
    illustration: "city-lineart-vladivostok.webp",
    name: "Владивосток",
    tag: "Город у океана",
    title: (
      <>
        Характер —<br />
        тихоокеанский.
      </>
    ),
    text: "Сопки, туманы, вантовые мосты над океанскими бухтами и старый китайский квартал в центре.",
    photo: "detail-vladivostok.webp",
    alt: "Панорама Русского моста",
    themes: [
      ["anchor", "Морская экономика"],
      ["social", "Наука и образование"],
      ["tourism", "Туризм"],
    ],
  },
  artem: {
    illustration: "city-lineart-artem.webp",
    name: "Артём",
    tag: "Воздушные ворота агломерации",
    title: <>Город в движении.</>,
    text: "Город аэропорта, промышленности и новых жилых территорий. Артём связывает воздушные маршруты с повседневной жизнью агломерации.",
    photo: "city-artem.webp",
    alt: "Панорама Артёма",
    themes: [
      ["plane", "Международный аэропорт"],
      ["factory", "Промышленность"],
      ["housing", "Жилые территории"],
    ],
  },
  "bolshoy-kamen": {
    illustration: "city-lineart-bolshoy-kamen.webp",
    name: "Большой Камень",
    tag: "Морская промышленность",
    title: (
      <>
        Масштаб —<br />
        океанский.
      </>
    ),
    text: "Центр судостроения, производства и развития морской промышленности. Территория, чья экономика тесно связана с морем.",
    photo: "city-bolshoy-kamen.webp",
    alt: "Морской пейзаж Приморья из макета",
    themes: [
      ["ship", "Судостроение"],
      ["factory", "Производство"],
      ["waves", "Морская промышленность"],
    ],
  },
};
export default function Regions({ selectedCity, onSelectCity }) {
  const [hovered, setHovered] = useState(null);
  const [view, setView] = useState("about");
  const story = stories[selectedCity];
  const active = hovered || selectedCity;
  const select = (id) => {
    onSelectCity(id);
    setView("about");
  };
  const followLight = (event) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--pointer-x",
      `${event.clientX - rect.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--pointer-y",
      `${event.clientY - rect.top}px`,
    );
  };
  return (
    <section
      id="regions"
      className="region-section"
      aria-labelledby="regions-title"
    >
      <div className="shell">
        <div className="section-head reveal">
          <span className="section-kicker">01 / Территории</span>
          <span className="section-aside">
            Единая агломерация.
            <br />
            Разные возможности.
          </span>
        </div>
        <div className="regions-heading reveal">
          <h2 className="section-title" id="regions-title">
            Масштаб города.
            <br />
            <span>Горизонт региона.</span>
          </h2>
          <span className="regions-hint">
            <Icon name="pin" size={19} /> Выберите территорию
          </span>
        </div>
        <div
          className="city-grid reveal"
          data-active={active}
          aria-label="Территории агломерации"
          onMouseLeave={() => setHovered(null)}
        >
          {cities.map((city, index) => (
            <button
              key={city.id}
              className={`city-card ${selectedCity === city.id ? "is-selected" : ""} ${active === city.id ? "is-emphasized" : ""}`}
              aria-pressed={selectedCity === city.id}
              aria-controls="city-detail"
              onClick={() => select(city.id)}
              onMouseEnter={() => setHovered(city.id)}
              onFocus={() => setHovered(city.id)}
              onBlur={() => setHovered(null)}
              onPointerMove={followLight}
            >
              <img
                className="city-photo city-illustration"
                src={asset(stories[city.id].illustration)}
                alt={`Контурная панорама: ${stories[city.id].name}`}
                loading="lazy"
              />
              <span className="city-card-shade" />
              <span className="city-card-light" />
              <span className="city-card-top">
                <span className="city-number">0{index + 1}</span>
                <span
                  className={`city-crest ${city.id === "bolshoy-kamen" ? "has-wide-source" : ""}`}
                >
                  <img src={asset(city.crest)} alt="" />
                </span>
              </span>
              <span className="city-card-body">
                <span className="city-type">
                  {index === 0
                    ? "Море · наука · культура"
                    : index === 1
                      ? "Авиация · промышленность"
                      : "Море · судостроение"}
                </span>
                <strong>
                  {index === 0 ? (
                    <>
                      Владивосток<small>и остров Русский</small>
                    </>
                  ) : (
                    stories[city.id].name
                  )}
                </strong>
                <span className="city-card-description">
                  {city.description}
                </span>
                <span className="city-card-link">
                  <span>
                    {selectedCity === city.id
                      ? "Выбранная территория"
                      : "Исследовать город"}
                  </span>
                  <span className="city-card-arrow">
                    <Icon
                      name="arrow"
                      active={selectedCity === city.id}
                      activeName="check"
                      hoverName="right"
                      size={23}
                    />
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>
        <article
          className={`city-detail city-story ${view === "directions" ? "is-directions" : ""}`}
          id="city-detail"
          aria-label={`О городе ${story.name}`}
        >
          <img
            key={story.photo}
            className="city-detail-image"
            src={asset(story.photo)}
            alt={story.alt}
            loading="lazy"
          />
          <div className="city-detail-shade" />
          <div className="city-story-top">
            <span>
              <Icon name="pin" size={18} /> {story.name}
            </span>
            <div className="city-story-tabs" aria-label="Сведения о территории">
              <button
                aria-pressed={view === "about"}
                onClick={() => setView("about")}
              >
                О городе
              </button>
              <button
                aria-pressed={view === "directions"}
                onClick={() => setView("directions")}
              >
                Направления
              </button>
            </div>
          </div>
          <div
            className="city-story-content"
            key={`${selectedCity}-${view}`}
            aria-live="polite"
          >
            <span className="section-kicker">{story.tag}</span>
            <h3>
              {view === "about" ? (
                story.title
              ) : (
                <>
                  Сильные стороны
                  <br />
                  территории.
                </>
              )}
            </h3>
            <p>{story.text}</p>
            {view === "directions" && (
              <div className="city-themes">
                {story.themes.map(([icon, text]) => (
                  <span key={text}>
                    <Icon name={icon} size={22} />
                    {text}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="city-story-bottom">
            {selectedCity === "vladivostok" && view === "about" ? (
              <dl className="city-metrics" aria-label="Показатели Владивостока">
                <div className="city-metric">
                  <dt>
                    <Icon name="people" size={26} />
                    <span>Население города</span>
                  </dt>
                  <dd>
                    <strong>628,4</strong>
                    <small>тыс. человек</small>
                  </dd>
                </div>
                <div className="city-metric">
                  <dt>
                    <Icon name="quality" size={26} />
                    <span>Индекс городской среды</span>
                  </dt>
                  <dd>
                    <strong>
                      205<span> / 360</span>
                    </strong>
                    <small>2024 год</small>
                  </dd>
                </div>
              </dl>
            ) : (
              <div className="city-story-note">
                {selectedCity === "vladivostok"
                  ? "27 проектов Владивостока и острова Русский — в атласе развития."
                  : "Подробные проекты этой территории готовятся к публикации."}
              </div>
            )}
            <a className="city-story-cta" href="#projects">
              <span>
                {selectedCity === "vladivostok"
                  ? "К проектам города"
                  : "К атласу Владивостока"}
              </span>
              <Icon name="arrow" hoverName="right" size={25} />
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
