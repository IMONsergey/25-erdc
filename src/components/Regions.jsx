import { asset, cities } from "../data.js";
import { FadeText, MaskedWords, Text } from "./AnimatedText.jsx";

function CityCard({ city, selected, onSelect }) {
  return (
    <button
      className={`city-card${selected ? " is-selected" : ""}`}
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(city.id)}
    >
      <span className="city-card-body">
        <span className="city-card-top">
          <img className="city-crest" data-city={city.id} src={asset(city.crest)} alt={`Герб города ${city.name}`} />
          <span className="city-choice">
            {selected ? <span className="selected-label">выбрано</span> : null}
            <span className="city-radio" aria-hidden="true"><span /></span>
          </span>
        </span>
        <Text className="city-card-title">{city.name}</Text>
        <Text className="city-card-description">{city.description}</Text>
      </span>
      <img className="city-photo" src={asset(city.photo)} alt={city.alt} />
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
            <h2>Владивосток</h2>
            <Text as="p">Сопки, туманы, вантовые мосты над океанскими бухтами и старый китайский квартал в центре — Владивосток не зря называют русским Сан-Франциско, его города-побратима. Только здесь этот характер не заимствованный, а свой, тихоокеанский.</Text>
          </div>
          <div className="city-facts-bottom">
            <div className="fact-grid">
              <article className="fact-card">
                <img src={asset("icon-population.svg")} alt="" />
                <span>численность<br />населения</span>
                <strong>628.4</strong><small>тыс. чел.</small>
              </article>
              <article className="fact-card">
                <img src={asset("icon-quality.svg")} alt="" />
                <span>Индекс качества<br />городской среды<br />на 2024г.*</span>
                <strong>205</strong><small>баллов</small>
              </article>
            </div>
            <Text as="p" className="fact-note">*0 — неблагоприятная городская среда, 360 — максимально благоприятная городская среда (данные сайта индекс-городов.рф)</Text>
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
        <h2>Контент в работе</h2>
        <Text>Материалы по территории будут добавлены в следующей итерации.</Text>
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
      {isVladivostok ? <VladivostokDetail /> : <ContentInProgress city={city} />}
    </section>
  );
}
