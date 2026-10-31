// 日本向けの公式商品ページと日本語成分表の形式確認。
// 原産国ではなく販売地域を対象とする。法令への適合証明ではない。
const domesticOfficialHosts=[
 'chifure.co.jp','shiseido.co.jp','orbis.co.jp','fancl.co.jp','dhc.co.jp',
 'rohto.co.jp','shop.rohto.co.jp','tvert.jp','kobayashi.co.jp',
 'kose.co.jp','pola.co.jp','daiichisankyo-hc.co.jp','kracie.co.jp',
 'mandom.co.jp','canmake.com','manyo-japanese.com','anuashop.jp','torriden.jp','mediheal.jp','jp.laneige.com','jp.hera.com'
];
// Individually confirmed Japanese storefronts on .com domains; scope by host and path.
const domesticComPaths=new Map([
 ['www.cledepeau-beaute.com',/^\/jp\/products\//],
 ['www.decorte.com',/^\/site\//],
 ['www.lunasol-official.com',/^\/categories\/pointmake\//],
 ['www.addiction-beauty.com',/^\/site\//],
 ['www.jillstuart-floranotisjillstuart.com',/^\/site\/jillstuart\//],
 ['www.nomorerules.net',/^\/pickup\/lip_monster\//],
 ['ls-jp.fujifilm.com',/^\/astaliftmen\/products\//],
 ['h-jp.fujifilm.com',/^\/products\/lunamer\//],
 ['jp.aestura.com',/^\/products\//],
 ['jp.sulwhasoo.com',/^\/products\//],
 ['drjartjp.com',/^\/$/],
 ['www.matsukiyococokara-online.com',/^\/store\/catalog\/product\/view\/id\/\d{13}\/?$/],
 ['aeonretail.com',/^\/product\/0\/P-\d{13}\/?$/]
]);
const matchesHost=(host,expected)=>host===expected||host.endsWith('.'+expected);
export function isJapaneseMarketURL(input){
 let u;try{u=new URL(input);}catch{return false;}
 if(u.protocol!=='https:'||u.username||u.password||u.port)return false;
 const host=u.hostname.toLowerCase();
 if(domesticOfficialHosts.some(x=>matchesHost(host,x)))return true;
 if(domesticComPaths.has(host))return domesticComPaths.get(host).test(u.pathname);
 // 未登録国内ドメインの場合、公式ページの本人確認と日本語成分表示が別途必須。
 if(host.endsWith('.co.jp')||host.endsWith('.jp'))return true;
 if(matchesHost(host,'kao-kirei.com'))return /^\/ja\/(official|item)\//.test(u.pathname);
 if(matchesHost(host,'kao.com')||matchesHost(host,'muji.com'))return /^\/jp(?:\/|$)/.test(u.pathname);
 return false;
}
export function isJapaneseMarketBrand(brand){
 return Boolean(brand&&brand.country==='JP')||isJapaneseMarketURL(brand?.site);
}
export const recognizedJapaneseCodes=/^(?:BG|DPG|PG|BHT|TEA|PCA|PVP|PCA-Na|DNA-Na|RNA-Na|EDTA-2Na|EDTA-3Na|EDTA-4Na|PEG(?:-?\d+|\(\d+\))|PPG-?\d+|CI\s*\d{5})$/i;
export const isJapaneseIngredientText=name=>{
 const s=String(name||'').normalize('NFKC').trim();
 return Boolean(s)&&(/[ぁ-んァ-ヶ一-龥々]/.test(s)||recognizedJapaneseCodes.test(s.replace(/^PCA[ー－−]Na$/i,'PCA-Na').replace(/[−－ー]/g,'-')));
};
export function isJapaneseIngredientsList(ingredients){
 const values=String(ingredients||'').normalize('NFKC').replace(/(\d),(\d)/g,'$1\u0001$2').replace(/N,N-/g,'N\u0002N-')
   .split(/[、,\n;；]/).map(x=>x.replace(/\u0001/g,',').replace(/\u0002/g,',').trim()).filter(Boolean);
 return values.length>0&&values.every(isJapaneseIngredientText);
}
export const japanBrands=catalog=>catalog.filter(isJapaneseMarketBrand);
export const japaneseMarketStats=items=>({
 total:items.length,
 japan:items.filter(b=>b.country==='JP').length,
 korea:items.filter(b=>b.country==='KR').length,
 japanMakers:new Set(items.filter(b=>b.country==='JP').map(b=>b.maker)).size,
 koreaMakers:new Set(items.filter(b=>b.country==='KR').map(b=>b.maker)).size,
 automated:items.filter(b=>b.strategy&&b.strategy!=='manual').length
});
