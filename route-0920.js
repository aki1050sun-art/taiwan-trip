/* September 20: user's chronological itinerary, without rewriting family reviews.
 * Run after Sep 20 A-Zong and doughnut correction scripts, before render().
 * Keep original area/place names for unchanged stops so review IDs remain intact.
 */
(function () {
  'use strict';
  const day = (window.TRIP_DATA || []).find(d => d.date.startsWith('9/20'));
  if (!day || !Array.isArray(day.areas)) return;
  const areas = day.areas;
  const get = name => areas.find(a => a.area === name);
  const sortPlaces = (area, names) => {
    if (!area) return;
    const rank = new Map(names.map((name, index) => [name, index]));
    area.places.sort((a, b) => (rank.has(a.name) ? rank.get(a.name) : 1000) - (rank.has(b.name) ? rank.get(b.name) : 1000));
  };
  const west = get('西門（天天利）');
  sortPlaces(west, ['天天利美食坊', '阿宗麵線']);
  const donutArea = get('晴光市場（9/20 14:30 訪問済み）');
  const dihua = get('北門・迪化街・大稻埕');
  sortPlaces(dihua, ['迪化街', 'Jade Boat 191 澎玉191', '妙口四神湯 肉包', '北門蝦仁飯・煲湯']);
  const night = get('寧夏夜市');
  if (night && !night.places.some(p => p.name === '寧夏夜市の焼きエリンギ（烤杏鮑菇）')) {
    night.places.push({
      name: '寧夏夜市の焼きエリンギ（烤杏鮑菇）',
      zh_name: '烤杏鮑菇',
      category: '焼きエリンギ・屋台料理　🥡持ち帰り／店名・屋台位置は未特定',
      status: 'マスト'
    });
  }
  sortPlaces(night, ['豆花荘', '寧夏夜市', '方家雞肉飯', '寧夏夜市の焼きエリンギ（烤杏鮑菇）']);
  const marketName = '晴光市場（20:00）';
  let lateMarket = get(marketName);
  if (!lateMarket) {
    lateMarket = {
      area: marketName, area_query: '晴光市場 台北', places: [
        {name:'晴光市場', zh_name:'晴光市場', category:'20:00頃に立ち寄り・買い物', status:'マスト'}
      ]
    };
    areas.push(lateMarket);
  }
  const hotelName = 'ホテル帰着（夜）';
  let lateHotel = get(hotelName);
  if (!lateHotel) {
    lateHotel = {
      area: hotelName, area_query:'晴美公寓酒店 Jolley Hotel 台北', places:[
        {name:'晴美公寓酒店（Jolley Hotel）', zh_name:'晴美公寓酒店', category:'晴光市場のあとホテルへ戻り、持ち帰った料理で部屋飲み', status:'マスト'}
      ]
    };
    areas.push(lateHotel);
  }
  const order = [
    '善導寺（朝）', '龍山寺・萬華', '善導寺（昼）', '西門（天天利）',
    '晴光市場（9/20 14:30 訪問済み）', '北門・迪化街・大稻埕',
    '寧夏夜市', marketName, hotelName, 'ホテル周辺（余裕があれば）'
  ];
  const index = new Map(order.map((name, i) => [name, i]));
  day.areas = areas.map((a, i) => ({a, i})).sort((x, y) =>
    (index.has(x.a.area) ? index.get(x.a.area) : 1000 + x.i) -
    (index.has(y.a.area) ? index.get(y.a.area) : 1000 + y.i)
  ).map(x => x.a);

  const steps = [
    ['6:30〜8:15', '阜杭豆漿', '朝食。', '阜杭豆漿'],
    ['8:15〜11:00', '龍山寺 → 剝皮寮歷史街區', '龍山寺を見学。剝皮寮は候補として散策。古北饕へ移動する時間も含む。', '龍山寺'],
    ['11:00〜', '古北饕 Goodbeitao', '小籠包など。', '古北饕 Goodbeitao'],
    ['12:15〜', '天天利美食坊 → 阿宗麵線', '西門エリアで順番に立ち寄り。阿宗麵線には以前の14:00訪問記録あり。', '天天利美食坊'],
    ['14:30', '脆皮鮮奶甜甜圈 晴光總店', 'ドーナツ店を14:30に訪問。', '脆皮鮮奶甜甜圈 晴光總店'],
    ['14:40', 'ホテルに帰着', 'ドーナツ店からホテルへ戻る。', '脆皮鮮奶甜甜圈 晴光總店'],
    ['15:40出発', 'ホテル → 迪化街', 'ホテルを出発し、16:00頃から迪化街を散策。', '迪化街'],
    ['16:00〜', '迪化街 → Jade Boat 191 澎玉191 → 妙口四神湯 肉包', '街歩きと買い物・軽食。', 'Jade Boat 191 澎玉191'],
    ['17:30', '北門蝦仁飯・煲湯', '夕食。', '北門蝦仁飯・煲湯'],
    ['18:30〜', '豆花荘 → 寧夏夜市', '豆花のあと夜市へ。方家雞肉飯と焼きエリンギを買って持ち帰り。', '豆花荘'],
    ['20:00頃', '晴光市場 → ホテル', '晴光市場に立ち寄った後、ホテルに戻って部屋飲み。', '晴光市場']
  ];
  function setup() {
    const section = [...document.querySelectorAll('#app .day')].find(x => x.querySelector('h2')?.textContent.includes('9/20'));
    if (!section || document.getElementById('route0920')) return;
    const header = section.querySelector('h2');
    if (!header) return;
    const style = document.createElement('style');
    style.textContent = '#route0920{background:#eff6ff;border:1px solid #93c5fd;border-radius:14px;padding:13px;margin:10px 0 14px;color:#1e3a5f;line-height:1.55}#route0920 h3{margin:0 0 6px;font-size:17px}#route0920 .r20-row{display:flex;gap:9px;border-top:1px solid #bfdbfe;padding:9px 0}#route0920 .r20-time{font-size:12px;font-weight:800;flex:0 0 93px;color:#1d4ed8}#route0920 .r20-name{font-size:14px;font-weight:800}#route0920 .r20-note{font-size:12px;color:#475569}#route0920 .r20-link{display:inline-block;margin-top:4px;font-size:12px;background:white;border:1px solid #93c5fd;border-radius:8px;padding:4px 9px;color:#1d4ed8;text-decoration:none}#route0920 .r20-caution{margin-top:8px;font-size:12px;background:#fff7ed;color:#92400e;border-radius:8px;padding:9px}';
    document.head.appendChild(style);
    const box = document.createElement('section');
    box.id = 'route0920'; box.setAttribute('aria-label', '9月20日の整理した行程');
    const title = document.createElement('h3'); title.textContent = '🗓️ 9/20 整理した行程'; box.append(title);
    const intro = document.createElement('p'); intro.className = 'r20-note';
    intro.textContent = '下の店・スポット一覧も回る順番です。候補店は残しています。「お店へ」で該当カードに移動できます。';box.append(intro);
    for (const [time, name, note, placeName] of steps) {
      const row = document.createElement('div'); row.className = 'r20-row';
      const t = document.createElement('span');t.className = 'r20-time';t.textContent=time;
      const info = document.createElement('div');
      const n = document.createElement('div');n.className='r20-name';n.textContent=name;
      const d = document.createElement('div');d.className='r20-note';d.textContent=note;
      const link = document.createElement('a');link.href='#';link.className='r20-link';link.textContent='お店・スポットへ ↓';
      link.addEventListener('click', e => {
        e.preventDefault();
        const card = [...section.querySelectorAll('.place')].find(p => p.querySelector('.name')?.firstChild?.textContent.trim() === placeName);
        card?.scrollIntoView({behavior:'smooth',block:'center'});
      });
      info.append(n,d,link);row.append(t,info);box.append(row);
    }
    const caution = document.createElement('div');caution.className='r20-caution';
    caution.textContent='※ 行程表の画像は変更前のものです。最新の時刻はこの「9/20 整理した行程」と下のお店・スポット一覧を参照してください。';
    box.append(caution);
    header.insertAdjacentElement('afterend',box);
    // The area heading already shows the confirmed 14:30 visit time.
    if (donutArea) donutArea.places.forEach(p => {
      if (p.name==='脆皮鮮奶甜甜圈 晴光總店') p.category=p.category.replace('15:00訪問済み','14:30訪問済み');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',setup);
  else setup();
})();
