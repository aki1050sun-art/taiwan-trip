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
    const intro = document.createElement('div'); intro.className = 'rr-note'; intro.textContent = 'エリア単位で回り、混雑・お腹の具合で候補を選びます。以下の「お店へ」から元の店カードへ移動できます。'; box.appendChild(intro);
    const steps = [
      {time:'11:00〜', name:'雙月食品社 青島店', note:'昼食。愛恨椒芝麵（チリ胡麻混ぜそば）・トリュフ混ぜそば・アサリと鶏のスープ・蒸し牡蠣を検討。公式掲載は昼11:00〜14:00、夜17:00〜20:00。', area:'善導寺・青島', place:'雙月食品社 青島店'},
      {time:'食後に確認', name:'甜滿（未訪問なら寄り道）', note:'以前「行く」と決めたお店。お土産のクラッカーを忘れずに。永康街方面への寄り道なので、既に購入済みなら省略。', area:'東門・永康街', place:'甜滿'},
      {time:'午後', name:'中山・赤峰街散策', note:'雑貨・カフェを中心に自由散策。無印良品、新光三越、面線町は時間・腹具合に応じて選ぶ候補。', area:'中山・赤峰街', place:'赤峰街'},
      {time:'散策中', name:'COOKIE886', note:'お土産のクッキー。中山・赤峰街散策の途中で立ち寄り。掲載営業時間は12:00〜20:00。', area:'中山・赤峰街', place:'COOKIE886'},
      {time:'18:00頃', name:'阿城鵝肉（吉林總店）', note:'夕食。煙燻鵝肉を食べたいお店。夜の確定ルート。', area:'夜｜阿城鵝肉 → 杏福冰館', place:'阿城鵝肉'},
      {time:'19:40頃', name:'杏福冰館', note:'食後のかき氷・杏仁豆腐。掲載21:00閉店なので遅くなりすぎないように。', area:'夜｜阿城鵝肉 → 杏福冰館', place:'杏福氷館'}
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
    const extra=document.createElement('div');extra.className='rr-extra';extra.textContent='追加の候補：青島飯糰（雙月の近く）／榕錦時光生活園區（永康街方面に寄る場合）／三葉足体養生館（夜、時間があれば）。どれも必須ではありません。9/20訪問済みのドーナツ・阿宗麵線は今日のルートに入れていません。';box.appendChild(extra);
    header.insertAdjacentElement('afterend',box);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',setup);
  else setup();
})();