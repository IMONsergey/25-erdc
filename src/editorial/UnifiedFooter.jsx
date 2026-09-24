import {asset} from '../data.js';
import {siteHref} from '../site.js';
import {regions,regionPath} from '../portal/data.js';
import {ArrowUpRight} from '../portal/icons.jsx';
import './footer.css';
export default function UnifiedFooter(){
 return <footer className="ed-footer" data-unified-footer="v2">
  <div className="e-shell">
   <div className="ed-footer-invitation"><span className="e-label">25 городов / Дальний Восток</span><a href={siteHref('regions')}>Будущее<br/><span>вашего города.</span><span className="ed-footer-arrow"><ArrowUpRight size={64} strokeWidth={1}/></span></a></div>
   <div className="ed-footer-grid"><div className="ed-footer-brand"><a href={siteHref()} aria-label="25 городов — главная"><img src={asset('logo-25-cities.svg')} alt="25 городов" width="150" height="36"/></a><p>Мастер-планы развития городов<br/>Дальнего Востока</p><a href="tel:88007075558">8 (800) 707-55-58</a></div>
   <nav aria-label="Разделы в подвале"><h2>Проект</h2>{[['about','О проекте'],['regions','Регионы'],['projects','Все проекты'],['dvkvartal','ДВ Квартал'],['news','Новости'],['map','Карта проектов']].map(([p,n])=><a key={p} href={siteHref(p)}>{n}</a>)}</nav>
   <nav className="ed-footer-regions" aria-label="Регионы в подвале"><h2>География</h2>{regions.map(r=><a key={r.id} href={siteHref(regionPath(r))}>{r.name}</a>)}</nav></div>
   <div className="ed-footer-bottom"><span>Корпорация развития Дальнего Востока и Арктики · 2026</span><a href={siteHref('sitemap')}>Карта сайта</a><a href="#top" aria-label="Наверх">Наверх<ArrowUpRight size={18}/></a></div>
  </div>
 </footer>;
}
