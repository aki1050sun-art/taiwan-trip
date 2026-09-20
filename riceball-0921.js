/* 9/21 morning: add ㄇㄇ紫米飯糰 immediately after the sandwich shop. Preserve all existing places and reviews. */
(function(){
  'use strict';
  const day=(window.TRIP_DATA||[]).find(d=>d.date.includes('9/21'));
  const morning=day?.areas.find(a=>a.area==='行天宮周辺');
  if(!morning)return;
  const name='ㄇㄇ紫米飯糰';
  if(morning.places.some(p=>p.name===name))return;
  const sandwich=morning.places.findIndex(p=>p.name==='良粟商號');
  if(sandwich<0)return;
  morning.places.splice(sandwich+1,0,{
    name,
    zh_name:name,
    category:'台湾おにぎり・紫米飯糰　🥡テイクアウト　📍台北市中山區農安街72之1號',
    status:'マスト'
  });
})();
