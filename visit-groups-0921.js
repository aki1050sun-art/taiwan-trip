/* 9/21 confirmed visits in chronological order, with unconfirmed and candidate places below.
 * Load after other 9/21 trip-data scripts and before rendering. Preserve existing
 * area/place identifiers (and thus family review keys) for all pre-existing places.
 */
(function () {
  'use strict';
  const day=(window.TRIP_DATA||[]).find(d=>d.date.startsWith('9/21'));
  if(!day||!Array.isArray(day.areas))return;
  const yongkang=day.areas.find(a=>a.area==='東門・永康街');
  if(yongkang&&!yongkang.places.some(p=>p.name==='永康街')){
    const after=yongkang.places.findIndex(p=>p.name==='天津蔥抓餅');
    yongkang.places.splice(after<0?yongkang.places.length:after+1,0,{
      name:'永康街',zh_name:'永康街',status:'マスト',
      category:'街歩き・散策　✓ 9/21 午前、天津蔥抓餅の後に散策'
    });
  }
  // The traveler identified this stop as 双連現烤蛋糕. Do not silently equate
  // it with 大川本舗 or invent a precise street address until shop identity is confirmed.
  const cakeAreaName='雙連｜現烤蛋糕（9/21 14:00頃訪問）';
  if(!day.areas.some(a=>a.places?.some(p=>p.name==='双連現烤蛋糕'))){
    day.areas.push({
      area:cakeAreaName,area_query:'雙連 現烤蛋糕 台北',places:[{
        name:'双連現烤蛋糕',zh_name:'雙連現烤蛋糕',status:'マスト',
        category:'台湾カステラ・焼き菓子　✓ 9/21 14:00頃訪問（正式店名・所在地は未確認）'
      }]
    });
  }
  const order=['良粟商號','fruitos 森果治','ㄇㄇ紫米飯糰','甜滿','天津蔥抓餅','永康街','雙月食品社 青島店','双連現烤蛋糕','COOKIE886'];
  const rank=new Map(order.map((name,i)=>[name,i]));
  const visited=[];const others=[];
  day.areas.forEach((area,index)=>{
    const actual=(area.places||[]).filter(p=>rank.has(p.name)).sort((a,b)=>rank.get(a.name)-rank.get(b.name));
    const remaining=(area.places||[]).filter(p=>!rank.has(p.name));
    if(actual.length)visited.push({area:{...area,places:actual},index,order:rank.get(actual[0].name)});
    if(remaining.length)others.push({area:{...area,places:remaining},index});
  });
  visited.sort((a,b)=>a.order-b.order||a.index-b.index);
  day.areas=[...visited.map(x=>x.area),...others.map(x=>x.area)];
  const visitedAreaCount=visited.length;
  try{
    const key='taiwan-trip-visited-v1';
    const current=JSON.parse(localStorage.getItem(key)||'{}');let changed=false;
    for(const name of order)if(current[name]!==true){current[name]=true;changed=true;}
    if(changed)localStorage.setItem(key,JSON.stringify(current));
  }catch(e){console.warn('9/21 visit flags could not be saved; visit order is still shown.',e);}
  function setup(){
    const section=[...document.querySelectorAll('#app .day')].find(el=>el.querySelector('h2')?.textContent.includes('9/21'));
    if(!section||document.getElementById('visitGroups0921'))return;
    const areaNodes=[...section.querySelectorAll(':scope > .area')];
    if(!areaNodes.length)return;
    const css=document.createElement('style');
    css.textContent='#visitGroups0921,.vg21-other{padding:10px 12px;margin:14px 0 7px;border-radius:11px;font-weight:850;font-size:15px}#visitGroups0921{background:#dcfce7;color:#166534;border:1px solid #86efac}.vg21-other{background:#fef3c7;color:#92400e;border:1px solid #fcd34d}';
    document.head.append(css);
    const visitedHeading=document.createElement('div');visitedHeading.id='visitGroups0921';
    visitedHeading.textContent='✓ 行ったお店・スポット｜訪問した順番（14:30まで）';
    areaNodes[0].insertAdjacentElement('beforebegin',visitedHeading);
    for(let i=0;i<visitedAreaCount&&i<areaNodes.length;i++){
      for(const card of areaNodes[i].querySelectorAll('.place')){
        const badge=card.querySelector('.name .badge');
        if(badge){badge.textContent='訪問済み';badge.classList.remove('cand');badge.classList.add('must');}
      }
    }
    if(areaNodes[visitedAreaCount]){
      const heading=document.createElement('div');heading.className='vg21-other';
      heading.textContent='その他のお店・スポット｜14:30以降の訪問実績は未確認・候補店もこちら';
      areaNodes[visitedAreaCount].insertAdjacentElement('beforebegin',heading);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
