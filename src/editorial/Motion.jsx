import {useEffect} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export default function EditorialMotion(){
 useEffect(()=>{
  const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)',()=>{
   gsap.utils.toArray('.ed-site [data-reveal]').forEach(el=>gsap.fromTo(el,{y:28,opacity:0},{y:0,opacity:1,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 94%',once:true}}));
   gsap.utils.toArray('.ed-site [data-parallax]').forEach(el=>gsap.fromTo(el,{yPercent:-4},{yPercent:4,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:1}}));
   ScrollTrigger.refresh();
  });
  return()=>mm.revert();
 },[]);
 return null;
}
