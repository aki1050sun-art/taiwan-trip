/* 9/21: 晴光市場早餐店 is optional, not a must-visit. Leave all other itinerary and review data untouched. */
(function(){
  'use strict';
  const day=(window.TRIP_DATA||[]).find(d=>d.date.includes('9/21'));
  const area=day?.areas.find(a=>a.area==='晴光市場・ホテル周辺');
  const place=area?.places.find(p=>p.name==='晴光市場早餐店');
  if(place)place.status='候補';
})();
