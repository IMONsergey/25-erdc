import {useEffect, useState} from 'react';
import {ArrowUpRight, ArrowDown, MapPin, Building2, School, Trees} from '../portal/icons.jsx';
import {regionById, regionPath, media, projects} from '../portal/data.js';
import {siteHref} from '../site.js';

const scenes = [
  {id:'primkrai', name:'Приморье', image:'home-hero.webp', line:'Город встречается с океаном', caption:'Русский мост · Владивосток', position:'58% 56%'},
  {id:'kamchatka', name:'Камчатка', image:regionById.kamchatka.image, line:'Большая жизнь у подножия вулканов', caption:'Петропавловск-Камчатский', position:'50% 50%'},
  {id:'sakhalin', name:'Сахалин', image:regionById.sakhalin.image, line:'Острова больших возможностей', caption:'Мыс Анива · Сахалин', position:'60% 50%'},
];

export function PanoramicHero(){
  const [selected,setSelected]=useState(0);
  const scene=scenes[selected];
  return <section className="s-hero" aria-labelledby="home-title">
    <div className="s-hero-visual" aria-hidden="true">
      {scenes.map((s,i)=><img key={s.id} src={media(s.image)} alt="" className={i===selected?'is-active':''} style={{objectPosition:s.position}} fetchPriority={i===0?'high':'low'} loading={i===0?'eager':'lazy'} decoding="async"/>)}
    </div>
    <div className="s-hero-wash"/>
    <div className="s-hero-body e-shell">
      <div className="s-hero-kicker"><span><i/>Стратегические мастер-планы</span><span>От Байкала до Тихого океана</span></div>
      <div className="s-hero-grid">
        <div className="s-hero-copy"><h1 id="home-title"><span>Новый облик</span><span>Дальнего Востока.</span></h1><p>Города, в которых хочется жить.<br/>Будущее, которое создаём вместе.</p><a className="s-white-link" href="#regions">Откройте свой город<ArrowUpRight size={22}/></a></div>
        <a className="s-hero-orbit" href={siteHref('regions')} aria-label="25 городов: открыть регионы и мастер-планы"><span className="s-orbit-ring"/><strong>25</strong><span>городов.<br/>Один большой<br/>шаг вперёд.</span><ArrowUpRight size={30}/></a>
      </div>
      <div className="s-hero-bottom">
        <div className="s-hero-location" aria-live="polite"><span><MapPin size={15}/>{scene.caption}</span><p key={scene.id}>{scene.line}</p><a href={siteHref(regionPath(regionById[scene.id]))}>Изучить регион<ArrowUpRight size={16}/></a></div>
        <div className="s-scene-tabs" role="group" aria-label="Панорамы Дальнего Востока">{scenes.map((s,i)=><button key={s.id} aria-pressed={selected===i} onClick={()=>setSelected(i)}><img src={media(s.image)} alt="" loading="lazy"/><span><small>0{i+1}</small>{s.name}</span><ArrowUpRight size={18}/></button>)}</div>
      </div>
    </div>
    <a className="s-hero-scroll" href="#about" aria-label="О проекте ниже"><ArrowDown size={16}/></a>
  </section>;
}

const chapters=[['regions','География'],['projects','Проекты'],['everyday','Город для жизни'],['news','События']];
export function ChapterNav(){
  const [active,setActive]=useState('');
  useEffect(()=>{
    let frame=0;
    const update=()=>{
      frame=0;
      const marker=window.innerWidth<=760?190:220;
      let current='';
      chapters.forEach(([id])=>{const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<=marker)current=id;});
      setActive(current);
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule);
    update();
    return()=>{window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);cancelAnimationFrame(frame);};
  },[]);
  return <nav className="s-chapters" aria-label="Разделы главной страницы"><div className="e-shell"><span className="s-chapter-brand">Дальний Восток / ближе</span>{chapters.map(([id,title],i)=><a key={id} href={`#${id}`} aria-current={active===id?'location':undefined}><small>0{i+1}</small>{title}<ArrowUpRight size={14}/></a>)}</div></nav>;
}

export function HomeImpact(){
  return <section className="s-impact e-shell" id="about">
    <div className="s-impact-heading" data-reveal><span className="e-label">Масштаб перемен</span><h2>Не просто строить.<br/><em>Менять жизнь.</em></h2><p>Мастер-планы связывают жильё, работу, образование и отдых в одну продуманную городскую среду.</p><a className="e-link" href={siteHref('about')}>Как устроен проект<ArrowUpRight size={20}/></a></div>
    <div className="s-impact-stats"><div className="s-stat s-stat-main"><span className="s-stat-symbol" aria-hidden="true"><span/><span/><span/><span/></span><strong>4<small>млн+</small></strong><p>жителей —<br/>в центре преобразований</p></div><a className="s-stat" href={siteHref('regions')}><small>От Байкала до Тихого океана</small><strong>11</strong><span>регионов<ArrowUpRight size={22}/></span></a><a className="s-stat" href={siteHref('projects')}><small>От идеи до нового города</small><strong>{projects.length}</strong><span>проектов в каталоге<ArrowUpRight size={22}/></span></a></div>
  </section>;
}

const everyday=[
  {id:'housing',name:'Жить',icon:Building2,image:'housing',title:'Дом — это больше, чем квартира.',text:'Новые кварталы, благоустроенные дворы и всё необходимое рядом. Городская среда начинается за порогом дома.',href:siteHref('dvkvartal'),link:'Дальневосточный квартал'},
  {id:'school',name:'Учиться',icon:School,image:'school',title:'Большие возможности с первых шагов.',text:'Школы, детские сады и образовательные пространства. Места, где можно открывать новое и выбирать своё будущее.',href:siteHref('projects','?q=школ'),link:'Проекты образования'},
  {id:'waterfront',name:'Отдыхать',icon:Trees,image:'waterfront',title:'Больше места для простых радостей.',text:'Набережные, парки и прогулочные маршруты. Места для встреч, спорта и времени с близкими.',href:siteHref('projects','?q=набережн'),link:'Проекты набережных'},
];
export function EverydayCity(){
  const [selected,setSelected]=useState(0);const item=everyday[selected];
  return <section className="s-everyday" id="everyday"><div className="e-shell">
    <div className="s-everyday-heading" data-reveal><span className="e-label">03 / Город для жизни</span><h2>Большие перемены.<br/><em>В привычных вещах.</em></h2></div>
    <div className="s-everyday-stage"><div className="s-everyday-photo"><img key={item.image} src={media(`editorial/visual-${item.image}.webp`)} alt={item.title} loading="lazy" decoding="async"/><span className="editorial-illustration">Иллюстрация</span><span className="s-everyday-word" aria-hidden="true">{item.name}</span></div>
      <div className="s-everyday-panel"><div className="s-everyday-tabs" role="group" aria-label="Жизнь в городе">{everyday.map((topic,i)=>{const Icon=topic.icon;return <button key={topic.id} aria-pressed={i===selected} onClick={()=>setSelected(i)}><Icon size={22}/>{topic.name}</button>;})}</div><div className="s-everyday-copy" aria-live="polite" key={item.id}><span className="s-micro">Город рядом с вами / 0{selected+1}</span><h3>{item.title}</h3><p>{item.text}</p><a className="s-white-link" href={item.href}>{item.link}<ArrowUpRight size={20}/></a></div><div className="s-everyday-note"><span>В центре — человек</span><span>25 городов</span></div></div>
    </div>
  </div></section>;
}
