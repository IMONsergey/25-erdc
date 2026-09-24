import {useEffect,useRef,useState} from 'react';
import {projectById,media,cityById,regionById} from './data.js';
import {useQueryState} from './interactions.jsx';
import {X,ChevronLeft,ChevronRight} from './icons.jsx';
export default function CatalogProjectDialog(){
 const [id,setId]=useQueryState('project'),[photo,setPhoto]=useState(0);const ref=useRef(null),previous=useRef(null);const p=projectById[id];
 useEffect(()=>{if(!p)return;previous.current=document.activeElement;setPhoto(0);ref.current.showModal();const before=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{ref.current?.close();document.body.style.overflow=before;previous.current?.focus();};},[id]);
 const close=()=>setId('');
 return <dialog ref={ref} className="catalog-project-dialog" aria-labelledby="catalog-project-title" onCancel={e=>{e.preventDefault();close();}} onClick={e=>{if(e.target===ref.current)close();}}>{p&&<article><button className="catalog-project-close" aria-label="Закрыть проект" onClick={close}><X size={25}/></button>{p.images.length>0&&<figure><img src={media(p.images[photo])} alt={p.title}/>{p.images.length>1&&<div><button aria-label="Предыдущее изображение" onClick={()=>setPhoto((photo-1+p.images.length)%p.images.length)}><ChevronLeft/></button><span>{photo+1}/{p.images.length}</span><button aria-label="Следующее изображение" onClick={()=>setPhoto((photo+1)%p.images.length)}><ChevronRight/></button></div>}</figure>}<div className="catalog-project-copy"><small>{cityById[p.city]?.name||regionById[p.region]?.name}</small><h2 id="catalog-project-title">{p.title}</h2>{p.texts.map((t,i)=><p key={i}>{t}</p>)}<dl>{p.stats.map((s,i)=><div key={i}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}</dl></div></article>}</dialog>;
}
