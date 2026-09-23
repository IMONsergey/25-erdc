import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Icon from "../components/Icon.jsx";
import { asset } from "../data.js";
import { cityScenes, regionalScenes } from "../content/illustrated-atlases.js";
import { illustratedCamera } from "./illustrated-camera.js";

export default function CityAtlasMap({ city, directions, active, selected, expanded, onChoose, onReady }) {
  const viewport = useRef(null), drag = useRef(null);
  const [size, setSize] = useState({width:0,height:0});
  const [zoom, setZoom] = useState(1), [pan, setPan] = useState([0,0]), [dragging, setDragging] = useState(false), [failed, setFailed] = useState(false);
  const scene = cityScenes[city.id] || regionalScenes[city.region];
  const target = scene.anchors[city.id] || [61,48];
  const camera = illustratedCamera(size.width, size.height, target, true, zoom, pan,
    {left:size.width >= 900 ? 380 : 25,right:size.width - (selected && size.width >= 900 ? 410 : 35),top:90,bottom:size.height-60});
  useLayoutEffect(() => {
    const node = viewport.current;
    const measure = () => setSize({width:node.clientWidth,height:node.clientHeight});
    measure(); const observer = new ResizeObserver(measure); observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { onReady({zoom:amount=>{setZoom(z=>Math.max(.8,Math.min(2.4,z+amount*.2)));setPan([0,0]);},fit:()=>{setZoom(1);setPan([0,0]);}}); return () => onReady(null); }, [onReady]);
  const end = () => {drag.current=null;setDragging(false);};
  return <div ref={viewport} className={`regional-map regional-illustration city-atlas-map ${dragging ? "is-dragging" : ""}`} tabIndex={0} aria-label={`Панорама мастер-плана — ${city.name}`}
    onKeyDown={e=>{if(e.target!==e.currentTarget)return; const moves={ArrowLeft:[70,0],ArrowRight:[-70,0],ArrowUp:[0,70],ArrowDown:[0,-70]}; if(moves[e.key]){e.preventDefault();setPan(p=>p.map((v,i)=>v+moves[e.key][i]));}else if(["+","=","-","0"].includes(e.key)){e.preventDefault();setZoom(z=>e.key==="0"?1:Math.max(.8,Math.min(2.4,z+(e.key==="-"?-.2:.2))));if(e.key==="0")setPan([0,0]);}}}
    onPointerDown={e=>{if(e.button!==0||e.target.closest("button"))return; drag.current={id:e.pointerId,x:e.clientX,y:e.clientY,pan};if(e.pointerType==="mouse"||expanded)e.currentTarget.setPointerCapture(e.pointerId);}}
    onPointerMove={e=>{const d=drag.current;if(!d||d.id!==e.pointerId)return;if(e.pointerType!=="mouse"&&!expanded)return; const dx=e.clientX-d.x,dy=e.clientY-d.y;if(Math.abs(dx)+Math.abs(dy)>4)setDragging(true);setPan([d.pan[0]+dx,d.pan[1]+dy]);}} onPointerUp={end} onPointerCancel={end}>
    <div className="regional-illustration-scene" style={size.width?{width:camera.width,height:camera.height,transform:`translate3d(${camera.x}px,${camera.y}px,0) scale(${camera.scale})`}:undefined}>
      <img className="regional-illustration-image" src={asset(scene.image)} alt={`Иллюстрированная панорама — ${cityScenes[city.id] ? city.name : city.name + ', ' + city.regionName}`} loading="lazy" draggable="false" onError={()=>setFailed(true)} />
    </div>
    {failed && <div className="regional-art-error" role="status">Не удалось загрузить панораму<button onClick={()=>{const img=viewport.current.querySelector('img');img.src=asset(scene.image);setFailed(false);}}>Повторить</button></div>}
    <nav className="city-atlas-map-directions" aria-label="Направления на панораме">
      {directions.map(d=><button key={d.id} className={active===d.id?"is-active":""} aria-pressed={active===d.id} style={{"--direction-color":d.color}} onClick={()=>onChoose(d.id)}><span className="city-atlas-direction-orb"><Icon name={d.icon} size={23}/><small>{d.count}</small></span><strong>{d.title}</strong></button>)}
    </nav>
  </div>;
}
