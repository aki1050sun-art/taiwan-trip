/* Export locally saved family ratings for transfer to the existing Google Sheet.
 * No external upload and no changes to the existing rating controls.
 */
(function(){
'use strict';
const KEY='taiwan-trip-reviews-v2';
const PEOPLE=['パパ','ママ','さき','まゆ'];
function exportReviews(){
 let saved;
 try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){alert('評価データを読み取れませんでした。');return}
 if(!saved||typeof saved!=='object'||Array.isArray(saved)){alert('評価データの形式を確認できません。');return}
 const info=new Map();
 (window.TRIP_DATA||[]).forEach(day=>(day.areas||[]).forEach(area=>(area.places||[]).forEach(p=>{
   const id=[day.date,area.area,p.name].join('|');
   info.set(id,{visit_date:day.date,shop_name:p.name,area:area.area,category:p.category||'',map_query:p.name+' 台北'});
 })));
 const records=[];
 for(const [id,r] of Object.entries(saved)){
   if(!r||typeof r!=='object')continue;
   const ratings={};
   for(const person of PEOPLE){const value=r.ratings?.[person];if(['again','good','skip'].includes(value))ratings[person]=value;}
   const memo=typeof r.memo==='string'?r.memo:'';
   if(!Object.keys(ratings).length&&!memo.trim())continue;
   const parts=id.split('|');
   records.push({review_id:id,...(info.get(id)||{visit_date:parts[0]||'',area:parts[1]||'',shop_name:parts.slice(2).join('|'),category:'',map_query:parts.slice(2).join('|')+' 台北'}),ratings,memo});
 }
 if(!records.length){alert('このスマホには転記できる評価やメモがまだありません。評価を入力したスマホで操作してください。');return}
 const payload={format:'taiwan-trip-local-reviews-v1',exported_at:new Date().toISOString(),records};
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});
 const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='台湾旅行_みんなの評価_'+new Date().toISOString().slice(0,10)+'.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
 alert('評価データを保存しました。保存されたJSONファイルをChatGPTのこのチャットに添付してください。');
}
function setup(){if(document.getElementById('review-export-panel'))return;
 const app=document.getElementById('app');if(!app)return;
 const panel=document.createElement('div');panel.id='review-export-panel';panel.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;background:#fff7ed;border:1px solid #fdba74;border-radius:12px;padding:12px;margin:10px 0';
 const text=document.createElement('div');text.style.cssText='font-size:13px;line-height:1.55;color:#7c2d12';text.textContent='📋 評価をGoogleスプレッドシートへ転記するためのデータを保存（このスマホで入力した評価・メモのみ）';
 const button=document.createElement('button');button.type='button';button.textContent='評価データを保存';button.style.cssText='background:#c2410c;color:white;border:0;border-radius:9px;padding:11px 14px;font-size:14px;font-weight:800;font-family:inherit;cursor:pointer';button.addEventListener('click',exportReviews);
 panel.append(text,button);
 // Weather is moved to the bottom of #app by weather-layout-and-umbrella.js.
 // Keep the export control immediately after the full weather section, not near the header.
 const weather=document.getElementById('tw-weather');
 if(weather && weather.parentElement===app)weather.insertAdjacentElement('afterend',panel);
 else app.appendChild(panel);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();