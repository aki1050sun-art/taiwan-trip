/* 9/21: keep only 一品活蝦 off the itinerary; restore 永康牛肉麵 with its existing note. Leave saved reviews untouched. */
(function(){
  'use strict';
  const day=(window.TRIP_DATA||[]).find(d=>d.date.includes('9/21'));
  const area=day?.areas.find(a=>a.area==='東門・永康街');
  if(!area)return;
  const skip=new Set(['一品活蝦（Yi Ping Fresh Shrimp）']);
  area.places=area.places.filter(place=>!skip.has(place.name));
})();
