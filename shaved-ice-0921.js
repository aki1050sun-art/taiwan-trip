/* September 21 evening shaved-ice stop. The short Maps URL cannot currently be resolved to a verified shop name. */
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
    area.setAttribute('aria-label','9月21日 夜のかき氷');
    const head=document.createElement('div');head.className='areahead';
    const h=document.createElement('h3');h.textContent='🌙 夜｜かき氷';head.appendChild(h);area.appendChild(head);
    const item=document.createElement('div');
    item.style.cssText='padding:12px 6px 5px;border-top:1px solid #eee;margin-top:10px';
    const name=document.createElement('div');name.className='name';name.textContent='かき氷のお店（店名確認中）';item.appendChild(name);
    const meta=document.createElement('div');meta.className='meta';meta.style.cssText='font-size:14px;line-height:1.6;margin:7px 0 12px';meta.textContent='9月21日（月）の夜に訪問したいお店。お送りいただいたGoogleマップの地点をそのまま開きます。';item.appendChild(meta);
    const link=document.createElement('a');link.className='mapbtn';link.href=MAP;link.target='_blank';link.rel='noopener noreferrer';link.style.cssText='display:inline-block;font-size:15px;padding:12px 15px';link.textContent='📍 このお店をGoogleマップで開く';item.appendChild(link);
    const note=document.createElement('div');note.className='meta';note.style.cssText='font-size:12px;margin-top:10px;line-height:1.6';note.textContent='※共有リンクから店名・住所を確認できなかったため、別のお店と取り違えないよう仮表示にしています。';item.appendChild(note);
    area.appendChild(item);
    day.appendChild(area);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();