// Product-level presentation: volumes and colors can belong to one product family.
// Keep the actually observed formula/variant for every analysis; never substitute
// a different shade's ingredient listing as though it was identical.
import {productFold} from './registered-products.js';

const colorSuffix=/[（(]((?:\d{1,3}|[A-Z]{1,3}\d{1,3})(?:[\s　][^）)]{1,24})?|クリア|ラベンダー|ソフトイエロー|ソフトグリーン|ナチュラルベージュ|ラベンダーグロウ|クリアグロウ)[）)]$/i;
const bracketShade=/\s*\[[A-Z]?\d{1,3}\][^\s]{0,30}$/i;
const capacityTail=/\s*(?:[（(]\s*)?\d+(?:\.\d+)?\s*(?:mL|ml|L|g|kg|枚|個|本|包)(?:入り)?(?:[）)])?$/i;

export function productFamilyName(product){
 const raw=String(product.name||'').trim().replace(capacityTail,'').trim();
 if(product.brand==='セザンヌ'&&/^cezanne-\d{13}-/.test(product.id))return raw.replace(colorSuffix,'');
 if(product.brand==='キャンメイク'&&/^canmake-/.test(product.id))return raw.replace(bracketShade,'').trim();
 return raw;
}

export function productFamilyKey(product){
 const name=productFamilyName(product);
 // Series and texture/type are independent products even when names match.
 // Only sourced metadata is used; never infer a series from the manufacturer.
 const series=productFold(product.series||'');
 // Only explicit type metadata or an unequivocal formulation descriptor matters.
 // Shade codes, refill packages and volume are grouped as requested.
 const variant=String(product.variant||'');
 const formulaVariant=/(?:しっとり|さっぱり|モイスト|リッチタイプ|ライトタイプ|無香料|香り(?:付き|なし)|敏感肌用)/.test(variant)?variant:'';
 const type=productFold(product.productType||formulaVariant);
 const part='|series:'+series+'|type:'+type;
 // A common source section identifies a product, not a specific shade.
 if(product.brand==='セザンヌ'&&product.sourcePageId)
  return productFold(product.brand)+'|section:'+product.sourcePageId+part;
 return productFold(product.brand)+'|'+productFold(name)+part;
}

export function productFamilies(products){
 const groups=new Map();
 for(const product of products){
  const key=productFamilyKey(product);
  if(!groups.has(key))groups.set(key,{key,brand:product.brand,series:product.series||null,productType:product.productType||null,name:productFamilyName(product),products:[]});
  groups.get(key).products.push(product);
 }
 return [...groups.values()].map(g=>({...g,products:Object.freeze(g.products),formulaVariants:g.products.length}));
}

// Only a unique exact product/alias can bypass explicit variant selection.
// A family name alone is not a safe identity when packages, shades or formulas differ.
export function exactFamilyMember(family,query=''){
 const q=productFold(query);
 if(!q)return null;
 const exact=family.products.filter(p=>
   [p.brand+' '+p.name,p.name,...p.aliases].some(v=>productFold(v)===q));
 return exact.length===1?exact[0]:null;
}
export function chooseFamilyFormula(family,query=''){
 return exactFamilyMember(family,query)||family.products[0]; // UI opens ambiguous variants
}
