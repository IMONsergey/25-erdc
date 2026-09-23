import { useEffect, useRef } from "react";
import { asset } from "../data.js";
import { siteHref } from "../site.js";
import Icon from "./Icon.jsx";

export default function RegionalHero({ region }) {
  const ref = useRef(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        ref.current?.style.setProperty(
          "--hero-scroll",
          Math.min(scrollY / ref.current.offsetHeight, 1),
        ),
      );
    };
    addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      removeEventListener("scroll", update);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <section
      ref={ref}
      className={`hero regional-hero regional-hero-${region.id}`}
      id="region"
      aria-labelledby="hero-title"
    >
      <div className="hero-scene">
        <img
          className="hero-image"
          src={asset(region.hero)}
          alt={region.heroAlt}
          fetchPriority="high"
        />
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-topline shell">
        <a href={siteHref("", "#regions")}>
          <Icon name="left" size={18} /> Все регионы
        </a>
        <span>Дальний Восток / {region.code}</span>
      </div>
      <div className="hero-heading">
        <p className="hero-eyebrow">{region.eyebrow}</p>
        <h1 id="hero-title">{region.title}</h1>
        <p className="hero-subtitle">{region.subtitle}</p>
      </div>
      <div className="hero-bottom shell">
        <a className="hero-explore" href="#cities">
          <span className="round-arrow">
            <Icon name="diagonal" hoverName="down" size={27} />
          </span>
          <span>
            Открыть
            <br />
            мастер-планы
          </span>
        </a>
        <div className="hero-stats" aria-label="Показатели региона">
          {region.stats.map(([value, unit, label]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>
                {value}
                <small>{unit}</small>
              </strong>
            </div>
          ))}
        </div>
        <a className="scroll-cue" href="#cities" aria-label="Листать к городам">
          <span>Листайте вниз</span>
          <Icon name="down" size={24} />
        </a>
      </div>
    </section>
  );
}
