/* 9/21: hide only the two restaurants the family decided not to visit. Do not alter stored reviews. */
(function(){
  'use strict';
  const day=(window.TRIP_DATA||[]).find(d=>d.date.includes('9/21'));
  const area=day?.areas.find(a=>a.area==='東門・永康街');
  if(!area)return;
  const skip=new Set(['永康牛肉麵（Yongkang Beef Noodles）','一品活蝦（Yi Ping Fresh Shrimp）']);
  area.places=area.places.filter(place=>!skip.has(place.name));
})();
