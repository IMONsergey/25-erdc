import {useState,useEffect} from 'react';
import {ArrowUpRight,ArrowDown,ArrowLeft,ArrowRight,Search,X} from '../portal/icons.jsx';
import {regions,cities,projects,news,regionById,cityById,regionPath,cityPath,projectHref,media,dateText,normalize,regionMood} from '../portal/data.js';
import {siteHref} from '../site.js';
import {asset} from '../data.js';
import {parentTerritory,territoryName} from '../content/territory-model.js';
import {NewsLink} from '../portal/NewsModal.jsx';
import {useQueryState} from '../portal/interactions.jsx';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
const pad=n=>String(n).padStart(2,'0');
const Picture=({src,alt='',eager=false,...props})=><img src={media(src)} alt={alt} loading={eager?'eager':'lazy'} fetchPriority={eager?'high':undefined} decoding="async" {...props}/>;
const Link=({href,children,light=false})=><a className={`h-link ${light?'h-link-light':''}`} href={href}><span>{children}</span><ArrowUpRight size={22}/></a>;
const Label=({number,children})=><div className="h-label"><span>{number}</span><span>{children}</span></div>;
function Heading({number,label,title,href,link}){return <div className="h-heading"><div><Label number={number}>{label}</Label><h2>{title}</h2></div>{href&&<Link href={href}>{link}</Link>}</div>;}

export function HorizonMotion(){
 useEffect(()=>{
  const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)',()=>{
   if(document.querySelector('.h-hero')) {
   gsap.fromTo('.h-hero-title > span',{y:55,opacity:0},{y:0,opacity:1,duration:1.25,stagger:.12,ease:'power3.out'});
   gsap.to('.h-hero-photo img',{yPercent:9,ease:'none',scrollTrigger:{trigger:'.h-hero',start:'top top',end:'bottom top',scrub:true}});
   }
   gsap.utils.toArray('.v3-site [data-h-reveal]').forEach(el=>gsap.fromTo(el,{y:30,opacity:0},{y:0,opacity:1,duration:.9,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 94%',once:true}}));
   gsap.utils.toArray('.v3-site .h-horizon').forEach(el=>gsap.fromTo(el,{scaleX:.15},{scaleX:1,duration:1.3,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 94%',once:true}}));
  });return()=>mm.revert();
 },[]);return null;
}

function Hero(){return <section className="h-hero" aria-labelledby="home-title">
 <div className="h-hero-photo"><Picture src="home-hero.webp" eager/><div/></div>
 <div className="h-shell h-hero-content"><div className="h-hero-overline"><span>25 городов · 11 регионов</span><span>Стратегические мастер-планы</span></div>
 <h1 className="h-hero-title" id="home-title"><span>Дальний Восток.</span><span>Новый горизонт.</span></h1>
 <div className="h-hero-rule"><span>От Байкала</span><i className="h-horizon"/><span>до Тихого океана</span></div>
 <div className="h-hero-bottom"><a className="h-scroll" href="#vision"><ArrowDown size={24}/><span>О проекте</span></a><p>Города, в которых хочется жить.<br/>Будущее, которое создаём вместе.</p><Link href="#geography" light>Открыть свой регион</Link></div>
 </div>
 </section>;}

function Vision(){return <section className="h-vision h-shell" id="vision">
 <Label number="01">Масштаб перемен</Label>
 <div className="h-vision-main" data-h-reveal><div className="h-big-number">25<span>городов</span></div><div><h2>Новый облик городов.<br/><em>Новые возможности<br/>для людей.</em></h2><p>Мастер-планы связывают жильё, работу, образование и отдых в одну продуманную городскую среду.</p><Link href={siteHref('about')}>Как устроен проект</Link></div></div>
 <dl className="h-facts"><div><dt>Регионов Дальнего Востока</dt><dd>11</dd></div><div><dt>Жителей в центре преобразований</dt><dd>4<span>млн+</span></dd></div><div><dt>Проектов в каталоге</dt><dd>{projects.length}</dd></div></dl>
 </section>;}

export function HorizonExplorer({items=regions}){
 const[active,setActive]=useState(items[0]?.id);const r=items.find(x=>x.id===active)||items[0];
 if(!r)return <p className="h-empty">Ничего не найдено. Попробуйте другой запрос.</p>;
 return <div className="h-explorer e-region-explorer">
 <div className="h-region-list" role="group" aria-label="Выбрать регион">{items.map(item=><a key={item.id} href={siteHref(regionPath(item))} onMouseEnter={()=>setActive(item.id)} onFocus={()=>setActive(item.id)} data-active={r.id===item.id}><span>{pad(item.index)}</span><strong>{item.name}</strong><ArrowUpRight size={22}/></a>)}</div>
 <div className="h-region-stage"><Picture key={r.id} src={r.image} alt={r.name}/><div className="h-region-shade"/><div className="h-region-stage-top"><span>{regionMood[r.id]}</span><span>{pad(r.index)} / 11</span></div><div className="h-region-stage-copy" aria-live="polite"><h3>{r.name}</h3><p>{r.cities.filter(id=>parentTerritory(id)===id).map(id=>cityById[id]?.name).join(' · ')}</p><Link href={siteHref(regionPath(r))} light>Открыть регион</Link></div></div>
 </div>;
}

function Feature(){
 const picks=['vladivostok','ulan-ude','petropavlovsk-kamchatsky'].map(id=>projects.find(p=>p.city===id&&p.hasSourceImages)).filter(Boolean);
 const[index,setIndex]=useState(0);const p=picks[index];if(!p)return null;
 return <section className="h-feature h-shell" id="projects"><Heading number="03" label="От замысла к городу" title={<>Будущее обретает<br/><em>очертания.</em></>} href={siteHref('projects')} link="Все проекты"/>
 <div className="h-feature-stage"><a className="h-feature-image" href={projectHref(p)} aria-label={p.title}><Picture key={p.id} src={p.images[0]} alt={p.title}/><span>{cityById[p.city]?.name}<ArrowUpRight size={26}/></span></a><div className="h-feature-copy"><div aria-live="polite"><Label number={pad(index+1)}>Мастер-план</Label><h3>{p.title}</h3>{p.stats.length>0&&<dl>{p.stats.slice(0,2).map((s,i)=><div key={i}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}</dl>}<Link href={projectHref(p)}>О проекте</Link></div><div className="h-controls"><span>{pad(index+1)} <i>/ {pad(picks.length)}</i></span><div><button onClick={()=>setIndex((index-1+picks.length)%picks.length)} aria-label="Предыдущий проект"><ArrowLeft size={24}/></button><button onClick={()=>setIndex((index+1)%picks.length)} aria-label="Следующий проект"><ArrowRight size={24}/></button></div></div></div></div>
 <a className="h-map-cta" href={siteHref('map')}><span>Все перемены —<br/>на одной карте.</span><span className="h-map-arrow"><ArrowUpRight size={56} strokeWidth={1}/></span></a>
 </section>;
}

const life=[{word:'Жить',image:'housing',title:'Дом — это больше, чем квартира.',text:'Новые кварталы, благоустроенные дворы и всё необходимое рядом.',href:siteHref('dvkvartal'),link:'Дальневосточный квартал'}, {word:'Учиться',image:'school',title:'Большие возможности с первых шагов.',text:'Школы, детские сады и образовательные пространства для нового поколения.',href:siteHref('projects','?q=школ'),link:'Проекты образования'}, {word:'Отдыхать',image:'waterfront',title:'Больше места для простых радостей.',text:'Набережные, парки и прогулочные маршруты. Места для встреч и времени с близкими.',href:siteHref('projects','?q=набережн'),link:'Проекты набережных'}];
function Life(){const[index,setIndex]=useState(0);const item=life[index];return <section className="h-life" id="everyday"><div className="h-shell"><Label number="04">Город для жизни</Label><div className="h-life-tabs" role="group" aria-label="Жизнь в городе">{life.map((s,i)=><button key={s.word} aria-pressed={index===i} onClick={()=>setIndex(i)}>{s.word}<span>0{i+1}</span></button>)}</div><div className="h-life-stage"><div className="h-life-photo"><Picture key={item.image} src={`editorial/visual-${item.image}.webp`} alt={item.title}/><span>Образ городской среды</span></div><div className="h-life-copy" aria-live="polite"><h2>{item.title}</h2><p>{item.text}</p><Link href={item.href} light>{item.link}</Link></div></div></div></section>;}

export function HorizonHome(){return <div className="h-home"><Hero/><Vision/><section className="h-geography" id="geography"><div className="h-shell"><Heading number="02" label="География развития" title={<>Один Дальний Восток.<br/><em>11 характеров.</em></>} href={siteHref('regions')} link="Регионы и города"/><HorizonExplorer/></div></section><Feature/><Life/><section className="h-news h-shell" id="news"><Heading number="05" label="События" title={<>Перемены.<br/><em>День за днём.</em></>} href={siteHref('news')} link="Все новости"/><div className="h-news-grid">{news.slice(0,3).map(n=><NewsLink key={n.id} post={n} className="h-news-card"><div><Picture src={n.image}/><ArrowUpRight size={26}/></div><time dateTime={n.date}>{dateText(n.date)}</time><h3>{n.title}</h3></NewsLink>)}</div></section></div>;}

export function HorizonDirectory(){
 const[q,setQ]=useQueryState('q');const[view,setView]=useQueryState('view','regions');const cityView=view==='cities';
 const regionMatches=regions.filter(r=>normalize(r.name+' '+r.cities.map(id=>cityById[id].name).join(' ')).includes(normalize(q)));
 const cityMatches=cities.filter(c=>parentTerritory(c.id)===c.id).filter(c=>normalize(territoryName(c)+' '+regionById[c.region]?.name+' '+cities.filter(m=>parentTerritory(m.id)===c.id).map(m=>m.name).join(' ')).includes(normalize(q)));
 const href=c=>{const member=q.trim()?cities.find(m=>parentTerritory(m.id)===c.id&&normalize(m.name).includes(normalize(q))):null;return siteHref(cityPath(c),member&&member.id!==c.id?`?city=${member.id}#regions`:'');};
 return <div className="h-directory h-shell"><div className="h-directory-heading"><Label number="11">Регионов Дальнего Востока</Label><h1>География<br/><em>нового горизонта.</em></h1><p>От Байкала до Тихого океана.<br/>У каждого региона — свой путь развития.</p></div><div className="h-directory-tools"><div role="group" aria-label="Показать территории"><button aria-pressed={!cityView} onClick={()=>setView('regions')}>Регионы <sup>11</sup></button><button aria-pressed={cityView} onClick={()=>setView('cities')}>Города и агломерации <sup>{cities.filter(c=>parentTerritory(c.id)===c.id).length}</sup></button></div><label className="h-search"><Search size={22}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Регион или город" aria-label="Найти регион или город"/>{q&&<button onClick={()=>setQ('')} aria-label="Очистить поиск"><X size={20}/></button>}</label></div><div className="h-result-count" aria-live="polite">{cityView?'Территорий':'Регионов'}: {cityView?cityMatches.length:regionMatches.length}</div>{cityView?<div className="h-city-grid">{cityMatches.map((c,i)=><a key={c.id} href={href(c)}><div><Picture src={c.image} alt={c.name}/><span>{pad(i+1)}<ArrowUpRight size={24}/></span></div><small>{regionById[c.region].name}</small><h2>{territoryName(c)}</h2></a>)}</div>:<HorizonExplorer items={regionMatches}/>} {cityView&&!cityMatches.length&&<p className="h-empty">Ничего не найдено. Попробуйте другой запрос.</p>}</div>;
}

export function HorizonFooter(){return <footer className="h-footer"><div className="h-shell"><div className="h-footer-top"><Label number="25">Городов Дальнего Востока</Label><a href={siteHref('regions')}>Горизонт<br/><span>начинается здесь.</span><ArrowUpRight strokeWidth={1}/></a></div><div className="h-horizon"/><div className="h-footer-body"><div><a href={siteHref()}><img src={asset('logo-25-cities.svg')} alt="25 городов" width="150" height="36"/></a><p>Новый облик<br/>Дальнего Востока</p><a href="tel:88007075558">8 (800) 707-55-58</a></div><nav aria-label="Разделы в подвале">{[['about','О проекте'],['regions','Регионы'],['projects','Проекты'],['dvkvartal','ДВ Квартал'],['news','Новости'],['map','Карта проектов']].map(([p,n])=><a key={p} href={siteHref(p)}>{n}</a>)}</nav><nav className="h-footer-regions" aria-label="Регионы в подвале">{regions.map(r=><a key={r.id} href={siteHref(regionPath(r))}>{r.name}</a>)}</nav></div><div className="h-footer-bottom"><span>Корпорация развития Дальнего Востока и Арктики · 2026</span><a href={siteHref('sitemap')}>Карта сайта</a><a href="#top">Наверх ↑</a></div></div></footer>;}
