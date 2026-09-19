/* Place the weather section after the complete itinerary and explain umbrella guidance. */
(function () {
  'use strict';
  function umbrellaAdvice(value) {
    if (!Number.isFinite(value)) return '予報がないため判断できません';
    if (value >= 70) return '傘を持って外出';
    if (value >= 40) return '折りたたみ傘を携帯';
    if (value >= 20) return '折りたたみ傘があると安心';
    return '雨が少ない予報でも、急な雨には注意';
  }
  function annotateWeather() {
    const section = document.getElementById('tw-weather');
    if (!section) return;
    const heading = section.querySelector('h2');
    if (heading) heading.textContent = '台北の天気・気温・湿度・傘・服装';
    section.querySelectorAll('.tw-weather-day').forEach(day => {
      const detail = Array.from(day.querySelectorAll('.tw-weather-details'))
        .find(node => node.textContent.startsWith('降水確率（最大） '));
      if (!detail) return;
      const match = detail.textContent.match(/降水確率（最大）\s*(\d+(?:\.\d+)?)%/);
      const probability = match ? Number(match[1]) : NaN;
      detail.textContent = '傘の目安｜降水確率（その日の最大） ' +
        (match ? match[1] + '%' : '—') + ' ／ ' + umbrellaAdvice(probability);
      detail.style.fontWeight = '800';
      detail.style.fontSize = '15px';
      detail.style.color = '#1d4ed8';
    });
    const body = document.getElementById('tw-weather-body');
    if (body && !body.querySelector('.tw-umbrella-note')) {
      const note = document.createElement('div');
      note.className = 'tw-weather-note tw-umbrella-note';
      note.textContent = '「傘の目安」は降水確率に基づく持参の目安です。降水確率は傘を使う確率そのものではありません。表示値はその日の予報の最大値です。';
      body.appendChild(note);
    }
  }
  function setup() {
    const section = document.getElementById('tw-weather');
    const main = document.getElementById('app');
    if (!section || !main) return;
    // The itinerary renders its days into #app; append weather only after the last day (9/22).
    main.appendChild(section);
    const body = document.getElementById('tw-weather-body');
    if (!body) return;
    const observer = new MutationObserver(() => {
      observer.disconnect();
      annotateWeather();
      observer.observe(body, {childList: true, subtree: true});
    });
    annotateWeather();
    observer.observe(body, {childList: true, subtree: true});
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
