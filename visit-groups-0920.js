/* Sep 20: actual visits first in chronological order, followed by unvisited candidates.
 * Preserve original area/place identifiers and all family review records.
 * Load after route-0920.js and before the original launcher renders.
 */
(function(){
 'use strict';
 const day=(window.TRIP_DATA||[]).find(d=>d.date.startsWith('9/20'));
 if(!day||!Array.isArray(day.areas))return;
 const visitedOrder=[
  '阜杭豆漿','龍山寺','剝皮寮歷史街區','古北饕 Goodbeitao','天天利美食坊','阿宗麵線',
  '脆皮鮮奶甜甜圈 晴光總店','迪化街','Jade Boat 191 澎玉191',
  '妙口四神湯 肉包','北門蝦仁飯・煲湯','豆花荘','寧夏夜市',
  '方家雞肉飯','寧夏夜市の焼きエリンギ（烤杏鮑菇）','晴光市場',
  '晴美公寓酒店（Jolley Hotel）'
 ];
 const rank=new Map(visitedOrder.map((name,i)=>[name,i]));
 const visitedAreas=[];const candidateAreas=[];
 day.areas.forEach((area,index)=>{
  const found=(area.places||[]).filter(p=>rank.has(p.name)).sort((a,b)=>rank.get(a.name)-rank.get(b.name));
  const other=(area.places||[]).filter(p=>!rank.has(p.name));
  if(found.length)visitedAreas.push({area:{...area,places:found},index,order:rank.get(found[0].name)});
  if(other.length)candidateAreas.push({area:{...area,places:other},index});
 });
 visitedAreas.sort((a,b)=>a.order-b.order||a.index-b.index);
 day.areas=[...visitedAreas.map(x=>x.area),...candidateAreas.map(x=>x.area)];
 const visitedCount=visitedAreas.length;
 try{
  const key='taiwan-trip-visited-v1';const flags=JSON.parse(localStorage.getItem(key)||'{}');let changed=false;
  for(const name of visitedOrder){if(flags[name]!==true){flags[name]=true;changed=true;}}
  if(changed)localStorage.setItem(key,JSON.stringify(flags));
 }catch(e){console.warn('Sep 20 visited flags not saved; cards remain in their confirmed order.',e);}
 function setup(){
  const section=[...document.querySelectorAll('#app .day')].find(el=>el.querySelector('h2')?.textContent.includes('9/20'));
  if(!section||document.getElementById('visitGroups0920'))return;
  const areas=[...section.querySelectorAll(':scope > .area')];
  if(!areas.length)return;
  const style=document.createElement('style');
  style.textContent='#visitGroups0920,.vg20-candidates{padding:10px 12px;margin:14px 0 7px;border-radius:11px;font-weight:850;font-size:15px}#visitGroups0920{background:#dcfce7;color:#166534;border:1px solid #86efac}.vg20-candidates{background:#fef3c7;color:#92400e;border:1px solid #fcd34d}';
  document.head.append(style);
  const heading=document.createElement('div');heading.id='visitGroups0920';heading.textContent='✓ 行ったお店・スポット｜訪問した順番';
  areas[0].insertAdjacentElement('beforebegin',heading);
  for(let i=0;i<visitedCount&&i<areas.length;i++){
   for(const card of areas[i].querySelectorAll('.place')){
    const badge=card.querySelector('.name .badge');
    if(badge){badge.textContent='訪問済み';badge.classList.remove('cand');badge.classList.add('must');}
   }
  }
  if(areas[visitedCount]){
   const optional=document.createElement('div');optional.className='vg20-candidates';
   optional.textContent='候補・行っていないお店｜以下にまとめて表示';
   areas[visitedCount].insertAdjacentElement('beforebegin',optional);
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
