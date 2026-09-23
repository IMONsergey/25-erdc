import { useId, useState } from "react";
import { cities, regions, cityById, cityPath } from "./data.js";
import { siteHref } from "../site.js";
import { ArrowUpRight, ArrowRight, MapPin, Map, Search } from "./icons.jsx";

export function MasterplanFinder() {
  const [city,setCity]=useState("");
  const id=useId();
  return <section className="p-masterplan-finder p-shell" id="masterplan-finder" aria-labelledby={`${id}-title`}>
    <div className="p-finder-copy"><MapPin size={26}/><div><h2 id={`${id}-title`}>Будущее вашего города</h2><p>Выберите территорию и откройте её мастер-план.</p></div></div>
    <form onSubmit={e=>{e.preventDefault();if(city)location.assign(siteHref(cityPath(cityById[city]),"#projects"));}}>
      <label className="p-select-field"><span className="visually-hidden">Город для изучения мастер-плана</span><select aria-label="Город для изучения мастер-плана" value={city} onChange={e=>setCity(e.target.value)}><option value="">Выберите город</option>{regions.map(r=><optgroup key={r.id} label={r.name}>{cities.filter(c=>c.region===r.id).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</optgroup>)}</select></label>
      <button className="p-button" disabled={!city}>Открыть карту<ArrowUpRight size={20}/></button>
    </form>
  </section>;
}

const journey = [
  {title:"Мастер-план",icon:MapPin,heading:"Большая картина будущего",text:"Мастер-план объединяет цели развития города: где появятся новые дома, общественные пространства, рабочие места и социальная инфраструктура.",href:siteHref("regions","?view=cities"),link:"Выбрать город"},
  {title:"Проекты",icon:Map,heading:"От стратегии к конкретным объектам",text:"Изучайте направления на карте, открывайте проекты и сравнивайте их показатели. У каждого города — свои задачи и приоритеты.",href:siteHref("projects","?program=masterplan"),link:"Изучить проекты"},
  {title:"Перемены",icon:Search,heading:"Следить за тем, что происходит",text:"Новости помогают узнавать об открытии объектов, ходе строительства и новых решениях. Выберите территорию, чтобы читать о своём городе.",href:siteHref("news"),link:"Читать новости"},
];
export function ProjectJourney() {
  const [active,setActive]=useState(0);
  const item=journey[active];
  return <section className="p-project-journey" aria-labelledby="journey-title"><div className="p-eyebrow">От идеи к результату</div><h2 id="journey-title">Как изучать перемены</h2>
    <div className="p-journey-tabs" role="tablist" aria-label="Путь от мастер-плана к переменам">{journey.map((s,i)=><button key={s.title} role="tab" id={`journey-tab-${i}`} aria-controls="journey-panel" aria-selected={active===i} tabIndex={active===i?0:-1} onClick={()=>setActive(i)} onKeyDown={e=>{let next;if(e.key==="ArrowRight")next=(i+1)%journey.length;else if(e.key==="ArrowLeft")next=(i+journey.length-1)%journey.length;else if(e.key==="Home")next=0;else if(e.key==="End")next=journey.length-1;if(next!==undefined){e.preventDefault();setActive(next);document.getElementById(`journey-tab-${next}`)?.focus();}}}><span>0{i+1}</span><s.icon size={22}/>{s.title}</button>)}</div>
    <div className="p-journey-panel" id="journey-panel" role="tabpanel" aria-labelledby={`journey-tab-${active}`} tabIndex={0}><div><h3>{item.heading}</h3><p>{item.text}</p></div><a className="p-text-link" href={item.href}>{item.link}<ArrowRight size={20}/></a></div>
  </section>;
}
