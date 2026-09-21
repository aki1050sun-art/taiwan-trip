/* 9/22: two optional morning food stops near Chiang Kai-shek Memorial Hall. Preserve existing itinerary and stored reviews. */
(function () {
  'use strict';
  const day = (window.TRIP_DATA || []).find(d => d.date.includes('9/22'));
  if (!day) return;
  const areaName = '中正紀念堂周辺（朝の候補）';
  if (day.areas.some(a => a.area === areaName)) return;
  const memorialIndex = day.areas.findIndex(a => a.area === '中正紀念堂');
  if (memorialIndex < 0) return;
  day.areas.splice(memorialIndex, 0, {
    area: areaName,
    area_query: '中正紀念堂 台北',
    places: [
      {name: '劉媽媽飯糰', zh_name: '劉媽媽飯糰', category: '台湾おにぎり・紫米飯糰　🥡テイクアウト　⚠火曜5:10〜11:30（掲載情報）／売り切れ・当日営業要確認', status: '候補'},
      {name: '林記牛肉麵（Lin Ji Beef Noodle Restaurant）', zh_name: '林記牛肉麵', category: '牛肉麵　⚠10:30開店との地図掲載／早朝は営業していません', status: '候補'}
    ]
  });
})();
