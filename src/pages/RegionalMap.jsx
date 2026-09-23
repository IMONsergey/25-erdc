import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { asset } from "../data.js";
import { regionalScenes, cityScenes } from "../content/illustrated-atlases.js";
import { illustratedCamera } from "./illustrated-camera.js";

export default function RegionalMap({ regionId, regionName, objects, plans, planId, selected, expanded, onPlan, onReady }) {
  const viewport = useRef(null), image = useRef(null), drag = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0, space: null });
  const [zoom, setZoom] = useState(1), [pan, setPan] = useState([0,0]), [dragging, setDragging] = useState(false), [failed, setFailed] = useState(false), [loadedImage, setLoadedImage] = useState("");
  const object = objects.find(o => o.id === selected);
  const activePlan = plans.find(p => p.id === (object?.planId || planId));
  const scene = cityScenes[activePlan?.cityId] || regionalScenes[regionId];
  const anchors = Object.values(scene.anchors);
  const target = scene.anchors[activePlan?.cityId] || [(Math.min(...anchors.map(a => a[0])) + Math.max(...anchors.map(a => a[0]))) / 2, 50];
  const counts = useMemo(() => objects.reduce((acc,o) => { acc[o.planId] = (acc[o.planId] || 0) + 1; return acc; }, {}), [objects]);
  const camera = illustratedCamera(size.width, size.height, target, Boolean(activePlan), zoom, pan, size.space);
  useLayoutEffect(() => {
    const element = viewport.current;
    const measure = () => {
      const bounds = element.getBoundingClientRect();
      const side = element.parentElement.querySelector(".regional-atlas-sidebar")?.getBoundingClientRect();
      const detail = element.parentElement.querySelector(".regional-object-card")?.getBoundingClientRect();
      const desktop = element.clientWidth >= 900;
      setSize({ width: element.clientWidth, height: element.clientHeight, space: {
        left: desktop && side ? side.right - bounds.left + 30 : 25,
        right: desktop && detail ? detail.left - bounds.left - 30 : element.clientWidth - 35,
        top: 90, bottom: element.clientHeight - 65,
      } });
    };
    measure();
    const observer = new ResizeObserver(measure); observer.observe(element);
    return () => observer.disconnect();
  }, [selected, expanded]);
  useEffect(() => { setPan([0,0]); setZoom(1); }, [planId, selected]);
  useEffect(() => { setFailed(false); if (image.current?.complete && image.current.naturalWidth) setLoadedImage(scene.image); }, [scene.image]);
  useEffect(() => {
    onReady(loadedImage === scene.image ? { zoom: amount => { setZoom(z => Math.max(.8,Math.min(2.4,z + amount * .2))); setPan([0,0]); }, fit: () => { setZoom(1); setPan([0,0]); } } : null);
    return () => onReady(null);
  }, [loadedImage, scene.image, onReady]);
  const endDrag = e => { if (drag.current?.id === e.pointerId) { drag.current = null; setDragging(false); } };
  const key = e => {
    if (e.target !== e.currentTarget) return;
    const moves = { ArrowLeft: [70,0], ArrowRight: [-70,0], ArrowUp: [0,70], ArrowDown: [0,-70] };
    if (moves[e.key]) { e.preventDefault(); setPan(p => p.map((n,i) => n + moves[e.key][i])); }
    else if (["+","=","-","0"].includes(e.key)) { e.preventDefault(); if (e.key === "0") {setPan([0,0]);setZoom(1);} else setZoom(z => Math.max(.8,Math.min(2.4,z + (e.key === "-" ? -.2 : .2)))); }
  };
  return <div ref={viewport} className={`regional-map regional-illustration ${dragging ? "is-dragging" : ""}`} tabIndex={0} aria-label={`Интерактивная панорама — ${regionName}`} onKeyDown={key}
    onPointerDown={e => { if (e.button !== 0 || e.target.closest("button")) return; drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, pan }; e.currentTarget.setPointerCapture(e.pointerId); }}
    onPointerMove={e => { const start = drag.current; if (!start || start.id !== e.pointerId) return; const dx=e.clientX-start.x,dy=e.clientY-start.y; if (Math.abs(dx)+Math.abs(dy)>4) setDragging(true); setPan([start.pan[0]+dx,start.pan[1]+dy]); }} onPointerUp={endDrag} onPointerCancel={endDrag}>
    <div className="regional-illustration-scene" style={size.width ? { width: camera.width, height: camera.height, transform: `translate3d(${camera.x}px,${camera.y}px,0) scale(${camera.scale})`, "--pin-scale": 1/camera.scale } : undefined}>
      <img key={scene.image} ref={image} className="regional-illustration-image" src={asset(scene.image)} alt={`Панорама ${activePlan?.name || regionName}`} loading="lazy" draggable="false" onLoad={() => setLoadedImage(scene.image)} onError={() => setFailed(true)} />
      <div className="regional-territory-markers" aria-label="Выбрать территорию на панораме">
        {plans.filter(p => scene.anchors[p.cityId]).map(p => <button key={p.id} className={`regional-territory-pin ${activePlan?.id === p.id ? "is-active" : ""} ${camera.x + scene.anchors[p.cityId][0] / 100 * camera.width * camera.scale > size.width - 245 ? "is-label-left" : ""}`} style={{left:`${scene.anchors[p.cityId][0]}%`,top:`${scene.anchors[p.cityId][1]}%`}} aria-label={`Показать проекты: ${p.name}`} aria-pressed={activePlan?.id === p.id} onClick={() => onPlan(p.id)}><span className="regional-pin-dot">{String(counts[p.id] || 0).padStart(2,"0")}</span><span className="regional-pin-label"><strong>{p.name}</strong></span></button>)}
      </div>
    </div>
    {failed && <div className="regional-art-error" role="status">Не удалось загрузить панораму<button onClick={() => { setFailed(false); image.current.src=asset(scene.image); }}>Повторить</button></div>}

  </div>;
}
