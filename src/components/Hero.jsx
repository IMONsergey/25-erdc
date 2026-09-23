import { useEffect, useRef } from "react";
import { asset } from "../data.js";
import Icon from "./Icon.jsx";
import { siteHref } from "../site.js";

export default function Hero() {
  const hero = useRef(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const progress = Math.min(
          window.scrollY / hero.current.offsetHeight,
          1,
        );
        hero.current.style.setProperty("--hero-scroll", progress);
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", update);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <section className="hero" ref={hero} id="city" aria-labelledby="hero-title">
      <div className="hero-scene">
        <img
          className="hero-image"
          src={asset("hero-page12.webp")}
          alt="Золотой мост во Владивостоке на закате"
          fetchPriority="high"
        />
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-topline shell">
        <a href={siteHref("primorye")}>Приморский край</a>
        <span>Мастер-план · 2050</span>
      </div>
      <div className="hero-heading">
        <p className="hero-eyebrow">Агломерация</p>
        <h1 id="hero-title">Владивосток</h1>
        <p className="hero-subtitle">
          Территории, связанные общей экономикой,
          <br className="desktop-break" /> транспортной системой и единой
          стратегией развития.
        </p>
      </div>
      <div className="hero-bottom shell">
        <a className="hero-explore" href="#projects">
          <span className="round-arrow">
            <Icon name="diagonal" hoverName="down" size={27} />
          </span>
          <span>
            {"Открыть "}
            <br />
            будущее города
          </span>
        </a>
        <div className="hero-stats" aria-label="Показатели агломерации">
          <div>
            <span>Площадь территории</span>
            <strong>
              5,3<small>тыс. км²</small>
            </strong>
          </div>
          <div>
            <span>Население агломерации</span>
            <strong>
              834,7<small>тыс. человек</small>
            </strong>
          </div>
          <div>
            <span>Горизонт реализации</span>
            <strong>
              2050<small>год</small>
            </strong>
          </div>
        </div>
        <a
          href="#regions"
          className="scroll-cue"
          aria-label="Листать к территориям"
        >
          <span>Листайте вниз</span>
          <Icon name="down" size={24} />
        </a>
      </div>
    </section>
  );
}
