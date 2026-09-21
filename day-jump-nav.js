/* Day shortcuts to the shop-by-shop launcher sections (not itinerary images).
 * Read-only navigation: does not edit trip data, visit statuses, or family reviews.
 */
(function () {
  'use strict';
  function setup() {
    const app = document.getElementById('app');
    if (!app || document.getElementById('tripDayJumpNav')) return;
    const days = Array.from(app.querySelectorAll('.day')).filter(day => day.querySelector('h2'));
    if (!days.length) return;

    const style = document.createElement('style');
    style.textContent = `
      #tripDayJumpNav{background:#fff;border:1px solid #bfdbfe;border-radius:14px;padding:12px;margin:8px 0 12px;box-shadow:0 2px 8px #0001}
      #tripDayJumpNav .tdj-title{font-size:13px;font-weight:850;color:#163e63;margin-bottom:9px}
      #tripDayJumpNav .tdj-buttons{display:flex;flex-wrap:wrap;gap:8px}
      #tripDayJumpNav .tdj-button{flex:1 1 68px;min-width:68px;border:1px solid #93c5fd;border-radius:10px;background:#eff6ff;color:#1d4ed8;padding:11px 9px;font-size:15px;font-weight:800;font-family:inherit;cursor:pointer}
      #tripDayJumpNav .tdj-button:focus-visible{outline:3px solid #2563eb;outline-offset:2px}
      #tripDayJumpNav .tdj-button:active{background:#dbeafe}
      .day.tdj-target{scroll-margin-top:88px}
    `;
    document.head.appendChild(style);

    const nav = document.createElement('nav');
    nav.id = 'tripDayJumpNav';
    nav.setAttribute('aria-label', '日付別のお店一覧へ移動');
    const title = document.createElement('div');
    title.className = 'tdj-title';
    title.textContent = '📅 日付を選んで、お店・スポット一覧へ';
    const buttons = document.createElement('div');
    buttons.className = 'tdj-buttons';
    days.forEach((day, index) => {
      const heading = day.querySelector('h2');
      const dateText = heading.textContent.trim();
      const dateMatch = dateText.match(/(?:^|\D)(\d{1,2})\s*\/\s*(\d{1,2})(?:\D|$)/);
      const label = dateMatch ? dateMatch[2] + '日' : dateText;
      day.id = day.id || ('trip-day-' + (dateMatch ? dateMatch[1] + '-' + dateMatch[2] : index + 1));
      day.classList.add('tdj-target');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'tdj-button';
      button.textContent = label;
      button.setAttribute('aria-label', dateText + 'のお店・スポット一覧へ移動');
      button.addEventListener('click', () => {
        const header = document.querySelector('header');
        const headerHeight = header ? header.getBoundingClientRect().height : 0;
        const top = window.scrollY + day.getBoundingClientRect().top - headerHeight - 10;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      });
      buttons.appendChild(button);
    });
    nav.append(title, buttons);
    app.insertBefore(nav, app.firstChild);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();
