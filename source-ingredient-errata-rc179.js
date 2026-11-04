// Immutable historical evidence is not rewritten. This correction is based on
// the exact Japanese maker product page and applies only to one proven bad transcription.
export const sourceIngredientErrataRc179=Object.freeze([Object.freeze({
 productId:'rc93-kao-kate-4973167017135',
 sourceAuditFile:'partial-ingredient-evidence-rc150.json',
 sourceUrl:'https://www.kao-kirei.com/ja/item/kbb/kate/4973167017135/',
 badOriginalName:'販売名：ケイトリアルアイズプロデューサーアイボリー成分：メチルトリメチコン',
 badNormalizedName:'販売名:ケイトリアルアイズプロデューサーアイボリー成分:メチルトリメチコン',
 confirmedJapaneseName:'メチルトリメチコン',
 verifiedOn:'2026-11-04',
 reason:'販売名と「成分」見出しがHTML整形時に先頭成分へ混入。日本公式では「成分：メチルトリメチコン、…」と記載。',
 disposition:'replace'
}),Object.freeze({
 productId:'rc100-etude-d9f0ed300cb0',
 sourceAuditFile:'partial-ingredient-evidence-rc155.json',
 sourceUrl:'https://etude.jp/etude_product/46124',
 badOriginalName:'＜クリエイター＞',
 badNormalizedName:'<クリエイター>',
 confirmedJapaneseName:null,
 verifiedOn:'2026-11-04',
 disposition:'remove-noningredient-label',
 reason:'メーカー公式の「全成分」欄では＜クリエイター＞は色・構成パート名の見出しであり、配合成分ではない。成分のタルクから参考抜粋を始める。'
})]);
export function applySourceIngredientErrataRc179(records){
 if(!Array.isArray(records))throw Error('Only validated partial records can be corrected');
 return records.map(record=>{
  const fix=sourceIngredientErrataRc179.find(x=>x.productId===record.productId);
  if(!fix)return record;
  if((record.auditFile&&record.auditFile!==fix.sourceAuditFile)||record.sourceUrl!==fix.sourceUrl||
     record.sourceOriginalJapaneseNames?.[0]!==fix.badOriginalName||
     record.sourceOriginalNames?.[0]!==fix.badOriginalName||
     !record.ingredients?.includes(fix.badNormalizedName))
   throw Error('Historical transcription changed; manual re-review required '+record.productId);
  const change=list=>list?.map(x=>x===fix.badNormalizedName||x===fix.badOriginalName?fix.confirmedJapaneseName:x)
   .filter(x=>x!==null);
  const ingredients=change(record.ingredients);
  return {
   ...record,ingredients,
   ingredientCount:ingredients.length,
   sourceOriginalJapaneseNames:change(record.sourceOriginalJapaneseNames),
   sourceOriginalNames:change(record.sourceOriginalNames),
   sourceOtherIngredientNames:change(record.sourceOtherIngredientNames),
   sourceErratumRc179:{verifiedOn:fix.verifiedOn,reason:fix.reason,
    originalTranscription:fix.badOriginalName,correctedName:fix.confirmedJapaneseName,
    disposition:fix.disposition,sourceUrl:fix.sourceUrl},
   note:record.note+'【rc179転記訂正】'+fix.reason
  };
 });
}
