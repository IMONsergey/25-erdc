import { asset, cities } from "../data.js";
export default function Regions({ selectedCity, onSelectCity }) {
  const city = cities.find((c) => c.id === selectedCity);
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
        <h2 className="section-title reveal" id="regions-title">
          Масштаб города.
          <br />
          <span>Горизонт региона.</span>
        </h2>
        <div className="city-grid reveal" aria-label="Территории агломерации">
          {cities.map((c, i) => (
            <button
              key={c.id}
              className={`city-card ${selectedCity === c.id ? "is-selected" : ""}`}
              aria-pressed={selectedCity === c.id}
              onClick={() => onSelectCity(c.id)}
            >
              <img
                className="city-photo"
                src={asset(c.photo)}
                alt={c.alt}
                loading="lazy"
              />
              <div className="city-card-shade" />
              <span className="city-card-top">
                <span>0{i + 1}</span>
                <img src={asset(c.crest)} alt="" />
              </span>
              <span className="city-card-body">
                <strong>{c.name}</strong>
                <span>{c.description}</span>
                <span className="city-card-link">
                  {selectedCity === c.id ? "Выбрано" : "Открыть территорию"}
                  <b>↗</b>
                </span>
              </span>
            </button>
          ))}
        </div>
        {selectedCity === "vladivostok" ? (
          <article className="city-detail reveal" id="city-detail">
            <img
              className="city-detail-image"
              src={asset("detail-vladivostok.webp")}
              alt="Панорама Русского моста"
              loading="lazy"
            />
            <div className="city-detail-shade" />
            <div className="city-detail-copy">
              <span className="section-kicker">Город у океана</span>
              <h3>
                Характер —<br />
                тихоокеанский.
              </h3>
              <p>
                Сопки, туманы, вантовые мосты над океанскими бухтами и старый
                китайский квартал в центре.
              </p>
            </div>
            <div className="city-detail-facts">
              <div>
                <img src={asset("icon-population.svg")} alt="" />
                <strong>628,4</strong>
                <span>
                  тыс. человек
                  <br />
                  население города
                </span>
              </div>
              <div>
                <img src={asset("icon-quality.svg")} alt="" />
                <strong>
                  205<span> / 360</span>
                </strong>
                <span>
                  индекс качества
                  <br />
                  городской среды, 2024
                </span>
              </div>
            </div>
          </article>
        ) : (
          <div className="city-unavailable" key={selectedCity} role="status">
            <img src={asset(city.crest)} alt="" />
            <div>
              <span className="section-kicker">{city.name}</span>
              <h3>
                Мастер-план готовится
                <br />к публикации
              </h3>
              <p>{city.description}</p>
            </div>
            <button
              className="text-button"
              onClick={() => onSelectCity("vladivostok")}
            >
              К проектам Владивостока ↗
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
