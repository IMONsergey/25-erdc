import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { asset } from "../data.js";
import {
  ulanProjectGroups as projectCategories,
  ulanProjects as selectedProjects,
} from "../regionData.jsx";
import Icon from "./Icon.jsx";
import ProjectDetail from "./BuryatiaProjectDetail.jsx";
import { getAtlasCamera } from "../atlasCamera.js";
const padded = (n) => String(n).padStart(2, "0");
export default function BuryatiaProjects() {
  const [categoryId, setCategoryId] = useState("renewal");
  const [projectId, setProjectId] = useState(null);
  const [focused, setFocused] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const panel = useRef(null);
  const section = useRef(null);
  const expandButton = useRef(null);
  const detail = useRef(null);
  const viewportRef = useRef(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const category = projectCategories.find((c) => c.id === categoryId);
  const projects = selectedProjects.filter((p) => p.category === categoryId);
  const project = projects.find((p) => p.id === projectId);
  const target = project?.anchor ?? [60, 48];
  const camera = getAtlasCamera(
    viewport.width,
    viewport.height,
    target,
    focused,
  );
  useLayoutEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const measure = () =>
      setViewport({ width: element.clientWidth, height: element.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [expanded]);
  const chooseCategory = (id) => {
    setCategoryId(id);
    setProjectId(null);
    setFocused(false);
  };
  const chooseProject = (id) => {
    const chosen = selectedProjects.find((item) => item.id === id);
    if (!chosen) return;
    setCategoryId(chosen.category);
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
          ...section.current.querySelectorAll("button,a[href],summary"),
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
      <div className="projects-overture">
        <div className="projects-intro shell reveal">
          <div>
            <span className="section-kicker">04 / Масштаб преобразований</span>
            <h2 className="section-title" id="projects-title">
              Город меняется.
              <br />
              <span>Здесь и сейчас.</span>
            </h2>
          </div>
          <div className="projects-total">
            <strong>{selectedProjects.length}</strong>
            <span>
              проектов
              <br />
              в {projectCategories.length} направлениях
            </span>
          </div>
        </div>
      </div>
      <div
        ref={section}
        className={`atlas ${expanded ? "is-expanded" : ""}`}
        role={expanded ? "dialog" : undefined}
        aria-modal={expanded ? true : undefined}
        aria-label="Атлас проектов Улан-Удэ"
        style={{ "--accent": category.color }}
      >
        <div className="atlas-viewport" ref={viewportRef}>
          <div
            className="atlas-camera"
            style={{
              "--target-x": `${target[0]}%`,
              "--target-y": `${target[1]}%`,
              width: viewport.width ? `${camera.width}px` : undefined,
              height: viewport.height ? `${camera.height}px` : undefined,
              "--zoom": camera.zoom,
              "--camera-x": `${camera.x}px`,
              "--camera-y": `${camera.y}px`,
            }}
          >
            <img
              className="atlas-terrain"
              src={asset("atlas-ulan-ude.webp")}
              alt="Художественная панорама Улан-Удэ и долины двух рек"
              loading="lazy"
            />
            <span className="atlas-place atlas-place-city">Улан-Удэ</span>

            <span className="atlas-sea">Селенга</span>
            <div
              className="atlas-markers"
              aria-label="Проекты Улан-Удэ на художественной схеме"
            >
              {selectedProjects.map((p) => (
                <button
                  key={p.id}
                  style={{
                    left: `${p.anchor[0]}%`,
                    top: `${p.anchor[1]}%`,
                    "--marker-color": projectCategories.find(
                      (c) => c.id === p.category,
                    ).color,
                  }}
                  className={`atlas-marker ${p.category === categoryId ? "is-in-category" : "is-context"} ${projectId === p.id ? "is-active" : ""} ${p.scope === "program" ? "is-programme" : ""}`}
                  aria-label={p.title}
                  aria-pressed={projectId === p.id}
                  onClick={() => chooseProject(p.id)}
                >
                  <span>{padded(p.number)}</span>
                  <span className="marker-tooltip">{p.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="atlas-vignette" />
        <aside className="atlas-sidebar">
          <div className="atlas-sidebar-head">
            <span className="section-kicker">Атлас развития</span>
            <h3>
              Улан-Удэ
              <br />
              Город двух рек
            </h3>
            <span className="atlas-project-count">
              {selectedProjects.length} проектов / {projectCategories.length} направления
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
                <Icon name={c.icon} size={21} />
                <span>{c.label}</span>
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
                  {p.title}
                  <small>Улан-Удэ</small>
                </span>
                <Icon name="arrow" hoverName="right" size={17} />
              </button>
            ))}
          </div>
        </aside>
        <div className="atlas-toolbar">
          <span className="atlas-mode">{selectedProjects.length} проектов на карте</span>
          <button
            type="button"
            aria-label="Общий вид карты"
            onClick={() => {
              setFocused(false);
              setProjectId(null);
            }}
          >
            <Icon name="reset" size={22} />
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
            <Icon
              name="expand"
              active={expanded}
              activeName="close"
              size={23}
            />
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
                Исследовать <Icon name="arrow" hoverName="right" size={22} />
              </button>
            </div>
          </div>
        )}
        {project && (
          <ProjectDetail
            key={project.id}
            project={project}
            category={category}
            index={index}
            total={projects.length}
            onPrev={prev}
            onNext={next}
            detailRef={detail}
            onClose={() => {
              setProjectId(null);
              setFocused(false);
            }}
          />
        )}
        <div className="atlas-bottom">
          <span>Художественная схема · расположение ориентировочное</span>
          <span>
            С<Icon name="up" size={18} />
          </span>
          <span>Улан-Удэ / Бурятия</span>
        </div>
      </div>
    </section>
  );
}
