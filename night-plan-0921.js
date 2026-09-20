/* Sep 21 updated evening itinerary; loaded immediately after data.js, before render(). */
(function(){
'use strict';
const day=(window.TRIP_DATA||[]).find(d=>d.date.includes('9/21'));
if(!day)return;
const morning=day.areas.find(a=>a.area==='行天宮周辺');
const goose=morning?.places.find(p=>p.name==='阿城鵝肉');
if(!goose)return;
morning.places=morning.places.filter(p=>p!==goose);
// The entire previous Ximen evening block is superseded by this new plan.
day.areas=day.areas.filter(a=>a.area!=='西門');
const night={area:'夜｜阿城鵝肉 → 杏福冰館',area_query:'阿城鵝肉 吉林總店 台北',places:[
 {...goose,zh_name:'阿城鵝肉 吉林總店',status:'マスト',category:'ガチョウ料理・煙燻鵝肉（ガチョウの燻製）　⏰18:00〜19:10 夕食の目安／吉林總店　⚠21:00閉店との掲載あり'},
 {name:'杏福氷館',zh_name:'杏福冰館',status:'マスト',category:'かき氷・雪花冰・杏仁豆腐　⏰19:40〜20:20 甘味の目安　⚠21:00閉店との掲載あり'}
]};
const hotelIndex=day.areas.findIndex(a=>a.area==='ホテル周辺（夜）');
day.areas.splice(hotelIndex<0?day.areas.length:hotelIndex,0,night);
// Preserve any ratings that may already have been entered against the former morning entry.
try{
 const key='taiwan-trip-reviews-v2',all=JSON.parse(localStorage.getItem(key)||'{}');
 const oldId=[day.date,'行天宮周辺','阿城鵝肉'].join('|');
 const newId=[day.date,night.area,'阿城鵝肉'].join('|');
 if(all[oldId]){const old=all[oldId],cur=all[newId]||{};
  all[newId]={...old,...cur,ratings:{...(old.ratings||{}),...(cur.ratings||{})},memo:cur.memo||old.memo||''};
  delete all[oldId];localStorage.setItem(key,JSON.stringify(all));
 }
}catch(e){console.warn('Review migration skipped:',e)}
const ICE_MAP='https://maps.app.goo.gl/1igYPHiukokMxbFQ7?g_st=al';
const GOOSE_ADDR='台北市中山區吉林路105號';
const ICE_ADDR='台北市中山區雙城街10巷35號';
const googleSearch=q=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q);
function setup(){
 const section=Array.from(document.querySelectorAll('#app .day')).find(s=>s.querySelector('h2')?.textContent.includes('9/21'));
 if(!section)return;
 const block=Array.from(section.querySelectorAll('.area')).find(a=>a.querySelector('.areahead h3')?.textContent===night.area);
 if(!block)return;
 const head=block.querySelector('.areahead');
 if(head){const directions=document.createElement('a');directions.className='areabtn';directions.href='https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(GOOSE_ADDR)+'&destination='+encodeURIComponent(ICE_ADDR)+'&travelmode=walking';directions.target='_blank';directions.rel='noopener noreferrer';directions.textContent='🚶 夕食→かき氷の経路';head.append(directions)}
 const hint=document.createElement('div');hint.className='meta';hint.style.cssText='font-size:13px;line-height:1.7;margin:8px 4px 12px;color:#374151';hint.textContent='18:00 夕食 → 19:10頃移動 → 19:40頃かき氷 → 20:30頃ホテルへ。時刻は目安です。混雑や当日の営業状況を優先してください。';head?.insertAdjacentElement('afterend',hint);
 for(const place of block.querySelectorAll('.place')){
  const el=place.querySelector('.name');const name=el?.firstChild?.textContent.trim();
  const link=place.querySelector('.mapbtn');
  if(name==='阿城鵝肉'&&link){link.href=googleSearch('阿城鵝肉 吉林總店 '+GOOSE_ADDR);link.target='_blank';link.rel='noopener noreferrer'}
  if(name==='杏福氷館'&&link){link.href=ICE_MAP;link.target='_blank';link.rel='noopener noreferrer'}
 }
 const schedule=section.querySelector('.schedule');
 if(schedule){const notice=document.createElement('div');notice.className='tip';notice.style.cssText='margin:7px 0;border:1px solid #fbbf24;color:#92400e;font-weight:700';notice.textContent='※ 行程表の画像は変更前のものです。9/21の18〜21時は下の「夜｜阿城鵝肉 → 杏福冰館」が最新予定です。';schedule.insertAdjacentElement('afterend',notice)}
 // Run after the existing taxi click handlers; only the taxi dialog receives these addresses.
 document.addEventListener('click',event=>{
  const button=event.target.closest?.('.taxibtn');if(!button||!block.contains(button))return;
  const name=button.closest('.place')?.querySelector('.name')?.firstChild?.textContent.trim();
  const addr=name==='阿城鵝肉'?GOOSE_ADDR:name==='杏福氷館'?ICE_ADDR:null;
  if(!addr)return;
  setTimeout(()=>{const box=document.getElementById('taxiAddress');if(box){box.style.display='block';box.textContent='地址：'+addr}
   const map=document.getElementById('taxiMap');if(map)map.href=name==='杏福氷館'?ICE_MAP:googleSearch('阿城鵝肉 吉林總店 '+addr);
  },0);
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();