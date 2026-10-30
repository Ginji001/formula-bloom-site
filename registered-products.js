// 公式の国内向け商品ページで日本語成分表を実際に確認できた製品だけを登録。
// ブランドの登録と製品の登録は区別する。これらは日本での販売継続や薬機法適合の保証ではない。
export const registeredProducts=Object.freeze([
 {id:"ihada-moist-lotion",brand:'イハダ',name:"薬用うるおいローション（しっとり）",
  aliases:["イハダ うるおいローション しっとり", "IHADA 薬用うるおいローション しっとり"],url:"https://www.shiseido.co.jp/ihada/products/skincare-lotion.html",variant:"しっとり",kind:'quasi',volume:"180mL",ingredientsExpected:23},
 {id:"ihada-rich-lotion",brand:'イハダ',name:"薬用うるおいローション（とてもしっとり）",
  aliases:["イハダ うるおいローション とてもしっとり", "IHADA 薬用うるおいローション とてもしっとり"],url:"https://www.shiseido.co.jp/ihada/products/skincare-lotion.html",variant:"とてもしっとり",kind:'quasi',volume:"180mL",ingredientsExpected:26},
 {id:"ihada-moist-emulsion",brand:'イハダ',name:"薬用うるおいエマルジョン",
  aliases:["イハダ 薬用うるおい乳液"],url:"https://www.shiseido.co.jp/ihada/products/skincare-emulsion.html",variant:null,kind:'quasi',volume:"135mL",ingredientsExpected:27},
 {id:"ihada-clear-lotion",brand:'イハダ',name:"薬用クリアローション",
  aliases:["イハダ クリアローション"],url:"https://www.shiseido.co.jp/ihada/products/skincare-clear-lotion.html",variant:null,kind:'quasi',volume:"180mL",ingredientsExpected:26},
 {id:"ihada-clear-emulsion",brand:'イハダ',name:"薬用クリアエマルジョン",
  aliases:["イハダ クリアエマルジョン"],url:"https://www.shiseido.co.jp/ihada/products/skincare-clear-emulsion.html",variant:null,kind:'quasi',volume:"135mL",ingredientsExpected:27},
 {id:'orbis-aquanist-lm',brand:'オルビス',name:'アクアニスト ローション LM（さっぱり高保湿タイプ）',
  aliases:['オルビス アクアニスト ローション LM','オルビス アクアニスト さっぱり'],url:'https://www.orbis.co.jp/small/11010852/',variant:'LM（さっぱり高保湿タイプ）',ingredientsExpected:19,sku:'9041',volume:'180mL'},
 {id:'orbis-aquanist-rm',brand:'オルビス',name:'アクアニスト ローション RM（しっとり高保湿タイプ）',
  aliases:['オルビス アクアニスト ローション RM','オルビス アクアニスト しっとり'],url:'https://www.orbis.co.jp/small/11010852/',variant:'RM（しっとり高保湿タイプ）',ingredientsExpected:27,sku:'9043',volume:'180mL'},
 {id:'orbis-encore-lotion',brand:'オルビス',name:'オルビスユー アンコール ローション',
  aliases:['オルビス アンコール ローション'],url:'https://www.orbis.co.jp/small/11010502/',variant:null,ingredientsExpected:15,sku:'9340',volume:'180mL'},
 {id:'fancl-bc-lotion',brand:'ファンケル',name:'BC 化粧液',
  aliases:['ファンケル BC 化粧液'],url:'https://www.fancl.co.jp/item/Seibun?category=01&item_id=3792-11',variant:null,ingredientsExpected:29,sku:'3792-11'},
 {id:'tvert-ga-moist',brand:'トゥヴェール',name:'バランシングGAローション モイスト',
  aliases:['トゥヴェール モイスト','バランシングGAローション モイスト','TOUT VERT バランシングGAローション モイスト'],
  url:'https://www.tvert.jp/shop/products/tvt002-2508tv0384',variant:'モイスト',ingredientsExpected:50},
 {id:'tvert-ga-normal',brand:'トゥヴェール',name:'バランシングGAローション',
  aliases:['トゥヴェール GAローション','バランシングGAローション 通常版'],
  url:'https://www.tvert.jp/shop/products/tvt002-2508tv0384',variant:'通常版',ingredientsExpected:33},
 {id:'chifure-moist-deep',brand:'ちふれ',name:'保湿化粧水 とてもしっとりタイプ',
  aliases:['ちふれ 保湿化粧水 とてもしっとり','ちふれ とてもしっとり'],
  url:'https://www.chifure.co.jp/products/skinlotion/2871',variant:null},
 {id:'chifure-lotion-light',brand:'ちふれ',name:'保湿化粧水 さっぱりタイプ',
  aliases:['ちふれ 保湿化粧水 さっぱり'],url:'https://www.chifure.co.jp/products/skinlotion/2875',variant:null},
 {id:'chifure-lotion-rich',brand:'ちふれ',name:'保湿化粧水 しっとりタイプ',
  aliases:['ちふれ 保湿化粧水 しっとり'],url:'https://www.chifure.co.jp/products/skinlotion/2873',variant:null},
 {id:'chifure-lotion-base',brand:'ちふれ',name:'保湿化粧水',
  aliases:['ちふれ 保湿化粧水 通常版'],url:'https://www.chifure.co.jp/products/skinlotion/2920',variant:null},
 {id:'chifure-milk-rich',brand:'ちふれ',name:'濃厚 乳液',
  aliases:['ちふれ 濃厚乳液'],url:'https://www.chifure.co.jp/products/milkylotion/2630',variant:null},
 {id:'chifure-milk-base',brand:'ちふれ',name:'保湿乳液',
  aliases:['ちふれ 保湿乳液'],url:'https://www.chifure.co.jp/products/milkylotion/2877',variant:null},
 {id:'torriden-dive-toner',brand:'Torriden',name:'ダイブイン トナー',
  aliases:['トリデン ダイブイン トナー','Torriden DIVE IN トナー'],url:'https://torriden.jp/products/no0002',variant:null},
 {id:'innisfree-green-tea-milk',brand:'イニスフリー',name:'グリーンティー セラミド ミルク エッセンストナー',
  aliases:['innisfree グリーンティー セラミド ミルク エッセンストナー'],url:'https://www.innisfree.jp/products/green-tea-ceramide-milk',variant:null},
 {id:'laneige-cream-skin',brand:'ラネージュ',name:'クリームスキン ローション',
  aliases:['LANEIGE クリームスキン ローション','ラネージュ クリームスキン'],url:'https://jp.laneige.com/products/cream-skin-cerapeptide-refiner',variant:null,ingredientsExpected:26},
 {id:'hera-hydro-reflecting-toner',brand:'ヘラ',name:'ハイドロ リフレクティング トナー',
  aliases:['HERA ハイドロ リフレクティング トナー'],url:'https://jp.hera.com/products/hydro-reflecting-toner',variant:null,ingredientsExpected:44},
 {id:'missha-vitac-pack-cleanser',brand:'MISSHA',name:'ビタシープラス 泡マスク洗顔',
  aliases:['ミシャ ビタシープラス 泡マスク洗顔'],url:'https://www.missha.co.jp/product/vitac_packformcleanser/',variant:null,ingredientsExpected:54},
 {id:'etude-cloud-filter-cushion',brand:'エチュード',name:'クラウドフィルタークッション',
  aliases:['ETUDE クラウドフィルタークッション'],url:'https://etude.jp/etude_product/213010464',variant:null,ingredientsExpected:31},
 {id:'hince-second-skin-primer',brand:'hince',name:'セカンドスキンハイドレイティングプライマー',
  aliases:['ヒンス セカンドスキンハイドレイティングプライマー'],url:'https://hince.jp/c/event/2026/brandweek_2026_s/HC085',variant:null,ingredientsExpected:37},
 {id:'curel-lotion-i',brand:'キュレル',name:'潤浸保湿 化粧水 Ⅰ ややしっとり',
  aliases:['キュレル 化粧水 I ややしっとり','キュレル 潤浸保湿 化粧水 ややしっとり'],
  url:'https://www.kao-kirei.com/ja/item/kbb/curel/4901301236043/',variant:null},
 {id:'curel-lotion-ii',brand:'キュレル',name:'潤浸保湿 化粧水 Ⅱ しっとり',
  aliases:['キュレル 化粧水 II しっとり','キュレル 潤浸保湿 化粧水 しっとり'],
  url:'https://www.kao-kirei.com/ja/item/kbb/curel/4901301236197/',variant:null},
 {id:'curel-lotion-iii',brand:'キュレル',name:'潤浸保湿 化粧水 Ⅲ とてもしっとり',
  aliases:['キュレル 化粧水 III とてもしっとり','キュレル 潤浸保湿 化粧水 とてもしっとり'],
  url:'https://www.kao-kirei.com/ja/item/kbb/curel/4901301236180/',variant:null},
 {id:'curel-emulsion',brand:'キュレル',name:'潤浸保湿 乳液',
  aliases:['キュレル 乳液'],url:'https://www.kao-kirei.com/ja/item/kbb/curel/4901301236173/',variant:null},
 {id:'curel-facecream',brand:'キュレル',name:'潤浸保湿 フェイスクリーム',
  aliases:['キュレル フェイスクリーム'],
  url:'https://www.kao-kirei.com/ja/item/kbb/curel/4901301236210/',variant:null},
 {id:'cezanne-skin-conditioner',brand:'セザンヌ',name:'スキンコンディショナー',
  aliases:['セザンヌ スキンコンディショナー'],url:'https://www.cezanne.co.jp/lineup/seibun/',variant:'スキンコンディショナー',
  ingredientsExpected:59,sourcePageId:'4939553013501'},
 {id:'cezanne-skin-conditioner-high-moisture',brand:'セザンヌ',name:'スキンコンディショナー高保湿',
  aliases:['セザンヌ スキンコンディショナー高保湿'],url:'https://www.cezanne.co.jp/lineup/seibun/',variant:'スキンコンディショナー高保湿',
  ingredientsExpected:41,sourcePageId:'4939553040019'},
 {id:'cezanne-rich-skin-conditioner-milk',brand:'セザンヌ',name:'濃密スキンコンディショナー ミルク',
  aliases:['セザンヌ 濃密スキンコンディショナー ミルク'],url:'https://www.cezanne.co.jp/lineup/seibun/',variant:'濃密スキンコンディショナー ミルク',
  ingredientsExpected:56,sourcePageId:'4939553042198'},
 {id:'cezanne-makeup-fix-mist',brand:'セザンヌ',name:'メイクフィックスミスト',
  aliases:['セザンヌ メイクフィックスミスト'],url:'https://www.cezanne.co.jp/lineup/seibun/',variant:'メイクフィックスミスト',
  ingredientsExpected:17,sourcePageId:'4939553042044'},
 {id:'cezanne-natural-lotion',brand:'セザンヌ',name:'ナチュラルローション',
  aliases:['セザンヌ ナチュラルローション'],url:'https://www.cezanne.co.jp/lineup/seibun/',variant:'ナチュラルローション',
  ingredientsExpected:39,sourcePageId:'4939553042587'},
 {id:'cezanne-cleansing-balm',brand:'セザンヌ',name:'うるオフクレンジングバーム',
  aliases:['セザンヌ うるオフクレンジングバーム'],url:'https://www.cezanne.co.jp/lineup/seibun/',variant:'うるオフクレンジングバーム',
  ingredientsExpected:32,sourcePageId:'4939553043416'},
 {id:'cezanne-rich-hydro-mask',brand:'セザンヌ',name:'濃密ハイドロマスク',
  aliases:['セザンヌ 濃密ハイドロマスク'],url:'https://www.cezanne.co.jp/lineup/seibun/',variant:'濃密ハイドロマスク',
  ingredientsExpected:36,sourcePageId:'4939553530213'},
].map(x=>Object.freeze({...x,aliases:Object.freeze(x.aliases)})));

export const registeredBrands=Object.freeze([...new Set(registeredProducts.map(x=>x.brand))]);

export function productFold(value){
 return String(value||'').normalize('NFKC').toLowerCase()
  .replace(/[\s\u3000\-_「」『』【】()（）・:：]+/g,'')
  .replace(/(Ⅰ|ⅰ)/g,'i').replace(/(Ⅱ|ⅱ)/g,'ii').replace(/(Ⅲ|ⅲ)/g,'iii');
}
export function productsForBrand(brand){
 const folded=productFold(brand);
 return registeredProducts.filter(x=>productFold(x.brand)===folded);
}
export function findRegisteredProducts(query){
 const q=productFold(query);
 if(!q)return [];
 const matches=registeredProducts.map(p=>{
  const names=[p.brand+' '+p.name,p.name,...p.aliases].map(productFold);
  const exact=names.some(x=>x===q);
  const contains=names.some(x=>x.includes(q)||q.includes(x));
  const tokens=String(query||'').normalize('NFKC').split(/[\s　]+/).map(productFold).filter(Boolean);
  const wordMatch=tokens.length>1&&tokens.every(t=>names.some(x=>x.includes(t)));
  const brandOnly=productFold(p.brand)===q;
  if(!exact&&!contains&&!wordMatch&&!brandOnly)return null;
  const score=exact?100:brandOnly?50:wordMatch?40:contains?30:0;
  return {product:p,score,exact};
 }).filter(Boolean);
 return matches.sort((a,b)=>b.score-a.score||a.product.name.localeCompare(b.product.name,'ja')).map(x=>x);
}
export function chooseExactRegisteredProduct(query){
 const matched=findRegisteredProducts(query);
 const exact=matched.filter(x=>x.exact);
 if(exact.length!==1)return null;
 const name=productFold(exact[0].product.name);
 // 「保湿化粧水」「GAローション」など総称は、派生処方が登録されているとき自動選択しない。
 return matched.some(x=>x!==exact[0]&&productFold(x.product.name).includes(name))?null:exact[0].product;
}
