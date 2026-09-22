/* 9/21 actual morning itinerary and previously proposed afternoon itinerary.
 * Display only: all place IDs, existing reviews and navigation remain intact.
 */
(function () {
  'use strict';
  function setup() {
    if(document.getElementById('remainingRoute0921'))return;
    const day=[...document.querySelectorAll('#app .day')].find(el=>el.querySelector('h2')?.textContent.includes('9/21'));
    if(!day)return;
    const header=day.querySelector('h2');if(!header)return;
    const style=document.createElement('style');
    style.textContent='#remainingRoute0921{background:#eff6ff;border:1px solid #93c5fd;border-radius:14px;padding:13px;margin:10px 0 14px;color:#1e3a5f;line-height:1.6}#remainingRoute0921 h3{margin:0 0 7px;font-size:17px}#remainingRoute0921 .rr-step{display:flex;gap:9px;align-items:flex-start;border-top:1px solid #bfdbfe;padding:9px 0}#remainingRoute0921 .rr-time{font-size:12px;font-weight:800;white-space:nowrap;min-width:70px;color:#1d4ed8}#remainingRoute0921 .rr-name{font-size:14px;font-weight:800}#remainingRoute0921 .rr-note{font-size:12px;color:#475569}#remainingRoute0921 .rr-link{background:white;color:#1d4ed8;border:1px solid #93c5fd;border-radius:7px;padding:3px 8px;font-size:12px;font-weight:750;text-decoration:none;display:inline-block;margin-top:3px}#remainingRoute0921 .rr-extra{font-size:12px;color:#334155;margin-top:8px;border-top:1px solid #bfdbfe;padding-top:9px}#remainingRoute0921 .rr-subhead{border-top:1px solid #93c5fd;padding-top:10px;margin-top:8px;font-size:13px;font-weight:850;color:#1e40af}';
    document.head.append(style);
    const box=document.createElement('section');box.id='remainingRoute0921';box.setAttribute('aria-label','9月21日の訪問記録と以前の予定');
    const h=document.createElement('h3');h.textContent='🗓️ 9/21 行程｜午前の訪問記録';box.append(h);
    const intro=document.createElement('div');intro.className='rr-note';intro.textContent='7:00 良粟商號 → 7:45 fruitos → 8:00 ㄇㄇ紫米飯糰 → ホテルへ戻る。続いて9:30 甜滿、天津蔥抓餅、永康街散策、12:00 雙月へ。午後以降は以前の予定で、訪問実績は未確認です。';box.append(intro);
    const morning=[
      {time:'7:00',name:'良粟商號',note:'炭焼きトースト。訪問済み。',area:'行天宮周辺',place:'良粟商號'},
      {time:'7:45',name:'fruitos 森果治',note:'良粟商號の次に訪問済み。',area:'行天宮周辺',place:'fruitos 森果治'},
      {time:'8:00',name:'ㄇㄇ紫米飯糰',note:'紫米飯糰。fruitos の次に訪問済み。',area:'行天宮周辺',place:'ㄇㄇ紫米飯糰'},
      {time:'その後',name:'ホテルに戻る',note:'ㄇㄇ紫米飯糰の後にホテルへ帰着。帰着時刻は未確認。',hotel:true},
      {time:'9:30',name:'甜滿',note:'午前中に訪問。お土産のクラッカーなど。',area:'東門・永康街',place:'甜滿'},
      {time:'その後',name:'天津蔥抓餅',note:'甜滿の後に訪問済み。',area:'東門・永康街',place:'天津蔥抓餅'},
      {time:'その後',name:'永康街散策',note:'天津蔥抓餅の後に街歩き。',area:'東門・永康街',place:'永康街'},
      {time:'12:00',name:'雙月食品社 青島店',note:'12:00に訪問。',area:'善導寺・青島',place:'雙月食品社 青島店'}
    ];
    const later=[
      {time:'午後・目安',name:'中山・赤峰街散策（COOKIE886を含む）',note:'以前の予定は約3時間の散策。訪問実績は未確認。',area:'中山・赤峰街',place:'赤峰街'},
      {time:'17:00予定',name:'済南鮮湯包 総店',note:'以前の予定。実際の訪問有無・到着時刻は未確認。',area:'東門・永康街',place:'済南鮮湯包 総店'},
      {time:'夕方予定',name:'阿城鵝肉（吉林總店）',note:'以前の夕食予定。訪問実績は未確認。',area:'夜｜阿城鵝肉 → 杏福冰館',place:'阿城鵝肉'},
      {time:'夜予定',name:'杏福冰館',note:'以前のデザート予定。訪問実績は未確認。',area:'夜｜阿城鵝肉 → 杏福冰館',place:'杏福氷館'}
    ];
    function targetFor(step){
      if(step.hotel)return document.querySelector('#app .hotelbar');
      const areas=[...day.querySelectorAll('.area')].filter(a=>a.querySelector('.areahead h3')?.textContent.trim()===step.area);
      for(const area of areas){
        const place=[...area.querySelectorAll('.place')].find(p=>p.querySelector('.name')?.firstChild?.textContent.trim()===step.place);
        if(place)return place;
      }
      return areas[0];
    }
    function addStep(step){
      const row=document.createElement('div');row.className='rr-step';
      const time=document.createElement('span');time.className='rr-time';time.textContent=step.time;
      const content=document.createElement('div');
      const name=document.createElement('div');name.className='rr-name';name.textContent=step.name;
      const note=document.createElement('div');note.className='rr-note';note.textContent=step.note;
      const jump=document.createElement('a');jump.className='rr-link';jump.href='#';jump.textContent=step.hotel?'ホテルのタクシーボタンへ ↑':'お店・スポットへ ↓';
      jump.addEventListener('click',e=>{e.preventDefault();targetFor(step)?.scrollIntoView({behavior:'smooth',block:'center'});});
      content.append(name,note,jump);row.append(time,content);box.append(row);
    }
    morning.forEach(addStep);
    const sub=document.createElement('div');sub.className='rr-subhead';sub.textContent='午後以降｜以前の予定（訪問実績は未確認）';box.append(sub);
    later.forEach(addStep);
    const extra=document.createElement('div');extra.className='rr-extra';extra.textContent='※ 下の「本日の行程表」画像は変更前です。実際の午前の行程はこの記録と下の訪問済みカードが最新です。午後のお店は訪問したと確認できるまで訪問済みとは扱いません。';box.append(extra);
    header.insertAdjacentElement('afterend',box);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
