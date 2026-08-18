import { useEffect, useMemo, useRef, useState } from "react";
import "ol/ol.css";
import { createMapDataProvider } from "./mapData.js";
import { isupSnapshot } from "./isupSnapshot.js";
import { influencePolygon, industries as fallbackIndustries, plans as fallbackPlans, stages as fallbackStages } from "./mockData.js";

const snapshotPlans = isupSnapshot.plans.length ? isupSnapshot.plans : fallbackPlans;
const snapshotIndustries = isupSnapshot.industries.length ? isupSnapshot.industries : fallbackIndustries;
const snapshotStages = isupSnapshot.stages.length ? isupSnapshot.stages : fallbackStages;
const defaultPlanId = snapshotPlans.find((item) => /Владивосток/i.test(item.label))?.id ?? snapshotPlans[0]?.id;

const createDefaultFilters = (dictionaries = { plans: snapshotPlans, industries: snapshotIndustries, stages: snapshotStages }) => ({
  query: "",
  planIds: new Set([dictionaries.plans.find((item) => /Владивосток/i.test(item.label))?.id ?? dictionaries.plans[0]?.id ?? defaultPlanId]),
  stageIds: new Set(dictionaries.stages.map((item) => item.id)),
  industryIds: new Set(dictionaries.industries.map((item) => item.id)),
  bbox: null,
});

function ToggleButton({ active, children, onClick, ariaLabel }) {
  return (
    <button className={`lab-chip${active ? " is-active" : ""}`} type="button" aria-pressed={active} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </button>
  );
}

function Donut({ stages, objects }) {
  const counts = stages.map((stage) => objects.filter((item) => item.stageId === stage.id).length);
  const total = Math.max(1, counts.reduce((sum, count) => sum + count, 0));
  let cursor = 0;
  const stops = stages
    .map((stage, index) => {
      const start = cursor;
      cursor += (counts[index] / total) * 100;
      return `${stage.color} ${start}% ${cursor}%`;
    })
    .join(", ");

  return (
    <div className="lab-donut" style={{ "--donut": stops }}>
      <strong>{objects.length}</strong>
      <span>объектов</span>
    </div>
  );
}

function Sidebar({ dictionaries, objects, filters, selectedId, onSelect, onToggleIndustry, onToggleStage, onOpenFilters }) {
  const selectedPlan = dictionaries.plans.find((item) => filters.planIds.has(item.id)) ?? dictionaries.plans[0];
  const stageCounts = dictionaries.stages.map((stage) => ({
    ...stage,
    count: objects.filter((item) => item.stageId === stage.id).length,
  }));
  const industryCounts = dictionaries.industries.map((industry) => ({
    ...industry,
    count: objects.filter((item) => item.industryId === industry.id).length,
  }));

  return (
    <aside className="lab-sidebar" aria-label="Панель объектов карты">
      <div className="lab-sidebar-head">
        <span>Мастер-планы</span>
        <strong>{selectedPlan?.label}</strong>
      </div>
      <div className="lab-status-summary">
        <Donut stages={dictionaries.stages} objects={objects} />
        <div className="lab-stage-list">
          {stageCounts.map((stage) => (
            <button
              className={`lab-stage-row${filters.stageIds.has(stage.id) ? " is-active" : ""}`}
              key={stage.id}
              type="button"
              aria-pressed={filters.stageIds.has(stage.id)}
              onClick={() => onToggleStage(stage.id)}
            >
              <i style={{ background: stage.color }} />
              <span>{stage.label}</span>
              <b>{stage.count}</b>
            </button>
          ))}
        </div>
      </div>
      <section className="lab-panel-section">
        <div className="lab-section-title">
          <h2>Подборки</h2>
          <button type="button" onClick={onOpenFilters}>Фильтры</button>
        </div>
        <div className="lab-collections" aria-label="Фильтр по отраслям">
          {industryCounts.map((industry) => (
            <ToggleButton
              key={industry.id}
              active={filters.industryIds.has(industry.id)}
              ariaLabel={`Переключить отрасль ${industry.label}`}
              onClick={() => onToggleIndustry(industry.id)}
            >
              <i style={{ background: industry.color }}>{industry.icon}</i>
              <span>{industry.label}</span>
              <b>{industry.count}</b>
            </ToggleButton>
          ))}
        </div>
      </section>
      <section className="lab-panel-section lab-updates">
        <div className="lab-section-title">
          <h2>Объекты</h2>
          <span>{objects.length}</span>
        </div>
        <div className="lab-object-list">
          {objects.map((item) => {
            const industry = dictionaries.industries.find((entry) => entry.id === item.industryId);
            const stage = dictionaries.stages.find((entry) => entry.id === item.stageId);
            return (
              <button
                className={`lab-object-card${selectedId === item.id ? " is-selected" : ""}`}
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id, true)}
                aria-pressed={selectedId === item.id}
              >
                <img src={item.image} alt="" />
                <span>
                  <small style={{ color: industry?.color }}>{industry?.label}</small>
                  <strong>{item.title}</strong>
                  <em>{item.address}</em>
                  <b style={{ "--stage": stage?.color }}>{stage?.label}</b>
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </aside>
  );
}

function FilterSheet({ open, dictionaries, filters, scenario, layers, onClose, onTogglePlan, onToggleStage, onToggleIndustry, onToggleLayer, onScenario }) {
  if (!open) return null;
  return (
    <div className="lab-filter-sheet" role="dialog" aria-modal="true" aria-label="Фильтры карты">
      <div className="lab-sheet-head">
        <h2>Фильтры</h2>
        <button type="button" aria-label="Закрыть фильтры" onClick={onClose}>×</button>
      </div>
      <section>
        <h3>Стадия реализации</h3>
        <div className="lab-filter-grid">
          {dictionaries.stages.map((stage) => (
            <ToggleButton key={stage.id} active={filters.stageIds.has(stage.id)} onClick={() => onToggleStage(stage.id)}>
              {stage.label}
            </ToggleButton>
          ))}
        </div>
      </section>
      <section>
        <h3>Отрасль</h3>
        <div className="lab-check-grid">
          {dictionaries.industries.map((industry) => (
            <label key={industry.id}>
              <input type="checkbox" checked={filters.industryIds.has(industry.id)} onChange={() => onToggleIndustry(industry.id)} />
              <span>{industry.label}</span>
            </label>
          ))}
        </div>
      </section>
      <section>
        <h3>Мастер-план</h3>
        <div className="lab-check-grid">
          {dictionaries.plans.map((plan) => (
            <label key={plan.id}>
              <input type="checkbox" checked={filters.planIds.has(plan.id)} onChange={() => onTogglePlan(plan.id)} />
              <span>{plan.label}</span>
            </label>
          ))}
        </div>
      </section>
      <section>
        <h3>Слои</h3>
        <div className="lab-layer-list">
          <label><input type="checkbox" checked={layers.objects} onChange={() => onToggleLayer("objects")} /> Объекты</label>
          <label><input type="checkbox" checked={layers.clusters} onChange={() => onToggleLayer("clusters")} /> Кластеры</label>
          <label><input type="checkbox" checked={layers.influence} onChange={() => onToggleLayer("influence")} /> Зона влияния</label>
        </div>
      </section>
      <section>
        <h3>Состояние данных</h3>
        <div className="lab-filter-grid">
          {["data", "empty", "error"].map((item) => (
            <ToggleButton key={item} active={scenario === item} onClick={() => onScenario(item)}>
              {item === "data" ? "Данные" : item === "empty" ? "Пусто" : "Ошибка"}
            </ToggleButton>
          ))}
        </div>
      </section>
      <button className="lab-apply" type="button" onClick={onClose}>Применить</button>
    </div>
  );
}

function DetailCard({ item, dictionaries, onClose }) {
  if (!item) return null;
  const industry = dictionaries.industries.find((entry) => entry.id === item.industryId);
  const stage = dictionaries.stages.find((entry) => entry.id === item.stageId);
  return (
    <article className="lab-detail" aria-live="polite">
      <div className="lab-detail-head">
        <span style={{ color: industry?.color }}>{industry?.label}</span>
        <button type="button" aria-label="Закрыть карточку объекта" onClick={onClose}>×</button>
      </div>
      <h2>{item.title}</h2>
      <img src={item.image} alt="" />
      <p>{item.description}</p>
      <dl>
        <div><dt>Адрес</dt><dd>{item.address}</dd></div>
        <div><dt>Стадия</dt><dd style={{ color: stage?.color }}>{stage?.label}</dd></div>
        <div><dt>Срок</dt><dd>{item.deadline}</dd></div>
        <div><dt>Бюджет</dt><dd>{item.budget}</dd></div>
        <div><dt>Параметр</dt><dd>{item.area}</dd></div>
      </dl>
    </article>
  );
}

function EmptyState({ kind, onReset }) {
  return (
    <div className={`lab-state lab-state--${kind}`} role={kind === "error" ? "alert" : "status"}>
      <h2>{kind === "error" ? "Данные временно недоступны" : "Нет объектов по выбранным условиям"}</h2>
      <p>{kind === "error" ? "Прототип показывает обработку сбоя provider без обращения к закрытому ИСУП." : "Измените поиск, стадии или отрасли, чтобы вернуть объекты на карту."}</p>
      <button type="button" onClick={onReset}>{kind === "error" ? "Вернуть mock" : "Сбросить фильтры"}</button>
    </div>
  );
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
    Polygon: GeomModule.Polygon,
    CircleStyle: StyleModule.Circle,
    Fill: StyleModule.Fill,
    Stroke: StyleModule.Stroke,
    Style: StyleModule.Style,
    Text: StyleModule.Text,
    Icon: StyleModule.Icon,
    fromLonLat: ProjectionModule.fromLonLat,
    toLonLat: ProjectionModule.toLonLat,
    transformExtent: ProjectionModule.transformExtent,
  };
}

function MapCanvas({ dictionaries, objects, selectedId, layers, onSelect, onBboxChange }) {
  const elementRef = useRef(null);
  const mapRef = useRef(null);
  const olRef = useRef(null);
  const vectorRef = useRef(null);
  const clusterLayerRef = useRef(null);
  const influenceRef = useRef(null);

  useEffect(() => {
    let disposed = false;
    loadOpenLayers().then((ol) => {
      if (disposed || !elementRef.current) return;
      olRef.current = ol;
      const selectedPlan = dictionaries.plans.find((item) => item.id === "vladivostok") ?? dictionaries.plans[0];
      const baseLayer = new ol.TileLayer({ source: new ol.OSM({ crossOrigin: "anonymous" }) });
      const influenceSource = new ol.VectorSource();
      const influenceLayer = new ol.VectorLayer({
        source: influenceSource,
        style: new ol.Style({
          fill: new ol.Fill({ color: "rgba(28, 151, 217, 0.13)" }),
          stroke: new ol.Stroke({ color: "rgba(28, 151, 217, 0.55)", width: 2 }),
        }),
      });
      const vectorSource = new ol.VectorSource();
      const objectLayer = new ol.VectorLayer({ source: vectorSource, style: (feature) => markerStyle(ol, feature.get("industry"), feature.get("selected")) });
      const clusterSource = new ol.Cluster({ distance: 44, source: vectorSource });
      const clusterLayer = new ol.VectorLayer({ source: clusterSource, style: (feature) => clusterStyle(ol, feature, dictionaries.industries) });
      const map = new ol.Map({
        target: elementRef.current,
        layers: [baseLayer, influenceLayer, clusterLayer, objectLayer],
        view: new ol.View({
          center: ol.fromLonLat(selectedPlan.center ?? [131.9203, 43.1869]),
          zoom: selectedPlan.zoom,
          minZoom: 8,
          maxZoom: 17,
        }),
      });
      map.on("click", (event) => {
        const hit = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
        if (!hit) return;
        const cluster = hit.get("features");
        const target = cluster?.length ? cluster[0] : hit;
        const objectId = target.get("objectId");
        if (objectId) onSelect(objectId, false);
      });
      let bboxTimer = null;
      map.on("moveend", () => {
        window.clearTimeout(bboxTimer);
        bboxTimer = window.setTimeout(() => {
          const extent = map.getView().calculateExtent(map.getSize());
          onBboxChange(ol.transformExtent(extent, "EPSG:3857", "EPSG:4326"));
        }, 220);
      });
      mapRef.current = map;
      vectorRef.current = vectorSource;
      clusterLayerRef.current = clusterLayer;
      influenceRef.current = influenceLayer;
      window.setTimeout(() => map.updateSize(), 60);
    });
    return () => {
      disposed = true;
      mapRef.current?.setTarget(undefined);
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const ol = olRef.current;
    const source = vectorRef.current;
    if (!ol || !source) return;
    source.clear();
    objects.forEach((item) => {
      const industry = dictionaries.industries.find((entry) => entry.id === item.industryId);
      const feature = new ol.Feature({
        geometry: new ol.Point(ol.fromLonLat(item.coordinates)),
        objectId: item.id,
        industry,
        selected: selectedId === item.id,
      });
      source.addFeature(feature);
    });
    if (!selectedId && objects.length) {
      const extent = source.getExtent();
      mapRef.current?.getView().fit(extent, {
        padding: window.innerWidth <= 860 ? [96, 32, Math.round(window.innerHeight * 0.45), 32] : [96, 96, 72, 540],
        maxZoom: 12,
        duration: 260,
      });
    }
  }, [objects, selectedId, dictionaries.industries]);

  useEffect(() => {
    const ol = olRef.current;
    const map = mapRef.current;
    if (!ol || !map || !selectedId) return;
    const item = objects.find((entry) => entry.id === selectedId);
    if (!item) return;
    map.getView().animate({ center: ol.fromLonLat(item.coordinates), zoom: Math.max(map.getView().getZoom(), 13.2), duration: 360 });
  }, [selectedId]);

  useEffect(() => {
    const ol = olRef.current;
    const layer = influenceRef.current;
    if (!ol || !layer) return;
    const source = layer.getSource();
    source.clear();
    const feature = new ol.Feature({
      geometry: new ol.Polygon([influencePolygon.map((point) => ol.fromLonLat(point))]),
    });
    source.addFeature(feature);
  }, []);

  useEffect(() => {
    clusterLayerRef.current?.setVisible(layers.clusters);
    influenceRef.current?.setVisible(layers.influence);
    if (mapRef.current) {
      const objectLayer = mapRef.current.getLayers().getArray()[3];
      objectLayer?.setVisible(layers.objects);
    }
  }, [layers]);

  const zoom = (delta) => {
    const view = mapRef.current?.getView();
    if (!view) return;
    view.animate({ zoom: view.getZoom() + delta, duration: 180 });
  };

  return (
    <div className="lab-map-shell">
      <div className="lab-map" ref={elementRef} aria-label="Интерактивная карта объектов" />
      <div className="lab-zoom">
        <button type="button" aria-label="Увеличить масштаб" onClick={() => zoom(1)}>+</button>
        <button type="button" aria-label="Уменьшить масштаб" onClick={() => zoom(-1)}>−</button>
      </div>
    </div>
  );
}

function markerStyle(ol, industry, selected) {
  return new ol.Style({
    image: new ol.CircleStyle({
      radius: selected ? 17 : 13,
      fill: new ol.Fill({ color: industry?.color ?? "#1c97d9" }),
      stroke: new ol.Stroke({ color: "#fff", width: selected ? 5 : 4 }),
    }),
    text: new ol.Text({
      text: industry?.icon ?? "•",
      fill: new ol.Fill({ color: "#fff" }),
      font: "700 14px Arial",
    }),
  });
}

function clusterStyle(ol, feature, industries) {
  const features = feature.get("features") ?? [];
  if (features.length <= 1) {
    const industry = features[0]?.get("industry") ?? industries[0];
    return markerStyle(ol, industry, false);
  }
  return new ol.Style({
    image: new ol.CircleStyle({
      radius: Math.min(24, 15 + features.length),
      fill: new ol.Fill({ color: "rgba(255,255,255,.92)" }),
      stroke: new ol.Stroke({ color: "#4c83ea", width: 5 }),
    }),
    text: new ol.Text({
      text: String(features.length),
      fill: new ol.Fill({ color: "#1e2431" }),
      font: "800 14px Arial",
    }),
  });
}

export default function MapLabApp() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode") ?? "mock";
  const provider = useMemo(() => createMapDataProvider(mode), [mode]);
  const [dictionaries, setDictionaries] = useState({ plans: snapshotPlans, industries: snapshotIndustries, stages: snapshotStages });
  const [filters, setFilters] = useState(createDefaultFilters());
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scenario, setScenario] = useState(params.get("state") ?? "data");
  const [selectedId, setSelectedId] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [layers, setLayers] = useState({ objects: true, clusters: true, influence: true });
  const [queryDraft, setQueryDraft] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    provider.getDictionaries({ signal: controller.signal }).then((nextDictionaries) => {
      setDictionaries(nextDictionaries);
      setFilters((current) => {
        const nextIndustryIds = [...current.industryIds].some((id) => nextDictionaries.industries.some((item) => item.id === id))
          ? current.industryIds
          : new Set(nextDictionaries.industries.map((item) => item.id));
        const nextPlanIds = [...current.planIds].some((id) => nextDictionaries.plans.some((item) => item.id === id))
          ? current.planIds
          : createDefaultFilters(nextDictionaries).planIds;
        return { ...current, industryIds: nextIndustryIds, planIds: nextPlanIds, stageIds: new Set(nextDictionaries.stages.map((item) => item.id)) };
      });
    }).catch(() => {});
    return () => controller.abort();
  }, [provider]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setFilters((current) => ({ ...current, query: queryDraft }));
    }, 240);
    return () => window.clearTimeout(timeout);
  }, [queryDraft]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    provider
      .getObjects({ filters, scenario, signal: controller.signal })
      .then((items) => {
        setObjects(items);
        setSelectedId((current) => (items.some((item) => item.id === current) ? current : null));
      })
      .catch((reason) => {
        if (reason.name !== "AbortError") {
          setObjects([]);
          setError(reason);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [provider, filters, scenario]);

  const selected = objects.find((item) => item.id === selectedId) ?? null;
  const toggleSet = (key, id) => {
    setFilters((current) => {
      const next = new Set(current[key]);
      next.has(id) ? next.delete(id) : next.add(id);
      if (next.size === 0) next.add(id);
      return { ...current, [key]: next };
    });
  };
  const resetFilters = () => {
    setQueryDraft("");
    setScenario("data");
    setFilters(createDefaultFilters(dictionaries));
  };

  return (
    <main className="map-lab-page">
      <header className="lab-topbar">
        <a className="lab-logo" href="../" aria-label="Вернуться на главную страницу 25 ERDC">
          <span aria-hidden="true">25</span>
          <strong>ERDC Map Lab</strong>
        </a>
        <label className="lab-search">
          <span className="visually-hidden">Поиск объектов</span>
          <input value={queryDraft} placeholder="Поиск объектов" onChange={(event) => setQueryDraft(event.target.value)} />
          {queryDraft ? <button type="button" aria-label="Очистить поиск" onClick={() => setQueryDraft("")}>×</button> : null}
        </label>
        <button className="lab-filter-button" type="button" aria-label="Открыть фильтры" onClick={() => setFiltersOpen(true)}>⌁</button>
      </header>
      <MapCanvas
        dictionaries={dictionaries}
        objects={objects}
        selectedId={selectedId}
        layers={layers}
        onSelect={setSelectedId}
        onBboxChange={(bbox) => setFilters((current) => ({ ...current, bbox }))}
      />
      <Sidebar
        dictionaries={dictionaries}
        objects={objects}
        filters={filters}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onToggleIndustry={(id) => toggleSet("industryIds", id)}
        onToggleStage={(id) => toggleSet("stageIds", id)}
        onOpenFilters={() => setFiltersOpen(true)}
      />
      <DetailCard item={selected} dictionaries={dictionaries} onClose={() => setSelectedId(null)} />
      <FilterSheet
        open={filtersOpen}
        dictionaries={dictionaries}
        filters={filters}
        scenario={scenario}
        layers={layers}
        onClose={() => setFiltersOpen(false)}
        onTogglePlan={(id) => toggleSet("planIds", id)}
        onToggleStage={(id) => toggleSet("stageIds", id)}
        onToggleIndustry={(id) => toggleSet("industryIds", id)}
        onToggleLayer={(key) => setLayers((current) => ({ ...current, [key]: !current[key] }))}
        onScenario={setScenario}
      />
      {loading ? <div className="lab-loading" role="status">Загрузка карты</div> : null}
      {!loading && error ? <EmptyState kind="error" onReset={resetFilters} /> : null}
      {!loading && !error && objects.length === 0 ? <EmptyState kind="empty" onReset={resetFilters} /> : null}
      <footer className="lab-legend" aria-label="Легенда стадий">
        {dictionaries.stages.map((stage) => (
          <span key={stage.id}><i style={{ background: stage.color }} />{stage.label}</span>
        ))}
      </footer>
    </main>
  );
}
