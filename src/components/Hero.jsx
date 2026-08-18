import { asset } from "../data.js";
import { FadeText, MaskedWords } from "./AnimatedText.jsx";

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
          <FadeText as="p" className="hero-eyebrow">Агломерация</FadeText>
          <h1 id="hero-title"><MaskedWords text="Владивосток" /></h1>
        </div>
        <div className="hero-summary" id="about">
          <div className="hero-stats" aria-label="Основные показатели">
            {stats.map(([label, value, unit]) => (
              <article className="glass-stat" key={label}>
                <FadeText>{label}</FadeText><strong><MaskedWords text={value} /></strong><small>{unit}</small>
              </article>
            ))}
          </div>
          <FadeText as="p">Агломерация объединяет территории, связанные общей экономикой, транспортной системой, рынком труда и единой стратегией пространственного развития.</FadeText>
          <a className="scroll-cue" href="#regions" aria-label="Перейти к мастер-планам">
            <img src={asset("icon-scroll.svg")} alt="" width="34" height="34" />
          </a>
        </div>
      </div>
    </section>
  );
}
