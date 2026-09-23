import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map from "ol/Map.js";
import View from "ol/View.js";
import TileLayer from "ol/layer/Tile.js";
import VectorLayer from "ol/layer/Vector.js";
import OSM from "ol/source/OSM.js";
import VectorSource from "ol/source/Vector.js";
import Cluster from "ol/source/Cluster.js";
import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import { fromLonLat } from "ol/proj.js";
import { Style, Circle, Fill, Stroke, Text } from "ol/style.js";
import { boundingExtent } from "ol/extent.js";
import "ol/ol.css";
import {
  Search,
  Plus,
  Minus,
  RotateCcw,
  ArrowUpRight,
  X,
  MapPin,
  List,
  Map as MapIcon,
} from "./icons.jsx";
import { isupSnapshot } from "../map-lab/isupSnapshot.js";
import { siteHref } from "../site.js";
import { cityById, cityPath } from "./data.js";
import { useQueryState, ShareButton } from "./interactions.jsx";
import atlasRegions from "../content/atlas-regions.json";
const planCity = Object.fromEntries(Object.values(atlasRegions).flatMap(r=>r.plans.map(p=>[p.id,p.cityId])));
const canLocate = o => o.id !== "89c29557-7303-44ae-acef-a9b3e0412455";
const stageNames = {
  planned: "Запланировано",
  prep: "Подготовка",
  design: "Проектирование",
  build: "Строительство",
  operation: "Эксплуатация",
  PLANNED: "Запланировано",
  PREP: "Подготовка",
  PIR: "Проектирование",
  SMR: "Строительство",
  OPERATION: "Эксплуатация",
};
const valid = isupSnapshot.objects.filter(
  (o) =>
    Array.isArray(o.coordinates) &&
    o.coordinates.length >= 2 &&
    o.coordinates.every(Number.isFinite),
);
const budget = (v) =>
  typeof v === "number" && v > 0
    ? `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 }).format(v / 1e6)} млн ₽`
    : typeof v === "string"
      ? v
      : "Не указан";
const styles = new globalThis.Map();
function markStyle(feature) {
  const list = feature.get("features") || [];
  const count = list.length;
  const key = String(count);
  if (!styles.has(key))
    styles.set(
      key,
      new Style({
        image: new Circle({
          radius: count > 1 ? Math.min(26, 17 + Math.log2(count)) : 8,
          fill: new Fill({ color: count > 1 ? "#075bdc" : "#1670ec" }),
          stroke: new Stroke({ color: "#fff", width: count > 1 ? 3 : 2 }),
        }),
        text:
          count > 1
            ? new Text({
                text: String(count),
                fill: new Fill({ color: "#fff" }),
                font: "600 13px Arial",
              })
            : undefined,
      }),
    );
  return styles.get(key);
}
export default function PortalMap() {
  const [plan, setPlan] = useQueryState("plan"),
    [industry, setIndustry] = useQueryState("industry"),
    [stage, setStage] = useQueryState("stage"),
    [query, setQuery] = useQueryState("q");
  const [selected, setSelected] = useState(null),
    [tab, setTab] = useState("map"),
    [limit, setLimit] = useState(45),
    [mapReady, setMapReady] = useState(false),
    [tileError, setTileError] = useState(false);
  const container = useRef(null),
    map = useRef(null),
    source = useRef(null),
    selectionSource = useRef(null),
    mapOnly = useRef(false);
  const filtered = useMemo(
    () =>
      valid.filter(
        (o) =>
          (!plan || o.planId === plan) &&
          (!industry || o.industryId === industry) &&
          (!stage || o.stageId === stage) &&
          `${o.title} ${o.description} ${o.address}`
            .toLowerCase()
            .replaceAll("ё", "е")
            .includes(query.toLowerCase().replaceAll("ё", "е")),
      ),
    [plan, industry, stage, query],
  );
  const object = valid.find((o) => o.id === selected);
  const plans = isupSnapshot.plans;
  const activeCity = cityById[planCity[object?.planId || plan]];
  const masterplanHref = activeCity ? siteHref(cityPath(activeCity), "#projects") : null;
  const stages = [...new Set(valid.map((o) => o.stageId))].filter(Boolean);
  const reset = () => {
    setPlan("");
    setIndustry("");
    setStage("");
    setQuery("");
    setSelected(null);
    map.current
      ?.getView()
      .animate({ center: fromLonLat([139, 56]), zoom: 3.8, duration: 400 });
  };
  const choose = useCallback((id) => {
    setSelected(id);
    const obj = valid.find((o) => o.id === id);
    if (obj && canLocate(obj)) {
      map.current?.getView().animate({
        center: fromLonLat(obj.coordinates),
        zoom: Math.max(map.current.getView().getZoom(), 13),
        duration: 400,
      });
    }
  }, []);
  useEffect(() => {
    const vs = new VectorSource(),
      ss = new VectorSource();
    source.current = vs;
    selectionSource.current = ss;
    const cluster = new Cluster({ distance: 40, source: vs });
    const tiles = new OSM();
    let failures = 0;
    tiles.on("tileloaderror", () => {
      failures++;
      if (failures > 4) setTileError(true);
    });
    tiles.on("tileloadend", () => setTileError(false));
    const m = new Map({
      target: container.current,
      layers: [
        new TileLayer({ source: tiles }),
        new VectorLayer({ source: cluster, style: markStyle }),
        new VectorLayer({
          source: ss,
          style: new Style({
            image: new Circle({
              radius: 13,
              fill: new Fill({ color: "#f4ab42" }),
              stroke: new Stroke({ color: "#fff", width: 4 }),
            }),
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([139, 56]),
        zoom: 3.8,
        minZoom: 2,
        maxZoom: 18,
      }),
      controls: [],
    });
    map.current = m;
    m.on("singleclick", (e) => {
      const hit = m.forEachFeatureAtPixel(e.pixel, (f) => f);
      const group = hit?.get("features");
      if (group?.length === 1) choose(group[0].get("objectId"));
      else if (group?.length > 1) {
        m.getView().fit(
          boundingExtent(group.map((f) => f.getGeometry().getCoordinates())),
          { padding: [70, 70, 70, 70], maxZoom: 15, duration: 350 },
        );
      } else if (hit?.get("objectId")) choose(hit.get("objectId"));
    });
    m.on("pointermove", (e) => {
      m.getTargetElement().style.cursor = m.hasFeatureAtPixel(e.pixel)
        ? "pointer"
        : "";
    });
    setMapReady(true);
    const observer = new ResizeObserver(() => m.updateSize());
    observer.observe(container.current);
    return () => {
      observer.disconnect();
      m.setTarget(undefined);
    };
  }, [choose]);
  useEffect(() => {
    if (!mapReady) return;
    source.current.clear();
    source.current.addFeatures(
      filtered.filter(canLocate).map(
        (o) =>
          new Feature({
            geometry: new Point(fromLonLat(o.coordinates)),
            objectId: o.id,
          }),
      ),
    );
    setLimit(45);
    if (selected && !filtered.some((o) => o.id === selected)) setSelected(null);
  }, [filtered, mapReady]);
  useEffect(() => {
    if (!mapReady) return;
    const p = plans.find((p) => p.id === plan);
    map.current.getView().animate({
      center: fromLonLat(p?.center || [139, 56]),
      zoom: p ? 10.5 : 3.8,
      duration: 400,
    });
  }, [plan, mapReady]);
  useEffect(() => {
    if (!selectionSource.current) return;
    selectionSource.current.clear();
    if (object && canLocate(object))
      selectionSource.current.addFeature(
        new Feature({
          geometry: new Point(fromLonLat(object.coordinates)),
          objectId: object.id,
        }),
      );
  }, [selected, mapReady]);
  return (
    <div className="p-map-page">
      <div className="p-map-heading">
        <div>
          <a href={siteHref()}>25 городов /</a>
          <h1>Карта проектов</h1>
        </div>
        <p>Объекты мастер-планов Дальнего Востока</p>
        <a href={masterplanHref || siteHref("projects")}>
          {activeCity ? `Мастер-план: ${activeCity.name}` : "Каталог проектов"}
          <ArrowUpRight size={18} />
        </a>
      </div>
      <div className="p-map-filters">
        <label className="p-search-field">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Поиск объектов на карте"
            placeholder="Найти объект"
          />
        </label>
        <label>
          <span className="visually-hidden">Город на карте</span>
          <select
            aria-label="Город на карте"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
          >
            <option value="">Все города</option>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="visually-hidden">Направление на карте</span>
          <select
            aria-label="Направление на карте"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          >
            <option value="">Все направления</option>
            {isupSnapshot.industries.map((i) => (
              <option key={i.id} value={i.id}>
                {i.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="visually-hidden">Стадия проекта</span>
          <select
            aria-label="Стадия проекта"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
          >
            <option value="">Все стадии</option>
            {stages.map((s) => (
              <option value={s} key={s}>
                {stageNames[s] || s}
              </option>
            ))}
          </select>
        </label>
        <button
          className="p-icon-button"
          aria-label="Сбросить фильтры карты"
          onClick={reset}
        >
          <RotateCcw size={19} />
        </button>
      </div>
      <div className="p-map-mobile-tabs">
        <button onClick={() => setTab("map")} aria-pressed={tab === "map"}>
          <MapIcon size={18} />
          Карта
        </button>
        <button onClick={() => setTab("list")} aria-pressed={tab === "list"}>
          <List size={18} />
          Список ({filtered.length})
        </button>
      </div>
      <div className={`p-map-workspace p-map-tab-${tab}`}>
        <aside className="p-map-list">
          <div className="p-map-count" aria-live="polite">
            Найдено объектов: {filtered.length}
          </div>
          <div className="p-map-list-scroll">
            {filtered.slice(0, limit).map((o) => (
              <button
                onClick={() => {
                  choose(o.id);
                  setTab("map");
                }}
                aria-pressed={selected === o.id}
                key={o.id}
              >
                <span>{o.industryName}</span>
                <strong>{o.title}</strong>
                <small>{plans.find((p) => p.id === o.planId)?.label}</small>
              </button>
            ))}
            {!filtered.length && (
              <div className="p-empty">
                <p>Объекты не найдены</p>
                <button className="p-button" onClick={reset}>
                  Сбросить фильтры
                </button>
              </div>
            )}
            {limit < filtered.length && (
              <button
                className="p-map-more"
                onClick={() => setLimit(limit + 45)}
              >
                Показать ещё 45 объектов
                <Plus size={16} />
              </button>
            )}
          </div>
        </aside>
        <div className="p-map-canvas-wrap">
          <div
            ref={container}
            className="p-map-canvas"
            aria-label="Интерактивная карта объектов"
            tabIndex={0}
          />
          <div className="p-map-controls">
            <button
              aria-label="Приблизить карту"
              onClick={() =>
                map.current?.getView().animate({
                  zoom: map.current.getView().getZoom() + 1,
                  duration: 250,
                })
              }
            >
              <Plus size={21} />
            </button>
            <button
              aria-label="Отдалить карту"
              onClick={() =>
                map.current?.getView().animate({
                  zoom: map.current.getView().getZoom() - 1,
                  duration: 250,
                })
              }
            >
              <Minus size={21} />
            </button>
            <button aria-label="Показать Дальний Восток" onClick={reset}>
              <RotateCcw size={18} />
            </button>
          </div>
          {tileError && (
            <div className="p-map-warning">
              Подложка временно недоступна. Объекты можно выбрать в списке.
            </div>
          )}
          <div className="p-map-attribution">
            ©{" "}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noreferrer"
            >
              OpenStreetMap
            </a>{" "}
            contributors
          </div>
          {object && (
            <section
              className="p-map-detail"
              aria-live="polite"
              aria-label="Карточка объекта"
            >
              <button
                aria-label="Закрыть карточку объекта"
                className="p-icon-button"
                onClick={() => setSelected(null)}
              >
                <X size={21} />
              </button>
              <span className="p-map-detail-category">
                {object.industryName}
              </span>
              <h2>{object.title}</h2>
              <p>{object.description || object.address}</p>
              <dl>
                <div>
                  <dt>Стадия</dt>
                  <dd>
                    {stageNames[object.stageId] ||
                      object.stageLabel ||
                      object.stageId}
                  </dd>
                </div>
                <div>
                  <dt>Бюджет</dt>
                  <dd>{budget(object.budget)}</dd>
                </div>
                {object.deadline && (
                  <div>
                    <dt>Срок реализации</dt>
                    <dd>{String(object.deadline).slice(0, 10)}</dd>
                  </div>
                )}
              </dl>
              {masterplanHref && <a className="p-map-plan-link" href={masterplanHref}>Открыть мастер-план<ArrowUpRight size={19}/></a>}
              <ShareButton label="Поделиться подборкой" />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
