// Explicitly distinct source-listed ingredient sequences are not proof of a
// manufacturing revision date, actual package identity, or regulatory status.
const norm=s=>String(s||'').normalize('NFKC').toLocaleLowerCase('und').replace(/\s+/g,'').trim();
export function compareListedFormulaVersions(variants){
 if(!Array.isArray(variants)||variants.length<2)return null;
 const [first,second]=variants;
 if(!Array.isArray(first.ingredients)||!Array.isArray(second.ingredients))return null;
 const a=new Set(first.ingredients.map(norm)),b=new Set(second.ingredients.map(norm));
 return {
  firstLabel:first.formulaLabel||'掲載1',
  secondLabel:second.formulaLabel||'掲載2',
  firstCount:first.ingredients.length,secondCount:second.ingredients.length,
  onlyFirst:first.ingredients.filter(n=>!b.has(norm(n))),
  onlySecond:second.ingredients.filter(n=>!a.has(norm(n))),
  sameListInSameOrder:JSON.stringify(first.ingredients.map(norm))===JSON.stringify(second.ingredients.map(norm)),
  identityAndDateUnverified:true
 };
}
export function listingVersionIsHistorical(variant){
 return /旧品|旧処方|旧版/.test(String(variant?.formulaLabel||''));
}
