/* Shared ordering shortcut: preserve drink choices, itinerary, and stored family reviews. */
(function () {
  'use strict';
  function setup() {
    const bar = document.querySelector('#app .drinkbar');
    const drinkModal = document.getElementById('drinkModal');
    if (!bar || !drinkModal || typeof openOrder !== 'function' || typeof setOrderPhrase !== 'function') return;

    const heading = bar.querySelector('strong');
    if (heading) heading.textContent = '📋 注文サポート';
    const modalHeading = drinkModal.querySelector('.modalhead [style*="font-weight"]');
    if (modalHeading) modalHeading.textContent = '📋 注文サポート｜ドリンク';

    if (document.getElementById('requestSmallPlates')) return;
    bar.style.flexWrap = 'wrap';
    bar.style.gap = '8px';
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'requestSmallPlates';
    button.className = 'drinkbtn';
    button.style.background = '#075985';
    button.textContent = '取り皿をください';
    button.setAttribute('aria-label', '取り皿をください：中国語を表示する');
    button.addEventListener('click', function () {
      openOrder('共通フレーズ');
      setOrderPhrase('不好意思，可以給我們幾個小盤子嗎？謝謝。', '取り皿をください。');
    });
    bar.appendChild(button);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();
