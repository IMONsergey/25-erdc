import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Icon from "../components/Icon.jsx";
import { Search } from "../portal/icons.jsx";
import { media, normalize, regionById } from "../portal/data.js";
import { siteHref } from "../site.js";
import { useQueryState, ShareButton } from "../portal/interactions.jsx";
import { cityDirections, cityDirection, projectWord } from "./city-atlas-data.js";
import CityAtlasMap from "./CityAtlasMap.jsx";
import "./city-atlas.css";

export default function CityAtlas({city,items}) {
  const directions = useMemo(()=>cityDirections.map(d=>({...d,count:items.filter(p=>cityDirection(p)===d.id).length})).filter(d=>d.count),[items]);
  const [direction,setDirection]=useQueryState("direction",directions[0]?.id||"housing");
  const [query,setQuery]=useQueryState("atlas-q"), [selected,setSelected]=useQueryState("project");
  const [expanded,setExpanded]=useState(false),[filtersOpen,setFiltersOpen]=useState(Boolean(query)),[imageIndex,setImageIndex]=useState(0);
  const stage=useRef(null),detail=useRef(null),list=useRef(null),expandButton=useRef(null),previousFocus=useRef(null),mapApi=useRef(null);
  const onReady=useCallback(api=>{mapApi.current=api;},[]);
  const active=directions.find(d=>d.id===direction)||directions[0];
  const project=items.find(p=>p.id===selected);
  const shown=items.filter(p=>(query||cityDirection(p)===active.id)&&(!query||normalize(p.title+" "+p.texts.join(" ")).includes(normalize(query.trim()))));
  const selectedIndex=shown.findIndex(p=>p.id===selected);
  const close=()=>{setSelected("");previousFocus.current?.focus({preventScroll:true});};
  const changeDirection=id=>{setDirection(id);setQuery("");setSelected("");list.current?.scrollTo({top:0});};
  const choose=id=>{previousFocus.current=document.activeElement;setSelected(id);setImageIndex(0);};
  const explore=id=>{changeDirection(id);const first=items.find(p=>cityDirection(p)===id);if(first)choose(first.id);};
  useEffect(()=>{if(project&&!query)setDirection(cityDirection(project));},[selected]);
  useEffect(()=>{setImageIndex(0);if(project&&!expanded)detail.current?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth",block:matchMedia("(max-width:899px)").matches?"start":"nearest"});},[selected]);
  useEffect(()=>{
    if(!selected&&!expanded)return;
    const onKey=e=>{
      if(e.key==="Escape"){if(expanded){setExpanded(false);expandButton.current?.focus();}else close();}
      if(e.key==="Tab"&&expanded){const nodes=[...stage.current.querySelectorAll('button:not(:disabled),a[href],input,[tabindex="0"]')].filter(n=>n.getClientRects().length);if(e.shiftKey&&document.activeElement===nodes[0]){e.preventDefault();nodes.at(-1)?.focus();}else if(!e.shiftKey&&document.activeElement===nodes.at(-1)){e.preventDefault();nodes[0]?.focus();}}
    };
    window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey);
  },[selected,expanded]);
  useEffect(()=>{if(!expanded)return;const before=document.body.style.overflow;document.body.style.overflow="hidden";expandButton.current?.focus();return()=>{document.body.style.overflow=before;};},[expanded]);
  const reset=()=>{setQuery("");setSelected("");setDirection(directions[0].id);mapApi.current?.fit();};
  const next=step=>choose(shown[(selectedIndex+step+shown.length)%shown.length].id);
  return <section id="projects" className="projects-section city-atlas-section" aria-labelledby="projects-title">
    <div className="projects-overture"><div className="projects-intro shell reveal"><div><span className="section-kicker">03 / Масштаб преобразований</span><h2 className="section-title" id="projects-title">Город меняется.<br/><span>Здесь и сейчас.</span></h2></div><div className="projects-total"><strong>{items.length}</strong><span>{projectWord(items.length)}<br/>{" "}развития территории</span></div></div></div>
    <div ref={stage} className={`regional-atlas-stage city-atlas-stage ${directions.length > 8 ? "has-many-directions" : ""} ${expanded?"is-expanded":""} ${project?"has-selection":""}`} role={expanded?"dialog":"region"} aria-modal={expanded?true:undefined} aria-label={`Атлас проектов — ${city.name}`} style={{"--accent":active.color,"--atlas-accent":active.color}}>
      <CityAtlasMap city={{...city,regionName:regionById[city.region].name}} directions={directions} active={active.id} selected={selected} expanded={expanded} onChoose={explore} onReady={onReady}/>
      <div className="regional-map-vignette" aria-hidden="true"/>
      <aside className="regional-atlas-sidebar">
        <div className="regional-sidebar-head"><div className="regional-sidebar-eyebrow"><span className="section-kicker">Атлас развития</span><button aria-label="Поиск проектов города" aria-expanded={filtersOpen} aria-controls="city-atlas-search" onClick={()=>setFiltersOpen(!filtersOpen)}><Search size={20}/></button></div><h3>{city.name}</h3><span>{items.length} {projectWord(items.length)} · {directions.length} направлений</span></div>
        <div className="regional-atlas-filters" id="city-atlas-search" hidden={!filtersOpen}><label className="regional-atlas-search"><Search size={18}/><input aria-label="Найти проект города" placeholder="Найти проект" value={query} onChange={e=>{setQuery(e.target.value);setSelected("");}}/><button hidden={!query} aria-label="Очистить поиск проектов города" onClick={()=>setQuery("")}><Icon name="close" size={18}/></button></label></div>
        <div className="regional-atlas-categories" aria-label="Направления развития города">{directions.map(d=><button key={d.id} aria-pressed={!query&&active.id===d.id} className={!query&&active.id===d.id?"is-active":""} style={{"--category-color":d.color}} onClick={()=>changeDirection(d.id)}><Icon name={d.icon} size={20}/><span>{d.title}</span><small>{d.count}</small></button>)}</div>
        <div className="regional-list-heading"><span aria-live="polite">{query?"Результаты поиска":active.title} <b>{shown.length}</b></span>{query&&<button onClick={()=>setQuery("")}>Сбросить</button>}</div>
        <div className="regional-atlas-list" ref={list} aria-label="Проекты города">{shown.map((p,i)=><button key={p.id} className={selected===p.id?"is-active":""} aria-pressed={selected===p.id} onClick={()=>choose(p.id)}><span className="regional-object-number">{String(i+1).padStart(2,"0")}</span><span><strong>{p.title}</strong><small>{p.stats[0] ? `${p.stats[0].label}: ${p.stats[0].value}` : city.name}</small></span><Icon name="arrow" size={17}/></button>)}{!shown.length&&<div className="regional-atlas-empty"><strong>Проекты не найдены</strong><p>Попробуйте другое название.</p><button onClick={()=>setQuery("")}>Сбросить поиск</button></div>}</div>
      </aside>
      <div className="regional-map-toolbar"><span className="regional-map-count">{city.name} · {items.length} {projectWord(items.length)}</span><button aria-label="Приблизить карту" onClick={()=>mapApi.current?.zoom(1)}><Icon name="plus" size={22}/></button><button aria-label="Отдалить карту" onClick={()=>mapApi.current?.zoom(-1)}><Icon name="minus" size={22}/></button><button aria-label="Общий вид мастер-плана" onClick={reset}><Icon name="reset" size={21}/></button><button ref={expandButton} aria-label={expanded?"Закрыть полный экран":"Открыть карту на весь экран"} aria-expanded={expanded} onClick={()=>setExpanded(!expanded)}><Icon name={expanded?"close":"expand"} size={21}/></button></div>
      {!project&&<div className="atlas-invitation regional-atlas-invitation"><span className="atlas-invitation-count">{String(shown.length).padStart(2,"0")}</span><div><span>проектов направления</span><h3>{query?"Результаты поиска":active.title}</h3><button disabled={!shown.length} onClick={()=>choose(shown[0].id)}>Исследовать<Icon name="arrow" size={22}/></button></div></div>}
      {project&&<article className="regional-object-card" ref={detail} aria-label={project.title} aria-live="polite"><div className="regional-object-top"><span><Icon name={active.icon} size={18}/>{cityDirections.find(d=>d.id===cityDirection(project)).title}</span><button aria-label="Закрыть карточку проекта" onClick={close}><Icon name="close" size={22}/></button></div><div className="regional-object-scroll"><figure className="regional-object-image"><img src={media(project.images[imageIndex]||city.image)} alt={project.images.length?project.title:city.name}/>{project.images.length>1&&<div className="regional-image-controls"><button aria-label="Предыдущее изображение" onClick={()=>setImageIndex((imageIndex-1+project.images.length)%project.images.length)}><Icon name="left" size={20}/></button><span>{imageIndex+1} / {project.images.length}</span><button aria-label="Следующее изображение" onClick={()=>setImageIndex((imageIndex+1)%project.images.length)}><Icon name="right" size={20}/></button></div>}</figure><div className="regional-object-copy">{project.status&&<span className="regional-object-status">{project.status}</span>}<h3>{project.title}</h3>{project.texts.map((t,i)=><p key={i}>{t}</p>)}<dl>{project.stats.map((s,i)=><div key={i}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}</dl><div className="regional-object-links"><a href={siteHref(`projects/${project.id}`)}>Паспорт проекта<Icon name="arrow" size={19}/></a><ShareButton url={siteHref(`cities/${city.id}`,`?project=${encodeURIComponent(project.id)}#projects`)}/></div></div></div><div className="regional-object-navigation"><button aria-label="Предыдущий проект" disabled={shown.length<2} onClick={()=>next(-1)}><Icon name="left" size={22}/></button><span><strong>{Math.max(1,selectedIndex+1)}</strong> / {shown.length}<small>Проекты направления</small></span><button aria-label="Следующий проект" disabled={shown.length<2} onClick={()=>next(1)}><Icon name="right" size={22}/></button></div></article>}
    </div>
  </section>;
}
