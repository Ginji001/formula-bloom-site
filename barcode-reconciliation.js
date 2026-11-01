// Product-specific source attribution for an EAN-13 candidate. A checksum and retailer
// cross-reference do not prove a JP statutory package, ingredients or formulation.
const categoryNames=Object.freeze({'cream-80ml':'白樺水分クリーム80mL','mask-sheet-10':'白樺水分シートマスク10枚'});
const validMarkets=new Set(['japan-retailer','crossborder-retailer','overseas-retailer','overseas-wholesaler','barcode-aggregator']);
// Every link is manually reviewed for this product. An arbitrary HTTPS page is NOT a source.
const reviewedProofs=new Map([
 ['https://mitsui-shopping-park.com/ec/p/1104800000305?mallColor=9501',{market:'japan-retailer',category:'cream-80ml'}],
 ['https://jp.iherb.com/pr/round-lab-birch-juice-moisturizing-cream-2-70-fl-oz-80-ml/126164',{market:'crossborder-retailer',category:'cream-80ml'}],
 ['https://theglowtrade.com/collections/round-lab',{market:'overseas-wholesaler',category:'cream-80ml'}],
 ['https://ymall.jp/store/luckycart/b081vs3f27-20250924/',{market:'japan-retailer',category:'cream-80ml'}],
 ['https://www.ozcosmetics.com/Round_Lab_Birch_Juice_Moisturizing_Cream_80ml/357329.aspx',{market:'overseas-retailer',category:'cream-80ml'}],
 ['https://kateminimalist.com/products/round-lab-silver-birch-juice-moisturizing-mask-sheet-10ea-set',{market:'overseas-retailer',category:'mask-sheet-10'}],
 ['https://www.barcodespider.com/round-lab-birch-juice',{market:'barcode-aggregator',category:'mask-sheet-10'}]
]);

export function isValidEan13(value){
 if(typeof value!=='string'||!/^[0-9]{13}$/.test(value))return false;
 const digits=[...value].map(Number);
 const weighted=digits.slice(0,12).reduce((sum,x,i)=>sum+x*(i%2?3:1),0);
 return (10-weighted%10)%10===digits[12];
}
const validLink=url=>{
 try{const x=new URL(url);return x.protocol==='https:'&&!x.username&&!x.password&&!x.port&&x.hostname.includes('.')&&x.hash==='';}
 catch{return false;}
};
export function reconcileBarcodes(candidates,{targetCategory='cream-80ml'}={}){
 if(!Array.isArray(candidates)||!categoryNames[targetCategory])throw Error('比較商品分類または候補データが不正');
 const seen=new Set();
 return Object.freeze(candidates.map(candidate=>{
  if(!isValidEan13(candidate?.value)||seen.has(candidate.value)||!Array.isArray(candidate.references)||candidate.references.length<2||!validLink(candidate.sourceUrl))
    throw Error('JAN候補・チェックデジット・複数参照元が不正');
  seen.add(candidate.value);
  const urls=new Set();
  for(const ref of candidate.references){
   const proof=reviewedProofs.get(ref?.url);
   if(!validLink(ref?.url)||urls.has(ref.url)||!validMarkets.has(ref.market)||!categoryNames[ref.productCategory]||typeof ref.site!=='string'||!ref.site.trim()||!proof||proof.market!==ref.market||proof.category!==ref.productCategory)throw Error('JAN比較資料・商品分類・URLが不正');
   urls.add(ref.url);
  }
  if(!urls.has(candidate.sourceUrl))throw Error('JAN候補の元資料が参照一覧にありません');
  const same=candidate.references.filter(x=>x.productCategory===targetCategory);
  const other=candidate.references.filter(x=>x.productCategory!==targetCategory);
  if(!same.length)throw Error('候補に対象商品を指す資料がありません');
  const status=other.length?'cross-category-conflict':'corroborated-cream-reference';
  return Object.freeze({
   value:candidate.value,
   eanChecksumValid:true,
   status,
   sameCategorySourceCount:same.length,
   otherCategorySourceCount:other.length,
   sameCategorySources:Object.freeze(same.map(x=>Object.freeze({...x}))),
   conflictingCategorySources:Object.freeze(other.map(x=>Object.freeze({...x}))),
   formulaConfirmed:false,
   japaneseLabelConfirmed:false,
   canonicalJapanJan:false,
   finding:status==='cross-category-conflict'
    ?'同じJANが別の商品種類にも掲載されています。JANの取り違え・販売店データの混在などの可能性がありますが、原因は断定できません。'
    :'複数の出典で80mLクリームとの対応を確認。ただし日本国内向け現物のJAN・処方確定ではありません。'
  });
 }));
}
