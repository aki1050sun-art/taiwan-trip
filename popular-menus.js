/* Popular-menu lookup and Chinese ordering for current Taiwan trip.
 * Independent UI overlay: never edits TRIP_DATA, localStorage, reviews, itinerary, or existing order modal.
 * Dishes are named in referenced restaurant menus/reviews; no price/availability claims.
 */
(function () {
  'use strict';
  const menus = {
    '良粟商號': {source:'https://www.fonfood.com/store/8731696', dishes:[
      ['炭燒肉蛋吐司','炭火焼きの肉と卵のトースト','肉・卵'],
      ['炭燒花肉蛋吐司','豚肉・ピーナッツ・卵のトースト','ピーナッツ入り'],
      ['良粟紅茶','お店の紅茶','飲み物']]},
    '阜杭豆漿': {source:'https://momoblog.tw/fuhangsoymilk/', dishes:[
      ['厚餅夾蛋','厚焼きパンの卵サンド','ボリュームあり'],
      ['鹹豆漿','塩味の豆乳スープ','しょっぱい豆乳'],
      ['焦糖甜餅','キャラメル風味の甘い焼き餅','甘い'],
      ['豆漿','豆乳','飲み物']]},
    '古北饕 Goodbeitao': {source:'https://www.ubereats.com/tw/store/%E5%8F%A4%E5%8C%97%E9%A5%95goodbeitao-%E6%97%97%E8%89%A6%E5%BA%97/llYmyCcoU6a7QJ8FAJsudg', dishes:[
      ['原味小籠湯包','定番の小籠包','蒸した肉汁入り点心'],
      ['蝦仁燒賣','エビ入りシューマイ','エビ'],
      ['紅油炒手','ラー油のワンタン','辛い'],
      ['奶皇流沙包','とろけるカスタードまん','甘い']]},
    '天天利美食坊': {source:'https://www.fonfood.com/store/871397', dishes:[
      ['半熟蛋滷肉飯','半熟卵のせ魯肉飯','豚肉・卵'],
      ['蚵仔煎','カキ入り台湾オムレツ','カキ'],
      ['蘿蔔糕','大根もち','焼いた点心']]},
    '劉媽媽飯糰': {source:'https://www.fonfood.com/store/919792', dishes:[
      ['招牌紫米飯糰','看板の紫米おにぎり','紫米・具だくさん'],
      ['海陸總匯飯糰','海と陸の具材のミックスおにぎり','具だくさん'],
      ['三島豬排飯糰','豚カツ入りおにぎり','豚肉']]},
    '林記牛肉麵（Lin Ji Beef Noodle Restaurant）': {source:'https://www.foodpanda.com.tw/restaurant/wgdh/lin-ji-niu-rou-mian-wgdh', dishes:[
      ['半筋半肉麵','牛すじ・牛肉の牛肉麺','牛肉・牛すじ'],
      ['牛肚麵','牛ハチノス入り麺','内臓（牛の胃）'],
      ['牛筋麵','牛すじ麺','牛すじ']]},
    '阿城鵝肉': {source:'https://www.fonfood.com/store/8422057', dishes:[
      ['煙燻鵝肉','燻製ガチョウ肉','ガチョウ'],
      ['鵝油飯','ガチョウ脂のご飯','ご飯'],
      ['米血糕','もち米入りの血の餅','血を使った料理']]},
    '杏福氷館': {source:'https://www.ubereats.com/tw/store/%E9%9B%99%E5%9F%8E%E5%A4%9C%E5%B8%82-%E6%9D%8F%E7%A6%8F%E5%86%B0%E9%A4%A8/A2J48G3vQLCaJk2l1TTiFQ', dishes:[
      ['原味手打杏仁豆腐','手作り杏仁豆腐','杏仁風味'],
      ['芋頭牛奶冰','タロイモのミルクかき氷','タロイモ'],
      ['杏福雪花冰','ふわふわミルク氷','トッピング選択あり']]},
    '杏福冰館': {source:'https://www.ubereats.com/tw/store/%E9%9B%99%E5%9F%8E%E5%A4%9C%E5%B8%82-%E6%9D%8F%E7%A6%8F%E5%86%B0%E9%A4%A8/A2J48G3vQLCaJk2l1TTiFQ', dishes:[
      ['原味手打杏仁豆腐','手作り杏仁豆腐','杏仁風味'],
      ['芋頭牛奶冰','タロイモのミルクかき氷','タロイモ'],
      ['杏福雪花冰','ふわふわミルク氷','トッピング選択あり']]},
    '雙月食品社 青島店': {source:'https://www.moonmoonfood.com/CISTopic?g=S00027', dishes:[
      ['愛恨椒芝麵','チリごま混ぜそば（ピリ辛ごま和え麺）','看板メニュー・ごま・花椒の香り／辛みあり'],
      ['蛤蜊燉雞腿湯','ハマグリと鶏もも肉のスープ','貝類・鶏肉'],
      ['阿甘剝皮辣椒燉雞腿湯','皮むき唐辛子と鶏もものスープ','唐辛子入り'],
      ['金鮮鱸魚蛤蜊湯','スズキとハマグリのスープ','魚・貝類']]},
    '巧之味手工水餃 済南店': {source:'https://news.ustv.com.tw/food/shop/10968', dishes:[
      ['招牌水餃','看板の水餃子','豚肉・野菜'],
      ['韭菜水餃','ニラ入り水餃子','ニラ・豚肉'],
      ['干貝水餃','ホタテ入り水餃子','貝類・豚肉']]},
    '済南鮮湯包 総店': {source:'https://page.line.me/322fshyw/showcase/858683681683747', dishes:[
      ['濟南鮮湯包','定番のスープ入り小籠包','肉汁入り'],
      ['絲瓜蝦仁湯包','ヘチマとエビのスープ小籠包','エビ'],
      ['蟹黃圓籠包','カニみそ入り小籠包','カニ']]},
    '好公道金雞園': {source:'https://goodeat.tw/food/hao-kung-tao-chin-chi-yuan-yongkang-taipei/', dishes:[
      ['小籠包','小籠包','肉汁入り'],
      ['蟹黃小包','カニみそ入り小籠包','カニ'],
      ['蝦仁燒賣','エビ入りシューマイ','エビ']]},
    '永康牛肉麵（Yongkang Beef Noodles）': {source:'https://gs.ctrip.com/html5/you/foods/Taipei360/4926335.html', dishes:[
      ['紅燒半筋半肉麵','醤油煮込み系・牛すじと牛肉の麺','辛さ・八角は注文時に確認'],
      ['清燉牛肉麵','あっさり澄んだスープの牛肉麺','牛肉'],
      ['粉蒸排骨','豚スペアリブの米粉蒸し','豚肉']]},
    '軟食力 行天宮店': {source:'https://ifoodie.tw/post/660885ac927f80f0ea6070ec', dishes:[
      ['雙蛋蛋餅','卵2個入り台湾式卵クレープ','卵'],
      ['炸湯圓','揚げ白玉団子','揚げ菓子']]},
    '香滿園': {source:'https://taipei.story-travelblog.com/xiangmanyuan/', dishes:[
      ['魯肉飯','豚肉の甘辛煮のせご飯','豚肉'],
      ['金針赤肉湯','金針菜と豚肉のスープ','豚肉・金針菜'],
      ['魚丸湯','魚団子のスープ','魚']]},
    '劉山東牛肉麵': {source:'https://news.ustv.com.tw/food/shop/11077', dishes:[
      ['清燉牛肉麵','澄んだスープの牛肉麺','牛肉'],
      ['紅燒牛肉麵','濃いめの煮込み牛肉麺','牛肉'],
      ['炸醬麵','肉みそ和え麺','豚肉など・店頭確認']]},
    '大川本舗現烤蛋糕': {source:'https://guava.failover.uber.com/tw/store/%E5%A4%A7%E5%B7%9D%E6%9C%AC%E9%8B%AA/yUvnijbLWKuU2QaUX4JraQ', dishes:[
      ['原味蛋糕','プレーン台湾カステラ','卵・乳'],
      ['黃金起司蛋糕','チーズ入り台湾カステラ','乳製品'],
      ['濃郁巧克力蛋糕','濃厚チョコレートケーキ','チョコレート']]},
    'COOKIE886': {source:'https://www.cookie886.com/Product/Category/CC7', dishes:[
      ['經典原味','定番バタークッキー','乳製品'],
      ['經典可可','ココアクッキー','ココア'],
      ['經典綜合','定番2種の詰め合わせ','お土産向き']]},
    '方家雞肉飯': {source:'https://www.tcma.gov.taipei/News_Content.aspx?n=0EF13537DA4433F4&s=CF4A384CB09A93E3&sms=CD584D86615E937D', dishes:[
      ['雞肉飯','鶏肉のせご飯','鶏肉'],
      ['滷肉飯','豚肉の甘辛煮のせご飯','豚肉'],
      ['蔥仔蛋','ネギ入り卵焼き','卵'],
      ['滷豆腐','味の染みた煮豆腐','大豆']]},
    '豆花荘': {source:'https://ifoodie.tw/post/67ea3eb07be9c356bb90eb6b', dishes:[
      ['粉圓豆花','タピオカ入り豆花','大豆・タピオカ'],
      ['粉粿豆花','もちもちゼリー入り豆花','大豆']]},
    '豆花莊': {source:'https://ifoodie.tw/post/67ea3eb07be9c356bb90eb6b', dishes:[
      ['粉圓豆花','タピオカ入り豆花','大豆・タピオカ'],
      ['粉粿豆花','もちもちゼリー入り豆花','大豆']]}
  };
  const CSS = `
    .popular-menu-btn{background:#7c3aed;color:white;border:0;border-radius:9px;padding:9px 11px;font-size:12px;font-weight:750;cursor:pointer;font-family:inherit}
    .pm-overlay{position:fixed;inset:0;background:rgba(0,0,0,.64);z-index:250;display:none;align-items:center;justify-content:center;padding:12px;box-sizing:border-box}
    .pm-overlay.pm-open{display:flex}
    .pm-dialog{width:min(560px,100%);max-height:91dvh;overflow-y:auto;background:white;border-radius:16px;padding:17px;box-sizing:border-box;color:#1f2937;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans JP',sans-serif}
    .pm-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
    .pm-heading h2{font-size:19px;line-height:1.4;margin:0}.pm-close{border:0;border-radius:100%;background:#eef2f7;font-size:24px;width:38px;height:38px;flex-shrink:0;cursor:pointer}
    .pm-note{font-size:12px;line-height:1.55;color:#64748b;margin:9px 0 14px}.pm-dish{display:flex;gap:9px;align-items:center;justify-content:space-between;border-top:1px solid #e5e7eb;padding:12px 0}
    .pm-zh{font-size:20px;font-weight:800;line-height:1.4}.pm-jp{font-size:13px;color:#334155;margin-top:3px}.pm-detail{font-size:11px;color:#64748b;margin-top:2px}
    .pm-qty{display:flex;gap:6px;align-items:center;flex-shrink:0}.pm-qty button{width:35px;height:37px;border-radius:8px;border:1px solid #cbd5e1;background:#f8fafc;font-size:22px;cursor:pointer}.pm-qty output{font-size:16px;font-weight:800;min-width:21px;text-align:center}
    .pm-order{background:#eff6ff;border:1px solid #93c5fd;border-radius:12px;padding:12px;margin:12px 0;line-height:1.7}.pm-order strong{display:block;font-size:13px;color:#1d4ed8}.pm-order-zh{font-size:23px;font-weight:850;overflow-wrap:anywhere}.pm-order-jp{font-size:12px;color:#475569}
    .pm-buttons{display:flex;gap:8px;flex-wrap:wrap}.pm-buttons button{flex:1;min-width:135px;padding:12px 7px;border:0;border-radius:10px;background:#2563eb;color:white;font-size:14px;font-weight:800;cursor:pointer}.pm-buttons button:disabled{background:#94a3b8;cursor:not-allowed}
    .pm-source{font-size:12px;margin:14px 0 5px}.pm-source a{color:#135ea8}.pm-status{font-size:12px;color:#047857;min-height:18px;margin-top:6px}
    @media(max-width:520px){.popular-menu-btn{flex:1}.pm-dialog{padding:13px}.pm-zh{font-size:18px}.pm-order-zh{font-size:21px}}
  `;
  let currentName = '';
  let counts = [];
  let dialog, listEl, orderZh, orderJp, sourceEl, statusEl, speakBtn, copyBtn;
  const qtyZh = ['零','一','兩','三','四','五','六','七','八','九','十'];
  function buildPhrase() {
    const entry=menus[currentName];
    if(!entry)return {zh:'',jp:''};
    const chosen=entry.dishes.map((d,i)=>({d,n:counts[i]||0})).filter(x=>x.n>0);
    if(!chosen.length)return {zh:'',jp:''};
    return {
      zh:'不好意思，我要'+chosen.map(x=>qtyZh[x.n]+'份'+x.d[0]).join('、')+'，謝謝。',
      jp:chosen.map(x=>x.d[1]+' × '+x.n).join('／')
    };
  }
  function updateOrder() {
    const phrase=buildPhrase();
    orderZh.textContent=phrase.zh||'食べたいメニューの「＋」を押してください。';
    orderJp.textContent=phrase.jp||'数量を選ぶと、中国語の注文文ができます。';
    speakBtn.disabled=copyBtn.disabled=!phrase.zh;
    statusEl.textContent='';
  }
  function el(tag, className, text) {
    const x=document.createElement(tag);
    if(className)x.className=className;
    if(text!==undefined)x.textContent=text;
    return x;
  }
  function openMenu(name) {
    currentName=name;
    const entry=menus[name];
    counts=entry?entry.dishes.map(()=>0):[];
    dialog.querySelector('h2').textContent=name+'｜人気メニュー';
    listEl.replaceChildren();
    sourceEl.replaceChildren();
    if(!entry){
      listEl.append(el('p','pm-note','この店舗はメニュー名の確認がまだできていません。推測で商品を載せず、確認できた店舗から順次登録しています。店頭のメニュー写真でご確認ください。'));
    }else{
      entry.dishes.forEach((d,i)=>{
        const row=el('div','pm-dish');
        const detail=el('div');
        detail.append(el('div','pm-zh',d[0]),el('div','pm-jp',d[1]));
        if(d[2])detail.append(el('div','pm-detail',d[2]));
        const qty=el('div','pm-qty');
        const minus=el('button','','−'); minus.type='button';minus.setAttribute('aria-label',d[1]+'を減らす');
        const value=el('output','','0');value.setAttribute('aria-live','polite');
        const plus=el('button','','＋');plus.type='button';plus.setAttribute('aria-label',d[1]+'を増やす');
        minus.addEventListener('click',()=>{counts[i]=Math.max(0,counts[i]-1);value.textContent=String(counts[i]);updateOrder()});
        plus.addEventListener('click',()=>{counts[i]=Math.min(10,counts[i]+1);value.textContent=String(counts[i]);updateOrder()});
        qty.append(minus,value,plus);row.append(detail,qty);listEl.append(row);
      });
      const link=el('a','','メニュー・紹介記事を確認する ↗');
      link.href=entry.source;link.target='_blank';link.rel='noopener noreferrer';
      sourceEl.append(link);
    }
    updateOrder();
    document.getElementById('popularMenuOverlay').classList.add('pm-open');
    document.getElementById('popularMenuOverlay').setAttribute('aria-hidden','false');
    dialog.querySelector('.pm-close').focus();
  }
  function closeMenu(){
    const overlay=document.getElementById('popularMenuOverlay');
    overlay.classList.remove('pm-open');overlay.setAttribute('aria-hidden','true');
    if(window.speechSynthesis)window.speechSynthesis.cancel();
  }
  function setup() {
    if(document.getElementById('popularMenuOverlay'))return;
    const style=el('style');style.textContent=CSS;document.head.append(style);
    const overlay=el('div','pm-overlay');overlay.id='popularMenuOverlay';overlay.setAttribute('aria-hidden','true');
    dialog=el('section','pm-dialog');dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-labelledby','pmTitle');
    const heading=el('div','pm-heading');
    const title=el('h2');title.id='pmTitle';
    const close=el('button','pm-close','×');close.type='button';close.setAttribute('aria-label','閉じる');close.addEventListener('click',closeMenu);
    heading.append(title,close);
    const note=el('p','pm-note','繁体字の料理名を店員さんに見せてください。掲載・紹介されているメニューから抜粋しています。人気順のランキングではありません。価格・提供状況・辛さは当日店頭でご確認ください。');
    listEl=el('div');
    const order=el('div','pm-order');order.append(el('strong','','注文用の中国語'));
    orderZh=el('div','pm-order-zh');orderJp=el('div','pm-order-jp');order.append(orderZh,orderJp);
    const buttons=el('div','pm-buttons');
    speakBtn=el('button','','🔊 中国語を読み上げる');speakBtn.type='button';speakBtn.addEventListener('click',()=>{const phrase=buildPhrase();if(phrase.zh&&typeof speakZh==='function')speakZh(phrase.zh)});
    copyBtn=el('button','','📋 中国語をコピー');copyBtn.type='button';copyBtn.addEventListener('click',async()=>{
      const phrase=buildPhrase();if(!phrase.zh)return;
      try{if(!navigator.clipboard?.writeText)throw new Error('clipboard unavailable');await navigator.clipboard.writeText(phrase.zh);statusEl.textContent='中国語をコピーしました。'}
      catch(e){statusEl.textContent='コピーできませんでした。上の中国語をそのまま見せてください。'}
    });
    buttons.append(speakBtn,copyBtn);statusEl=el('div','pm-status');statusEl.setAttribute('role','status');
    sourceEl=el('div','pm-source');
    dialog.append(heading,note,listEl,order,buttons,statusEl,sourceEl);
    overlay.append(dialog);overlay.addEventListener('click',e=>{if(e.target===overlay)closeMenu()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('pm-open'))closeMenu()});
    document.body.append(overlay);
    // Original launcher already renders every food stop with an .orderbtn; attach only to those.
    document.querySelectorAll('#app .day .place').forEach(place=>{
      if(!place.querySelector('.orderbtn'))return;
      const nameEl=place.querySelector('.name');
      const name=nameEl?.firstChild?.textContent?.trim();
      const actions=place.querySelector('.actions');
      if(!name||!actions||actions.querySelector('.popular-menu-btn'))return;
      const btn=el('button','popular-menu-btn','🍜 人気メニュー');
      btn.type='button';btn.addEventListener('click',()=>openMenu(name));
      actions.append(btn);
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);
  else setup();
})();