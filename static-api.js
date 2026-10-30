// GitHub Pages向け。サーバーは使用せず、収録ブランドと商品名のみローカル検索。
// 商品成分の自動収集・保存版再配布は行わず、利用者の手入力・写真OCRを使用する。
import {brands,identifyBrand,brandStats} from './brand-directory.js';
import {registeredProducts,findRegisteredProducts,productsForBrand} from './registered-products.js';
import {isJapaneseMarketURL} from './japan-market-policy.js';

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
const staticProducts=q=>{
 const s=fold(q);if(!s)return [];
 return registeredProducts.filter(x=>[x.brand+' '+x.name,x.name,...x.aliases].some(value=>fold(value).includes(s)||s.includes(fold(value)))).slice(0,30);
};
const mapped=p=>({...p,registered:true,officialVerified:false,sourceType:'registered',kind:'cosmetic'});
export async function staticGetJSON(path,{signal}={}){
 if(signal?.aborted)throw new DOMException('検索を中止しました。','AbortError');
 const u=new URL(path,location.href),q=(u.searchParams.get('q')||'').trim();
 if(u.pathname.endsWith('/formula-records.json')){
  const response=await fetch('./formula-records.json',{signal});
  if(!response.ok)throw Error('収録データを読み込めません。');
  return response.json();
 }
 if(u.pathname.endsWith('/api/brands')){
  return {brands:brands.map(({id,country,maker,name,aliases,site,strategy})=>({id,country,maker,name,aliases,site:isJapaneseMarketURL(site||'')?site:'',strategy,japanSiteVerified:!!site&&isJapaneseMarketURL(site)})),stats:{...brandStats(),japanMarketBrands:brands.length,japanMarketSites:brands.filter(b=>b.site&&isJapaneseMarketURL(b.site)).length,verifiedProducts:0}};
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
  const products=matched.length?matched:productsForBrand(brand.name);
  return {found:true,brandOnly:!!exact,brand:{name:brand.name,site:brand.site&&isJapaneseMarketURL(brand.site)?brand.site:'',japanSiteVerified:!!brand.site&&isJapaneseMarketURL(brand.site)},products:products.map(mapped),registeredCount:products.length,shopLinks:shopLinks(q),retailerCount:0};
 }
 if(u.pathname.endsWith('/api/search')){
  const brand=identifyBrand(q);
  return {results:[],brand:brand?{name:brand.name,site:brand.site&&isJapaneseMarketURL(brand.site)?brand.site:'',japanSiteVerified:!!brand.site&&isJapaneseMarketURL(brand.site)}:null,
   note:'GitHub Pages版では外部の公式商品ページをサーバーから読み取れません。全成分を貼り付けるか写真OCRを使ってください。'};
 }
 if(u.pathname.endsWith('/api/official'))throw Error('GitHub Pages版は公式サイトへの自動照会に対応していません。掲載元を確認し、日本語の全成分を入力してください。');
 if(u.pathname.endsWith('/api/retail'))throw Error('外部サイトからの自動読み込みは停止しています。掲載元の利用条件に従い、日本語の全成分を入力してください。');
 throw Error('このデータはGitHub Pages版では利用できません。');
}
