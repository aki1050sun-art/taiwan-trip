/* 9/21 food notes: append only the requested descriptions; preserve itinerary order, statuses and saved reviews. */
(function(){
  'use strict';
  const day=(window.TRIP_DATA||[]).find(d=>d.date.includes('9/21'));
  const area=day?.areas.find(a=>a.area==='東門・永康街');
  if(!area)return;
  const addNote=(name,note)=>{
    const place=area.places.find(p=>p.name===name);
    if(place && !place.category.includes(note))place.category+='　'+note;
  };
  addNote('甜滿','🎁 お土産：クラッカー');
  addNote('永康牛肉麵（Yongkang Beef Noodles）','🌶 八角が効いている・辛い');
})();
