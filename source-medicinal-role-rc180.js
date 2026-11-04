// Source-specific corrections to partial medicinal roles. Historical rc151 evidence stays untouched.
// These are only the 12 already archived names for each exact Japanese product page.
export const verifiedMedicinalRoleRc180=Object.freeze([
 Object.freeze({
  productId:'rc94-jp-official-transino-180',
  sourceUrl:'https://www.daiichisankyo-hc.co.jp/products/details/transino_uv_concealer/',
  originalAuditFile:'partial-ingredient-evidence-rc151.json',
  activeOriginalNames:Object.freeze(['トラネキサム酸']),
  checkedOn:'2026-11-04',
  originalSection:'＜有効成分＞トラネキサム酸／＜その他の成分＞トレハロース、…',
  evidence:'第一三共ヘルスケア日本公式の商品個別ページ「成分・分量」欄'
 }),
 Object.freeze({
  productId:'rc94-jp-official-transino-181',
  sourceUrl:'https://www.daiichisankyo-hc.co.jp/products/details/transino_uv_powder-ex/',
  originalAuditFile:'partial-ingredient-evidence-rc151.json',
  activeOriginalNames:Object.freeze(['グリチルレチン酸ステアリル']),
  checkedOn:'2026-11-04',
  originalSection:'＜有効成分＞グリチルレチン酸ステアリル／＜その他の成分＞トレハロース、…',
  evidence:'第一三共ヘルスケア日本公式の商品個別ページ「成分・分量」欄'
 })
]);
export function applyVerifiedMedicinalRoleRc180(records){
 if(!Array.isArray(records))throw Error('Expected validated partial reference array');
 return records.map(r=>{
  const fix=verifiedMedicinalRoleRc180.find(x=>x.productId===r.productId);
  if(!fix)return r;
  if(r.sourceUrl!==fix.sourceUrl||(r.auditFile&&r.auditFile!==fix.originalAuditFile)||
    r.kind!=='quasi'||r.sourceActiveIngredientNames?.length!==0||
    r.sourceOtherIngredientNames?.length!==r.sourceOriginalJapaneseNames?.length||
    r.sourceOriginalJapaneseNames?.length!==12||
    r.sourceOriginalJapaneseNames?.[0]!==fix.activeOriginalNames[0]||
    !r.ingredients.includes(fix.activeOriginalNames[0]))
   throw Error('Medicinal source drift requires manual re-review: '+r.productId);
  const others=r.sourceOriginalJapaneseNames.filter(x=>!fix.activeOriginalNames.includes(x));
  if(others.length!==11||others.some(x=>!r.sourceOtherIngredientNames.includes(x)))
   throw Error('Medicinal source role partition mismatch: '+r.productId);
  return{
   ...r,
   sourceActiveIngredientNames:[...fix.activeOriginalNames],
   sourceOtherIngredientNames:others,
   sourceMedicinalRoleRc180:{
    checkedOn:fix.checkedOn,sourceUrl:fix.sourceUrl,originalSection:fix.originalSection,
    evidence:fix.evidence,physicalLabelChecked:false,currentLotChecked:false,
    fullFormulaRepublishingPermissionChecked:false
   },
   note:r.note+'【rc180薬用区分の個別再確認】公式の有効成分・その他成分の見出しに従い、既存12名称を区分。全成分への昇格なし。'
  };
 });
}
