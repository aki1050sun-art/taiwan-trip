/* Station/exit reference for the September 2026 Taipei family itinerary.
 * Exit facilities: Taipei Metro official station information. Store exits are
 * explicitly qualified: an area fallback is NOT claimed to be a verified nearest exit.
 */
(function(){
'use strict';
const ST={
 elem:{name:'中山國小',code:'O10',id:'130',up:['1','2','3','4'],both:['1'],lift:['2','4']},
 shuang:{name:'雙連',code:'R12',id:'054',up:['1','2'],both:['2'],lift:['2']},
 minquan:{name:'民權西路',code:'R13・O11',id:'055',up:['7','10'],both:[],lift:['10']},
 shandao:{name:'善導寺',code:'BL13',id:'088',up:['1','3','4','6'],both:['1','3','4','6'],lift:['3']},
 longshan:{name:'龍山寺',code:'BL10',id:'085',up:['1','2'],both:['1','2'],lift:['1']},
 ximen:{name:'西門',code:'BL11・G12',id:'086',up:['1','3','4','6'],both:['3','4','6'],lift:['4','6']},
 beimen:{name:'北門',code:'G13',id:'105',up:['1','2','3'],both:[],lift:['2','3']},
 bridge:{name:'大橋頭',code:'O12',id:'128',up:['1','1A','2','3'],both:['1','1A','3'],lift:['1']},
 zhongshan:{name:'中山',code:'R11・G14',id:'053',up:['1','4','5','6'],both:['1','4','5','6'],lift:['4','5','6']},
 xingtian:{name:'行天宮',code:'O09',id:'131',up:['1','2','3','4'],both:['2','4'],lift:['2']},
 dongmen:{name:'東門',code:'R07・O06',id:'134',up:['1','3','5','7'],both:['5'],lift:['8']},
 xinsheng:{name:'忠孝新生',code:'BL14・O07',id:'089',up:['2','3','4','5','6'],both:['2','3','4','5','6'],lift:['2','3']},
 taipei:{name:'台北車站（台北駅・M出口）',code:'BL12・R10',id:'051',up:['M1','M2','M3','M4','M5','M8'],both:['M1','M2','M3','M4','M5','M8'],lift:['M2','M4']},
 memorial:{name:'中正紀念堂',code:'G10・R08',id:'042',up:['1','2','3','5','7'],both:['1','5'],lift:['1','5']},
 yuanshan:{name:'圓山',code:'R14',id:'056',up:[],both:[],lift:[]},
 airportA1:{name:'桃園機場捷運 A1 台北車站',code:'A1（空港MRT・台北MRTとは別駅）',id:null,up:[],both:[],lift:[]},
 airportT2:{name:'桃園機場捷運 A13 機場第二航廈',code:'A13（空港MRT）',id:null,up:[],both:[],lift:[]}
};
// [station, a commonly cited shop exit, caveat]. Empty exit means NOT verified.
const SHOP={
 '撞記 水果 果汁 雪花冰':['elem','','錦州街の店舗。出口の最短経路は未確認。'],
 '徳恵鵝肉専売店':['elem','','錦州街の店舗。出口の最短経路は未確認。'],
 '黃記魯肉飯（Huang Ji Braised Pork）':['elem','1','店舗へのアクセス案内に基づく。'],
 '丸林魯肉飯':['yuanshan','','民族店（民族東路32號）を想定。農安店の場合は駅・出口が異なるため、利用店を確認してください。'],
 '阿富海鮮粥':['elem','','屋台の場所をGoogleマップで確認してください。'],
 '鴻水餃牛肉麵':['elem','','店舗の出口情報は未確認。'],
 '三葉足体養生館':['elem','','店舗の出口情報は未確認。'],
 '阜杭豆漿':['shandao','5','5番出口は階段。エスカレーターなら6番出口（道路の反対側から回り込み）。'],
 '龍山寺':['longshan','1','龍山寺の一般的なアクセス口。'],
 '剝皮寮歷史街區':['longshan','3','歴史街区の入口によって近い出口は変わります。3番出口にはエスカレーターなし。'],
 '小王煮瓜（Wang’s Broth）':['longshan','','華西街の店舗。最短出口は未確認。'],
 '本丸飯糰':['dongmen','','仁愛路二段の店舗。最短出口は未確認。'],
 '古北饕 Goodbeitao':['shandao','5','店の案内に善導寺5番出口と記載。階段を避けるなら4番出口（徒歩距離増）。'],
 '天天利美食坊':['ximen','6','西門町の漢中街方面。'],
 '北門蝦仁飯・煲湯':['beimen','','天水路方面。最短出口は未確認。'],
 '妙口四神湯 肉包':['bridge','1A','迪化街北側方面。北門駅3番出口から歩く案内もあります。'],
 'Jade Boat 191 澎玉191':['bridge','','迪化街一段191號。最短出口は未確認。'],
 '霞海城隍廟':['beimen','','迪化街一段61號。最短出口は未確認。'],
 '迪化街':['beimen','','長い商店街のため、目的地の位置で近い駅・出口が変わります。ここでは南側からのアクセス例。'],
 '豆花荘':['shuang','1','寧夏路49號への徒歩アクセス目安。'],
 '方家雞肉飯':['shuang','1','寧夏夜市の屋台。屋台位置や入口により歩行距離が変わります。'],
 '寧夏夜市':['shuang','1','夜市には複数の入口があります。雙連駅からの一般的なアクセス例。'],
 '良粟商號':['xingtian','4','松江路330巷方面。店舗別の最短距離は現地の地図で確認。'],
 'fruitos 森果治':['xingtian','4','松江路376號方面。店舗別の最短距離は現地の地図で確認。'],
 '軟食力 行天宮店':['xingtian','','民權東路方面。最短出口は未確認。'],
 '阿城鵝肉':['xingtian','','吉林一店・二店など複数店舗あり。利用する支店を決めて駅・出口を確認してください。'],
 '晴光市場早餐店':['elem','','お店の正確な番地は未確認。市場周辺の駅情報です。'],
 '曾家豆漿':['xingtian','','錦州街123號の店舗。最短出口は未確認。'],
 '甜滿':['dongmen','5','永康街方面。'],
 '永康牛肉麵（Yongkang Beef Noodles）':['dongmen','3','金山南路方面。3番出口は地上への上りエスカレーターあり。'],
 '好公道金雞園':['dongmen','5','永康街方面。店舗別の最短距離は現地の地図で確認。'],
 '済南鮮湯包 総店':['xinsheng','6','濟南路三段の店舗。'],
 '巧之味手工水餃 済南店':['shandao','','濟南路二段の店舗。最短駅・出口は未確認。'],
 '一品活蝦（Yi Ping Fresh Shrimp）':['dongmen','','支店が複数あります。行く店舗を決めて駅・出口を確認してください。'],
 'Rongjin Gorgeous Time 榕錦時光生活園區':['dongmen','','金華街の園区。入口により近い出口は変わります。'],
 '天津蔥抓餅':['dongmen','5','永康街方面。店舗別の最短距離は現地の地図で確認。'],
 '雙月食品社 青島店':['shandao','3','店舗公式サイトに善導寺3番出口と記載。'],
 '青島飯糰':['taipei','M8','青島西路13號。M8出口は上下エスカレーター。'],
 'COOKIE886':['shuang','1','民生西路66巷の台北店。'],
 '面線町':['zhongshan','','赤峰街49巷方面。最短出口は未確認。'],
 '無印良品 中山 台北':['zhongshan','','中山エリアに複数店あり。行く店舗を確認してください。'],
 '新光三越台北南西一館':['zhongshan','2','南京西路12號に隣接。2番出口は階段。'],
 '赤峰街':['zhongshan','5','赤峰街は南北に延びます。南端のアクセス例。'],
 '脆皮鮮奶甜甜圈 晴光總店':['elem','1','晴光總店への複数のアクセス案内に基づく。'],
 '阿宗麵線':['ximen','6','峨眉街の本店。'],
 '幸福堂 西門町全球旗艦店':['ximen','','漢中街方面。最短出口は未確認。'],
 '西門 梁山泊小籠湯包':['ximen','','漢口街二段の店舗。最短出口は未確認。'],
 '師園鹽酥雞 西門店':['ximen','','支店の住所に複数の掲載情報あり。現地で確認してください。'],
 '漢口小籠湯包':['ximen','','店の住所・最短出口が未確認です。'],
 '龍都冰果專業家':['longshan','','和平西路三段の店舗。最短出口は未確認。'],
 '可蜜達吐司（Comida Toast）':['beimen','','支店が複数あります。利用する店舗の住所を確認してください。'],
 '香滿園':['shuang','2','萬全街方面。雙連2番出口からのアクセス目安。'],
 '雙連朝市':['shuang','2','市場は広いため入口で出口が変わります。萬全街方面のアクセス例。'],
 '中正紀念堂':['memorial','5','紀念堂側の入口。'],
 '大川本舗現烤蛋糕':['shuang','1','民生西路103號方面。店舗別の最短距離は現地の地図で確認。'],
 '劉山東牛肉麵':['taipei','M6','開封街一段14巷。M6は階段。エスカレーター利用ならM5番出口。地下街Z出口を使う道順もあります。'],
 'A1 台北車站 桃園機場捷運':['airportA1','','空港MRTの駅は台北MRTのM出口とは別です。A1の出口番号・エスカレーター位置は未確認。'],
 '桃園国際空港 第2ターミナル':['airportT2','','第2ターミナル連絡駅。改札から航空会社チェックイン階へは館内の案内表示を確認してください。']
};
const AREA={
 'ホテル周辺・雙城街':'elem','善導寺（朝）':'shandao','龍山寺・萬華':'longshan','善導寺（昼）':'shandao','西門（天天利）':'ximen','北門・迪化街・大稻埕':'beimen','寧夏夜市':'shuang',
 'ホテル周辺（余裕があれば）':'elem','行天宮周辺':'xingtian','晴光市場・ホテル周辺':'elem','東門・永康街':'dongmen','善導寺・青島':'shandao','中山・赤峰街':'zhongshan','晴光市場（ドーナツ）':'elem','西門':'ximen','ホテル周辺（夜）':'elem','雙連（朝）':'shuang','中正紀念堂':'memorial','雙連（大川本舗）':'shuang','台北駅・開封街':'taipei','空港移動':'airportA1'
};
const sourceURL=s=>s.id?'https://web.metro.taipei/pages2026/WebStation/'+s.id:'https://www.tymetro.com.tw/';
const mapURL=(s,exit)=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('台北捷運 '+s.name+(exit?' '+exit+'號出口':''));
function nameOf(place){const el=place.querySelector('.name');if(!el)return '';for(const n of el.childNodes)if(n.nodeType===3&&n.textContent.trim())return n.textContent.trim();return ''}
function line(parent,head,body){const p=document.createElement('p');p.style.cssText='margin:12px 0;line-height:1.65';const b=document.createElement('strong');b.textContent=head;p.append(b,document.createTextNode(body));parent.append(p)}
function escDescription(s,exit){if(!exit)return null;if(s.both.includes(exit))return '上下両方向';if(s.up.includes(exit))return '地上へ上りのみ';return null}
function openInfo(name,area){const entry=SHOP[name]||[AREA[area]||null,'','駅・出口の個別情報は未確認。'];const s=ST[entry[0]];const modal=document.getElementById('mrt-info-modal'),content=document.getElementById('mrt-info-content');content.replaceChildren();
 const h=document.createElement('h2');h.textContent='🚇 '+name;h.style.cssText='font-size:20px;line-height:1.45;margin:0 0 12px';content.append(h);
 if(!s){line(content,'駅情報：','利用店舗・住所が未確認です。Googleマップで目的地を確認してください。');return show(modal)}
 line(content,'利用する駅：',s.name+'（'+s.code+'）');
 const exit=entry[1],qualifier=entry[2]||'';
 line(content,exit?'お店へ向かう出口：':'お店の最寄り出口：',exit?exit+'番出口（徒歩アクセスの目安。厳密な最短出口の保証ではありません）':'個別には未確認');
 if(qualifier)line(content,'補足：',qualifier);
 const best=exit&&s.up.includes(exit)?exit:(s.both[0]||s.up[0]||null);
 if(best){line(content,'エスカレーターで地上へ：',best+'番出口（'+escDescription(s,best)+'）'+(exit&&best!==exit?'。お店側の出口より少し歩く場合があります。':''));
  if(exit&&!s.up.includes(exit)&&s.both.length>0&&best!==s.both[0])line(content,'上下両方向の出口：',s.both[0]+'番出口');
  else if(exit&&s.up.includes(exit)&&!s.both.includes(exit)&&s.both.length)line(content,'上下両方向を使える別出口：',s.both[0]+'番出口');
 }else line(content,'エスカレーター：','該当する出口を確認できていません。駅の公式案内をご確認ください。');
 if(s.lift.length)line(content,'エレベーター：',s.lift.join('・')+'番出口（駅の公式設備表による）');
 const note=document.createElement('p');note.textContent='※駅の出口設備は台北捷運の公式資料を参照。出口と店舗の距離・動線は現地の工事、横断歩道、店舗の入口で変わります。エスカレーターは上りのみの出口もあります。';note.style.cssText='font-size:12px;line-height:1.6;color:#475569;margin:12px 0';content.append(note);
 const links=document.createElement('div');links.style.cssText='display:flex;flex-wrap:wrap;gap:8px;margin-top:14px';
 function link(text,url){const a=document.createElement('a');a.textContent=text;a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.style.cssText='display:inline-block;padding:10px 12px;border-radius:9px;background:#1565c0;color:white;text-decoration:none;font-size:14px;font-weight:800';links.append(a)}
 link('🚇 駅の公式出口・設備表',sourceURL(s));link('📍 お店への徒歩経路','https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(s.name+' 捷運站 '+(best||exit||'')+' 出口 台北')+'&destination='+encodeURIComponent(name+' 台北')+'&travelmode=walking');
 if(exit)link('📍 '+exit+'番出口の地図',mapURL(s,exit));content.append(links);show(modal)
}
function show(modal){modal.style.display='flex';modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function close(){const modal=document.getElementById('mrt-info-modal');if(modal){modal.style.display='none';modal.setAttribute('aria-hidden','true');document.body.style.overflow=''}}
function setup(){if(document.getElementById('mrt-info-modal'))return;
 const modal=document.createElement('div');modal.id='mrt-info-modal';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-hidden','true');modal.setAttribute('aria-label','各お店の駅情報');modal.style.cssText='display:none;position:fixed;inset:0;z-index:150;align-items:center;justify-content:center;padding:12px;background:rgba(0,0,0,.64)';
 const card=document.createElement('div');card.style.cssText='background:white;color:#1f2937;border-radius:18px;width:min(620px,100%);max-height:90vh;overflow:auto;padding:18px;box-sizing:border-box;box-shadow:0 15px 55px #0005';
 const top=document.createElement('div');top.style.cssText='display:flex;justify-content:flex-end';const dismiss=document.createElement('button');dismiss.type='button';dismiss.textContent='閉じる ×';dismiss.style.cssText='border:0;border-radius:9px;background:#e2e8f0;padding:9px 12px;font-size:15px;font-weight:800;cursor:pointer';dismiss.addEventListener('click',close);top.append(dismiss);card.append(top);const content=document.createElement('div');content.id='mrt-info-content';card.append(content);modal.append(card);document.body.append(modal);modal.addEventListener('click',e=>{if(e.target===modal)close()});
 document.querySelectorAll('.day').forEach(day=>day.querySelectorAll('.area').forEach(area=>{const label=area.querySelector('.areahead h3')?.textContent.trim()||'';area.querySelectorAll('.place').forEach(place=>{const name=nameOf(place),actions=place.querySelector('.actions');if(!name||!actions||actions.querySelector('.station-info-btn'))return;const button=document.createElement('button');button.type='button';button.className='station-info-btn';button.textContent='🚇 お店の駅情報';button.style.cssText='background:#0f766e;color:white;border:0;border-radius:9px;font-size:13px;font-weight:800;font-family:inherit;padding:9px 11px;cursor:pointer';button.addEventListener('click',()=>openInfo(name,label));actions.append(button)})}));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();