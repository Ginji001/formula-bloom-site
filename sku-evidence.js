// Source-first product identity only. A matching barcode does not establish a matching current formulation.
import {registeredProducts} from './registered-products.js';
import {isJapaneseMarketURL} from './japan-market-policy.js';
const fold=x=>String(x||'').normalize('NFKC').toLowerCase().replace(/[\s・_－―‐ー\-()（）「」]/g,'');
const size=x=>String(x||'').normalize('NFKC').toLowerCase().replace(/\s/g,'');
export function compareSkuRecord(product,record){
 if(!product||record?.productId!==product.id)throw Error('商品IDの一致が必要です');
 const observation=record.observation;
 if(!observation?.productName||!observation?.sourceUrl||!['japan-domestic-retailer','overseas-maker'].includes(observation.sourceMarket))throw Error('照合資料が不完全です');
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
 if(observation.sourceMarket==='japan-domestic-retailer'&&!isJapaneseMarketURL(observation.sourceUrl))throw Error('国内向け掲載ページでありません');
 const nameMatches=fold(product.name)===fold(observation.productName);
 if(!nameMatches){conflicts.push('商品名違い');risks.push('商品名の一致が確認できません');}
 else checks.push('商品名一致');
 const status=observation.sourceMarket==='overseas-maker'?'foreign-not-transferable':
  conflicts.length?'blocked-identity-conflict':
  nameMatches&&product.jan&&product.jan===observation.jan&&product.variant&&fold(product.variant)===fold(observation.variant)&&size(product.volume)===size(observation.volume)?'sku-identifiers-matched':'review-only';
 return Object.freeze({productId:product.id,status,checks,risks,
  sourceMarket:observation.sourceMarket,sourceUrl:observation.sourceUrl,sourceKind:observation.sourceKind,
  observedName:observation.productName,checkedOn:record.checkedOn,
  labelCompared:false,formulaConfirmed:false,fullIngredientListConfirmed:false,
  nextAction:status==='sku-identifiers-matched'?'現物ラベルと掲載日本語成分・製造ロットを確認してください。':status==='foreign-not-transferable'?'国内向けの容器表示・容量単位・JANを確認してください。海外の配合成分は採用しません。':'未照合の識別項目を国内向け現物・公式掲載で確認してください。'
 });
}
export function validateSkuEvidence(data){
 if(data?.schemaVersion!==1||!Array.isArray(data.records))throw Error('SKU比較資料の形式が不正');
 const ids=new Set();
 return Object.freeze(data.records.map(r=>{
  const product=registeredProducts.find(p=>p.id===r.productId);
  if(!product||ids.has(r.productId)||!/^2026-\d\d-\d\d$/.test(r.checkedOn||'')||r.labelCompared!==false||r.formulaConfirmed!==false)throw Error('SKU資料の商品・確認日・現物状態が不正');
  ids.add(r.productId);
  const result=compareSkuRecord(product,r);
  if(result.sourceMarket==='overseas-maker'&&!/^https:\/\//.test(result.sourceUrl))throw Error('海外資料のURLが不正');
  if(r.expectedStatus!==result.status)throw Error('SKU照合ステータスと実際の識別子が矛盾：'+r.productId);
  return Object.freeze({...r,comparison:result});
 }));
}
export const skuRecordForProduct=(validated,product)=>validated.find(x=>x.productId===product?.id)||null;
