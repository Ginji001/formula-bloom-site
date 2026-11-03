// GitHub Pages向け。サーバーは使用せず、収録ブランドと商品名のみローカル検索。
// 新規の外部サイトからの自動収集は行わない。既存の全成分掲載保存版と、利用者の手入力・写真OCRを区別する。
import {brands,identifyBrand,brandStats} from './brand-directory.js';
import {registeredProducts,findRegisteredProducts,productsForBrand} from './registered-products.js';
import {isJapaneseMarketURL} from './japan-market-policy.js';
import {factProductIds} from './facts-index.js';

const fold=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[\s\p{P}\p{S}]+/gu,'');
const searchProviders=[
 ['Amazon.co.jp','https://www.amazon.co.jp/s?k='],
 ['楽天市場','https://search.rakuten.co.jp/search/mall/'],
 ['Yahoo!ショッピング','https://shopping.yahoo.co.jp/search?p='],
 ['Qoo10','https://www.qoo10.jp/s/?keyword='],
 ['@cosme','https://www.cosme.net/search/?word='],
 ['LIPS','https://lipscosme.com/search?keyword=']
];
const shopLinks=q=>searchProviders.map(([name,base],i)=>({id:['amazon','rakuten','yahoo','qoo10','cosme','lips'][i],name,url:base+encodeURIComponent(q)+(i===1?'/':'')}));
const staticProducts=q=>findRegisteredProducts(q).map(x=>x.product);
const mapped=p=>({...p,registered:factProductIds.has(p.id),officialVerified:false,sourceType:'registered',kind:p.kind??null});
export async function staticGetJSON(path,{signal}={}){
 if(signal?.aborted)throw new DOMException('検索を中止しました。','AbortError');
 const u=new URL(path,location.href),q=(u.searchParams.get('q')||'').trim();
 if(u.pathname.endsWith('/sku-evidence.json')){
  const response=await fetch('./sku-evidence.json',{signal});
  if(!response.ok)throw Error('商品特定の比較資料を読み込めませんでした。');
  return response.json();
 }
 if(u.pathname.endsWith('/inci-reference-evidence.json')){
  const response=await fetch('./inci-reference-evidence.json',{signal});
  if(!response.ok)throw Error('英語INCI参考資料を読み込めませんでした。');
  return response.json();
 }
 if(u.pathname.endsWith('/source-disclosed-ingredient-names-rc128.json')){
  const response=await fetch('./source-disclosed-ingredient-names-rc128.json',{signal});
  if(!response.ok)throw Error('メーカーの表示名称資料を読み込めません。');
  return response.json();
 }
 if(u.pathname.endsWith('/source-disclosed-ingredient-names-rc132.json')){
  const response=await fetch('./source-disclosed-ingredient-names-rc132.json',{signal});
  if(!response.ok)throw Error('追加の表示名称資料を読み込めません。');
  return response.json();
 }
 if(u.pathname.endsWith('/source-disclosed-ingredient-names-rc130.json')){
  const response=await fetch('./source-disclosed-ingredient-names-rc130.json',{signal});
  if(!response.ok)throw Error('追加の表示名称資料を読み込めません。');
  return response.json();
 }
 for(const version of ['rc144','rc145']){
  const name='partial-ingredient-evidence-'+version+'.json';
  if(u.pathname.endsWith('/'+name)){
   const response=await fetch('./'+name,{signal});
   if(!response.ok)throw Error('追加の公式成分原文を読み込めません。');
   return response.json();
  }
 }
 if(u.pathname.endsWith('/partial-ingredient-evidence-rc159.json')){
  const response=await fetch('./partial-ingredient-evidence-rc159.json',{signal});
  if(!response.ok)throw Error('追加の日本公式原文を取得できません。');
  return response.json();
 }
 if(u.pathname.endsWith('/excluded-416-recheck-rc159.json')){
  const response=await fetch('./excluded-416-recheck-rc159.json',{signal});
  if(!response.ok)throw Error('再調査一覧を取得できません。');
  return response.json();
 }
 if(u.pathname.endsWith('/partial-ingredient-evidence-rc158.json')){
  const response=await fetch('./partial-ingredient-evidence-rc158.json',{signal});
  if(!response.ok)throw Error('国内公式の再調査原文を取得できません。');
  return response.json();
 }
 if(u.pathname.endsWith('/excluded-416-recheck-rc158.json')){
  const response=await fetch('./excluded-416-recheck-rc158.json',{signal});
  if(!response.ok)throw Error('旧調査除外416商品別台帳を取得できません。');
  return response.json();
 }
 if(u.pathname.endsWith('/partial-ingredient-evidence-rc157.json')){
  const response=await fetch('./partial-ingredient-evidence-rc157.json',{signal});
  if(!response.ok)throw Error('公式で商品版照合した成分名を取得できません。');
  return response.json();
 }
 if(u.pathname.endsWith('/partial-ingredient-evidence-rc156.json')){
  const response=await fetch('./partial-ingredient-evidence-rc156.json',{signal});
  if(!response.ok)throw Error('日本公式の追加成分名を取得できません。');
  return response.json();
 }
 if(u.pathname.endsWith('/partial-ingredient-evidence-rc155.json')){
  const response=await fetch('./partial-ingredient-evidence-rc155.json',{signal});
  if(!response.ok)throw Error('200商品純増のメーカー公式原文を取得できません。');
  return response.json();
 }
 if(u.pathname.endsWith('/partial-ingredient-evidence-rc154.json')){
  const response=await fetch('./partial-ingredient-evidence-rc154.json',{signal});
  if(!response.ok)throw Error('FANCL個別出典成分を読み込めません。');
  return response.json();
 }
 if(u.pathname.endsWith('/partial-ingredient-evidence-rc153.json')){
  const response=await fetch('./partial-ingredient-evidence-rc153.json',{signal});
  if(!response.ok)throw Error('最新の日本公式参考成分を取得できません。');
  return response.json();
 }
 if(u.pathname.endsWith('/partial-ingredient-evidence-rc152.json')){
  const response=await fetch('./partial-ingredient-evidence-rc152.json',{signal});
  if(!response.ok)throw Error('追加の日本公式成分原文を読み込めません。');
  return response.json();
 }
 if(u.pathname.endsWith('/partial-ingredient-evidence-rc151.json')){
  const response=await fetch('./partial-ingredient-evidence-rc151.json',{signal});
  if(!response.ok)throw Error('追加のメーカー日本語参考原文を取得できません。');
  return response.json();
 }
 if(u.pathname.endsWith('/partial-ingredient-evidence-rc150.json')){
  const response=await fetch('./partial-ingredient-evidence-rc150.json',{signal});
  if(!response.ok)throw Error('最新のメーカー公式参考成分を読み込めません。');
  return response.json();
 }
 if(u.pathname.endsWith('/partial-ingredient-evidence-rc149.json')){
  const response=await fetch('./partial-ingredient-evidence-rc149.json',{signal});
  if(!response.ok)throw Error('日本公式の商品別参考成分を読み込めません。');
  return response.json();
 }
 if(u.pathname.endsWith('/partial-ingredient-evidence-rc148.json')){
  const response=await fetch('./partial-ingredient-evidence-rc148.json',{signal});
  if(!response.ok)throw Error('最新の国内公式成分原文を読み込めません。');
  return response.json();
 }
 if(u.pathname.endsWith('/partial-ingredient-evidence-rc147.json')){
  const response=await fetch('./partial-ingredient-evidence-rc147.json',{signal});
  if(!response.ok)throw Error('追加の日本公式の成分原文を読み込めません。');
  return response.json();
 }
 if(u.pathname.endsWith('/partial-ingredient-evidence-rc146.json')){
  const response=await fetch('./partial-ingredient-evidence-rc146.json',{signal});
  if(!response.ok)throw Error('追加の日本公式の成分原文を読み込めません。');
  return response.json();
 }
 if(u.pathname.endsWith('/partial-ingredient-evidence-rc143.json')){
  const response=await fetch('./partial-ingredient-evidence-rc143.json',{signal});
  if(!response.ok)throw Error('花王の原文参考資料を読み込めません。');
  return response.json();
 }
 if(u.pathname.endsWith('/partial-ingredient-evidence-rc141.json')){
  const response=await fetch('./partial-ingredient-evidence-rc141.json',{signal});
  if(!response.ok)throw Error('アルブラン公式原文を読み込めません。');
  return response.json();
 }
 if(u.pathname.endsWith('/partial-ingredient-evidence-rc140.json')){
  const response=await fetch('./partial-ingredient-evidence-rc140.json',{signal});
  if(!response.ok)throw Error('個別JANの公式成分原文を読み込めません。');
  return response.json();
 }
 if(u.pathname.endsWith('/partial-ingredient-evidence-rc139.json')){
  const response=await fetch('./partial-ingredient-evidence-rc139.json',{signal});
  if(!response.ok)throw Error('個別JANの公式成分原文を読み込めません。');
  return response.json();
 }
 if(u.pathname.endsWith('/partial-ingredient-evidence-rc137.json')){
  const response=await fetch('./partial-ingredient-evidence-rc137.json',{signal});
  if(!response.ok)throw Error('オバジ日本公式の個別成分名を読み込めません。');
  return response.json();
 }
 if(u.pathname.endsWith('/partial-ingredient-evidence-rc136.json')){
  const response=await fetch('./partial-ingredient-evidence-rc136.json',{signal});
  if(!response.ok)throw Error('ロート公式の成分名資料を読み込めません。');
  return response.json();
 }
 if(u.pathname.endsWith('/partial-ingredient-evidence-rc135.json')){
  const response=await fetch('./partial-ingredient-evidence-rc135.json',{signal});
  if(!response.ok)throw Error('花王公式の個別商品成分名を読み込めません。');
  return response.json();
 }
 if(u.pathname.endsWith('/partial-ingredient-evidence-rc134.json')){
  const response=await fetch('./partial-ingredient-evidence-rc134.json',{signal});
  if(!response.ok)throw Error('国内向け参考成分名資料を読み込めません。');
  return response.json();
 }
 if(u.pathname.endsWith('/partial-ingredient-evidence-rc133.json')){
  const response=await fetch('./partial-ingredient-evidence-rc133.json',{signal});
  if(!response.ok)throw Error('資生堂の医薬部外品参考成分資料を読み込めません。');
  return response.json();
 }
 if(u.pathname.endsWith('/partial-ingredient-evidence-rc131.json')){
  const response=await fetch('./partial-ingredient-evidence-rc131.json',{signal});
  if(!response.ok)throw Error('日本公式の色番別成分資料を読み込めません。');
  return response.json();
 }
 if(u.pathname.endsWith('/partial-ingredient-evidence.json')){
  const response=await fetch('./partial-ingredient-evidence.json',{signal});
  if(!response.ok)throw Error('判明成分の資料を読み込めませんでした。');
  return response.json();
 }
 if(u.pathname.endsWith('/formula-records.json')){
  const response=await fetch('./formula-records.json',{signal});
  if(!response.ok)throw Error('収録データを読み込めません。');
  return response.json();
 }
 if(u.pathname.endsWith('/api/brands')){
  const existing=brands.map(({id,country,maker,name,aliases,site,strategy})=>({id,country,maker,name,aliases,site:isJapaneseMarketURL(site||'')?site:'',strategy,japanSiteVerified:!!site&&isJapaneseMarketURL(site)}));
  let extra=[];
  try{const response=await fetch('./maker-brand-directory.json',{signal});if(response.ok){const directory=await response.json();extra=directory.makers.flatMap(m=>m.brands.filter(b=>b.brandId===null).map(b=>({id:null,country:m.country,maker:m.maker,name:b.name,aliases:b.aliases,site:'',strategy:'manual',japanSiteVerified:false})));}}catch{}
  return {brands:[...existing,...extra],stats:{...brandStats(),total:existing.length+extra.length,japanMarketBrands:existing.length+extra.length,japanMarketSites:brands.filter(b=>b.site&&isJapaneseMarketURL(b.site)).length,verifiedProducts:factProductIds.size}};
 }
 if(u.pathname.endsWith('/api/catalog')){
  const filtered=u.searchParams.get('brand')?productsForBrand(u.searchParams.get('brand')):q?staticProducts(q):registeredProducts;
  return {products:filtered.map(mapped),count:filtered.length,registeredTotal:registeredProducts.length};
 }
 if(u.pathname.endsWith('/api/brand-products')){
  const id=identifyBrand(q),exact=brands.find(b=>b.aliases.some(a=>fold(a)===fold(q)));
  const brand=exact||id;
  if(!brand)return {found:false,products:[],shopLinks:shopLinks(q)};
  const matched=staticProducts(q);
  const products=exact?productsForBrand(brand.name):matched;
  return {found:true,brandOnly:!!exact,brand:{name:brand.name,site:brand.site&&isJapaneseMarketURL(brand.site)?brand.site:'',japanSiteVerified:!!brand.site&&isJapaneseMarketURL(brand.site)},products:products.map(mapped),registeredCount:products.length,shopLinks:shopLinks(q),retailerCount:0};
 }
 if(u.pathname.endsWith('/api/search')){
  const brand=identifyBrand(q);
  return {results:[],brand:brand?{name:brand.name,site:brand.site&&isJapaneseMarketURL(brand.site)?brand.site:'',japanSiteVerified:!!brand.site&&isJapaneseMarketURL(brand.site)}:null,
   note:'GitHub Pages版では外部の公式商品ページをサーバーから読み取れません。全成分を貼り付けるか写真OCRを使ってください。'};
 }
 if(u.pathname.endsWith('/api/official')){
  const target=u.searchParams.get('url')||'';
  let parsed;try{parsed=new URL(target);}catch{throw Error('登録商品ページのURLを確認してください。');}
  if(parsed.protocol!=='https:'||parsed.username||parsed.password||parsed.port||parsed.hash)
   throw Error('登録済みの国内公式商品URLのみ対応しています。');
  const matchingProducts=registeredProducts.filter(p=>p.url===parsed.href||p.url+'/'===parsed.href||p.url===parsed.href+'/');
  if(!matchingProducts.length)throw Error('日本語の全成分保存版がない商品です。手入力・写真OCRから追加できます。');
  const archived=await staticGetJSON('/formula-records.json',{signal});
  const matching=archived.records.filter(r=>matchingProducts.some(p=>p.id===r.productId)&&r.sourceUrl===parsed.href);
  if(!matching.length)throw Error('この商品は全成分保存版が未確認です。原文・実物表示を確認し、手入力してください。');
  return {
   name:matching.length>1?'色・タイプ別の複数処方掲載ページ':matching[0].productName,url:matching[0].sourceUrl,region:'jp',kind:matching[0].kind,
   sourceType:'archive',japanMarketConfirmed:true,ingredientPages:[],rows:[],archiveVerifiedAt:matching[0].verifiedAt,
   variants:matching.map(r=>({productId:r.productId,sourceOrigin:r.sourceType,formulaStatus:r.formulaStatus||'listed',sourcePageId:r.sourcePageId||null,sku:r.sku||null,volume:r.volume||null,label:'全成分：'+r.productName+(r.variant&&!r.productName.includes(r.variant)?' '+r.variant:''),ingredients:r.ingredients,activeIngredients:r.activeIngredients||null,otherIngredients:r.otherIngredients||null,
    order:r.order+'。'+r.verifiedAt.slice(0,10)+'の掲載確認保存版。最新処方・実物との一致は未確認。',ingredientCount:r.ingredientCount})),
   fetchedAt:'',officialVerified:false
  };
 }
 if(u.pathname.endsWith('/api/retail'))throw Error('外部サイトからの自動読み込みは停止しています。掲載元の利用条件に従い、日本語の全成分を入力してください。');
 throw Error('このデータはGitHub Pages版では利用できません。');
}
