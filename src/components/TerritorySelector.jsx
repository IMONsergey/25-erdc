import { useState } from "react";
import { asset } from "../data.js";
import Icon from "./Icon.jsx";

export default function TerritorySelector({ cities, regionName }) {
  const [selected, setSelected] = useState(cities[0].id);
  const [hovered, setHovered] = useState(null);
  const city = cities.find((c) => c.id === selected);
  const followLight = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--pointer-x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--pointer-y", `${e.clientY - r.top}px`);
  };
  return (
    <section
      className="region-section regional-territories"
      id="cities"
      aria-labelledby="cities-title"
    >
      <div className="shell">
        <div className="section-head reveal">
          <span className="section-kicker">01 / Мастер-планы</span>
          <span className="section-aside">
            {regionName}
            <br />
            Разные города. Общий горизонт.
          </span>
        </div>
        <div className="regions-heading reveal">
          <h2 className="section-title" id="cities-title">
            Города, в которых
            <br />
            <span>хочется жить.</span>
          </h2>
          <span className="regions-hint">
            <Icon name="pin" size={20} /> Выберите территорию
          </span>
        </div>
        <div
          className={`region-city-grid count-${cities.length} reveal`}
          onMouseLeave={() => setHovered(null)}
          aria-label="Мастер-планы городов"
        >
          {cities.map((c, i) => (
            <button
              key={c.id}
              className={`city-card ${selected === c.id ? "is-selected" : ""} ${(hovered || selected) === c.id ? "is-emphasized" : ""}`}
              aria-pressed={selected === c.id}
              aria-controls="regional-city-detail"
              onClick={() => setSelected(c.id)}
              onMouseEnter={() => setHovered(c.id)}
              onFocus={() => setHovered(c.id)}
              onBlur={() => setHovered(null)}
              onPointerMove={followLight}
            >
              <img
                className="city-photo city-illustration"
                src={asset(c.illustration)}
                alt={`Контурная панорама: ${c.name}`}
                loading="lazy"
              />
              <span className="city-card-shade" />
              <span className="city-card-light" />
              <span className="city-card-top">
                <span className="city-number">0{i + 1}</span>
                {c.crest ? (
                  <span className="city-crest">
                    <img src={asset(c.crest)} alt="" />
                  </span>
                ) : (
                  <Icon
                    name={i === 1 ? "anchor" : i === 2 ? "train" : "factory"}
                    size={30}
                  />
                )}
              </span>
              <span className="city-card-body">
                <span className="city-type">{c.tag}</span>
                <strong>
                  {c.name}
                  {c.subtitle && <small>{c.subtitle}</small>}
                </strong>
                <span className="city-card-description">{c.description}</span>
                <span className="city-card-link">
                  <span>
                    {selected === c.id
                      ? "Выбранная территория"
                      : "Исследовать город"}
                  </span>
                  <span className="city-card-arrow">
                    <Icon
                      name="arrow"
                      activeName="check"
                      active={selected === c.id}
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
          className="city-detail city-story regional-city-story"
          id="regional-city-detail"
          aria-label={`О городе ${city.name}`}
        >
          <img
            key={city.image}
            className="city-detail-image"
            src={asset(city.image)}
            alt={`Панорама: ${city.name}`}
            loading="lazy"
          />
          <div className="city-detail-shade" />
          <div className="city-story-top">
            <span>
              <Icon name="pin" size={20} />
              {city.name}
            </span>
            <span className="region-story-marker">Мастер-план территории</span>
          </div>
          <div className="city-story-content" key={city.id} aria-live="polite">
            <span className="section-kicker">{city.tag}</span>
            <h3>{city.title}</h3>
            <p>{city.text}</p>
            <div className="city-themes">
              {city.themes.map(([icon, label]) => (
                <span key={label}>
                  <Icon name={icon} size={22} />
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div className="city-story-bottom">
            {city.stats ? (
              <dl className="city-metrics">
                {city.stats.map(([value, unit, label], i) => (
                  <div className="city-metric" key={label}>
                    <dt>
                      <Icon name={i === 0 ? "people" : "quality"} size={25} />
                      <span>{label}</span>
                    </dt>
                    <dd>
                      <strong>{value}</strong>
                      <small>{unit}</small>
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <span className="city-story-note">{regionName}</span>
            )}
            <a
              className="city-story-cta"
              href={city.href}
              target={city.external ? "_blank" : undefined}
              rel={city.external ? "noreferrer" : undefined}
            >
              <span>
                {city.cta}
                {city.external && <small>На портале «25 городов»</small>}
              </span>
              <Icon
                name={city.external ? "external" : "arrow"}
                hoverName="right"
                size={26}
              />
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
