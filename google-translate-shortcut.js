/* Shortcut to Google Translate; the OS/browser decides whether the installed app opens. */
(function () {
  'use strict';
  function setup() {
    const app = document.getElementById('app');
    if (!app || document.getElementById('google-translate-shortcut')) return;
    const bar = document.createElement('div');
    bar.id = 'google-translate-shortcut';
    bar.style.cssText = 'display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap;background:#edf7ff;border:1px solid #bfdbfe;border-radius:12px;padding:11px 12px;margin:8px 0 4px';
    const heading = document.createElement('div');
    const title = document.createElement('strong');
    title.style.cssText = 'font-size:15px;color:#163e63';
    title.textContent = '🌐 Google翻訳';
    const detail = document.createElement('div');
    detail.style.cssText = 'font-size:12px;color:#475569;margin-top:3px';
    detail.textContent = '日本語 → 台湾の繁体字中国語';
    heading.append(title, detail);
    const link = document.createElement('a');
    link.href = 'https://translate.google.com/?sl=ja&tl=zh-TW&op=translate';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = '翻訳を開く ↗';
    link.setAttribute('aria-label', 'Google翻訳を開く（日本語から台湾の繁体字中国語へ）');
    link.style.cssText = 'display:inline-block;box-sizing:border-box;background:#1565c0;color:#fff;text-decoration:none;border-radius:10px;padding:12px 17px;font-size:16px;font-weight:800;text-align:center;min-height:44px';
    bar.append(heading, link);
    const drink = app.querySelector('.drinkbar');
    if (drink) drink.insertAdjacentElement('afterend', bar);
    else app.prepend(bar);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();
