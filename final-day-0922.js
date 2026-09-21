/* 9/22 confirmed itinerary supplied by the traveler on 9/21.
 * Reorder launcher place cards chronologically; retain all optional shops in their
 * original area names so existing candidate review IDs remain unchanged.
 * The previously canceled castella stop and superseded airport-MRT assumption
 * are not part of this plan. Do not assert the 13:45 MRT line/destination.
 */
(function () {
  'use strict';
  const day = (window.TRIP_DATA || []).find(d => d.date.includes('9/22'));
  if (!day || !Array.isArray(day.areas)) return;
  const originalAreas = day.areas;
  const originals = new Map();
  for (const area of originalAreas) {
    for (const place of area.places || []) {
      if (!originals.has(place.name)) originals.set(place.name, {place, area:area.area});
    }
  }
  const breakfast = originals.get('香滿園');
  const memorial = originals.get('中正紀念堂');
  const noodles = originals.get('林記牛肉麵（Lin Ji Beef Noodle Restaurant）');
  if (!breakfast || !memorial || !noodles) {
    console.warn('9/22 confirmed itinerary: required existing places not found; original cards preserved.');
    return;
  }
  const confirmedNames = new Set([breakfast.place.name, memorial.place.name, noodles.place.name]);
  const copy = (record, category) => ({...record.place, status:'マスト', category});
  const hotelName = '晴美公寓酒店（Jolley Hotel）';
  const confirmedAreas = [
    {
      area:'確定①｜7:00〜8:30 チェックアウト・朝食',
      area_query:'晴美公寓酒店 台北',
      places:[
        {name:hotelName, zh_name:'晴美公寓酒店', status:'マスト', category:'⏰7:00〜7:30 チェックアウト・フロントにスーツケースを預ける／7:30〜7:45 香滿園へ移動'},
        copy(breakfast,'魯肉飯・台湾朝食　⏰7:45〜8:15 行列30分想定／8:15〜8:30 朝食。待ち時間は目安')
      ]
    },
    {
      area:'確定②｜8:30〜11:20 中正紀念堂・牛肉麵',
      area_query:'中正紀念堂 台北',
      places:[
        copy(memorial,'観光・歴史　⏰8:30〜9:00 移動／9:00〜9:10 屋外見学／9:10〜10:30 館内・展示見学'),
        copy(noodles,'牛肉麵　⏰10:30〜10:45 中正紀念堂から移動／10:45〜11:20 昼食　⚠火曜10:30開店との掲載情報・当日の営業は未確認')
      ]
    },
    {
      area:'確定③｜11:20〜12:30 ホテル・台北駅',
      area_query:'台北車站 台北',
      places:[
        {name:hotelName, zh_name:'晴美公寓酒店', status:'マスト', category:'⏰11:20〜12:00 林記牛肉麵からホテルへ移動／12:00〜12:05 フロントで荷物を受け取る'},
        {name:'台北車站（台北駅・コインロッカー）', zh_name:'台北車站', status:'マスト', category:'⏰12:05〜12:20 タクシーで台北駅へ／12:20〜12:30 周辺コインロッカーに荷物を預ける　⚠ロッカーの場所・サイズ・空き状況は未確認'}
      ]
    },
    {
      area:'確定④｜12:30〜13:45 買い物・MRT乗車',
      area_query:'新光三越 台北站前店',
      places:[
        {name:'新光三越 台北站前店', zh_name:'新光三越 台北站前店', status:'マスト', category:'⏰12:30〜13:15 ショッピング45分　★見たいもの：無印良品・フェイラー（店舗内の取扱い・売場は未確認）'},
        {name:'台北車站（MRT乗車）', zh_name:'台北車站', status:'マスト', category:'⏰13:15〜13:35 ロッカーで荷物を回収してMRT駅へ移動／13:35〜13:45 乗車準備／13:45 MRT乗車　⚠目的地・路線・乗車ホームは未確認（空港MRTと決めつけない）'}
      ]
    }
  ];
  // Keep optional stores in their original area labels and their original ordering.
  // The old A1/airport cards belong to an earlier, now unconfirmed assumption;
  // no candidate shops are removed.
  const optionalAreas = originalAreas.map(area => ({
    ...area,
    places:(area.places || []).filter(place =>
      !confirmedNames.has(place.name) &&
      place.name !== '大川本舗現烤蛋糕' &&
      place.name !== 'A1 台北車站 桃園機場捷運' &&
      place.name !== '桃園国際空港 第2ターミナル'
    )
  })).filter(area => area.places.length > 0);
  day.areas = [...confirmedAreas, ...optionalAreas];

  // Moving a food place changes its area-based review key. Copy any saved review
  // to the new key only when needed; leave the old record intact as a backup.
  try {
    const key='taiwan-trip-reviews-v2';
    const stored=localStorage.getItem(key);
    if (stored) {
      const reviews=JSON.parse(stored);
      let changed=false;
      [breakfast, noodles].forEach(record => {
        const targetArea=record === breakfast ? confirmedAreas[0].area : confirmedAreas[1].area;
        const oldId=[day.date,record.area,record.place.name].join('|');
        const newId=[day.date,targetArea,record.place.name].join('|');
        if (reviews[oldId] && !reviews[newId]) {reviews[newId]=reviews[oldId];changed=true;}
      });
      if(changed)localStorage.setItem(key,JSON.stringify(reviews));
    }
  } catch(e) {console.warn('Could not copy moved-place review keys; original reviews are preserved.',e);}

  const rows = [
    ['7:00〜7:30','ホテルチェックアウト・荷物預け','フロントにスーツケースを預けて出発準備。',0,0],
    ['7:30〜7:45','ホテル → 香滿園','朝食のお店へ移動。',0,1],
    ['7:45〜8:15','香滿園｜行列','約30分待ちを想定。実際の待ち時間は当日次第。',0,1],
    ['8:15〜8:30','香滿園｜朝食','食事15分を確保。',0,1],
    ['8:30〜9:00','中正紀念堂へ移動','移動時間30分を想定。',1,0],
    ['9:00〜9:10','中正紀念堂｜屋外見学','建物の外観・広場など。',1,0],
    ['9:10〜10:30','中正紀念堂｜館内・展示見学','館内・展示に80分。',1,0],
    ['10:30〜10:45','林記牛肉麵へ移動','中正紀念堂から移動。',1,1],
    ['10:45〜11:20','林記牛肉麵｜昼食','火曜10:30開店との掲載情報あり。営業・混雑は当日確認。',1,1],
    ['11:20〜12:00','林記牛肉麵 → ホテル','移動40分を確保。',2,0],
    ['12:00〜12:05','ホテルで荷物を受け取る','フロントで預けたスーツケースを回収。',2,0],
    ['12:05〜12:20','ホテル → 台北駅','荷物があるためタクシー移動を想定。',2,1],
    ['12:20〜12:30','台北駅周辺のコインロッカーに荷物を預ける','大型荷物対応・場所・空き状況は未確認。',2,1],
    ['12:30〜13:15','新光三越 台北站前店｜ショッピング','45分確保。無印良品・フェイラーを見たい（取扱いは未確認）。',3,0],
    ['13:15〜13:35','荷物回収・MRT駅へ移動','コインロッカーへ戻って荷物を受け取る。',3,1],
    ['13:35〜13:45','乗車準備','路線・乗り場を現地で確認。',3,1],
    ['13:45','MRT乗車','指定の乗車時刻。目的地・路線・降車駅は未確定。',3,1]
  ];

  function setup() {
    const section=Array.from(document.querySelectorAll('#app .day')).find(el => el.querySelector('h2')?.textContent.includes('9/22'));
    if(!section || document.getElementById('departureRoute0922'))return;
    const header=section.querySelector('h2');
    if(!header)return;
    const style=document.createElement('style');
    style.textContent='#departureRoute0922{background:#ecfdf5;border:1px solid #86efac;border-radius:14px;padding:13px;margin:10px 0 14px;color:#14532d;line-height:1.55}#departureRoute0922 h3{margin:0 0 8px;font-size:17px}#departureRoute0922 .dr-row{display:flex;gap:10px;padding:8px 0;border-top:1px solid #bbf7d0}#departureRoute0922 .dr-time{min-width:78px;font-size:12px;font-weight:800;color:#166534;flex-shrink:0}#departureRoute0922 .dr-name{font-size:14px;font-weight:800}#departureRoute0922 .dr-note{font-size:12px;color:#365c42}#departureRoute0922 .dr-warning{font-size:12px;color:#7c2d12;margin-top:8px;padding:8px;background:#fff7ed;border-radius:8px}#departureRoute0922 .dr-jump{font-size:12px;border:1px solid #86efac;background:white;color:#166534;border-radius:7px;padding:3px 8px;margin-top:4px;font-weight:750;cursor:pointer}#departureRoute0922 .dr-caption{font-size:12px;color:#365c42;margin:5px 0 12px}.dr-candidates{background:#fff3c9;color:#795d00;border:1px solid #fde68a;border-radius:10px;padding:11px 12px;font-size:14px;font-weight:800;margin:15px 0 6px}.dr-target{scroll-margin-top:92px}';
    document.head.append(style);
    const box=document.createElement('section');box.id='departureRoute0922';box.setAttribute('aria-label','9月22日 確定行程');
    const heading=document.createElement('h3');heading.textContent='🗓️ 9/22（火）確定行程｜7:00〜13:45';box.append(heading);
    const intro=document.createElement('p');intro.className='dr-caption';intro.textContent='ご指定の17ステップを時刻順に表示。各「お店・スポットへ」から下のランチャーの該当カードへ移動できます。候補店は確定行程の後に別枠で残しています。';box.append(intro);
    const areas=Array.from(section.querySelectorAll(':scope > .area'));
    rows.forEach(([time,name,note,areaIndex,placeIndex])=>{
      const row=document.createElement('div');row.className='dr-row';
      const clock=document.createElement('div');clock.className='dr-time';clock.textContent=time;
      const info=document.createElement('div');
      const label=document.createElement('div');label.className='dr-name';label.textContent=name;
      const detail=document.createElement('div');detail.className='dr-note';detail.textContent=note;
      const jump=document.createElement('button');jump.type='button';jump.className='dr-jump';jump.textContent='お店・スポットへ ↓';
      jump.addEventListener('click',()=>{
        const target=areas[areaIndex]?.querySelectorAll('.place')[placeIndex] || areas[areaIndex];
        if(target){target.classList.add('dr-target');target.scrollIntoView({behavior:'smooth',block:'start'});}
      });
      info.append(label,detail,jump);row.append(clock,info);box.append(row);
    });
    const warning=document.createElement('div');warning.className='dr-warning';
    warning.textContent='※ 旧「本日の行程表」画像は変更前のままです。コインロッカーの場所・空き、移動時間、13:45のMRTの路線・目的地は未確認です。以前の「空港MRT・14:30空港到着」は今回の確定行程には引き継いでいません。';
    box.append(warning);
    header.insertAdjacentElement('afterend',box);
    if(optionalAreas.length && areas[confirmedAreas.length]) {
      const optionalTitle=document.createElement('div');optionalTitle.className='dr-candidates';
      optionalTitle.textContent='候補店・立ち寄り先｜確定行程には組み込まない（訪問は当日の状況次第）';
      areas[confirmedAreas.length].insertAdjacentElement('beforebegin',optionalTitle);
    }
    const schedule=section.querySelector('.schedule');
    if(schedule){const note=document.createElement('p');note.className='dr-caption';note.textContent='※ こちらの行程表画像は以前の案です。最新の確定行程は上の17ステップと下の確定①〜④のカードをご覧ください。';schedule.append(note);}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);
  else setup();
})();
