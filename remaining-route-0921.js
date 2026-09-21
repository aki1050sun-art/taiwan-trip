/* Sep 21 remaining route summary. Adds navigation only; does not change place IDs, ratings, or the itinerary. */
(function () {
  'use strict';
  function setup() {
    if (document.getElementById('remainingRoute0921')) return;
    const day = Array.from(document.querySelectorAll('#app .day')).find(el => el.querySelector('h2')?.textContent.includes('9/21'));
    if (!day) return;
    const header = day.querySelector('h2');
    if (!header) return;
    const style = document.createElement('style');
    style.textContent = '#remainingRoute0921{background:#eff6ff;border:1px solid #93c5fd;border-radius:14px;padding:13px;margin:10px 0 14px;color:#1e3a5f;line-height:1.6}#remainingRoute0921 h3{margin:0 0 7px;font-size:17px}#remainingRoute0921 .rr-step{display:flex;gap:9px;align-items:flex-start;border-top:1px solid #bfdbfe;padding:9px 0}#remainingRoute0921 .rr-time{font-size:12px;font-weight:800;white-space:nowrap;min-width:70px;color:#1d4ed8}#remainingRoute0921 .rr-name{font-size:14px;font-weight:800}#remainingRoute0921 .rr-note{font-size:12px;color:#475569}#remainingRoute0921 .rr-link{background:white;color:#1d4ed8;border:1px solid #93c5fd;border-radius:7px;padding:3px 8px;font-size:12px;font-weight:750;text-decoration:none;display:inline-block;margin-top:3px}#remainingRoute0921 .rr-extra{font-size:12px;color:#334155;margin-top:8px;border-top:1px solid #bfdbfe;padding-top:9px}';
    document.head.appendChild(style);
    const box = document.createElement('section');
    box.id = 'remainingRoute0921';
    box.setAttribute('aria-label', '9月21日のこれからの行程');
    const h = document.createElement('h3'); h.textContent = '🗓️ 9/21 これからの行程（時刻は目安）'; box.appendChild(h);
    const intro = document.createElement('div'); intro.className = 'rr-note'; intro.textContent = '雙月で昼食 → 中山・赤峰街をCOOKIE886込みで約3時間 → 17:00に済南鮮湯包 総店 → 阿城鵝肉 → 杏福冰館。甜滿は訪問済みのため除外しています。'; box.appendChild(intro);
    const steps = [
      {time:'12:30頃〜', name:'雙月食品社 青島店', note:'昼食。行列次第で後の時刻が変わります。愛恨椒芝麵（チリ胡麻混ぜそば）・トリュフ混ぜそばなど。13:15頃の食事終了を想定。', area:'善導寺・青島', place:'雙月食品社 青島店'},
      {time:'13:15〜13:30', name:'中山・赤峰街へ移動', note:'移動時間は交通状況により前後します。', area:'中山・赤峰街', place:'赤峰街'},
      {time:'13:30〜16:30', name:'中山・赤峰街散策（約3時間）', note:'COOKIE886の買い物もこの3時間に含みます。雑貨・カフェを中心に自由散策。無印良品・新光三越・面線町は余裕があれば。', area:'中山・赤峰街', place:'赤峰街'},
      {time:'散策中', name:'COOKIE886', note:'クッキーを購入。散策3時間の内数です。', area:'中山・赤峰街', place:'COOKIE886'},
      {time:'16:30〜17:00', name:'済南鮮湯包 総店へ移動', note:'17:00の夜営業開始を目指します。交通状況によって到着は前後します。', area:'東門・永康街', place:'済南鮮湯包 総店'},
      {time:'17:00頃〜', name:'済南鮮湯包 総店（濟南鮮湯包）', note:'夜営業開始に合わせて小籠包。台北市大安區濟南路三段20號。混雑があれば待ち時間が発生する可能性があります。', area:'東門・永康街', place:'済南鮮湯包 総店'},
      {time:'17:45〜18:15', name:'阿城鵝肉へ移動', note:'済南鮮湯包での食事終了後に移動。移動時間・行列に応じて前後します。', area:'夜｜阿城鵝肉 → 杏福冰館', place:'阿城鵝肉'},
      {time:'18:15頃〜', name:'阿城鵝肉（吉林總店）', note:'夕食。煙燻鵝肉を検討。済南鮮湯包でも食べるので量はお腹に合わせて調整。', area:'夜｜阿城鵝肉 → 杏福冰館', place:'阿城鵝肉'},
      {time:'19:50頃〜', name:'杏福冰館', note:'食後のかき氷・杏仁豆腐。掲載21:00閉店のため、夕食が長引くときは営業状況を確認。', area:'夜｜阿城鵝肉 → 杏福冰館', place:'杏福氷館'}
    ];
    function targetFor(step) {
      const area = Array.from(day.querySelectorAll('.area')).find(a => a.querySelector('.areahead h3')?.textContent.trim() === step.area);
      return Array.from(area?.querySelectorAll('.place') || []).find(p => p.querySelector('.name')?.firstChild?.textContent.trim() === step.place) || area;
    }
    steps.forEach(step => {
      const row=document.createElement('div'); row.className='rr-step';
      const time=document.createElement('span');time.className='rr-time';time.textContent=step.time;
      const content=document.createElement('div');
      const name=document.createElement('div');name.className='rr-name';name.textContent=step.name;
      const note=document.createElement('div');note.className='rr-note';note.textContent=step.note;
      const jump=document.createElement('a');jump.className='rr-link';jump.href='#';jump.textContent='お店・エリアへ ↓';
      jump.addEventListener('click',e=>{e.preventDefault();const target=targetFor(step);if(target){target.scrollIntoView({behavior:'smooth',block:'center'});}});
      content.append(name,note,jump);row.append(time,content);box.appendChild(row);
    });
    const extra=document.createElement('div');extra.className='rr-extra';extra.textContent='⚠ 雙月で並ぶと散策開始が遅れる可能性があります。散策を3時間確保する場合、済南の到着は17:00より遅くなることがあります。済南・阿城の待ち時間次第では杏福冰館の掲載21:00閉店にご注意ください。追加候補：青島飯糰／三葉足体養生館（時間があれば）。甜滿は訪問済み。';box.appendChild(extra);
    header.insertAdjacentElement('afterend',box);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',setup);
  else setup();
})();