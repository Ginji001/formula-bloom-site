import {isJapaneseIngredientText,isJapaneseMarketURL} from './japan-market-policy.js';
import {analyze,splitIngredients} from './engine.js';
import {registeredProducts} from './registered-products.js';
export function validatePartialEvidence(data){
 if(data?.schemaVersion!==1||!Array.isArray(data.records))throw Error('判明成分資料が不正です');
 const seen=new Set();
 return Object.freeze(data.records.map(record=>{
  const product=registeredProducts.find(p=>p.id===record.productId);
  if(!product||seen.has(record.productId)||product.brand!==record.brand||product.name!==record.productName||
   (product.volume||null)!==(record.volume||null)||!isJapaneseMarketURL(record.sourceUrl)||
   record.coverage!=='partial-only'||record.order!=='not-confirmed'||record.labelCompared!==false||
   !Array.isArray(record.ingredients)||!record.ingredients.length||
   record.ingredients.some(s=>!isJapaneseIngredientText(s))||
   !['japanese-manufacturer-website','japanese-domestic-retailer-listing'].includes(record.sourceType)||
   (record.sourceType==='japanese-domestic-retailer-listing'&&!record.retailerName))throw Error('判明成分の出典・商品照合が不正: '+record.productId);
  seen.add(record.productId);
  return Object.freeze({...record,ingredients:Object.freeze([...new Set(record.ingredients)])});
 }));
}
export function partialForProduct(records,item){return records.find(r=>r.productId===item?.id)||null;}
export function reviewPartialInput(value){
 const names=splitIngredients(String(value||'').replace(/\r/g,'')).map(s=>s.trim()).filter(Boolean);
 if(!names.length||names.length>40||names.some(name=>!isJapaneseIngredientText(name)))throw Error('確認できた日本語の成分表示名称を1～40個入力してください。海外INCIや広告の総称は使えません。');
 const dedup=[...new Set(names)];
 if(analyze(dedup.join('、')).length!==dedup.length)throw Error('入力成分の形式を確認してください');
 return dedup;
}
