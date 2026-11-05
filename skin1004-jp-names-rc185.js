// SKIN1004 — additional Japan-facing product names confirmed from identifiable public listings.
// Not added to the frozen 2,163-product audited cohort: these are SEARCH-ONLY, not verified ingredient formulas.
// Domestic retail listings and Japan-facing cross-border listings are deliberately distinguished.
import {productFold} from './registered-products.js';
const checked='2026-11-05';
const mall='https://mitsui-shopping-park.com/ec/search?brandId=23568';
const cor='https://coreelle.jp/collections/skin1004_all';
const release='https://prtimes.jp/main/html/rd/p/000000046.000127171.html';
function item(id,name,volume,url,sourceScope,extra={}){
 return Object.freeze({
  id:'rc185-skin1004-'+id,brand:'SKIN1004',name,
  aliases:Object.freeze(['SKIN1004 '+name,'スキン1004 '+name,'スキンワンオーオーフォー '+name,...(extra.aliases||[])]),
  url,volume:volume||null,kind:'cosmetic',jan:extra.jan||null,sku:null,
  variant:extra.variant||null,series:extra.series||null,
  registrationStatus:'name-only',rightsStatus:'reference-link-only',
  sourceScope,sourceCheckedOn:checked,identityVerifiedAt:checked,
  sourceProvenance:'public-japan-facing-product-name-only',
  productIdentityNote:sourceScope==='japan-retail-listed-product-name-only'?
   '日本国内小売の商品一覧に掲載された日本語の商品名です。容量・JANは個別出典で確認できたものだけ記載。日本国内向け法定全成分・実物ラベル・現在の処方・販売継続は未確認です。':
   sourceScope==='japan-distributor-release-name-only'?
   '日本の取扱会社が発表した商品名・容量の記録です。現在の販売状態・JAN・国内の法定日本語全成分・現物ラベルは未確認です。':
   '日本語販売ページの個別製品名と記載容量を確認。海外発送に関する注意書きがあり、国内流通の法定日本語成分表示・JAN・実物ラベルの一致は未確認です。'
 });
}
const retail='japan-retail-listed-product-name-only';
const cross='japan-facing-retailer-crossborder-possible-name-only';
const press='japan-distributor-release-name-only';
export const skin1004JapanSearchAdditions=Object.freeze([
 // Japan domestic retailer &mall: names, not complete domestic ingredient labels.
 item('centella-serum','マダガスカルセンテラ セラム',null,mall,retail,{series:'センテラ',aliases:['センテラセラム']}),
 item('hyalu-teca-serum-50','ヒアルーテカ セラム','50mL','https://www.yodobashi.com/product/100000001010209229/',retail,{series:'ヒアルーテカ',aliases:['ヒアルーTECA プランピングアンプル','ヒアルーテカ プランピングセラム']}),
 item('hyalu-cica-water-fit-sun','ヒアルーシカ ウォーターフィットサンセラム',null,mall,retail,{series:'ヒアルーシカ'}),
 item('centella-cleansing-oil','マダガスカルセンテラ クレンジングオイル',null,mall,retail,{series:'センテラ'}),
 item('hyalu-teca-moisture-cream','ヒアルーテカ モイスチャークリーム',null,mall,retail,{series:'ヒアルーテカ'}),
 item('probio-intensive-ampoule','プロバイオシカ インテンシブ アンプル',null,mall,retail,{series:'プロバイオシカ'}),
 item('hyalu-teca-glass-milk','ヒアルーテカ グラススキンミルク',null,mall,retail,{series:'ヒアルーテカ'}),
 item('probio-glow-sun','マダガスカルセンテラ プロバイオシカ グロウサンセラム',null,mall,retail,{series:'プロバイオシカ'}),
 item('probio-mask-five','プロバイオシカ セラムマスク','5枚',mall,retail,{series:'プロバイオシカ'}),
 item('centella-toner','マダガスカルセンテラ トナー',null,mall,retail,{series:'センテラ'}),
 item('centella-watergel-mask-five','マダガスカルセンテラ ウォータージェルシート アンプルマスク','5枚',mall,retail,{series:'センテラ'}),
 item('centella-quick-toner-pads','マダガスカルセンテラ クイックトナーパッド','70枚',mall,retail,{series:'センテラ',aliases:['センテラ クイックカーミングパッド']}),
 item('hyalu-cica-hydrating-mask-five','ヒアルーシカ ハイドレーティングマスク','5枚',mall,retail,{series:'ヒアルーシカ'}),

 // Japan-facing seller Coréelle: individual pages, shipping can be overseas.
 item('centella-ampoule-30','マダガスカルセンテラ アンプル','30mL','https://coreelle.jp/products/skin1004-sk-cicaampl30-01',cross,{series:'センテラ'}),
 item('poremizing-clear-toner-210','マダガスカルセンテラ ポアマイジング クリアトナー','210mL','https://coreelle.jp/products/skin1004-madagascar-centella-poremizing-clear-toner-210ml',cross,{series:'ポアマイジング'}),
 item('poremizing-fresh-ampoule-100','マダガスカルセンテラ ポアマイジング フレッシュアンプル','100mL','https://coreelle.jp/products/skin1004-madagascar-centella-poremizing-fresh-ampoule-100ml',cross,{series:'ポアマイジング'}),
 item('centella-ampoule-foam-125','マダガスカルセンテラ アンプルフォーム','125mL','https://coreelle.jp/products/sk-ampfoam-01',cross,{series:'センテラ'}),
 item('centella-toning-toner-210','マダガスカルセンテラ トーニングトナー','210mL','https://coreelle.jp/products/sk-cicatoner-01',cross,{series:'センテラ'}),
 item('centella-light-cleansing-oil-200','マダガスカルセンテラ ライトクレンジングオイル','200mL','https://coreelle.jp/products/sk-cicaoil-01',cross,{series:'センテラ'}),
 item('hyalu-cica-blue-serum-30','マダガスカルセンテラ ヒアルシカ ブルーセラム','30mL','https://coreelle.jp/products/sk-hyaserum-01',cross,{series:'ヒアルーシカ'}),
 item('hyalu-cica-sleeping-pack-100','マダガスカルセンテラ ヒアルシカ スリーピングパック','100mL','https://coreelle.jp/products/sk-hyalpack-01',cross,{series:'ヒアルーシカ'}),
 item('hyalu-cica-sun-stick-20','ヒアルシカ シルキーフィットサンスティック','20g','https://coreelle.jp/products/skin1004-%E3%83%92%E3%82%A2%E3%83%AB%E3%82%B7%E3%82%AB%E3%82%B7%E3%83%AB%E3%82%AD%E3%83%BC%E3%83%95%E3%82%A3%E3%83%83%E3%83%88%E3%82%B5%E3%83%B3%E3%82%B9%E3%83%86%E3%82%A3%E3%83%83%E3%82%AF',cross,{series:'ヒアルーシカ',aliases:['ヒアルーシカ シルキーフィットサンスティック']}),

 // Japan distributor's product press release: avoid adding an already-registered 50mL TECA ampoule.
 item('teca-soothing-toner-210','センテラ TECA スージングトナー','210mL',release,press,{series:'センテラTECA'}),
 item('teca-cream-75','センテラ TECA クリーム','75mL',release,press,{series:'センテラTECA'})
]);
export const skin1004JapanSearchSources=Object.freeze({mall,cor,release,checked,subsetOnly:true});
export function skin1004JapanSearchMatches(query){
 const folded=productFold(query);
 if(!folded)return [];
 const brandNames=['skin1004','スキン1004','スキンワンオーオーフォー'];
 const brandOnly=brandNames.includes(folded);
 const withBrand=brandNames.find(b=>folded.startsWith(b));
 const needle=withBrand?folded.slice(withBrand.length):folded;
 if(!brandOnly && needle.length<5)return [];
 return skin1004JapanSearchAdditions.filter(p=>{
  if(brandOnly)return true;
  const names=[p.name,...p.aliases,...(p.volume?[p.name+' '+p.volume,...p.aliases.map(a=>a+' '+p.volume)]:[])].map(productFold);
  return names.some(n=>n.includes(folded))||names.some(n=>n.includes(needle))&&needle.length>=5;
 });
}
