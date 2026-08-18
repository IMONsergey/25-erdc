import { useEffect, useMemo, useRef, useState } from "react";
import "ol/ol.css";
import { asset } from "../../data.js";
import { createMapDataProvider } from "../mapData.js";
import { isupSnapshot } from "../isupSnapshot.js";

const vladivostokPlan = isupSnapshot.plans.find((item) => /Владивосток/i.test(item.label));

const industryIconRules = [
  [/жиль/i, "icon-category-housing.svg"],
  [/транспорт/i, "icon-category-transport.svg"],
  [/инфраструктур|связь|эконом|производ|безопас/i, "icon-category-engineering.svg"],
  [/туризм/i, "icon-category-tourism.svg"],
  [/эколог/i, "icon-category-ecology.svg"],
  [/здрав/i, "icon-category-health.svg"],
  [/образ|культур|спорт|социаль/i, "icon-category-social.svg"],
];

const industryCopyRules = [
  [/жиль/i, "Жилье, городская среда и общественные пространства."],
  [/образ/i, "Школы, детские сады, кампусы и объекты образования."],
  [/здрав/i, "Медицинские учреждения и инфраструктура здоровья."],
  [/культур|спорт/i, "Культурные, спортивные и общественные объекты."],
  [/транспорт/i, "Уличная сеть, общественный транспорт, портовая и логистическая инфраструктура."],
  [/инфраструктур|связь|эконом|производ|безопас/i, "Инженерные сети, связь, безопасность и производственная инфраструктура."],
  [/туризм/i, "Туристические точки, маршруты и сервисная инфраструктура."],
  [/эколог/i, "Экология, рекреационные территории и зеленые связи."],
];

const industryOrderRules = [
  [/жиль/i, 10],
  [/образ/i, 20],
  [/здрав/i, 30],
  [/культур|спорт/i, 40],
  [/транспорт/i, 50],
  [/инфраструктур/i, 60],
  [/туризм/i, 70],
];

function firstMatchingRule(rules, industryName, fallback) {
  return rules.find(([rule]) => rule.test(industryName))?.[1] ?? fallback;
}

function iconForIndustry(industryName) {
  return firstMatchingRule(industryIconRules, industryName, "icon-category-engineering.svg");
}

function labelForIndustry(industryName) {
  return /здрав/i.test(industryName) ? "Здоровье" : industryName;
}

function copyForIndustry(industryName) {
  return firstMatchingRule(industryCopyRules, industryName, "Объект стратегического развития Владивостока.");
}

function orderForIndustry(industryName) {
  return firstMatchingRule(industryOrderRules, industryName, 900);
}

function normalizeTitle(title) {
  return title.replace(/\s+/g, " ").trim();
}

function compactTitle(title, limit = 82) {
  const normalized = normalizeTitle(title)
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/строительство,\s*реконструкция\s*и\s*капитальный\s*ремонт/gi, "Строительство и ремонт")
    .replace(/реконструкция\s*и\s*капитальный\s*ремонт/gi, "Реконструкция и ремонт")
    .replace(/строительство,\s*реконструкция/gi, "Строительство и реконструкция")
    .replace(/муниципальное бюджетное общеобразовательное учреждение/gi, "Школа")
    .replace(/муниципальное бюджетное дошкольное образовательное учреждение/gi, "Детский сад")
    .replace(/государственное бюджетное учреждение здравоохранения/gi, "Медучреждение")
    .replace(/\s+/g, " ")
    .trim();
  return normalized.length > limit ? `${normalized.slice(0, limit - 3).trim()}...` : normalized;
}

function prepareObject(object) {
  const industryName = object.industryName ?? "Без отрасли";
  return {
    ...object,
    categoryId: object.industryId ?? industryName,
    categoryLabel: industryName,
    categoryDisplayLabel: labelForIndustry(industryName),
    title: normalizeTitle(object.title),
    displayTitle: compactTitle(object.title, 72),
    detailTitle: compactTitle(object.title, 94),
    short: object.description || object.address || copyForIndustry(industryName),
  };
}

const preparedObjects = isupSnapshot.objects
  .filter((item) => item.planId === vladivostokPlan?.id)
  .map(prepareObject);

const categoryMeta = isupSnapshot.industries
  .map((industry) => ({
    id: industry.id,
    label: labelForIndustry(industry.label),
    sourceLabel: industry.label,
    icon: iconForIndustry(industry.label),
    order: orderForIndustry(industry.label),
    count: preparedObjects.filter((item) => item.categoryId === industry.id).length,
  }))
  .filter((category) => category.count > 0)
  .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label, "ru"));

const defaultCategoryId = categoryMeta.find((item) => /жиль/i.test(item.label))?.id ?? categoryMeta[0]?.id;

function CategoryIcon({ name }) {
  return <span className="category-icon" style={{ "--category-icon": `url(${asset(name)})` }} aria-hidden="true" />;
}

function MaskedWords({ text }) {
  return String(text)
    .split(/\s+/)
    .filter(Boolean)
    .map((word, index) => (
      <span className="mask-word" style={{ "--word-index": index }} key={`${word}-${index}`}>
        <span>{word}</span>
      </span>
    ));
}

function FadeText({ children, as: Tag = "span", className = "" }) {
  return <Tag className={`fade-line${className ? ` ${className}` : ""}`}>{children}</Tag>;
}

async function loadOpenLayers() {
  const [MapModule, ViewModule, TileLayerModule, XYZModule, VectorLayerModule, VectorSourceModule, ClusterModule, FeatureModule, GeomModule, StyleModule, ProjectionModule, EasingModule] = await Promise.all([
    import("ol/Map.js"),
    import("ol/View.js"),
    import("ol/layer/Tile.js"),
    import("ol/source/XYZ.js"),
    import("ol/layer/Vector.js"),
    import("ol/source/Vector.js"),
    import("ol/source/Cluster.js"),
    import("ol/Feature.js"),
    import("ol/geom.js"),
    import("ol/style.js"),
    import("ol/proj.js"),
    import("ol/easing.js"),
  ]);
  return {
    Map: MapModule.default,
    View: ViewModule.default,
    TileLayer: TileLayerModule.default,
    XYZ: XYZModule.default,
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
    easeOut: EasingModule.easeOut,
  };
}

function markerStyle(ol, object, selected) {
  const color = selected ? "#031c39" : colorForIndustry(object.categoryLabel);
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

function colorForIndustry(industryName) {
  if (/жиль/i.test(industryName)) return "#1c97d9";
  if (/образ|здрав/i.test(industryName)) return "#38b88a";
  if (/культур|спорт/i.test(industryName)) return "#8f80d8";
  if (/транспорт/i.test(industryName)) return "#e68a3e";
  if (/инфраструктур/i.test(industryName)) return "#349ca4";
  if (/эколог/i.test(industryName)) return "#17a179";
  return "#4c83ea";
}

function IntegratedMap({ objects, selectedId, onSelect }) {
  const elementRef = useRef(null);
  const mapRef = useRef(null);
  const olRef = useRef(null);
  const sourceRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

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
          new ol.TileLayer({
            source: new ol.XYZ({
              url: "https://{a-c}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
              crossOrigin: "anonymous",
              transition: 280,
              attributions: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
            }),
          }),
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
      setMapReady(true);
      window.setTimeout(() => map.updateSize(), 80);
    });

    return () => {
      disposed = true;
      mapRef.current?.setTarget(undefined);
      mapRef.current = null;
      setMapReady(false);
    };
  }, [onSelect]);

  useEffect(() => {
    const ol = olRef.current;
    const source = sourceRef.current;
    const map = mapRef.current;
    if (!ol || !source || !map || !mapReady) return;
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
        duration: 520,
        easing: ol.easeOut,
      });
    }
  }, [objects, mapReady]);

  useEffect(() => {
    const ol = olRef.current;
    const map = mapRef.current;
    const source = sourceRef.current;
    const object = objects.find((item) => item.id === selectedId);
    if (!ol || !map || !source || !mapReady) return;
    source.getFeatures().forEach((feature) => {
      feature.set("selected", feature.get("objectId") === selectedId);
      feature.changed();
    });
    if (!object) return;
    const view = map.getView();
    const currentZoom = view.getZoom() ?? 11;
    view.cancelAnimations();
    view.animate({
      center: ol.fromLonLat(object.coordinates),
      zoom: Math.max(currentZoom, 12.45),
      duration: 680,
      easing: ol.easeOut,
    });
  }, [selectedId, objects, mapReady]);

  return <div className="integrated-map-canvas" ref={elementRef} aria-label="Интерактивная карта объектов Владивостока" />;
}

function ProjectCard({ object, selected, onSelect }) {
  return (
    <button className={`integrated-object${selected ? " is-active" : ""}`} type="button" aria-pressed={selected} onClick={onSelect}>
      <img src={object.image} alt="" />
      <span>
        <strong><MaskedWords text={object.displayTitle} /></strong>
        <FadeText as="small">{object.short}</FadeText>
      </span>
    </button>
  );
}

function DetailOverlay({ object, stage, onClose }) {
  if (!object) return null;
  return (
    <article className="integrated-detail-card" aria-live="polite">
      <div className="integrated-detail-media">
        <img className="project-detail-photo" src={object.image} alt="" />
        <button className="project-close" type="button" onClick={onClose} aria-label="Закрыть карточку объекта">
          <img src={asset("icon-plus.svg")} alt="" />
        </button>
      </div>
      <div className="integrated-detail-body">
        <div className="project-detail-title">
          <h3><MaskedWords text={object.detailTitle} /></h3>
        </div>
        <div className="project-status-row">
          <span className="project-type">{object.categoryDisplayLabel}</span>
          <div className="stage-progress" role="progressbar" aria-label={`Стадия: ${stage?.label ?? "не указана"}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={stageProgress(object.stageId)}>
            <span className="stage-progress-fill" style={{ width: `${stageProgress(object.stageId)}%` }} />
            <span className="stage-progress-label">{stage?.label ?? "Стадия уточняется"}</span>
          </div>
        </div>
        <FadeText as="p" className="project-description">{object.description || object.address}</FadeText>
        <div className="project-metrics">
          <div><strong>{object.budget}</strong><FadeText>утверждённый бюджет</FadeText></div>
          <div><strong>{object.deadline}</strong><FadeText>плановый срок</FadeText></div>
          <div><strong>{object.address || "Владивосток"}</strong><FadeText>локация</FadeText></div>
        </div>
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
        <FadeText as="p" className="section-label">Масштаб преобразований</FadeText>
        <h2 id="projects-title"><MaskedWords text="Ключевые проекты развития Владивостока" /></h2>
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
            <h3><MaskedWords text={activeCategory.label} /></h3>
            <div><FadeText>Объекты ИСУП</FadeText><b>{filteredObjects.length}</b></div>
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
          {loading ? (
            <div className="integrated-preloader" role="status" aria-live="polite">
              <span aria-hidden="true" />
              <FadeText>Готовим карту и объекты</FadeText>
            </div>
          ) : null}
          {selectedObject ? <DetailOverlay object={selectedObject} stage={selectedStage} onClose={() => setSelectedId(null)} /> : null}
        </div>
      </div>
    </section>
  );
}
