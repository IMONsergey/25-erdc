import { useEffect, useRef } from "react";
import Map from "ol/Map.js";
import View from "ol/View.js";
import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import GeoJSON from "ol/format/GeoJSON.js";
import TileLayer from "ol/layer/Tile.js";
import VectorLayer from "ol/layer/Vector.js";
import OSM from "ol/source/OSM.js";
import VectorSource from "ol/source/Vector.js";
import Cluster from "ol/source/Cluster.js";
import { fromLonLat } from "ol/proj.js";
import { boundingExtent } from "ol/extent.js";
import { Style, Circle, Fill, Stroke, Text } from "ol/style.js";
import { defaults } from "ol/interaction/defaults.js";
import MouseWheelZoom from "ol/interaction/MouseWheelZoom.js";
import ScaleLine from "ol/control/ScaleLine.js";
import { siteRoot } from "../site.js";
import "ol/ol.css";

const colours = { housing: "#79dffa", social: "#bbcbff", transport: "#ffd09c", engineering: "#a3dbed", ecology: "#a0e3b3", tourism: "#cbb7f8", economy: "#fae5ad" };
const duration = () => matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 450;
const mapPadding = (container, selected = false) => {
  if (container.clientWidth < 900) return [70, 25, 55, 25];
  const bounds = container.getBoundingClientRect();
  const sidebar = container.parentElement.querySelector(".regional-atlas-sidebar")?.getBoundingClientRect();
  const card = selected && container.parentElement.querySelector(".regional-object-card")?.getBoundingClientRect();
  return [95, card ? bounds.right - card.left + 24 : 75, 65, sidebar ? sidebar.right - bounds.left + 24 : 385];
};
export default function RegionalMap({ objects, plans, selected, expanded, light, onChoose, onCluster, onReady }) {
  const container = useRef(null), instance = useRef(null), source = useRef(null), highlight = useRef(null);
  const latest = useRef({ objects, plans, selected, expanded, onChoose, onCluster, onReady });
  latest.current = { objects, plans, selected, expanded, onChoose, onCluster, onReady };
  useEffect(() => {
    const vector = new VectorSource({ wrapX: false });
    const selection = new VectorSource({ wrapX: false });
    source.current = vector; highlight.current = selection;
    const cluster = new Cluster({ distance: 42, minDistance: 16, source: vector });
    const raster = new TileLayer({ className: "regional-basemap", opacity: .94, source: new OSM({ transition: 200, wrapX: false }) });
    const styleCache = new globalThis.Map();
    const markerStyle = feature => {
      const members = feature.get("features") || [];
      const count = members.length;
      const category = members.every(m => m.get("category") === members[0]?.get("category")) ? members[0]?.get("category") : "housing";
      const key = `${count}-${category}`;
      if (!styleCache.has(key)) styleCache.set(key, new Style({
        image: new Circle({ radius: count > 1 ? Math.min(29, 19 + Math.log2(count)) : 9, fill: new Fill({ color: count > 1 ? "#0b4e70ee" : colours[category] }), stroke: new Stroke({ color: colours[category] || "#b2eaff", width: count > 1 ? 2 : 2.5 }) }),
        text: count > 1 ? new Text({ text: String(count), font: '600 14px "TikTok Sans", sans-serif', fill: new Fill({ color: "#fff" }) }) : undefined,
      }));
      return styleCache.get(key);
    };
    const labelSource = new VectorSource({ features: plans.map(p => new Feature({ geometry: new Point(fromLonLat(p.center)), name: p.name.replace(" агломерация", "") })) });
    const map = new Map({
      target: container.current,
      layers: [
        new VectorLayer({ source: new VectorSource({ url: new URL("content/atlas/land.json", siteRoot).href, format: new GeoJSON(), wrapX: false }), style: new Style({ fill: new Fill({ color: "#155272" }), stroke: new Stroke({ color: "#54a6c3", width: 1 }) }) }),
        raster,
        new VectorLayer({ source: labelSource, declutter: true, style: f => new Style({ text: new Text({ text: f.get("name"), font: '500 14px "TikTok Sans", sans-serif', offsetY: -32, fill: new Fill({ color: "#eefbff" }), stroke: new Stroke({ color: "#053d59", width: 5 }) }) }) }),
        new VectorLayer({ source: cluster, style: markerStyle }),
        new VectorLayer({ source: selection, style: new Style({ image: new Circle({ radius: 17, fill: new Fill({ color: "#fff1c7" }), stroke: new Stroke({ color: "#fff", width: 4 }) }), zIndex: 20 }) }),
      ],
      view: new View({ center: fromLonLat(plans[0].center), zoom: 9, minZoom: 3, maxZoom: 18, multiWorld: false }),
      controls: [new ScaleLine({ className: "regional-scale", units: "metric" })],
      interactions: defaults({ mouseWheelZoom: false }).extend([new MouseWheelZoom({ condition: event => latest.current.expanded || event.originalEvent.ctrlKey || event.originalEvent.metaKey })]),
    });
    instance.current = map;
    const padding = selectedCard => mapPadding(container.current, selectedCard);
    const fit = (records = latest.current.objects, selectedCard = false) => {
      const points = records.filter(o => o.coordinates).map(o => fromLonLat(o.coordinates));
      if (points.length) map.getView().fit(boundingExtent(points), { padding: padding(selectedCard), maxZoom: selectedCard ? 14 : 11, duration: duration() });
    };
    latest.current.onReady({ zoom: amount => map.getView().animate({ zoom: map.getView().getZoom() + amount, duration: duration() / 2 }), fit, updateSize: () => map.updateSize() });
    map.on("singleclick", event => {
      const hit = map.forEachFeatureAtPixel(event.pixel, feature => feature, { hitTolerance: 8 });
      if (hit?.get("objectId")) return latest.current.onChoose(hit.get("objectId"));
      const group = hit?.get("features");
      if (group?.length === 1) latest.current.onChoose(group[0].get("objectId"));
      else if (group?.length > 1) {
        const ids = group.map(f => f.get("objectId"));
        latest.current.onCluster(ids);
        map.getView().fit(boundingExtent(group.map(f => f.getGeometry().getCoordinates())), { padding: padding(false), maxZoom: 17, duration: duration() });
      }
    });
    map.on("pointermove", event => {
      container.current.style.cursor = map.hasFeatureAtPixel(event.pixel, { hitTolerance: 6 }) ? "pointer" : "grab";
    });
    const observer = new ResizeObserver(() => map.updateSize()); observer.observe(container.current);
    return () => { observer.disconnect(); latest.current.onReady(null); map.setTarget(undefined); map.dispose(); };
  }, [plans]);
  useEffect(() => {
    if (!source.current) return;
    source.current.clear();
    source.current.addFeatures(objects.filter(o => o.coordinates).map(o => new Feature({ geometry: new Point(fromLonLat(o.coordinates)), objectId: o.id, category: o.category })));
    const points = objects.filter(o => o.coordinates).map(o => fromLonLat(o.coordinates));
    if (points.length) instance.current.getView().fit(boundingExtent(points), { padding: mapPadding(container.current), maxZoom: 11, duration: duration() });
  }, [objects]);
  useEffect(() => {
    if (!highlight.current) return;
    highlight.current.clear();
    const object = objects.find(o => o.id === selected);
    if (object?.coordinates) {
      const point = fromLonLat(object.coordinates);
      highlight.current.addFeature(new Feature({ geometry: new Point(point), objectId: object.id }));
      instance.current.getView().fit(boundingExtent([point]), { padding: mapPadding(container.current, true), maxZoom: 14, duration: duration() });
    }
  }, [selected, objects]);
  useEffect(() => { instance.current?.updateSize(); }, [expanded]);
  return <div ref={container} className={`regional-map ${light ? "is-light" : ""}`} tabIndex={0} aria-label="Интерактивная карта объектов региона" />;
}
