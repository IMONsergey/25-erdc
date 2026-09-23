import { useState } from "react";
import { asset } from "../data.js";
import { projectDetails } from "../projectDetails.js";
import Icon from "./Icon.jsx";
import { siteHref } from "../site.js";
const padded = (n) => String(n).padStart(2, "0");
export default function ProjectDetail({
  project,
  category,
  index,
  total,
  onClose,
  onPrev,
  onNext,
  detailRef,
}) {
  const data = projectDetails[project.id];
  const [sourceOpen, setSourceOpen] = useState(false);
  const [reading, setReading] = useState(false);
  const scope =
    project.scope === "program"
      ? "Городская программа"
      : project.scope === "area"
        ? "Развитие территории"
        : "Объект мастер-плана";
  return (
    <article
      ref={detailRef}
      className={`atlas-detail ${reading ? "is-reading" : ""}`}
      aria-labelledby="project-detail-title"
    >
      <header className="atlas-detail-top">
        <span>
          <Icon name={category.id} size={17} />
          {padded(project.number)} / {category.shortLabel}
        </span>
        <div>
          <button
            className="detail-expand"
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
            src={asset(data.image)}
            alt={`${data.imageKind}: ${project.shortTitle}`}
            decoding="async"
          />
          <figcaption>
            <Icon
              name={data.image.startsWith("concept-") ? "spark" : "camera"}
              size={13}
            />
            {data.imageKind}
          </figcaption>
        </figure>
        <div className="project-body">
          <div className="project-badges">
            <span className="project-tag">{data.tag}</span>
            <span className="project-status">
              <i />
              {data.status}
            </span>
          </div>
          <h3 id="project-detail-title">{project.title}</h3>
          <p className="project-description">{data.description}</p>
          {data.facts.length > 0 && (
            <div className="project-facts-wrap">
              {data.factsNote && (
                <span className="project-facts-label">{data.factsNote}</span>
              )}
              <dl className={`project-facts count-${data.facts.length}`}>
                {data.facts.map(([value, unit, label]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>
                      {value}
                      <small>{unit}</small>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <div className="project-programme">
            <h4>{data.featuresTitle}</h4>
            <ul>
              {data.features.map((feature) => (
                <li key={feature}>
                  <Icon name="check" size={18} />
                  <span>{feature}</span>
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
              <dd>{project.area}</dd>
            </div>
            <div>
              <dt>
                <Icon name={category.id} size={17} />
                Направление
              </dt>
              <dd>{project.group}</dd>
            </div>
            <div>
              <dt>
                <Icon name="route" size={17} />
                Масштаб
              </dt>
              <dd>{scope}</dd>
            </div>
          </dl>
          <p className="project-location-note">
            <Icon name="info" size={16} />
            <span>
              {project.scope === "program"
                ? "Условная точка городской программы. Она объединяет несколько объектов на территории города."
                : "Расположение на художественной схеме ориентировочное."}
            </span>
          </p>
          <details
            className="project-source"
            onToggle={(event) => setSourceOpen(event.currentTarget.open)}
          >
            <summary>
              О данных проекта
              <Icon
                name="plus"
                active={sourceOpen}
                activeName="minus"
                size={17}
              />
            </summary>
            <p>
              {data.source ||
                `Перечень проектов от 19.08.2026, лист «ВЫБРАНО», строка ${project.sourceRow}. Описание раскрывает объём работ, указанный в перечне. Бюджет, сроки и текущая стадия реализации в таблице не приведены.`}
            </p>
            {data.image.startsWith("concept-") && (
              <p>
                Изображение создано для визуального раскрытия темы. Оно не
                является утверждённым архитектурным решением проекта.
              </p>
            )}
          </details>
        </div>
      </div>
      <a
        className="atlas-full-page-link"
        href={siteHref(`vladivostok/projects/${project.id}`)}
      >
        Страница проекта <Icon name="arrow" size={18} />
      </a>
      <footer className="atlas-detail-nav">
        <button onClick={onPrev} aria-label="Предыдущий проект">
          <Icon name="left" size={20} />
        </button>
        <span>
          <strong>{padded(index + 1)}</strong>
          <small> / {padded(total)}</small>
          <span className="detail-nav-label">Проекты направления</span>
        </span>
        <button onClick={onNext} aria-label="Следующий проект">
          <Icon name="right" size={20} />
        </button>
      </footer>
    </article>
  );
}
