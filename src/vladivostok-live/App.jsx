import {useEffect,useState} from 'react';
import Header from './Header.jsx';
import Hero from '../vladivostok-20260922/components/Hero.jsx';
import Regions from '../vladivostok-20260922/components/Regions.jsx';
import Mission from '../components/Mission.jsx';
import Projects from './Projects.jsx';
import Motion from '../vladivostok-20260922/components/Motion.jsx';
import Icon from '../vladivostok-20260922/components/Icon.jsx';
import {asset} from '../vladivostok-20260922/data.js';
import {cityById,projectById} from '../portal/data.js';
import {siteHref} from '../site.js';
import PromoAtlas from '../pages/PromoAtlas.jsx';
import MemberMission from '../pages/MemberMission.jsx';
const valid=['vladivostok','artem','bolshoy-kamen'];
const read=()=>{const id=new URLSearchParams(location.search).get('city');return valid.includes(id)?id:'vladivostok';};
export default function App(){
 const [selected,setSelected]=useState(read);
 const city={...cityById[selected],name:selected==='artem'?'Артём':cityById[selected].name};
 const items=city.projects.map(id=>projectById[id]);
 const select=id=>{setSelected(id);const u=new URL(location.href);id==='vladivostok'?u.searchParams.delete('city'):u.searchParams.set('city',id);u.searchParams.delete('project');history.replaceState(history.state,'',u);};
 useEffect(()=>{const sync=()=>setSelected(read());window.addEventListener('popstate',sync);return()=>window.removeEventListener('popstate',sync);},[]);
 return <><a className="skip-link" href="#content">Перейти к содержанию</a><div id="top"/><Header/><main id="content"><div className="ocean-zone"><Hero/><Regions selectedCity={selected} onSelectCity={select}/></div>{selected==='vladivostok'?<><Mission/><Projects/></>:<><MemberMission key={`mission-${selected}`} city={city} items={items}/><PromoAtlas key={`atlas-${selected}`} city={city} items={items}/></>}</main><footer className="site-footer"><div className="shell footer-top"><a href={siteHref()}><img src={asset('logo-25-cities.svg')} alt="25 городов" width="130" height="32"/></a><p>Новый облик городов<br/>Дальнего Востока</p><a href={siteHref('primorye')}>Все мастер-планы Приморья<Icon name="arrow" size={24}/></a></div><div className="shell footer-bottom"><span>Корпорация развития Дальнего Востока и Арктики · 2026</span><a href="tel:88007075558">8 (800) 707-55-58</a></div></footer><Motion/></>;
}
