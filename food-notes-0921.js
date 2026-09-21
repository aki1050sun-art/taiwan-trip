/* 9/21 food notes: preserve itinerary order, statuses and saved reviews. */
(function(){
  'use strict';
  const day=(window.TRIP_DATA||[]).find(d=>d.date.includes('9/21'));
  if(!day)return;
  const area=day.areas.find(a=>a.area==='東門・永康街');
  const addNote=(name,note)=>{
    const place=area?.places.find(p=>p.name===name);
    if(place && !place.category.includes(note))place.category+='　'+note;
  };
  addNote('甜滿','🎁 お土産：クラッカー');
  addNote('永康牛肉麵（Yongkang Beef Noodles）','🌶 八角が効いている・辛い');

  const qingdao=day.areas.find(a=>a.area==='善導寺・青島');
  const shuangyue=qingdao?.places.find(p=>p.name==='雙月食品社 青島店');
  if(shuangyue){
    shuangyue.category=shuangyue.category.replace('ピリ辛胡麻麺','チリ胡麻混ぜそば（愛恨椒芝麺）');
    if(!shuangyue.category.includes('トリュフ混ぜそば')){
      shuangyue.category=shuangyue.category.replace('／アサリと鶏のスープ','／トリュフ混ぜそば／アサリと鶏のスープ');
    }
  }
})();
