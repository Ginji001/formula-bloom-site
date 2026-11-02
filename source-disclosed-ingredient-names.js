// Manufacturer source: independently normalized factual ingredient names only.
// Purpose-group table position is NEVER a legal ingredient order; these are reference flowers.
import {registeredProducts} from './registered-products.js';
import {reviewPartialInput} from './partial-ingredient-evidence.js';
export function validateDisclosedNameFacts(data){
 if(data?.schemaVersion!==1||!Array.isArray(data.records)||data.notFullFormulaArchive!==true)throw Error('明記成分の参考データ形式が不正です。');
 const ids=new Set();
 for(const r of data.records){
  const p=registeredProducts.find(p=>p.id===r.productId);
  if(!p||ids.has(r.productId)||r.brand!==p.brand||r.productName!==p.name||
   r.volume!==p.volume||r.variant!==p.variant||r.sourceUrl!==p.ingredientSourceUrl||
   r.order!=='ingredient-name-facts-sorted-alphabetically-not-original-formula-order'||
   !['all-displayed-name-facts-from-purpose-grouped-table-not-Japan-package-label-order','manufacturer-disclosed-japanese-name-facts-for-same-JAN-not-current-lot'].includes(r.coverage)||
   r.formulaOrderConfirmed!==false||r.completePhysicalLabelConfirmed!==false||
   r.republicationOfManufacturerProse!==false||
   !Array.isArray(r.ingredientNames)||r.ingredientNames.length<2||r.ingredientNames.length>40||
   r.ingredientCount!==r.ingredientNames.length||
   reviewPartialInput(r.ingredientNames.join('、')).length!==r.ingredientCount||
   !/^https:\/\/(?:www\.chifure\.co\.jp\/products\/|www\.shop\.rohto\.co\.jp\/category\/skincare\/bloomio\/|www\.kao-kirei\.com\/ja\/item\/kbb\/kate\/)/.test(r.sourceUrl))
   throw Error('明記成分と国内向け商品の照合が不正: '+r.productId);
  ids.add(r.productId);
 }
 return Object.freeze(data.records.map(r=>Object.freeze({...r,ingredientNames:Object.freeze([...r.ingredientNames])})));
}
export function disclosedNameFactsForProduct(records,item){return records.find(r=>r.productId===item?.id)||null;}
