/* Shop information badges: Google rating + spice guidance.
 * Google ratings are a dated snapshot (2026-09-23) and may change.
 * Spice guidance is a practical travel aid, not a recipe claim; recipes vary by dish.
 */
(function(){
'use strict';

const INFO={
  '阿富海鮮粥':{g:4.1,n:975,f:'少',s:'少',note:'海鮮粥・揚げ物中心。八角・五香粉は主役になりにくい。'},
  '鴻水餃牛肉麵':{g:4.3,n:1164,f:'普通',s:'普通',note:'牛肉麵は煮込み香辛料を感じやすい。ニラ餃子は比較的弱め。'},
  '阜杭豆漿':{g:4.1,n:23576,f:'少',s:'少',note:'豆漿・蛋餅・燒餅系。八角・五香粉は基本的に目立ちにくい。'},
  '古北饕 Goodbeitao':{g:4.4,n:2472,f:'少',s:'少',note:'小籠包・点心中心。料理によって差はあるが香辛料は比較的穏やか。'},
  '天天利美食坊':{g:4.1,n:8532,f:'普通',s:'普通',note:'魯肉飯など煮込み系は八角・五香粉系の香りを感じる場合あり。'},
  '阿宗麵線':{f:'少',s:'普通',note:'麵線自体は穏やか。辛味調味料を足すと強くなる。'},
  '脆皮鮮奶甜甜圈 晴光總店':{f:'ほぼなし',s:'ほぼなし',note:'甘い揚げ菓子。八角・五香粉系は通常使わない。'},
  'Jade Boat 191 澎玉191':{na:true},
  '妙口四神湯 肉包':{g:4.1,n:1799,f:'少',s:'普通',note:'四神湯は薬膳系の香り。八角・五香粉とは別系統の風味。'},
  '北門蝦仁飯・煲湯':{g:4.0,n:1176,f:'少',s:'少',note:'蝦仁飯・煲湯中心で香辛料感は比較的穏やか。'},
  '豆花荘':{g:4.2,n:6674,f:'ほぼなし',s:'ほぼなし',note:'豆花・甘味中心。'},
  '方家雞肉飯':{g:4.0,n:1833,f:'少',s:'少',note:'雞肉飯は比較的やさしい味付け。'},
  '良粟商號':{g:4.3,n:1981,f:'ほぼなし',s:'少',note:'炭焼きトースト・サンドイッチ中心。'},
  'fruitos 森果治':{g:4.6,n:266,f:'ほぼなし',s:'ほぼなし',note:'フルーツ・サンド・ジュース中心。'},
  'ㄇㄇ紫米飯糰':{g:4.2,n:151,f:'少',s:'少',note:'紫米飯糰。具材により差があるが香辛料は比較的弱め。'},
  '甜滿':{f:'ほぼなし',s:'ほぼなし',note:'ベーカリー・スイーツ系。'},
  '天津蔥抓餅':{g:3.6,n:4221,f:'少',s:'少',note:'蔥抓餅自体は香辛料が強くない。ソース追加で変わる。'},
  '雙月食品社 青島店':{g:4.8,n:24702,f:'少',s:'普通',note:'スープ類は穏やか。愛恨椒芝麵など辛味メニューは香辛料感が上がる。'},
  '双連現烤蛋糕':{g:4.3,n:433,f:'ほぼなし',s:'ほぼなし',note:'台湾カステラ・焼き菓子系。'},
  'COOKIE886':{g:4.4,n:1626,f:'ほぼなし',s:'ほぼなし',note:'バタークッキー中心。'},
  '香滿園':{g:4.4,n:1785,f:'普通',s:'普通',note:'魯肉飯など煮込み料理は八角・五香粉系の香りを感じる場合あり。'},
  '林記牛肉麵（Lin Ji Beef Noodle Restaurant）':{f:'普通',s:'普通',note:'牛肉麵の煮込みは香辛料を感じやすい。実際の強さは当日のスープ次第。'},
  '黃記魯肉飯（Huang Ji Braised Pork）':{g:4.2,n:6295,f:'普通',s:'普通',note:'魯肉飯の煮込み香があるため、八角・五香粉が気になる人は少量から。'},
  '丸林魯肉飯':{f:'普通',s:'普通',note:'魯肉飯系は煮込み香辛料を感じる場合あり。'},
  '永康牛肉麵（Yongkang Beef Noodles）':{f:'普通',s:'普通',note:'牛肉麵は煮込み香辛料を感じやすい。'},
  '好公道金雞園':{g:4.0,n:4148,f:'少',s:'少',note:'小籠包・点心中心で、八角・五香粉は目立ちにくい。'},
  '済南鮮湯包 総店':{f:'少',s:'少',note:'湯包・点心中心。'},
  '阿城鵝肉':{g:4.4,n:6769,f:'普通',s:'普通',note:'燻製・台湾小吃系。料理によって香辛料感に差がある。'},
  '杏福氷館':{f:'ほぼなし',s:'ほぼなし',note:'かき氷・杏仁豆腐中心。'}
};

function shopName(card){
  const el=card.querySelector('.name');
  if(!el)return '';
  for(const node of el.childNodes){
    if(node.nodeType===Node.TEXT_NODE&&node.textContent.trim())return node.textContent.trim();
  }
  return el.textContent.replace(/マスト|候補|訪問済み/g,'').trim();
}
function fmt(n){return new Intl.NumberFormat('ja-JP').format(n);}
function setup(){
  if(document.getElementById('shopMetaLegend'))return;
  const app=document.getElementById('app');if(!app)return;
  const style=document.createElement('style');
  style.textContent='.shopmeta{margin-top:7px;padding:7px 8px;border-radius:9px;background:#f8fafc;border:1px solid #e2e8f0}.shopmeta-chips{display:flex;flex-wrap:wrap;gap:5px}.shopmeta-chip{font-size:11px;font-weight:800;border-radius:999px;padding:4px 7px;background:#eef2ff;color:#3730a3}.shopmeta-chip.spice{background:#fff7ed;color:#9a3412}.shopmeta-note{font-size:11px;color:#64748b;margin-top:5px;line-height:1.45}#shopMetaLegend{background:#f8fafc;border:1px solid #cbd5e1;border-radius:12px;padding:10px 12px;margin:8px 0;font-size:12px;line-height:1.55;color:#475569}';
  document.head.append(style);
  const legend=document.createElement('div');legend.id='shopMetaLegend';
  legend.textContent='⭐ お店情報：Google評価は2026/9/23確認時点の目安で、今後変動します。「八角・五香粉」「香辛料感」は料理傾向からの実用的な目安（ほぼなし／少／普通／多）。メニューや調理で変わるため断定値ではありません。';
  const firstTip=app.querySelector('.tip');
  if(firstTip)firstTip.insertAdjacentElement('afterend',legend);else app.prepend(legend);
  for(const card of app.querySelectorAll('.place')){
    if(card.querySelector('.shopmeta'))continue;
    const name=shopName(card),info=INFO[name];if(!info||info.na)continue;
    const box=document.createElement('div');box.className='shopmeta';
    const chips=document.createElement('div');chips.className='shopmeta-chips';
    if(typeof info.g==='number'){
      const c=document.createElement('span');c.className='shopmeta-chip';
      c.textContent='Google ★'+info.g.toFixed(1)+(info.n?'（'+fmt(info.n)+'件）':'');
      chips.append(c);
    }
    if(info.f){
      const c=document.createElement('span');c.className='shopmeta-chip spice';c.textContent='八角・五香粉：'+info.f;chips.append(c);
    }
    if(info.s){
      const c=document.createElement('span');c.className='shopmeta-chip spice';c.textContent='香辛料感：'+info.s;chips.append(c);
    }
    box.append(chips);
    if(info.note){
      const note=document.createElement('div');note.className='shopmeta-note';note.textContent=info.note;box.append(note);
    }
    const meta=card.querySelector('.meta');
    (meta||card.firstElementChild)?.insertAdjacentElement('afterend',box);
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();