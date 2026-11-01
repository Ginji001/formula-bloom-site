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
    !['manufacturer-official-english-inci','foreign-retailer-english-inci'].includes(record.sourceType)||record.coverage!=='english-excerpt-only'||
    record.order!=='not-confirmed'||record.domesticFormulaMatched!==false||
    record.labelCompared!==false||record.currentFormulaCompared!==false||
    record.exportAsFullFormula!==false||
    !['overseas-official','japan-facing-official-english','overseas-retailer-english','japan-facing-retailer-english'].includes(record.sourceMarket)||
    (record.sourceType==='manufacturer-official-english-inci'&&!['overseas-official','japan-facing-official-english'].includes(record.sourceMarket))||
    (record.sourceType==='foreign-retailer-english-inci'&&(!['overseas-retailer-english','japan-facing-retailer-english'].includes(record.sourceMarket)||typeof record.retailerName!=='string'||!record.retailerName.trim()))||
    !/^https:\/\//i.test(record.sourceUrl)||
    !['jp.beautyofjoseon.com','www.skin1004.com','tirtir.global','celimax.com','haruharuwonder.com','biodance.com','us.numbuzin.com','lgbeauty.com','heimish.us','doctoraltheaglobal.com','medicube.us','global.amoremall.com','www.3cecosmetics.com','dasique.com','amusemakeup.jp','us.oliveyoung.com','wholesale.q-depot.com','lewkin.com','www.jolse.com','www.axis-y.com','purito.com'].includes((()=>{try{return new URL(record.sourceUrl).hostname;}catch{return '';}})())||
    !Array.isArray(record.ingredients)||record.ingredients.length<2||record.ingredients.length>12||
    record.ingredients.some(v=>typeof v!=='string'||v.length>90||!ingredientPattern.test(v))||
    new Set(record.ingredients.map(x=>x.toLowerCase())).size!==record.ingredients.length||
    typeof record.note!=='string'||record.note.length<20||
    typeof record.checkedOn!=='string')throw Error('英語INCI参考資料の商品・成分・出典照合が不正: '+record.productId);
  if(record.productId==='rc82-drceuracle-kombucha-150'&&(
      record.sourceUrl!=='https://www.jolse.com/product/drceuracle-vegan-kombucha-tea-essence-150ml/36156/'||
      record.sourceType!=='foreign-retailer-english-inci'||
      record.sourceMarket!=='overseas-retailer-english'||
      record.ingredients.length!==8||
      record.ingredients[0]!=='Water'||
      record.ingredients[2]!=='Hydrogenated Poly(C6-14 Olefin)'||
      record.ingredients[7]!=='Trilaureth-4 Phosphate'
  ))throw Error('Dr.Ceuracle海外参照の出典・抜粋内容が確認時と異なります');
  if(record.productId==='rc83-axisy-glow-50'&&(
    record.sourceUrl!=='https://www.axis-y.com/products/dark-spot-correcting-glow-serum'||
    record.sourceType!=='manufacturer-official-english-inci'||record.sourceMarket!=='overseas-official'||
    JSON.stringify(record.ingredients)!==JSON.stringify(['Water','Glycerin','Niacinamide','Sodium Hyaluronate','Propanediol','Erythritol','Butylene Glycol','Squalane'])
  ))throw Error('AXIS-Y海外公式英語INCI参照の照合条件が変更されました');
  if(record.productId==='rc89-purito-centella-60-original'&&(
    record.sourceUrl!=='https://purito.com/product/wonder-releaf-centella-serum/'||
    record.sourceType!=='manufacturer-official-english-inci'||record.sourceMarket!=='overseas-official'||
    JSON.stringify(record.ingredients)!==JSON.stringify(['Water','Glycerin','Dipropylene Glycol','Propanediol','Butylene Glycol','Niacinamide','1,2-Hexanediol','Sodium Hyaluronate'])
  ))throw Error('PURITOオリジナル60mLの海外公式INCI参照が変更されました');
  const pinnedReferences={
   'rc90-iope-super-vital-softener-150':{
    sourceUrl:'https://global.amoremall.com/products/iope-super-vital-softener',sourceType:'manufacturer-official-english-inci',
    ingredients:['BUTYLENE GLYCOL','GLYCERETH-26','GLYCERIN','ALCOHOL DENAT.','NIACINAMIDE','1,2-HEXANEDIOL','DIMETHICONE','PROPANEDIOL']},
   'rc90-mamonde-pore-shrinker-serum-50':{
    sourceUrl:'https://global.amoremall.com/products/mamonde-pore-shrinker-bakuchiol-serum',sourceType:'manufacturer-official-english-inci',
    ingredients:['BUTYLENE GLYCOL','CAPRYLIC/CAPRIC TRIGLYCERIDE','GLYCERIN','1,2-HEXANEDIOL','BETAINE','BEHENYL ALCOHOL','GELLAN GUM','SODIUM CHLORIDE']},
   'rc90-iunik-teatree-relief-serum-50':{
    sourceUrl:'https://www.jolse.com/product/iunik-tea-tree-relief-serum-50ml/53747/category/1230/display/1/',sourceType:'foreign-retailer-english-inci',
    ingredients:['Melaleuca Alternifolia (Tea Tree) Leaf Water','Centella Asiatica Leaf Water','Butylene Glycol','Niacinamide','Glycereth-26','Water','Centella Asiatica (Gotu Kola) Extract','Sodium Hyaluronate']}
  };
  const pin=pinnedReferences[record.productId];
  if(pin&&(record.sourceUrl!==pin.sourceUrl||record.sourceType!==pin.sourceType||
   record.sourceMarket!==(pin.sourceType==='manufacturer-official-english-inci'?'overseas-official':'overseas-retailer-english')||
   JSON.stringify(record.ingredients)!==JSON.stringify(pin.ingredients)))throw Error('商品固有の海外英語INCI参考出典・名称が不正です');
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
