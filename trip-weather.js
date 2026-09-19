/* Taipei trip weather: live Open-Meteo data. Never display made-up forecasts. */
(function () {
  'use strict';
  const TZ = 'Asia/Taipei';
  const TRIP_DATES = ['2026-09-19', '2026-09-20', '2026-09-21', '2026-09-22'];
  const SOURCE = 'https://open-meteo.com/en/docs';
  const URL = 'https://api.open-meteo.com/v1/forecast?latitude=25.0330&longitude=121.5654&timezone=Asia%2FTaipei&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,precipitation_probability_max&hourly=relative_humidity_2m&past_days=3&forecast_days=7';
  let loading = false;
  function taipeiDate() {
    const parts = new Intl.DateTimeFormat('en-US', {timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit'}).formatToParts(new Date());
    const get = type => parts.find(p => p.type === type)?.value || '';
    return get('year') + '-' + get('month') + '-' + get('day');
  }
  function condition(code) {
    if (code === 0) return '快晴';
    if (code === 1) return '晴れ';
    if (code === 2) return '晴れ時々曇り';
    if (code === 3) return '曇り';
    if ([45, 48].includes(code)) return '霧';
    if ([51, 53, 55, 56, 57].includes(code)) return '霧雨';
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return '雨・にわか雨';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return '雪';
    if ([95, 96, 99].includes(code)) return '雷雨';
    return '天気情報あり';
  }
  function number(value, unit, digits = 0) {
    return typeof value === 'number' && Number.isFinite(value) ? value.toFixed(digits) + unit : '—';
  }
  function clothing(max, feel, humidity, rain, code) {
    const warmest = Number.isFinite(feel) ? feel : max;
    if (!Number.isFinite(warmest)) return '気温を取得できていないため、服装の判断は保留してください。';
    let text;
    if (warmest >= 34) text = '半袖1枚でも暑い見込み。薄手・通気性のよい服を。';
    else if (warmest >= 29) text = '半袖1枚で十分。日中は暑く、冷房用の薄い羽織があると安心。';
    else if (warmest >= 25) text = '半袖中心でOK。冷房や夜に備え、薄手の羽織があると便利。';
    else if (warmest >= 20) text = '半袖＋薄手の長袖シャツや羽織を。';
    else text = '長袖や上着を準備してください。';
    if (Number.isFinite(humidity) && humidity >= 75 && warmest >= 25) text += ' 湿度が高く蒸し暑さに注意。';
    if ((Number.isFinite(rain) && rain >= 40) || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) text += ' 折りたたみ傘を。';
    if ([95, 96, 99].includes(code)) text += ' 雷が鳴ったら屋外散策を中断。';
    return text;
  }
  function daytimeHumidity(hourly, day) {
    const times = hourly?.time || [], values = hourly?.relative_humidity_2m || [];
    const selected = [];
    for (let i = 0; i < times.length; i++) {
      const time = times[i];
      if (typeof time !== 'string' || !time.startsWith(day)) continue;
      const hour = Number(time.slice(11, 13));
      if (hour >= 9 && hour <= 18 && Number.isFinite(values[i])) selected.push(values[i]);
    }
    if (!selected.length) return null;
    return Math.round(selected.reduce((sum, value) => sum + value, 0) / selected.length);
  }
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function showError(text) {
    const info = document.getElementById('tw-weather-body');
    if (info) info.textContent = text + ' 通信ができたら「更新」を押してください。';
  }
  function paint(data) {
    const body = document.getElementById('tw-weather-body');
    if (!body) return;
    body.replaceChildren();
    const today = taipeiDate(), current = data.current || {}, daily = data.daily || {};
    const dates = daily.time || [];
    if (!dates.length) { showError('天気データを取得できませんでした。'); return; }
    if (TRIP_DATES.includes(today)) {
      const now = el('div', 'tw-weather-now');
      const nowTitle = el('div', 'tw-weather-heading', '台北・今日の現在の天気（' + today.slice(5).replace('-', '/') + '）');
      now.appendChild(nowTitle);
      const nowNumbers = el('div', 'tw-weather-large', condition(current.weather_code) + '　' + number(current.temperature_2m, '℃', 1));
      now.appendChild(nowNumbers);
      now.appendChild(el('div', 'tw-weather-details', '現在の湿度 ' + number(current.relative_humidity_2m, '%') + ' ／ 体感気温 ' + number(current.apparent_temperature, '℃', 1)));
      const todayIndex = dates.indexOf(today);
      if (todayIndex >= 0) {
        now.appendChild(el('div', 'tw-weather-clothes', '服装：' + clothing(daily.temperature_2m_max?.[todayIndex], daily.apparent_temperature_max?.[todayIndex], current.relative_humidity_2m, daily.precipitation_probability_max?.[todayIndex], daily.weather_code?.[todayIndex])));
      }
      body.appendChild(now);
    }
    body.appendChild(el('div', 'tw-weather-heading tw-weather-heading-space', '旅行日ごとの天気と服装（台北市中心部）'));
    const grid = el('div', 'tw-weather-grid');
    const days = ['土', '日', '月', '火'];
    TRIP_DATES.forEach((day, n) => {
      const item = el('div', 'tw-weather-day' + (day === today ? ' tw-weather-today' : ''));
      item.appendChild(el('div', 'tw-weather-date', day.slice(5).replace('-', '/') + '（' + days[n] + '）' + (day === today ? ' 今日' : day < today ? ' 参考・過去日' : ' 予報')));
      const i = dates.indexOf(day);
      if (i < 0) {
        item.appendChild(el('div', 'tw-weather-details', 'この日の気象データは取得対象外です。'));
      } else {
        const humid = daytimeHumidity(data.hourly, day);
        const weatherCode = daily.weather_code?.[i];
        item.appendChild(el('div', 'tw-weather-condition', condition(weatherCode)));
        item.appendChild(el('div', 'tw-weather-details', '最高 ' + number(daily.temperature_2m_max?.[i], '℃') + ' ／ 最低 ' + number(daily.temperature_2m_min?.[i], '℃')));
        item.appendChild(el('div', 'tw-weather-details', '日中湿度目安 ' + number(humid, '%') + ' ／ 最高体感 ' + number(daily.apparent_temperature_max?.[i], '℃')));
        item.appendChild(el('div', 'tw-weather-details', '降水確率（最大） ' + number(daily.precipitation_probability_max?.[i], '%')));
        item.appendChild(el('div', 'tw-weather-clothes', '服装：' + clothing(daily.temperature_2m_max?.[i], daily.apparent_temperature_max?.[i], humid, daily.precipitation_probability_max?.[i], weatherCode)));
      }
      grid.appendChild(item);
    });
    body.appendChild(grid);
    const note = el('div', 'tw-weather-note');
    note.textContent = '気温・湿度は台北市中心部の気象データです。日中湿度は9〜18時の予測値の平均。服装は体感気温などに基づく目安です。空港・山間部は異なります。';
    body.appendChild(note);
    const stamp = document.getElementById('tw-weather-stamp');
    if (stamp) stamp.textContent = '取得：' + new Intl.DateTimeFormat('ja-JP', {timeZone: TZ, month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit', hour12:false}).format(new Date()) + '（台湾時間）';
  }
  async function refresh() {
    if (loading) return;
    loading = true;
    const button = document.getElementById('tw-weather-refresh');
    if (button) { button.disabled = true; button.textContent = '取得中…'; }
    try {
      const response = await fetch(URL, {cache:'no-store'});
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const data = await response.json();
      if (!data?.daily?.time) throw new Error('invalid weather data');
      paint(data);
    } catch (error) {
      console.error('Weather fetch failed', error);
      showError('現在、最新の天気・気温・湿度を表示できません。');
    } finally {
      loading = false;
      if (button) { button.disabled = false; button.textContent = '天気を更新'; }
    }
  }
  function setup() {
    const main = document.getElementById('app');
    if (!main || document.getElementById('tw-weather')) return;
    const style = document.createElement('style');
    style.textContent = '#tw-weather{background:#fff;border:2px solid #93c5fd;border-radius:14px;padding:13px;margin:10px 0 12px;box-shadow:0 2px 8px #0001;color:#1f2937}#tw-weather .tw-weather-top{display:flex;align-items:center;justify-content:space-between;gap:9px;flex-wrap:wrap}#tw-weather h2{margin:0;color:#163e63;font-size:18px}#tw-weather-refresh{border:0;border-radius:9px;background:#1565c0;color:#fff;font-size:14px;font-weight:800;padding:9px 12px;cursor:pointer}#tw-weather-refresh:disabled{opacity:.6}#tw-weather-body{margin-top:9px;font-size:15px;line-height:1.55}#tw-weather .tw-weather-now{background:#eff6ff;border-radius:12px;padding:12px;margin-bottom:10px}#tw-weather .tw-weather-heading{font-size:15px;font-weight:900;color:#1d4ed8}#tw-weather .tw-weather-heading-space{margin:10px 0 7px}#tw-weather .tw-weather-large{font-size:23px;font-weight:900;margin:4px 0}#tw-weather .tw-weather-details{font-size:14px;margin-top:4px}#tw-weather .tw-weather-clothes{font-size:15px;font-weight:800;color:#065f46;margin-top:9px}#tw-weather .tw-weather-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}#tw-weather .tw-weather-day{border:1px solid #dbeafe;border-radius:10px;padding:10px;min-width:0}#tw-weather .tw-weather-today{border:2px solid #2563eb;background:#f8fbff}#tw-weather .tw-weather-date{font-size:15px;font-weight:900;color:#163e63}#tw-weather .tw-weather-condition{font-size:17px;font-weight:900;margin-top:4px}#tw-weather .tw-weather-note{font-size:12px;color:#64748b;margin-top:10px}#tw-weather .tw-weather-foot{display:flex;justify-content:space-between;gap:6px;flex-wrap:wrap;margin-top:10px;font-size:12px;color:#475569}#tw-weather .tw-weather-foot a{color:#135ea8}@media(max-width:640px){#tw-weather .tw-weather-grid{grid-template-columns:1fr}#tw-weather .tw-weather-large{font-size:22px}#tw-weather .tw-weather-day{padding:11px}}';
    document.head.appendChild(style);
    const section = el('section'); section.id = 'tw-weather'; section.setAttribute('aria-label', '台北旅行の天気と服装');
    const top = el('div', 'tw-weather-top'); top.appendChild(el('h2', '', '台北の天気・気温・湿度・服装'));
    const button = el('button', '', '天気を更新'); button.id = 'tw-weather-refresh'; button.type = 'button'; button.addEventListener('click', refresh); top.appendChild(button); section.appendChild(top);
    const body = el('div', '', '最新の天気を取得しています…'); body.id = 'tw-weather-body'; body.setAttribute('aria-live', 'polite'); section.appendChild(body);
    const foot = el('div', 'tw-weather-foot'); const stamp = el('span'); stamp.id = 'tw-weather-stamp'; foot.appendChild(stamp);
    const link = el('a', '', '天気データ：Open-Meteo'); link.href = SOURCE; link.target = '_blank'; link.rel = 'noopener'; foot.appendChild(link); section.appendChild(foot);
    const tip = main.querySelector('.tip');
    if (tip) tip.insertAdjacentElement('afterend', section); else main.prepend(section);
    refresh();
    document.addEventListener('visibilitychange', () => {if (!document.hidden) refresh();});
    setInterval(() => {if (!document.hidden) refresh();}, 15 * 60 * 1000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup); else setup();
})();
