/* September 19 actual itinerary and shop order. Keep original place/area names and review IDs. */
(function () {
  'use strict';
  const day=(window.TRIP_DATA||[]).find(d=>d.date.startsWith('9/19'));
  if(!day)return;
  const area=day.areas.find(a=>a.area==='ホテル周辺・雙城街');
  if(!area)return;
  const visitedNames=['阿富海鮮粥','鴻水餃牛肉麵'];
  const rank=new Map(visitedNames.map((name,index)=>[name,index]));
  area.places=area.places.map((place,index)=>({place,index})).sort((a,b)=>{
    const ar=rank.has(a.place.name)?rank.get(a.place.name):100+a.index;
    const br=rank.has(b.place.name)?rank.get(b.place.name):100+b.index;
    return ar-br;
  }).map(item=>item.place);
  for(const place of area.places){
    if(place.name==='阿富海鮮粥'&&!place.category.includes('9/19 23時過ぎ')){
      place.category+='　✓ 9/19 23時過ぎ：海鮮揚げをテイクアウト';
    }
    if(place.name==='鴻水餃牛肉麵'&&!place.category.includes('9/19 23時過ぎ')){
      place.category+='　✓ 9/19 23時過ぎ：ニラ餃子をテイクアウト';
    }
  }
  // These two visits are confirmed by the traveler. Do not change family review data.
  try{
    const key='taiwan-trip-visited-v1';
    const visited=JSON.parse(localStorage.getItem(key)||'{}');
    let changed=false;
    for(const name of visitedNames){if(visited[name]!==true){visited[name]=true;changed=true;}}
    if(changed)localStorage.setItem(key,JSON.stringify(visited));
  }catch(e){console.warn('9/19 visit flags could not be saved',e);}
  function setup(){
    const section=[...document.querySelectorAll('#app .day')].find(el=>el.querySelector('h2')?.textContent.includes('9/19'));
    if(!section||document.getElementById('route0919'))return;
    const heading=section.querySelector('h2');
    if(!heading)return;
    const style=document.createElement('style');
    style.textContent='#route0919{background:#eff6ff;border:1px solid #93c5fd;border-radius:14px;padding:13px;margin:10px 0 14px;color:#1e3a5f;line-height:1.55}#route0919 h3{margin:0 0 7px;font-size:17px}#route0919 .r19-row{display:flex;gap:10px;border-top:1px solid #bfdbfe;padding:9px 0}#route0919 .r19-time{flex:0 0 78px;font-size:12px;font-weight:800;color:#1d4ed8}#route0919 .r19-name{font-size:14px;font-weight:800}#route0919 .r19-note{font-size:12px;color:#475569}#route0919 .r19-link{display:inline-block;margin-top:4px;font-size:12px;background:white;border:1px solid #93c5fd;border-radius:8px;padding:4px 9px;color:#1d4ed8;text-decoration:none}#route0919 .r19-section{margin:13px 0 6px;padding:9px 10px;border-radius:9px;font-weight:800;font-size:14px}#route0919 .r19-section.visited{background:#ecfdf5;color:#047857}#route0919 .r19-section.unvisited{background:#fff3c9;color:#795d00}.r19-group-title{margin:14px 0 4px;padding:9px 10px;border-radius:10px;font-weight:850;font-size:14px}.r19-group-title.visited{background:#dcfce7;color:#166534}.r19-group-title.unvisited{background:#fef3c7;color:#92400e}';
    document.head.append(style);
    const box=document.createElement('section');box.id='route0919';box.setAttribute('aria-label','9月19日の実際の行程');
    const title=document.createElement('h3');title.textContent='🗓️ 9/19 実際の行程';box.append(title);
    const intro=document.createElement('div');intro.className='r19-note';intro.textContent='予定より30分遅れて桃園に到着。ホテルにチェックイン後、2店でテイクアウトして部屋飲み。';box.append(intro);
    const steps=[
      ['到着時','桃園空港に到着','予定時刻より30分遅れ。実際の到着時刻は未登録。',null],
      ['到着後','ホテルへ移動・チェックイン','ホテルに荷物を置いて外出。',null],
      ['23:00過ぎ','阿富海鮮粥','海鮮揚げをテイクアウト。','阿富海鮮粥'],
      ['その後','鴻水餃牛肉麵','ニラ餃子をテイクアウト。','鴻水餃牛肉麵'],
      ['買い物後','ホテルに戻り部屋飲み','持ち帰った料理で部屋飲み。',null]
    ];
    for(const [time,name,note,placeName] of steps){
      const row=document.createElement('div');row.className='r19-row';
      const clock=document.createElement('span');clock.className='r19-time';clock.textContent=time;
      const info=document.createElement('div');const n=document.createElement('div');n.className='r19-name';n.textContent=name;
      const d=document.createElement('div');d.className='r19-note';d.textContent=note;info.append(n,d);
      if(placeName){const link=document.createElement('a');link.className='r19-link';link.href='#';link.textContent='お店のボタンへ ↓';link.addEventListener('click',event=>{event.preventDefault();const target=[...section.querySelectorAll('.place')].find(p=>p.querySelector('.name')?.firstChild?.textContent.trim()===placeName);target?.scrollIntoView({behavior:'smooth',block:'center'});});info.append(link);}
      row.append(clock,info);box.append(row);
    }
    heading.insertAdjacentElement('afterend',box);
    const shopArea=[...section.querySelectorAll('.area')].find(el=>el.querySelector('.areahead h3')?.textContent.trim()==='ホテル周辺・雙城街');
    if(!shopArea)return;
    const cards=[...shopArea.querySelectorAll(':scope > .place')];
    const visitedCards=visitedNames.map(name=>cards.find(p=>p.querySelector('.name')?.firstChild?.textContent.trim()===name)).filter(Boolean);
    const others=cards.filter(card=>!visitedCards.includes(card));
    const groupHeading=(text,kind)=>{const div=document.createElement('div');div.className='r19-group-title '+kind;div.textContent=text;return div;};
    if(visitedCards.length){const mark=groupHeading('✓ 行ったお店｜訪問順','visited');shopArea.insertBefore(mark,visitedCards[0]);for(const card of visitedCards){shopArea.appendChild(card);const badge=card.querySelector('.name .badge');if(badge){badge.textContent='訪問済み';badge.classList.remove('cand');badge.classList.add('must');}}shopArea.insertBefore(mark,visitedCards[0]);}
    if(others.length){const mark=groupHeading('候補・行っていないお店','unvisited');shopArea.appendChild(mark);for(const card of others)shopArea.appendChild(card);}
    const schedule=section.querySelector('.schedule');if(schedule){const note=document.createElement('p');note.className='r19-note';note.style.padding='0 12px 9px';note.textContent='※ 行程表画像は以前の案です。上の「実際の行程」が最新版です。';schedule.append(note);}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
