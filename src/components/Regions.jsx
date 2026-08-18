import { asset, cities } from "../data.js";
import { FadeText, MaskedWords } from "./AnimatedText.jsx";

function CityCard({ city, selected, onSelect }) {
  return (
    <button
      className={`city-card${selected ? " is-selected" : ""}`}
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(city.id)}
    >
      <span className="city-card-body" key={`${city.id}-${selected ? "selected" : "idle"}`}>
        <span className="city-card-top">
          <img className="city-crest" data-city={city.id} src={asset(city.crest)} alt={`Герб города ${city.name}`} />
          <span className="city-choice">
            {selected ? <span className="selected-label">выбрано</span> : null}
            <span className="city-radio" aria-hidden="true"><span /></span>
          </span>
        </span>
        <span className="city-card-title"><MaskedWords text={city.name} /></span>
        <FadeText className="city-card-description">{city.description}</FadeText>
      </span>
      <img className="city-photo" src={asset(city.photo)} alt={city.alt} key={`${city.id}-photo-${selected ? "selected" : "idle"}`} />
    </button>
  );
}

function VladivostokDetail() {
  return (
    <>
      <div className="soft-divider" />
      <div className="city-detail">
        <article className="city-facts">
          <div className="city-copy">
            <h2><MaskedWords text="Владивосток" /></h2>
            <FadeText as="p">Сопки, туманы, вантовые мосты над океанскими бухтами и старый китайский квартал в центре — Владивосток не зря называют русским Сан-Франциско, его города-побратима. Только здесь этот характер не заимствованный, а свой, тихоокеанский.</FadeText>
          </div>
          <div className="city-facts-bottom">
            <div className="fact-grid">
              <article className="fact-card">
                <img src={asset("icon-population.svg")} alt="" />
                <span>численность<br />населения</span>
                <strong><MaskedWords text="628.4" /></strong><small>тыс. чел.</small>
              </article>
              <article className="fact-card">
                <img src={asset("icon-quality.svg")} alt="" />
                <span>Индекс качества<br />городской среды<br />на 2024г.*</span>
                <strong><MaskedWords text="205" /></strong><small>баллов</small>
              </article>
            </div>
            <FadeText as="p" className="fact-note">*0 — неблагоприятная городская среда, 360 — максимально благоприятная городская среда (данные сайта индекс-городов.рф)</FadeText>
          </div>
        </article>
        <img className="city-detail-image" src={asset("detail-vladivostok.webp")} alt="Русский мост во Владивостоке" />
      </div>
    </>
  );
}

function ContentInProgress({ city }) {
  return (
    <div className="city-progress" role="status">
      <span className="progress-mark" aria-hidden="true">↗</span>
      <div>
        <p>Мастер-план: {city.name}</p>
        <h2><MaskedWords text="Контент в работе" /></h2>
        <FadeText>Материалы по территории будут добавлены в следующей итерации.</FadeText>
      </div>
    </div>
  );
}

export default function Regions({ selectedCity, onSelectCity }) {
  const city = cities.find((item) => item.id === selectedCity) ?? cities[0];
  const isVladivostok = selectedCity === "vladivostok";

  return (
    <section className="shell region-section" id="regions" aria-labelledby="regions-title">
      <div className="section-intro section-intro--light">
        <div>
          <h2 id="regions-title"><MaskedWords text="Мастер-планы агломерации Владивосток" /></h2>
          <FadeText as="p">Выберите территорию, чтобы изучить её мастер-план.</FadeText>
        </div>
        <div className="selection-hint" aria-hidden="true">
          <img src={asset("icon-select-city.svg")} alt="" width="29" height="29" />
          <span>Выберите город<br />для изучения<br />мастер-планов</span>
        </div>
      </div>
      <div className="city-grid" aria-label="Территории агломерации">
        {cities.map((item) => (
          <CityCard key={item.id} city={item} selected={item.id === selectedCity} onSelect={onSelectCity} />
        ))}
      </div>
      {isVladivostok ? <VladivostokDetail /> : <ContentInProgress key={city.id} city={city} />}
    </section>
  );
}
