import { useEffect, useMemo, useRef, useState } from "react";
import "ol/ol.css";
import { asset, categories } from "../../data.js";
import { createMapDataProvider } from "../mapData.js";
import { isupSnapshot } from "../isupSnapshot.js";

const vladivostokPlan = isupSnapshot.plans.find((item) => /Владивосток/i.test(item.label));

const categoryIndustryRules = {
  housing: [/жилье/i],
  social: [/социаль/i, /здрав/i, /образ/i, /культур/i, /спорт/i],
  transport: [/транспорт/i],
  engineering: [/инфраструктур/i, /связь/i, /экономика/i, /производ/i, /безопас/i],
  ecology: [/эколог/i],
  tourism: [/туризм/i],
};

const categoryCopy = {
  housing: "Жильё, КРТ, городская среда и общественные пространства.",
  social: "Образование, здоровье, культура, спорт и социальные объекты.",
  transport: "Уличная сеть, общественный транспорт, портовая и логистическая инфраструктура.",
  engineering: "Инженерные сети, связь, безопасность и производственная инфраструктура.",
  ecology: "Экология, рекреационные территории и зелёные связи.",
  tourism: "Туристические точки, маршруты и сервисная инфраструктура.",
};

const categoryStageName = {
  housing: "Городская среда",
  social: "Социальные объекты",
  transport: "Транспортные объекты",
  engineering: "Инфраструктурные объекты",
  ecology: "Рекреация и экология",
  tourism: "Туризм",
};

function categoryForObject(object) {
  const industry = object.industryName ?? "";
  if (/транспорт/i.test(industry)) return "transport";
  if (/эколог/i.test(industry)) return "ecology";
  if (/туризм/i.test(industry)) return "tourism";
  return categories.find((category) => categoryIndustryRules[category.id]?.some((rule) => rule.test(industry)))?.id ?? "engineering";
}

function normalizeTitle(title) {
  return title.replace(/\s+/g, " ").trim();
}

function prepareObject(object) {
  const categoryId = categoryForObject(object);
  return {
    ...object,
    categoryId,
    title: normalizeTitle(object.title),
    short: object.description || object.address || categoryCopy[categoryId],
  };
}

const preparedObjects = isupSnapshot.objects
  .filter((item) => item.planId === vladivostokPlan?.id)
  .map(prepareObject);

const categoryMeta = categories.map((category) => ({
  ...category,
  count: preparedObjects.filter((item) => item.categoryId === category.id).length,
}));

const defaultCategoryId = categoryMeta.find((item) => item.id === "housing" && item.count > 0)?.id ?? categoryMeta.find((item) => item.count > 0)?.id ?? "housing";

function CategoryIcon({ name }) {
  return <span className="category-icon" style={{ "--category-icon": `url(${asset(name)})` }} aria-hidden="true" />;
}

async function loadOpenLayers() {
  const [MapModule, ViewModule, TileLayerModule, OSMModule, VectorLayerModule, VectorSourceModule, ClusterModule, FeatureModule, GeomModule, StyleModule, ProjectionModule] = await Promise.all([
    import("ol/Map.js"),
    import("ol/View.js"),
    import("ol/layer/Tile.js"),
    import("ol/source/OSM.js"),
    import("ol/layer/Vector.js"),
    import("ol/source/Vector.js"),
    import("ol/source/Cluster.js"),
    import("ol/Feature.js"),
    import("ol/geom.js"),
    import("ol/style.js"),
    import("ol/proj.js"),
  ]);
  return {
    Map: MapModule.default,
    View: ViewModule.default,
    TileLayer: TileLayerModule.default,
    OSM: OSMModule.default,
    VectorLayer: VectorLayerModule.default,
    VectorSource: VectorSourceModule.default,
    Cluster: ClusterModule.default,
    Feature: FeatureModule.default,
    Point: GeomModule.Point,
    CircleStyle: StyleModule.Circle,
    Fill: StyleModule.Fill,
    Stroke: StyleModule.Stroke,
    Style: StyleModule.Style,
    Text: StyleModule.Text,
    fromLonLat: ProjectionModule.fromLonLat,
  };
}

function markerStyle(ol, object, selected) {
  const color = selected ? "#031c39" : colorForCategory(object.categoryId);
  return new ol.Style({
    image: new ol.CircleStyle({
      radius: selected ? 20 : 14,
      fill: new ol.Fill({ color }),
      stroke: new ol.Stroke({ color: "#fff", width: selected ? 6 : 4 }),
    }),
    text: new ol.Text({
      text: selected ? "•" : "",
      fill: new ol.Fill({ color: "#fff" }),
      font: "800 18px Arial",
    }),
  });
}

function clusterStyle(ol, feature) {
  const features = feature.get("features") ?? [];
  if (features.length <= 1) return markerStyle(ol, features[0]?.get("object"), false);
  return new ol.Style({
    image: new ol.CircleStyle({
      radius: Math.min(25, 14 + features.length * 0.35),
      fill: new ol.Fill({ color: "rgba(255,255,255,.94)" }),
      stroke: new ol.Stroke({ color: "#1c97d9", width: 5 }),
    }),
    text: new ol.Text({
      text: String(features.length),
      fill: new ol.Fill({ color: "#1e2431" }),
      font: "800 14px Arial",
    }),
  });
}

function colorForCategory(categoryId) {
  if (categoryId === "housing") return "#1c97d9";
  if (categoryId === "social") return "#38b88a";
  if (categoryId === "transport") return "#e68a3e";
  if (categoryId === "engineering") return "#349ca4";
  if (categoryId === "ecology") return "#17a179";
  return "#4c83ea";
}

function IntegratedMap({ objects, selectedId, onSelect }) {
  const elementRef = useRef(null);
  const mapRef = useRef(null);
  const olRef = useRef(null);
  const sourceRef = useRef(null);

  useEffect(() => {
    let disposed = false;
    loadOpenLayers().then((ol) => {
      if (disposed || !elementRef.current) return;
      olRef.current = ol;
      const source = new ol.VectorSource();
      const clusterSource = new ol.Cluster({ distance: 44, source });
      const objectLayer = new ol.VectorLayer({ source: clusterSource, style: (feature) => clusterStyle(ol, feature) });
      const selectedLayer = new ol.VectorLayer({ source, style: (feature) => (feature.get("selected") ? markerStyle(ol, feature.get("object"), true) : null) });
      const map = new ol.Map({
        target: elementRef.current,
        layers: [
          new ol.TileLayer({ source: new ol.OSM({ crossOrigin: "anonymous" }) }),
          objectLayer,
          selectedLayer,
        ],
        view: new ol.View({
          center: ol.fromLonLat(vladivostokPlan?.center ?? [131.998421, 43.192243]),
          zoom: 10.7,
          minZoom: 9,
          maxZoom: 17,
        }),
      });
      map.on("click", (event) => {
        const hit = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
        const features = hit?.get("features");
        const target = features?.[0] ?? hit;
        const objectId = target?.get("objectId");
        if (objectId) onSelect(objectId);
      });
      mapRef.current = map;
      sourceRef.current = source;
      window.setTimeout(() => map.updateSize(), 80);
    });

    return () => {
      disposed = true;
      mapRef.current?.setTarget(undefined);
      mapRef.current = null;
    };
  }, [onSelect]);

  useEffect(() => {
    const ol = olRef.current;
    const source = sourceRef.current;
    const map = mapRef.current;
    if (!ol || !source || !map) return;
    source.clear();
    objects.forEach((object) => {
      const feature = new ol.Feature({
        geometry: new ol.Point(ol.fromLonLat(object.coordinates)),
        objectId: object.id,
        object,
        selected: object.id === selectedId,
      });
      source.addFeature(feature);
    });
    if (objects.length) {
      map.getView().fit(source.getExtent(), {
        padding: window.innerWidth <= 720 ? [46, 34, 220, 34] : [70, 80, 70, 70],
        maxZoom: 12,
        duration: 260,
      });
    }
  }, [objects, selectedId]);

  useEffect(() => {
    const ol = olRef.current;
    const map = mapRef.current;
    const object = objects.find((item) => item.id === selectedId);
    if (!ol || !map || !object) return;
    map.getView().animate({ center: ol.fromLonLat(object.coordinates), zoom: Math.max(map.getView().getZoom(), 13.4), duration: 320 });
  }, [selectedId]);

  return <div className="integrated-map-canvas" ref={elementRef} aria-label="Интерактивная карта объектов Владивостока" />;
}

function ProjectCard({ object, selected, onSelect }) {
  return (
    <button className={`integrated-object${selected ? " is-active" : ""}`} type="button" aria-pressed={selected} onClick={onSelect}>
      <img src={object.image} alt="" />
      <span>
        <strong>{object.title}</strong>
        <small>{object.short}</small>
      </span>
    </button>
  );
}

function DetailOverlay({ object, stage, onClose }) {
  if (!object) return null;
  return (
    <article className="integrated-detail-card" aria-live="polite">
      <div className="project-detail-title">
        <h3>{object.title}</h3>
        <button className="project-close" type="button" onClick={onClose} aria-label="Закрыть карточку объекта">
          <img src={asset("icon-plus.svg")} alt="" />
        </button>
      </div>
      <img className="project-detail-photo" src={object.image} alt="" />
      <div className="project-status-row">
        <span className="project-type">{object.industryName}</span>
        <div className="stage-progress" role="progressbar" aria-label={`Стадия: ${stage?.label ?? "не указана"}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={stageProgress(object.stageId)}>
          <span className="stage-progress-fill" style={{ width: `${stageProgress(object.stageId)}%` }} />
          <span className="stage-progress-label">{stage?.label ?? "Стадия уточняется"}</span>
        </div>
      </div>
      <p className="project-description">{object.description || object.address}</p>
      <div className="project-metrics">
        <div><strong>{object.budget}</strong><span>утверждённый бюджет</span></div>
        <div><strong>{object.deadline}</strong><span>плановый срок</span></div>
        <div><strong>{object.address || "Владивосток"}</strong><span>локация</span></div>
      </div>
    </article>
  );
}

function stageProgress(stageId) {
  if (stageId === "operation") return 100;
  if (stageId === "build") return 73;
  if (stageId === "design") return 45;
  if (stageId === "prep") return 22;
  return 8;
}

function formatObject(providerObject) {
  return {
    ...providerObject,
    image: providerObject.image,
    budget: providerObject.budget,
    deadline: providerObject.deadline,
  };
}

export default function IntegratedProjects() {
  const provider = useMemo(() => createMapDataProvider("mock"), []);
  const [allObjects, setAllObjects] = useState([]);
  const [stages, setStages] = useState(isupSnapshot.stages);
  const [categoryId, setCategoryId] = useState(defaultCategoryId);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    provider.getDictionaries({ signal: controller.signal }).then((dictionaries) => setStages(dictionaries.stages));
    provider
      .getObjects({
        signal: controller.signal,
        scenario: "data",
        filters: {
          query: "",
          planIds: new Set([vladivostokPlan?.id]),
          stageIds: new Set(isupSnapshot.stages.map((stage) => stage.id)),
          industryIds: new Set(isupSnapshot.industries.map((industry) => industry.id)),
          bbox: null,
        },
      })
      .then((items) => setAllObjects(items.map((item) => prepareObject(formatObject(item)))))
      .catch((reason) => {
        if (reason.name !== "AbortError") setError(reason);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [provider]);

  const activeCategory = categoryMeta.find((item) => item.id === categoryId) ?? categoryMeta[0];
  const filteredObjects = allObjects.filter((item) => item.categoryId === categoryId);
  const selectedObject = filteredObjects.find((item) => item.id === selectedId) ?? null;
  const selectedStage = stages.find((stage) => stage.id === selectedObject?.stageId);

  const selectCategory = (id) => {
    setCategoryId(id);
    setSelectedId(null);
  };

  return (
    <section className="shell projects-section integrated-projects-section" id="projects" aria-labelledby="projects-title">
      <div className="section-intro">
        <p className="section-label">Масштаб преобразований</p>
        <h2 id="projects-title">Ключевые проекты развития Владивостока</h2>
      </div>
      <div className="project-categories" aria-label="Фильтры объектов Владивостока">
        {categoryMeta.map((item) => (
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
      <div className="projects-workspace integrated-workspace">
        <aside className="project-list integrated-list" aria-label="Объекты выбранного направления">
          <div className="project-list-head">
            <h3>{activeCategory.label}</h3>
            <div><span>{categoryStageName[activeCategory.id] ?? "Объекты"}</span><b>{filteredObjects.length}</b></div>
          </div>
          {loading ? (
            <div className="project-list-progress"><span aria-hidden="true">•••</span><p>Загружаем объекты ИСУП</p></div>
          ) : error ? (
            <div className="project-list-progress"><span aria-hidden="true">!</span><p>Не удалось получить данные</p></div>
          ) : filteredObjects.length ? (
            <div className="project-items integrated-items">
              {filteredObjects.map((object) => (
                <ProjectCard key={object.id} object={object} selected={selectedId === object.id} onSelect={() => setSelectedId(object.id)} />
              ))}
            </div>
          ) : (
            <div className="project-list-progress"><span aria-hidden="true">0</span><p>В этом направлении нет объектов по Владивостоку</p></div>
          )}
        </aside>
        <div className="project-map integrated-map">
          <IntegratedMap objects={filteredObjects} selectedId={selectedId} onSelect={setSelectedId} />
          <div className="map-hint" aria-hidden="true">
            <img src={asset("icon-close.svg")} alt="" />
            <span>Двигайте карту и нажмите на объект, чтобы увидеть подробности</span>
          </div>
          {selectedObject ? <DetailOverlay object={selectedObject} stage={selectedStage} onClose={() => setSelectedId(null)} /> : null}
        </div>
      </div>
    </section>
  );
}
