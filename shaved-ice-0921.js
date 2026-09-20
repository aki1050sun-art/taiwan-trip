/* September 21 evening shaved-ice stop: shop name supplied by traveler. */
(function(){
  'use strict';
  const MAP='https://maps.app.goo.gl/1igYPHiukokMxbFQ7?g_st=al';
  function setup(){
    if(document.getElementById('sep21-shaved-ice'))return;
    const day=Array.from(document.querySelectorAll('#app .day')).find(section=>section.querySelector('h2')?.textContent.includes('9/21'));
    if(!day)return;
    const area=document.createElement('div');
    area.className='area';
    area.id='sep21-shaved-ice';
    area.setAttribute('aria-label','9月21日 夜のかき氷・杏福氷館');
    const head=document.createElement('div');head.className='areahead';
    const h=document.createElement('h3');h.textContent='🌙 夜｜かき氷';head.appendChild(h);area.appendChild(head);
    const item=document.createElement('div');
    item.style.cssText='padding:12px 6px 5px;border-top:1px solid #eee;margin-top:10px';
    const name=document.createElement('div');name.className='name';name.textContent='杏福氷館';item.appendChild(name);
    const meta=document.createElement('div');meta.className='meta';meta.style.cssText='font-size:14px;line-height:1.6;margin:7px 0 12px';meta.textContent='9月21日（月）の夜に訪問予定。かき氷を食べたい。';item.appendChild(meta);
    const link=document.createElement('a');link.className='mapbtn';link.href=MAP;link.target='_blank';link.rel='noopener noreferrer';link.style.cssText='display:inline-block;font-size:15px;padding:12px 15px';link.textContent='📍 杏福氷館をGoogleマップで開く';item.appendChild(link);
    area.appendChild(item);
    day.appendChild(area);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();