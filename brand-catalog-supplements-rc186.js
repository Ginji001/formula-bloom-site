// rc186: Official Japanese brand lists, title-only supplemental search.
import {productFold} from './registered-products.js';
import {skin1004JapanSearchAdditions,skin1004JapanSearchMatches} from './skin1004-jp-names-rc185.js';
const checked='2026-11-06';
// Only brand/catalog-page citations, not manufacturer-verified specific formula/lot identifiers.
const sources=Object.freeze({
 'カルテHD':'https://carte-beauty.com/site/e/etop01/',
 'ソフティモ':'https://www.kose-softymo.com/lineup/',
 'クリアターン':'https://www.kosecosmeport.co.jp/clearturn/shokunin/',
 'ファシオ':'https://maison.kose.co.jp/site/fasio/c/c40/',
 'SKIO':'https://www.shop.rohto.co.jp/category/skincare/skio',
 'THE GINZA':'https://corp.shiseido.com/jp/news/detail.html?n=00000000003924',
 'NARS':'https://www.narscosmetics.jp/light-reflecting-collection/'
});
const classes=Object.freeze({
 'カルテHD':'japan-official-brand-listing-name-only',
 'ソフティモ':'japan-official-brand-listing-name-only',
 'クリアターン':'japan-official-brand-listing-name-only',
 'ファシオ':'japan-official-brand-listing-name-only',
 'SKIO':'japan-official-brand-listing-name-only',
 'THE GINZA':'japan-distributor-brand-release-name-only',
 'NARS':'japan-official-brand-listing-name-only'
});
const definitions=[
 ['カルテHD',[
 ['moist-cleanse','モイスチュア クレンジング オイルジェル',null,'quasi'],
 ['moist-wash','モイスチュア ウォッシングフォーム',null,'quasi'],
 ['moist-lotion','モイスチュア ローション','150mL','quasi'],
 ['balance-lotion','バランスケア ローション','150mL','quasi'],
 ['moist-emulsion','モイスチュア エマルジョン','120mL','quasi'],
 ['balance-emulsion','バランスケア エマルジョン','120mL','quasi'],
 ['moist-install','モイスチュア インストール',null,'quasi'],
 ['moist-key','モイスチュア キー',null,'quasi']
 ]],
 ['ソフティモ',[
 ['clearpro-cushion','クリアプロ クッションクレンジング オイル',null,null],
 ['clearpro-enzyme','クリアプロ 酵素クレンジング オイル',null,null],
 ['quick-oil','スピーディ クレンジングオイル',null,null],
 ['deep-oil','ディープ クレンジングオイル',null,null],
 ['white-oil','ホワイト クレンジングオイル',null,null],
 ['cica-black','クリアプロ クレンジングバーム CICA ブラック',null,null],
 ['cica-deep','クリアプロ クレンジングバーム CICA ディープクリア',null,null],
 ['speedy-gel','スピーディ クレンジングジェル',null,null]
 ]],
 ['クリアターン',[
 ['honey30','美肌職人 はちみつマスク','30枚',null],
 ['rice30','美肌職人 米ぬかマスク','30枚',null],
 ['barley30','美肌職人 はとむぎマスク','30枚',null],
 ['sake30','美肌職人 日本酒マスク','30枚',null],
 ['honey7','美肌職人 はちみつマスク','7枚',null],
 ['rice7','美肌職人 米ぬかマスク','7枚',null],
 ['barley7','美肌職人 はとむぎマスク','7枚',null],
 ['sake7','美肌職人 日本酒マスク','7枚',null]
 ]],
 ['ファシオ',[
 ['bb-kit','BB ティント UV カバー キット',null,null],
 ['moist-cover-cream','うるおい整う クリーム下地（しっかりカバー）',null,null],
 ['eyebrow-liquid','眉尻消えない リキッド アイブロウ',null,null],
 ['ultra-wp','ウルトラ WP マスカラ（極細カール）',null,null],
 ['lash-base','ハリコシアップ マスカラ下地',null,null],
 ['bb-cushion','BB ティント クッション 耐久カバー',null,null],
 ['uv-lip','ぷるんとリップ美容液 UV',null,null],
 ['bb-cover','BB ティント UV カバー',null,null]
 ]],
 ['SKIO',[
 ['vc-serum','VC ホワイトピールセラム','26mL','quasi'],
 ['vc-gel','VC ホワイトピールゲル','80g','quasi'],
 ['vc-gel-refill','VC ホワイトピールゲル つけかえ用レフィル','80g','quasi'],
 ['vc-lotion','VC バランシングピールローション','110mL','cosmetic'],
 ['vc-wash','VC ブーストジェルウォッシュ','140g','cosmetic'],
 ['vc-uv','VCトーンアップUVエッセンス','30g','cosmetic'],
 ['vc-balm','VCクレンジングバーム','90g','cosmetic']
 ]],
 ['THE GINZA',[
 ['gel-oil','ザ・ギンザ ハイブリッドジェルオイル n',null,'cosmetic'],
 ['gel-oil-refill','ザ・ギンザ ハイブリッドジェルオイル n（レフィル）',null,'cosmetic'],
 ['lotion','ザ・ギンザ エッセンスローション n',null,'cosmetic'],
 ['emulsion','ザ・ギンザ エッセンスエマルジョン n',null,'cosmetic']
 ]],
 ['NARS',[
 ['powder-pressed','ライトリフレクティングセッティングパウダー プレスト N',null,'cosmetic'],
 ['powder-loose','ライトリフレクティングセッティングパウダー ルース N',null,'cosmetic'],
 ['cushion-refill','ライトリフレクティング セラムクッションファンデーション（レフィル）',null,'cosmetic'],
 ['tone-up','ライトリフレクティング トーンアップヴェール',null,'cosmetic'],
 ['cleansing-oil','ライトリフレクティング クレンジングオイル',null,'cosmetic'],
 ['setting-mist','ライトリフレクティング メーキャップセッティングミスト',null,'cosmetic']
 ]]
];
const extra=definitions.flatMap(([brand,items])=>items.map(([code,name,volume,kind])=>Object.freeze({
 id:'rc186-'+({'カルテHD':'carte','ソフティモ':'softymo','クリアターン':'clearturn','ファシオ':'fasio','SKIO':'skio','THE GINZA':'theginza','NARS':'nars'}[brand])+'-'+code,
 brand,name,volume,kind,aliases:Object.freeze([brand+' '+name,...(brand==='THE GINZA'?['THE GINZA '+name.replace(/^ザ・ギンザ /,'')]:[])]),
 url:sources[brand],variant:null,jan:null,sku:null,
 registrationStatus:'name-only',rightsStatus:'reference-link-only',sourceScope:classes[brand],
 sourceCheckedOn:checked,identityVerifiedAt:checked,
 sourceProvenance:'individual-product-name-on-official-japanese-lineup-or-distributor-announcement',
 productIdentityNote:'日本のメーカー公式ラインナップ等で、ブランド・商品名と記載がある場合のみ容量・化粧品／医薬部外品を確認した参考商品です。色番、JAN、現物ラベル、法定日本語全成分、処方変更・販売継続は未確認です。商品群の掲載は個別SKUの成分表を意味しません。'
})));
export const officialBrandNameSupplementsRC186=Object.freeze(extra);
export const allBrandNameSupplementsRC186=Object.freeze([...skin1004JapanSearchAdditions,...extra]);
export const officialBrandListingSourcesRC186=sources;
const aliasBrands=Object.freeze({'カルテＨＤ':'カルテHD','Carte HD':'カルテHD','THEGINZA':'THE GINZA','ザ・ギンザ':'THE GINZA'});
function canonicalBrand(value){
 const q=productFold(value);
 for(const name of [...Object.keys(sources),'SKIN1004',...Object.keys(aliasBrands)]){
  if(productFold(name)===q)return aliasBrands[name]||name;
 }
 return null;
}
export function supplementalProductsForBrandRC186(brand){
 const b=canonicalBrand(brand)||brand;
 return allBrandNameSupplementsRC186.filter(p=>p.brand===b);
}
export function supplementalMatchesRC186(query){
 const q=productFold(query);
 if(!q)return [];
 const exact=canonicalBrand(query);
 if(exact)return supplementalProductsForBrandRC186(exact);
 const brands=[...Object.keys(sources),'SKIN1004',...Object.keys(aliasBrands)];
 const explicit=brands.find(b=>q.startsWith(productFold(b)));
 const needle=explicit?q.slice(productFold(explicit).length):q;
 if(needle.length<5)return [];
 const scoped=explicit? supplementalProductsForBrandRC186(explicit):allBrandNameSupplementsRC186;
 return scoped.filter(p=>{
  const names=[p.name,...p.aliases,...(p.volume?[p.name+' '+p.volume,...p.aliases.map(x=>x+' '+p.volume)]:[])].map(productFold);
  return names.some(x=>x.includes(needle))||names.some(x=>x.includes(q));
 });
}
export const supplementalSourcesReviewedAtRC186=checked;
