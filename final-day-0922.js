/* 9/22 tentative departure-day plan. Remove only the canceled castella stop from the displayed itinerary.
 * Preserve stored family reviews, every other stop, and the original schedule image (label it outdated).
 */
(function () {
  'use strict';
  const day = (window.TRIP_DATA || []).find(d => d.date.includes('9/22'));
  if (!day) return;
  const cakeName = '大川本舗現烤蛋糕';
  day.areas = day.areas.map(area => ({
    ...area,
    places: area.places.filter(place => place.name !== cakeName)
  })).filter(area => area.places.length > 0);

  function setup() {
    const section = Array.from(document.querySelectorAll('#app .day')).find(el => el.querySelector('h2')?.textContent.includes('9/22'));
    if (!section || document.getElementById('departureRoute0922')) return;
    const header = section.querySelector('h2');
    if (!header) return;
    const style = document.createElement('style');
    style.textContent = '#departureRoute0922{background:#ecfdf5;border:1px solid #86efac;border-radius:14px;padding:13px;margin:10px 0 14px;color:#14532d;line-height:1.55}#departureRoute0922 h3{margin:0 0 8px;font-size:17px}#departureRoute0922 .dr-row{display:flex;gap:10px;padding:8px 0;border-top:1px solid #bbf7d0}#departureRoute0922 .dr-time{min-width:75px;font-size:12px;font-weight:800;color:#166534;flex-shrink:0}#departureRoute0922 .dr-name{font-size:14px;font-weight:800}#departureRoute0922 .dr-note{font-size:12px;color:#365c42}#departureRoute0922 .dr-warning{font-size:12px;color:#7c2d12;margin-top:8px;padding:8px;background:#fff7ed;border-radius:8px}';
    document.head.append(style);
    const box = document.createElement('section');
    box.id = 'departureRoute0922';
    box.setAttribute('aria-label', '9月22日 カステラ店を除いた暫定行程');
    const title = document.createElement('h3');
    title.textContent = '🗓️ 9/22 帰国日の暫定行程';
    box.append(title);
    const intro = document.createElement('p');
    intro.className = 'dr-note';
    intro.textContent = '10:00のカステラ店（大川本舗）は取りやめ。下の時刻は仮置きで、朝食・観光は当日の状況で選択します。';
    box.append(intro);
    const rows = [
      ['8:00頃', '香滿園で朝食', '雙連エリア。時間があれば雙連朝市を散策。'],
      ['9:15〜10:20', '中正紀念堂方面へ移動・散策', '中正紀念堂を見学。劉媽媽飯糰（11:30終了との掲載）は食べたい場合の候補。'],
      ['10:30頃', '林記牛肉麵（候補）', '10:30開店との掲載。朝食後のお腹の具合で選択し、無理に詰め込まない。'],
      ['11:30〜12:30', 'ホテルで荷物を受け取り、台北駅へ', 'ホテルに荷物を預けている場合。移動時間と余裕を確保。'],
      ['12:30〜13:15', '台北駅 A1・空港MRT', '駅構内で乗り場・発車時刻を確認。劉山東牛肉麵は時間が十分ある場合だけの候補。'],
      ['14:30まで', '桃園国際空港 第2ターミナル', 'これまでの到着目標。列車時刻・乗車時間は当日確認。']
    ];
    rows.forEach(([time, name, note]) => {
      const row = document.createElement('div'); row.className = 'dr-row';
      const t = document.createElement('div'); t.className = 'dr-time'; t.textContent = time;
      const info = document.createElement('div');
      const n = document.createElement('div'); n.className = 'dr-name'; n.textContent = name;
      const d = document.createElement('div'); d.className = 'dr-note'; d.textContent = note;
      info.append(n,d); row.append(t,info); box.append(row);
    });
    const warning = document.createElement('div'); warning.className = 'dr-warning';
    warning.textContent = '※ 下の「本日の行程表」画像は変更前のものです。カステラ店が載っていても、上の暫定行程と下のお店・スポット一覧が最新です。';
    box.append(warning);
    header.insertAdjacentElement('afterend', box);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();
