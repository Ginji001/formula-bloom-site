// 掲載時点の日本向け全成分保存版にあるSKUだけを探す。名前やブランドの一致では代用しない。
import {productFold} from './registered-products.js';
import {isRc167FullIngredientProductId} from './formula-expansion-rc167.js';
import {isRc168FullIngredientProductId} from './formula-expansion-rc168.js';
import {isRc169FullIngredientProductId} from './formula-expansion-rc169.js';

export function archivedProductIds(archive) {
 if(!archive || !Array.isArray(archive.records)) return new Set();
 return new Set(archive.records.map(record=>record.productId));
}

export function productsWithVerifiedArchive(products,archive,allowed=()=>true) {
 const ids=archivedProductIds(archive);
 return products.filter(item=>allowed(item)&&ids.has(item.id));
}

export function itemHasArchiveInCatalog(item) {
 // 登録台帳の区分は現行409件の保存版IDと毎回テストで全件照合する。
 // 実際の花の生成は必ず保存版原文の recordForProduct() を再検証してから。
 return Boolean(item&&(item.registrationStatus!=='name-only'||isRc167FullIngredientProductId(item.id)||isRc168FullIngredientProductId(item.id)||isRc169FullIngredientProductId(item.id)));
}

export function familyMatchingText(family,query) {
 const term=productFold(query||'');
 if(!term)return true;
 const head=productFold([family.brand,family.name,family.series||'',family.productType||''].join(' '));
 if(head.includes(term))return true;
 return family.products.some(item=>productFold([
  item.brand,item.name,item.series||'',item.productType||'',item.variant||'',item.volume||'',
  item.jan||'',item.sku||''
 ].join(' ')).includes(term));
}

export function visibleFormulaFamilies(families,{query='',availableOnly=false}={}) {
 return families.flatMap(family=>{
  const products=availableOnly?family.products.filter(itemHasArchiveInCatalog):family.products;
  if(!products.length)return [];
  const candidate=products.length===family.products.length?family:{...family,products};
  return familyMatchingText(candidate,query)?[candidate]:[];
 });
}
