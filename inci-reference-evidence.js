import {registeredProducts} from './registered-products.js';
import {analyze,splitIngredients} from './engine.js';
const ingredientPattern=/^(?:[A-Za-z]|[0-9]+,[0-9]+-)[A-Za-z0-9\s()\/.+\-]*$/;
export function validateInciReferenceEvidence(payload){
 if(payload?.schemaVersion!==1||!Array.isArray(payload.records))throw Error('英語INCI参考資料の形式が不正です');
 const seen=new Set();
 return Object.freeze(payload.records.map(record=>{
  const product=registeredProducts.find(p=>p.id===record.productId);
  if(!product||seen.has(record.productId)||product.brand!==record.brand||
    product.name!==record.productName||(product.volume||null)!==(record.volume||null)||
    (product.variant||null)!==(record.variant||null)||
    record.sourceType!=='manufacturer-official-english-inci'||record.coverage!=='english-excerpt-only'||
    record.order!=='not-confirmed'||record.domesticFormulaMatched!==false||
    record.labelCompared!==false||record.currentFormulaCompared!==false||
    record.exportAsFullFormula!==false||
    !['overseas-official','japan-facing-official-english'].includes(record.sourceMarket)||
    !/^https:\/\//i.test(record.sourceUrl)||
    !['jp.beautyofjoseon.com','www.skin1004.com','tirtir.global','celimax.com','haruharuwonder.com','biodance.com'].includes((()=>{try{return new URL(record.sourceUrl).hostname;}catch{return '';}})())||
    !Array.isArray(record.ingredients)||record.ingredients.length<2||record.ingredients.length>12||
    record.ingredients.some(v=>typeof v!=='string'||v.length>90||!ingredientPattern.test(v))||
    new Set(record.ingredients.map(x=>x.toLowerCase())).size!==record.ingredients.length||
    typeof record.note!=='string'||record.note.length<20||
    typeof record.checkedOn!=='string')throw Error('英語INCI参考資料の商品・成分・出典照合が不正: '+record.productId);
  const parsed=analyze(record.ingredients.join('、'));
  if(parsed.length!==record.ingredients.length)throw Error('英語INCIの分割結果が一致しません: '+record.productId);
  seen.add(record.productId);
  return Object.freeze({...record,ingredients:Object.freeze([...record.ingredients])});
 }));
}
export function inciReferenceForProduct(records,product){return records.find(r=>r.productId===product?.id)||null;}
export function reviewEnglishInciNames(input){
 const parts=splitIngredients(String(input||'').replace(/\r/g,'')).map(x=>x.trim()).filter(Boolean);
 if(parts.length<2||parts.length>30||parts.some(x=>x.length>90||!ingredientPattern.test(x))||new Set(parts.map(x=>x.toLowerCase())).size!==parts.length)throw Error('確認した英語INCI名を2～30件入力してください。表示名・区切りと重複を確認してください。');
 if(analyze(parts.join('、')).length!==parts.length)throw Error('英語INCIの区切りを確認してください。');
 return parts;
}
