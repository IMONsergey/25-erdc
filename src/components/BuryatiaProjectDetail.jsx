import { useState } from "react";
import { asset } from "../data.js";
import Icon from "./Icon.jsx";

export default function BuryatiaProjectDetail({
  project,
  category,
  index,
  total,
  onClose,
  onPrev,
  onNext,
  detailRef,
}) {
  const [reading, setReading] = useState(false);
  return (
    <article
      ref={detailRef}
      className={`atlas-detail ${reading ? "is-reading" : ""}`}
      aria-labelledby="project-detail-title"
    >
      <header className="atlas-detail-top">
        <span>
          <Icon name={category.icon} size={17} />
          {project.number} / {category.label}
        </span>
        <div>
          <button
            aria-label={reading ? "Свернуть карточку" : "Увеличить карточку"}
            aria-pressed={reading}
            onClick={() => setReading(!reading)}
          >
            <Icon
              name="expand"
              activeName="collapse"
              active={reading}
              size={18}
            />
          </button>
          <button aria-label="Закрыть карточку проекта" onClick={onClose}>
            <Icon name="close" size={22} />
          </button>
        </div>
      </header>
      <div className="project-detail-scroll">
        <figure className="project-cover">
          <img
            src={asset(project.image)}
            alt={project.title}
            decoding="async"
          />
        </figure>
        <div className="project-body">
          <div className="project-badges">
            <span className="project-tag">{category.label}</span>
            <span className="project-status">В мастер-плане</span>
          </div>
          <h3 id="project-detail-title">{project.title}</h3>
          <p className="project-description">{project.description}</p>
          <div className="project-programme">
            <h4>Что предусмотрено</h4>
            <ul>
              {project.features.map((f) => (
                <li key={f}>
                  <Icon name="check" size={18} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <dl className="project-passport">
            <div>
              <dt>
                <Icon name="pin" size={17} />
                Территория
              </dt>
              <dd>Улан-Удэ, Республика Бурятия</dd>
            </div>
            <div>
              <dt>
                <Icon name={category.icon} size={17} />
                Направление
              </dt>
              <dd>{category.label}</dd>
            </div>
          </dl>
        </div>
      </div>
      <footer className="atlas-detail-nav">
        <button onClick={onPrev} aria-label="Предыдущий проект">
          <Icon name="left" size={21} />
        </button>
        <span>
          <strong>{String(index + 1).padStart(2, "0")}</strong> /{" "}
          {String(total).padStart(2, "0")}
        </span>
        <button onClick={onNext} aria-label="Следующий проект">
          <Icon name="right" size={21} />
        </button>
      </footer>
    </article>
  );
}
