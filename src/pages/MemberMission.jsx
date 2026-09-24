import {useState} from 'react';
import Icon from '../components/Icon.jsx';
import {media} from '../portal/data.js';
export default function MemberMission({city,items}){
 const [active,setActive]=useState(0);
 const visual=items.filter(p=>p.images.length).slice(0,4);
 const entry=visual[active];
 const paragraphs=city.about.flatMap(t=>t.split(/(?<=[.!?])\s+(?=[А-ЯЁ«])/)).slice(0,3);
 return <section className="mission-section" id="mission" aria-labelledby="mission-title"><div className="shell mission-layout"><div className="mission-copy"><span className="section-kicker">02 / Миссия города</span><h2 id="mission-title">{city.mission}</h2><div className="mission-principles">{paragraphs.map((p,i)=><article className="mission-principle" key={i}><div className="mission-emblem"><Icon name={['housing','economy','globe'][i]} size={32}/></div><div><p>{p}</p></div></article>)}</div></div><div className="mission-strategy"><div className="strategy-visual"><img src={media(entry?.images[0]||city.image)} alt={entry?.title||city.name} loading="lazy"/><span className="strategy-label"><Icon name="pin" size={18}/>{city.name}</span></div><div className="strategy-body"><div className="strategy-heading"><h3>Проекты развития</h3><span>{active+1} / {visual.length}</span></div><div className="strategy-tabs">{visual.map((p,i)=><button key={p.id} aria-label={p.title} aria-pressed={i===active} className={i===active?'is-active':''} onClick={()=>setActive(i)}><Icon name="housing" size={26}/><strong>{String(i+1).padStart(2,'0')}</strong></button>)}</div><p className="strategy-description" aria-live="polite">{entry?.title||city.mission}</p><a href="#projects">Проекты на карте <Icon name="arrow" size={20}/></a></div></div></div></section>;
}
