/* Taxi destination addresses. Unknown or branch-ambiguous addresses are never guessed. */
(function(){
'use strict';
const HOTEL='台北市中山區林森北路568號';
const ADDRESS={
 '撞記 水果 果汁 雪花冰':'台北市中山區錦州街30巷1號',
 '徳恵鵝肉専売店':'台北市中山區錦州街36號',
 '黃記魯肉飯（Huang Ji Braised Pork）':'台北市中山區中山北路二段183巷28號',
 '阿富海鮮粥':'台北市中山區農安街14號前（雙城美食攤位）',
 '鴻水餃牛肉麵':'台北市中山區雙城街12號',
 '三葉足体養生館':'台北市中山區雙城街17-3號2樓',
 '阜杭豆漿':'台北市中正區忠孝東路一段108號2樓（華山市場）',
 '龍山寺':'台北市萬華區廣州街211號',
 '剝皮寮歷史街區':'台北市萬華區康定路173巷（歴史街区・番地なし）',
 '小王煮瓜（Wang’s Broth）':'台北市萬華區華西街17之4號',
 '本丸飯糰':'台北市中正區仁愛路二段39號之2',
 '古北饕 Goodbeitao':'台北市中正區杭州南路一段9號',
 '天天利美食坊':'台北市萬華區漢中街32巷1號',
 '北門蝦仁飯・煲湯':'台北市大同區天水路2-4號',
 '妙口四神湯 肉包':'台北市大同區民生西路388號',
 'Jade Boat 191 澎玉191':'台北市大同區迪化街一段191號',
 '霞海城隍廟':'台北市大同區迪化街一段61號',
 '迪化街':'台北市大同區迪化街一段（街区・番地なし）',
 '豆花荘':'台北市大同區寧夏路49號',
 '方家雞肉飯':'台北市大同區寧夏路（寧夏夜市・060號攤位）',
 '寧夏夜市':'台北市大同區寧夏路（夜市エリア）',
 '良粟商號':'台北市中山區松江路330巷8號',
 'fruitos 森果治':'台北市中山區松江路376之1號',
 '軟食力 行天宮店':'台北市中山區民權東路二段135巷30弄21號',
 '曾家豆漿':'台北市中山區錦州街123號',
 '甜滿':'台北市大安區永康街31巷10號',
 '永康牛肉麵（Yongkang Beef Noodles）':'台北市大安區金山南路二段31巷17號',
 '好公道金雞園':'台北市大安區永康街28-1號',
 '済南鮮湯包 総店':'台北市大安區濟南路三段20號',
 '巧之味手工水餃 済南店':'台北市中正區濟南路二段6號',
 'Rongjin Gorgeous Time 榕錦時光生活園區':'台北市大安區金華街167號',
 '天津蔥抓餅':'台北市大安區永康街6巷1號',
 '雙月食品社 青島店':'台北市中正區青島東路6之2號',
 '青島飯糰':'台北市中正區青島西路13號',
 'COOKIE886':'台北市中山區民生西路66巷25弄1號',
 '面線町':'台北市大同區赤峰街49巷25號1樓',
 '新光三越台北南西一館':'台北市中山區南京西路12號',
 '赤峰街':'台北市大同區赤峰街（街区・番地なし）',
 '脆皮鮮奶甜甜圈 晴光總店':'台北市中山區雙城街17巷24號',
 '阿宗麵線':'台北市萬華區峨眉街8-1號',
 '幸福堂 西門町全球旗艦店':'台北市萬華區漢中街101號',
 '西門 梁山泊小籠湯包':'台北市萬華區漢口街二段54-4號',
 '龍都冰果專業家':'台北市萬華區和平西路三段192號',
 '香滿園':'台北市大同區萬全街8巷（巷内・番地なし）',
 '雙連朝市':'台北市中山區民生西路45巷（市場エリア）',
 '中正紀念堂':'台北市中正區中山南路21號',
 '大川本舗現烤蛋糕':'台北市大同區民生西路103號',
 '劉山東牛肉麵':'台北市中正區開封街一段14巷2號',
 'A1 台北車站 桃園機場捷運':'台北市中正區鄭州路8號',
 '桃園国際空港 第2ターミナル':'桃園市大園區航站南路9號'
};
const NOTES={
 '丸林魯肉飯':'支店を確認してください。民族店：台北市中山區民族東路32號 ／ 農安店：台北市中山區農安街105號',
 '阿城鵝肉':'吉林一店：台北市中山區吉林路105號 ／ 吉林二店：台北市中山區吉林路162號（乗車前に店舗を確認）',
 '晴光市場早餐店':'晴光市場周辺。店の正確な番地は未確認のため、Googleマップで確認してください。',
 '一品活蝦（Yi Ping Fresh Shrimp）':'複数の店舗があります。行く支店と住所をGoogleマップで確認してください。',
 '無印良品 中山 台北':'複数の店舗があります。行く店舗と住所をGoogleマップで確認してください。',
 '師園鹽酥雞 西門店':'台北市萬華區成都路28號（掲載情報には32號もあります。乗車前にGoogleマップで確認）',
 '漢口小籠湯包':'店の正確な住所は未確認のため、Googleマップで確認してください。',
 '可蜜達吐司（Comida Toast）':'複数の店舗があります。北門店：台北市中正區中華路一段21巷14號。行く店舗を確認してください。'
};
function getName(place){const el=place.querySelector('.name');if(!el)return '';const node=Array.from(el.childNodes).find(x=>x.nodeType===Node.TEXT_NODE&&x.textContent.trim());return node?node.textContent.trim():el.textContent.replace(/マスト|候補/g,'').trim()}
function addressText(name){return ADDRESS[name]||NOTES[name]||'住所未確認。Googleマップで行き先を確認してください。'}
function setup(){
 const hotel=document.querySelector('.hotelbar strong');
 if(hotel&&!hotel.querySelector('.hotel-address')){const line=document.createElement('span');line.className='hotel-address';line.textContent='住所：'+HOTEL;line.style.cssText='display:block;margin-top:6px;font-size:17px;line-height:1.65;font-weight:750;overflow-wrap:anywhere';hotel.appendChild(line)}
 document.querySelectorAll('.place').forEach(place=>{const name=getName(place),button=place.querySelector('.taxibtn');if(!name||!button||place.querySelector('.taxi-address-line'))return;const line=document.createElement('div');line.className='taxi-address-line';line.textContent='住所：'+addressText(name);line.style.cssText='font-size:17px;line-height:1.65;font-weight:650;color:#1e293b;margin-top:7px;overflow-wrap:anywhere';const meta=place.querySelector('.meta');if(meta)meta.insertAdjacentElement('afterend',line);else place.querySelector('.name')?.insertAdjacentElement('afterend',line)});
 const taxiAddress=document.getElementById('taxiAddress');if(taxiAddress){taxiAddress.style.cssText+=';font-size:22px;font-weight:800;line-height:1.7;padding:16px;overflow-wrap:anywhere;color:#111827';}
 document.addEventListener('click',event=>{const target=event.target;if(!(target instanceof Element))return;const shop=target.closest('.taxibtn');if(shop){let name='';try{name=decodeURIComponent(shop.dataset.jp||'')}catch(e){name=shop.dataset.jp||''}const address=addressText(name);const box=document.getElementById('taxiAddress');if(box){box.style.display='block';box.textContent='地址：'+address}const map=document.getElementById('taxiMap');if(map&&ADDRESS[name])map.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(name+' '+ADDRESS[name]);return}const hotelButton=target.closest('.hotelbtn[data-taxi-address]');if(hotelButton){const box=document.getElementById('taxiAddress');if(box){box.style.display='block';box.textContent='地址：'+HOTEL}}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();