import { useRef, useState } from "react";
import { asset, categories, projects } from "../data.js";

function CategoryIcon({ name }) {
  return <span className="category-icon" style={{ "--category-icon": `url(${asset(name)})` }} aria-hidden="true" />;
}

function ProjectList({ category, activeProjectId, onSelect }) {
  const housing = category.id === "housing";

  return (
    <aside className="project-list" aria-label="Список проектов">
      <div className="project-list-head">
        <h3>{category.label}</h3>
        <div><span>{housing ? "Реновация и КРТ" : "Проекты"}</span><b>{housing ? "10" : "—"}</b></div>
      </div>
      {housing ? (
        <div className="project-items">
          {projects.map((project) => (
            <button
              className={`project-item${activeProjectId === project.id ? " is-active" : ""}`}
              type="button"
              key={project.id}
              aria-pressed={activeProjectId === project.id}
              onClick={() => onSelect(project.id)}
            >
              <img src={asset(project.image)} alt="" />
              <span><strong>{project.title}</strong><small>{project.short}</small></span>
            </button>
          ))}
        </div>
      ) : (
        <div className="project-list-progress">
          <span aria-hidden="true">•••</span>
          <p>Контент в работе</p>
        </div>
      )}
    </aside>
  );
}

function ProjectDetail({ project, onClose }) {
  return (
    <article className="project-detail-card" aria-live="polite">
      <div className="project-detail-title">
        <h3>{project.title}</h3>
        <button className="project-close" type="button" onClick={onClose} aria-label="Закрыть карточку проекта">
          <img src={asset("icon-plus.svg")} alt="" />
        </button>
      </div>
      <img className="project-detail-photo" src={asset(project.image)} alt={`Визуализация проекта «${project.title}»`} />
      {project.complete ? (
        <>
          <div className="project-status-row">
            <span className="project-type">Реновация</span>
            <div className="stage-progress" role="progressbar" aria-label="Стадия строительства" aria-valuemin="0" aria-valuemax="100" aria-valuenow="73">
              <span className="stage-progress-fill" />
              <span className="stage-progress-label">Стадия строительства</span>
            </div>
          </div>
          <p className="project-description">Комфортная жилая застройка по стандарту ДОМ.РФ, парк, пешеходный мост, культурный и спортивный центр, социальная инфраструктура.</p>
          <div className="project-metrics">
            <div><strong>94.22 га</strong><span>площадь участка проектирования</span></div>
            <div><strong>130.5 млрд ₽</strong><span>инвестиций</span></div>
            <div><strong>924,4 тыс. м²</strong><span>общая площадь застройки</span></div>
          </div>
          <h4>Что появится</h4>
          <ul className="project-results">
            <li>Строительство 4 ЖК, гостиничного комплекса и 2 общественно-деловых объектов (2,9 га)</li>
            <li>Пешеходный мост через реку Улу</li>
            <li>Культурный и спортивный центр</li>
            <li>Жильё по стандарту ДОМ.РФ</li>
          </ul>
        </>
      ) : (
        <div className="detail-progress-copy">
          <p>{project.short}</p>
          <strong>Подробный контент в работе</strong>
        </div>
      )}
    </article>
  );
}

function ProjectMap({ activeProject, canSelectProject, onSelectProject, onClose }) {
  const canvasRef = useRef(null);
  const panRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef(null);

  const applyPan = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.setProperty("--pan-x", `${panRef.current.x}px`);
    canvas.style.setProperty("--pan-y", `${panRef.current.y}px`);
  };

  const onPointerDown = (event) => {
    if (event.target.closest("button")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, startX: panRef.current.x, startY: panRef.current.y };
    event.currentTarget.classList.add("is-dragging");
  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    panRef.current = {
      x: Math.max(-90, Math.min(90, drag.startX + event.clientX - drag.x)),
      y: Math.max(-70, Math.min(70, drag.startY + event.clientY - drag.y)),
    };
    applyPan();
  };

  const finishDrag = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    event.currentTarget.classList.remove("is-dragging");
  };

  return (
    <div
      className="project-map"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
    >
      <div className="project-map-canvas" ref={canvasRef}>
        <img className="project-map-image" src={asset("projects-map.webp")} alt="Карта проектов Владивостока" draggable="false" />
        {canSelectProject ? (
          <button className="map-marker" type="button" onClick={() => onSelectProject("kungasny")} aria-label="Открыть проект на мысе Кунгасного">
            <img src={asset("project-marker.webp")} alt="" draggable="false" />
          </button>
        ) : null}
      </div>
      <div className="map-hint" aria-hidden="true">
        <img src={asset("icon-close.svg")} alt="" />
        <span>{canSelectProject ? "Двигайте карту и нажмите на проект, чтобы увидеть подробности" : "Карту можно перемещать"}</span>
      </div>
      {activeProject ? <ProjectDetail project={activeProject} onClose={onClose} /> : null}
    </div>
  );
}

export default function Projects() {
  const [categoryId, setCategoryId] = useState("housing");
  const [activeProjectId, setActiveProjectId] = useState(null);
  const category = categories.find((item) => item.id === categoryId) ?? categories[0];
  const activeProject = projects.find((item) => item.id === activeProjectId) ?? null;

  const selectCategory = (id) => {
    setCategoryId(id);
    setActiveProjectId(null);
  };

  return (
    <section className="shell projects-section" id="projects" aria-labelledby="projects-title">
      <div className="section-intro">
        <p className="section-label">Масштаб преобразований</p>
        <h2 id="projects-title">Ключевые проекты развития Владивостока</h2>
      </div>
      <div className="project-categories" aria-label="Категории проектов">
        {categories.map((item) => (
          <button
            className={`category${item.id === categoryId ? " is-active" : ""}`}
            type="button"
            key={item.id}
            aria-pressed={item.id === categoryId}
            onClick={() => selectCategory(item.id)}
          >
            <CategoryIcon name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <div className="projects-workspace">
        <ProjectList category={category} activeProjectId={activeProjectId} onSelect={setActiveProjectId} />
        <ProjectMap
          activeProject={activeProject}
          canSelectProject={category.id === "housing"}
          onSelectProject={setActiveProjectId}
          onClose={() => setActiveProjectId(null)}
        />
      </div>
    </section>
  );
}
