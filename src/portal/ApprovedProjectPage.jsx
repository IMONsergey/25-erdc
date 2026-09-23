import { ArrowLeft, ArrowUpRight } from "./icons.jsx";
import { selectedProjects, projectCategories } from "../selectedProjects.js";
import { projectDetails } from "../projectDetails.js";
import { siteHref } from "../site.js";
import { asset } from "../data.js";
export default function ApprovedProjectPage({ id }) {
  const p = selectedProjects.find((p) => p.id === id);
  if (!p)
    return (
      <section className="p-shell p-section">
        <h1>Проект не найден</h1>
      </section>
    );
  const d = projectDetails[id],
    category = projectCategories.find((c) => c.id === p.category);
  return (
    <>
      <section className="p-page-hero p-page-hero-solid p-page-hero-compact">
        <div className="p-shell">
          <nav className="p-breadcrumbs" aria-label="Хлебные крошки">
            <a href={siteHref()}>Главная</a>
            <span>/</span>
            <a href={siteHref("vladivostok")}>Владивосток</a>
            <span>/</span>
            <span>Проект {String(p.number).padStart(2, "0")}</span>
          </nav>
          <div className="p-page-hero-copy">
            <div className="p-eyebrow">{category.label}</div>
            <h1>{p.title}</h1>
          </div>
        </div>
      </section>
      <section className="p-shell p-section">
        <figure className="p-approved-cover">
          <img src={asset(d.image)} alt={p.shortTitle} />
        </figure>
        <div className="p-project-detail-grid">
          <aside>
            <div className="p-eyebrow">Паспорт проекта</div>
            <dl className="p-detail-meta">
              <div>
                <dt>Город</dt>
                <dd>Владивосток</dd>
              </div>
              <div>
                <dt>Направление</dt>
                <dd>{category.label}</dd>
              </div>
              <div>
                <dt>Территория</dt>
                <dd>{p.area}</dd>
              </div>
              <div>
                <dt>Статус</dt>
                <dd>{d.status}</dd>
              </div>
            </dl>
            <a
              className="p-text-link"
              href={siteHref("vladivostok", `?project=${p.id}#projects`)}
            >
              Открыть в атласе
              <ArrowUpRight size={19} />
            </a>
          </aside>
          <div className="p-project-description">
            {d.facts.length > 0 && (
              <dl className="p-stats">
                {d.facts.map(([v, u, l]) => (
                  <div key={l}>
                    <dd>
                      {v} {u}
                    </dd>
                    <dt>{l}</dt>
                  </div>
                ))}
              </dl>
            )}
            <h2>О проекте</h2>
            <p>{d.description}</p>
            {d.features.length > 0 && (
              <>
                <h2>{d.featuresTitle || "Что предусмотрено"}</h2>
                <ul className="p-approved-features">
                  {d.features.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
        <a className="p-back-link" href={siteHref("vladivostok", "#projects")}>
          <ArrowLeft size={20} />
          Атлас Владивостока
        </a>
      </section>
    </>
  );
}
