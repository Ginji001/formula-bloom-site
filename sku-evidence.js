// Source-first product identity only. A matching barcode does not establish a matching current formulation.
import {registeredProducts} from './registered-products.js';
import {isJapaneseMarketURL} from './japan-market-policy.js';
import {reconcileBarcodes} from './barcode-reconciliation.js';
const fold=x=>String(x||'').normalize('NFKC').toLowerCase().replace(/[\s・_－―‐ー\-()（）「」]/g,'');
const size=x=>String(x||'').normalize('NFKC').toLowerCase().replace(/\s/g,'');
export function compareSkuRecord(product,record){
 if(!product||record?.productId!==product.id)throw Error('商品IDの一致が必要です');
 const observation=record.observation;
 if(!observation?.productName||!observation?.sourceUrl||!['japan-domestic-retailer','japan-market-unverified-catalog','overseas-maker','japan-facing-crossborder-retailer','historical-domestic-maker-announcement'].includes(observation.sourceMarket))throw Error('照合資料が不完全です');
 const checks=[],risks=[],conflicts=[];
 if(fold(product.brand)!==fold(observation.brand)){conflicts.push('ブランド名が異なります');risks.push('ブランド名が一致しません');}
 if(size(product.volume)!==size(observation.volume)){conflicts.push('容量違い');risks.push('容量・単位が異なります：登録 '+(product.volume||'未登録')+'／比較 '+(observation.volume||'未記載'));}
 else checks.push('容量一致：'+product.volume);
 if(product.variant&&observation.variant&&fold(product.variant)!==fold(observation.variant)){conflicts.push('色番違い');risks.push('色番・仕様が一致しません');}
 else if(product.variant&&!observation.variant)risks.push('比較資料の色番・仕様が未記載');
 else if(product.variant)checks.push('色番・仕様一致：'+product.variant);
 else risks.push('登録商品の色番・仕様が未指定');
 if(product.jan&&observation.jan&&product.jan===observation.jan)checks.push('JAN一致：'+product.jan);
 else if(product.jan&&observation.jan){conflicts.push('JAN違い');risks.push('JANが一致しません');}
 else risks.push('JANの一致を確認できません');
 if(observation.sourceMarket==='overseas-maker')risks.push('海外版であり国内向け処方の証拠ではありません');
 if(observation.sourceMarket==='japan-facing-crossborder-retailer')risks.push('日本語販売ページでも韓国直送・個人輸入であり国内向け法定ラベル未確認');
 if(observation.sourceMarket==='historical-domestic-maker-announcement')risks.push('当時の国内販売資料のみ。現行製品・JAN・全成分を保証しません');
 if(['japan-domestic-retailer','japan-market-unverified-catalog','japan-facing-crossborder-retailer','historical-domestic-maker-announcement'].includes(observation.sourceMarket)&&!isJapaneseMarketURL(observation.sourceUrl))throw Error('国内向け掲載ページでありません');
 const nameMatches=fold(product.name)===fold(observation.productName);
 if(!nameMatches){conflicts.push('商品名違い');risks.push('商品名の一致が確認できません');}
 else checks.push('商品名一致');
 const status=observation.sourceMarket==='overseas-maker'?'foreign-not-transferable':
  observation.sourceMarket==='japan-facing-crossborder-retailer'?'crossborder-not-domestic':
  observation.sourceMarket==='historical-domestic-maker-announcement'?'historical-domestic-identity':
  observation.sourceMarket==='japan-market-unverified-catalog'?'catalog-unverified':
  conflicts.length?'blocked-identity-conflict':
  nameMatches&&product.jan&&product.jan===observation.jan&&product.variant&&fold(product.variant)===fold(observation.variant)&&size(product.volume)===size(observation.volume)?'sku-identifiers-matched':'review-only';
 return Object.freeze({productId:product.id,status,checks,risks,
  sourceMarket:observation.sourceMarket,sourceUrl:observation.sourceUrl,sourceKind:observation.sourceKind,
  observedName:observation.productName,checkedOn:record.checkedOn,
  labelCompared:false,formulaConfirmed:false,fullIngredientListConfirmed:false,
  nextAction:status==='crossborder-not-domestic'?'韓国直送の販売ページからは日本国内で流通する容器表示と配合成分を確認できません。日本国内の正規輸入品・現物ラベル・JANを確認してください。':status==='historical-domestic-identity'?'当時の国内販売は確認できます。現物ラベル・JAN・発売後の処方変更を確認してください。ASINはJANではありません。':status==='catalog-unverified'?'投稿型の商品情報だけでは国内販売された正確なSKUを特定できません。メーカー、現物ラベル、国内輸入販売元を確認してください。':status==='sku-identifiers-matched'?'現物ラベルと掲載日本語成分・製造ロットを確認してください。':status==='foreign-not-transferable'?'国内向けの容器表示・容量単位・JANを確認してください。海外の配合成分は採用しません。':'未照合の識別項目を国内向け現物・公式掲載で確認してください。'
 });
}
const pinnedReviewedSourceUrls=Object.freeze({
 'rc82-roundlab-birch-80':'https://www.biccamera.com/bc/item/15277443/',
 'rc82-drceuracle-kombucha-150':'https://www.cosme.net/products/10239837/',
 'rc83-axisy-glow-50':'https://coreelle.jp/products/ax-darkserum-01',
 'rc64-iope-vitamin-c23':'https://prtimes.jp/main/html/rd/p/000000001.000072494.html'
});
export function validateSkuEvidence(data){
 if(data?.schemaVersion!==1||!Array.isArray(data.records))throw Error('SKU比較資料の形式が不正');
 const ids=new Set();
 return Object.freeze(data.records.map(r=>{
  const product=registeredProducts.find(p=>p.id===r.productId);
  if(!product||ids.has(r.productId)||!/^2026-\d\d-\d\d$/.test(r.checkedOn||'')||r.labelCompared!==false||r.formulaConfirmed!==false)throw Error('SKU資料の商品・確認日・現物状態が不正');
  if(pinnedReviewedSourceUrls[r.productId]&&r.observation?.sourceUrl!==pinnedReviewedSourceUrls[r.productId])throw Error('商品候補の出典URLが一致しません');
  ids.add(r.productId);
  const result=compareSkuRecord(product,r);
  if(result.sourceMarket==='overseas-maker'&&!/^https:\/\//.test(result.sourceUrl))throw Error('海外資料のURLが不正');
  if(r.expectedStatus!==result.status)throw Error('SKU照合ステータスと実際の識別子が矛盾：'+r.productId);
  if(r.janCandidates&&r.productId!=='rc82-roundlab-birch-80')throw Error('未監査の商品にJAN候補の比較を追加できません');
  if(r.productId==='rc82-roundlab-birch-80'&&(!Array.isArray(r.janCandidates)||r.janCandidates.length!==2||product.jan!==null))throw Error('ラウンドラボ候補JANの比較必須・現物JAN未確認');
  const janReconciliation=r.janCandidates?reconcileBarcodes(r.janCandidates):Object.freeze([]);
  if(r.productId==='rc82-roundlab-birch-80'&&(
    janReconciliation[0].value!=='8809738600221'||janReconciliation[0].status!=='corroborated-cream-reference'||
    janReconciliation[1].value!=='8809624726400'||janReconciliation[1].status!=='cross-category-conflict'
   ))throw Error('ラウンドラボのJAN証拠評価が改変されました');
  return Object.freeze({...r,janReconciliation,comparison:result});
 }));
}
export const skuRecordForProduct=(validated,product)=>validated.find(x=>x.productId===product?.id)||null;
