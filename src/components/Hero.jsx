import { asset } from "../data.js";

const stats = [
  ["Площадь территории", "5.3", "тыс. км²"],
  ["Население края", "834.7", "тыс человек"],
  ["Горизонт реализации", "2050", "год"],
];

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <img className="hero-image" src={asset("hero-vladivostok.webp")} alt="Владивосток и Русский мост" />
      <div className="hero-shade" aria-hidden="true" />
      <div className="shell hero-inner">
        <div className="hero-heading">
          <p className="hero-eyebrow">Агломерация</p>
          <h1 id="hero-title">Владивосток</h1>
        </div>
        <div className="hero-summary" id="about">
          <div className="hero-stats" aria-label="Основные показатели">
            {stats.map(([label, value, unit]) => (
              <article className="glass-stat" key={label}>
                <span>{label}</span><strong>{value}</strong><small>{unit}</small>
              </article>
            ))}
          </div>
          <p>Агломерация объединяет территории, связанные общей экономикой, транспортной системой, рынком труда и единой стратегией пространственного развития.</p>
          <a className="scroll-cue" href="#regions" aria-label="Перейти к мастер-планам">
            <img src={asset("icon-scroll.svg")} alt="" width="34" height="34" />
          </a>
        </div>
      </div>
    </section>
  );
}
