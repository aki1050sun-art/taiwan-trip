/* Correct the actual visit to Qingguang doughnut shop without losing local ratings. */
(function(){
'use strict';
const days=window.TRIP_DATA||[];
const sep20=days.find(d=>d.date.startsWith('9/20'));
const sep21=days.find(d=>d.date.startsWith('9/21'));
if(!sep20||!sep21)return;
const shop='脆皮鮮奶甜甜圈 晴光總店';
const source=sep21.areas.find(a=>a.area==='晴光市場（ドーナツ）');
const donut=source?.places.find(p=>p.name===shop);
if(!donut)return;
source.places=source.places.filter(p=>p!==donut);
if(!source.places.length)sep21.areas=sep21.areas.filter(a=>a!==source);
const areaName='晴光市場（9/20 15:00 訪問済み）';
let target=sep20.areas.find(a=>a.area===areaName);
if(!target){
 target={area:areaName,area_query:'晴光市場 台北',places:[]};
 const nightMarket=sep20.areas.findIndex(a=>a.area==='寧夏夜市');
 sep20.areas.splice(nightMarket<0?sep20.areas.length:nightMarket,0,target);
}
target.places.push({...donut,category:donut.category+'　✓ 9/20 15:00訪問済み'});
try{
 const key='taiwan-trip-reviews-v2';
 const all=JSON.parse(localStorage.getItem(key)||'{}');
 const oldId=[sep21.date,source.area,shop].join('|');
 const newId=[sep20.date,areaName,shop].join('|');
 if(all[oldId]){
  const old=all[oldId],current=all[newId]||{};
  const merged={...old,...current,ratings:{...(old.ratings||{}),...(current.ratings||{})},memo:current.memo||old.memo||''};
  if(merged.memo==='9/20 14:30訪問')merged.memo='9/20 15:00訪問';
  all[newId]=merged;
  delete all[oldId];
  localStorage.setItem(key,JSON.stringify(all));
 }
}catch(e){console.warn('Doughnut review migration skipped:',e)}
})();
