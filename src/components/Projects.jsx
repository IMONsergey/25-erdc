import { useEffect, useRef, useState } from "react";
import { asset } from "../data.js";
import { projectCategories, selectedProjects } from "../selectedProjects.js";
const padded = (n) => String(n).padStart(2, "0");
export default function Projects() {
  const [categoryId, setCategoryId] = useState("housing");
  const [projectId, setProjectId] = useState(null);
  const [focused, setFocused] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const panel = useRef(null);
  const section = useRef(null);
  const expandButton = useRef(null);
  const detail = useRef(null);
  const category = projectCategories.find((c) => c.id === categoryId);
  const projects = selectedProjects.filter((p) => p.category === categoryId);
  const project = projects.find((p) => p.id === projectId);
  const target =
    project?.anchor ??
    (project?.area === "Остров Русский" ? [59, 67] : [63, 34]);
  const chooseCategory = (id) => {
    setCategoryId(id);
    setProjectId(null);
    setFocused(false);
  };
  const chooseProject = (id) => {
    setProjectId(id);
    setFocused(true);
  };
  useEffect(() => {
    if (panel.current) panel.current.scrollTop = 0;
  }, [categoryId]);
  useEffect(() => {
    if (projectId && matchMedia("(max-width: 700px)").matches) {
      detail.current?.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "nearest",
      });
    }
  }, [projectId]);
  useEffect(() => {
    if (!expanded) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e) => {
      if (e.key === "Escape") {
        setExpanded(false);
        expandButton.current?.focus();
      }
      if (e.key === "Tab") {
        const nodes = [
          ...section.current.querySelectorAll("button,a[href]"),
        ].filter((el) => el.getClientRects().length);
        const first = nodes[0],
          last = nodes.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    expandButton.current?.focus();
    return () => {
      document.body.style.overflow = before;
      window.removeEventListener("keydown", key);
    };
  }, [expanded]);
  const index = project ? projects.indexOf(project) : -1;
  const next = () => chooseProject(projects[(index + 1) % projects.length].id);
  const prev = () =>
    chooseProject(projects[(index - 1 + projects.length) % projects.length].id);
  return (
    <section
      id="projects"
      className="projects-section"
      aria-labelledby="projects-title"
    >
      <div className="projects-intro shell reveal">
        <div>
          <span className="section-kicker">03 / Масштаб преобразований</span>
          <h2 className="section-title" id="projects-title">
            Город меняется.
            <br />
            <span>Здесь и сейчас.</span>
          </h2>
        </div>
        <div className="projects-total">
          <strong>27</strong>
          <span>
            проектов
            <br />в 7 направлениях
          </span>
        </div>
      </div>
      <div
        ref={section}
        className={`atlas ${expanded ? "is-expanded" : ""}`}
        role={expanded ? "dialog" : undefined}
        aria-modal={expanded ? true : undefined}
        aria-label="Атлас проектов Владивостока"
        style={{ "--accent": category.color }}
      >
        <div className="atlas-viewport">
          <div
            className="atlas-camera"
            style={{
              "--target-x": `${target[0]}%`,
              "--target-y": `${target[1]}%`,
              "--zoom": focused ? 1.17 : 1,
              "--camera-x": focused ? `${(63 - target[0]) * 0.32}%` : "0%",
              "--camera-y": focused ? `${(42 - target[1]) * 0.3}%` : "0%",
            }}
          >
            <img
              className="atlas-terrain"
              src={asset("atlas-vladivostok.webp")}
              alt="Художественная панорама побережья Владивостока и острова Русский"
              loading="lazy"
            />
            <span className="atlas-place atlas-place-city">Владивосток</span>
            <span className="atlas-place atlas-place-island">
              Остров Русский
            </span>
            <span className="atlas-sea">Амурский залив</span>
            <div className="atlas-markers" key={categoryId}>
              {projects
                .filter((p) => p.anchor)
                .map((p) => (
                  <button
                    key={p.id}
                    style={{ left: `${p.anchor[0]}%`, top: `${p.anchor[1]}%` }}
                    className={`atlas-marker ${projectId === p.id ? "is-active" : ""}`}
                    aria-label={p.title}
                    aria-pressed={projectId === p.id}
                    onClick={() => chooseProject(p.id)}
                  >
                    <span>{padded(p.number)}</span>
                    <span className="marker-tooltip">{p.shortTitle}</span>
                  </button>
                ))}
            </div>
            {project &&
              !project.anchor &&
              (project.scope === "program" ||
                project.area === "Остров Русский") && (
                <div
                  key={project.id}
                  className={`atlas-area ${project.area === "Остров Русский" ? "is-island" : ""}`}
                  aria-hidden="true"
                >
                  <i />
                  <i />
                  <i />
                </div>
              )}
          </div>
        </div>
        <div className="atlas-vignette" />
        <aside className="atlas-sidebar">
          <div className="atlas-sidebar-head">
            <span className="section-kicker">Атлас развития</span>
            <h3>
              Владивосток
              <br />и остров Русский
            </h3>
            <span className="atlas-project-count">
              27 проектов / 7 направлений
            </span>
          </div>
          <div className="atlas-categories" aria-label="Направления развития">
            {projectCategories.map((c, i) => (
              <button
                key={c.id}
                className={categoryId === c.id ? "is-active" : ""}
                aria-pressed={categoryId === c.id}
                onClick={() => chooseCategory(c.id)}
              >
                <img src={asset(c.icon)} alt="" />
                <span>{c.shortLabel}</span>
                <small>
                  {padded(
                    selectedProjects.filter((p) => p.category === c.id).length,
                  )}
                </small>
              </button>
            ))}
          </div>
          <div className="atlas-list-head">
            <span>{category.label}</span>
            <span>{padded(projects.length)}</span>
          </div>
          <div
            className="atlas-project-list"
            ref={panel}
            aria-label="Проекты выбранного направления"
          >
            {projects.map((p) => (
              <button
                className={`atlas-project ${projectId === p.id ? "is-active" : ""}`}
                key={p.id}
                aria-pressed={projectId === p.id}
                onClick={() => chooseProject(p.id)}
              >
                <span className="atlas-project-number">{padded(p.number)}</span>
                <span>
                  {p.shortTitle}
                  <small>
                    {p.scope === "program" ? "Городская программа" : p.area}
                  </small>
                </span>
                <b>↗</b>
              </button>
            ))}
          </div>
        </aside>
        <div className="atlas-toolbar">
          <span className="atlas-mode">Владивосток · 2050</span>
          <button
            type="button"
            aria-label="Общий вид карты"
            onClick={() => {
              setFocused(false);
              setProjectId(null);
            }}
          >
            ↺
          </button>
          <button
            ref={expandButton}
            type="button"
            aria-label={
              expanded ? "Закрыть полный экран" : "Открыть карту на весь экран"
            }
            aria-expanded={expanded}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "×" : "⤢"}
          </button>
        </div>
        {!project && (
          <div className="atlas-invitation" key={categoryId}>
            <span className="atlas-invitation-count">
              {padded(projects.length)}
            </span>
            <div>
              <span>проектов направления</span>
              <h3>{category.label}</h3>
              <button onClick={() => chooseProject(projects[0].id)}>
                Исследовать <span>↗</span>
              </button>
            </div>
          </div>
        )}
        {project && (
          <article
            ref={detail}
            className="atlas-detail"
            key={project.id}
            aria-live="polite"
          >
            <div className="atlas-detail-top">
              <span>
                {padded(project.number)} / {category.shortLabel}
              </span>
              <button
                aria-label="Закрыть карточку проекта"
                onClick={() => {
                  setProjectId(null);
                  setFocused(false);
                }}
              >
                ×
              </button>
            </div>
            {project.image && (
              <img
                src={asset(project.image)}
                className="atlas-detail-image"
                alt={`Визуализация проекта: ${project.shortTitle}`}
              />
            )}
            <div className="atlas-detail-body">
              <span className="atlas-detail-location">{project.area}</span>
              <h3>{project.title}</h3>
              <p>{project.group}</p>
              <div className="atlas-detail-scope">
                {project.scope === "program"
                  ? "Городская программа"
                  : project.scope === "area"
                    ? "Развитие территории"
                    : "Проект мастер-плана"}
              </div>
              {!project.anchor && (
                <small className="atlas-location-note">
                  {project.scope === "program"
                    ? "Программа охватывает несколько объектов."
                    : project.area === "Остров Русский"
                      ? "На карте выделен остров Русский."
                      : "Расположение проекта уточняется."}
                </small>
              )}
            </div>
            <div className="atlas-detail-nav">
              <button onClick={prev} aria-label="Предыдущий проект">
                ←
              </button>
              <span>
                {padded(index + 1)} <small>/ {padded(projects.length)}</small>
              </span>
              <button onClick={next} aria-label="Следующий проект">
                →
              </button>
            </div>
          </article>
        )}
        <div className="atlas-bottom">
          <span>Художественная схема · расположение условное</span>
          <span>
            С<span className="north-arrow">↑</span>
          </span>
          <span>Владивосток / остров Русский</span>
        </div>
      </div>
    </section>
  );
}
