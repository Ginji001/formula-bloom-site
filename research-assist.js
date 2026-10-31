// Product/ingredient discovery hints only. No HTTP requests, scraping, invented products or licenses.
const clip=(v,max=100)=>String(v||'').normalize('NFKC').trim().slice(0,max);
export function domesticResearchQuery(brand,productName=''){
 const name=clip(brand,80),item=clip(productName,100);
 if(!name)return '';
 return [name,item,'日本 国内向け 全成分 商品情報'].filter(Boolean).join(' ');
}
export function domesticResearchLink(brand,productName=''){
 const query=domesticResearchQuery(brand,productName);
 return query?{
  label:productName?'国内向けの日本語全成分を探す（外部検索）':'国内向け商品・全成分を探す（外部検索）',
  url:'https://www.google.com/search?q='+encodeURIComponent(query),
  evidenceStatus:'unverified-search-suggestion',
  requiresUserAction:true
 }:null;
}
// Status is inferred from our own archive and catalog, not inferred physical SKU information.
export function makeDomesticResearchQueue(brands,products,records,generatedAt){
 if(!Array.isArray(brands)||!Array.isArray(products)||!Array.isArray(records))throw Error('調査台帳の元データが不正です。');
 const counts=new Map(),formulas=new Map();
 for(const p of products){counts.set(p.brand,(counts.get(p.brand)||0)+1);}
 for(const r of records){formulas.set(r.brand,(formulas.get(r.brand)||0)+1);}
 const entries=brands.map(b=>{
  const productNameCount=counts.get(b.name)||0,formulaCount=formulas.get(b.name)||0;
  const stage=formulaCount?'has-archived-formulas':productNameCount?'product-names-only':'brand-only';
  const suggestion=domesticResearchLink(b.name);
  return {
   brand:b.name,country:b.country,stage,productNameCount,archivedFormulaCount:formulaCount,
   referenceStatus:formulaCount?'source-linked-archived-formula':'reference-only-unverified',
   referenceUsableFor:'ブランド検索・商品候補調査・日本語成分の手入力案内',
   referenceIsCompleteFormula:formulaCount>0,
   nextCheck:stage==='brand-only'?'日本国内向けの個別製品名・タイプ・容量・掲載元を確認':
    stage==='product-names-only'?'登録済み個別製品と日本語全成分・利用許諾・現物表示を照合':
    '残りの色・容量・SKUと最新処方・現物・利用許諾を照合',
   suggestedExternalSearch:suggestion.url,
   suggestionStatus:suggestion.evidenceStatus,
   claimAllProductsCovered:false,sourcePermissionVerified:false,physicalLabelVerified:false
  };
 });
 if(entries.some(e=>e.archivedFormulaCount>e.productNameCount)||new Set(entries.map(e=>e.brand)).size!==entries.length)throw Error('ブランド・成分台帳に矛盾があります。');
 return {schemaVersion:1,generatedAt,brandCount:brands.length,productNameRecords:products.length,archivedFormulaRecords:records.length,
  brandOnlyCount:entries.filter(e=>e.stage==='brand-only').length,
  nameOnlyBrandCount:entries.filter(e=>e.stage==='product-names-only').length,
  archivedFormulaBrandCount:entries.filter(e=>e.stage==='has-archived-formulas').length,
  allSKUsVerified:false,formulaRedistributionLicensesVerified:false,
  referenceOnlyBrands:entries.filter(e=>e.referenceStatus==='reference-only-unverified').length,
  referenceHandling:'未収録ブランドも参考調査対象として扱う。成分未確認のブランドから成分表・花・効能・濃度を生成しない。',
  notice:'この台帳の優先作業と検索先は推定の調査補助です。製品の存在・日本国内販売・全成分・再配布許諾の確認済み証拠ではありません。外部サイトには利用者がリンクを開いた場合だけ移動します。',
  brands:entries};
}
