/* Move the actual A-Zong Mian Xian visit to Sep 20, 14:00, before the old Ximen block is removed. */
(function(){
'use strict';
const days=window.TRIP_DATA||[];
const sep20=days.find(d=>d.date.startsWith('9/20'));
const sep21=days.find(d=>d.date.startsWith('9/21'));
if(!sep20||!sep21)return;
const shop='阿宗麵線';
const oldArea=sep21.areas.find(a=>a.area==='西門');
const place=oldArea?.places.find(p=>p.name===shop);
const newArea=sep20.areas.find(a=>a.area==='西門（天天利）');
if(!place||!newArea)return;
oldArea.places=oldArea.places.filter(p=>p!==place);
if(!newArea.places.some(p=>p.name===shop))newArea.places.unshift({...place,category:place.category+'　✓ 9/20 14:00訪問済み'});
try{
 const key='taiwan-trip-reviews-v2';
 const reviews=JSON.parse(localStorage.getItem(key)||'{}');
 const oldId=[sep21.date,oldArea.area,shop].join('|');
 const newId=[sep20.date,newArea.area,shop].join('|');
 const original=reviews[oldId]||{};
 const existing=reviews[newId]||{};
 reviews[newId]={...original,...existing,visited:true,ratings:{...(original.ratings||{}),...(existing.ratings||{})},memo:existing.memo||original.memo||''};
 if(oldId!==newId)delete reviews[oldId];
 localStorage.setItem(key,JSON.stringify(reviews));
}catch(e){console.warn('A-Zong review migration skipped:',e)}
try{
 const key='taiwan-trip-visited-v1';
 const visited=JSON.parse(localStorage.getItem(key)||'{}');
 visited[shop]=true;
 localStorage.setItem(key,JSON.stringify(visited));
}catch(e){console.warn('A-Zong visited state skipped:',e)}
})();
