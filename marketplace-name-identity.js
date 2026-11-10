// Source name collisions are candidates for manual SKU review, not evidence of identical formulas.
export const foldedSourceProductName = value => String(value||'').normalize('NFKC')
 .toLocaleLowerCase('und').replace(/[\s\u3000・]/g,'');
export const listingNameKey = row => [row.source,foldedSourceProductName(row.brandName),
 foldedSourceProductName(row.name)].join('|');
export function listingNameCollisionCounts(rows){
 const result=new Map();
 for(const row of rows){
  const key=listingNameKey(row);
  result.set(key,(result.get(key)||0)+1);
 }
 return result;
}
export function sourceListingId(row){
 try{
  const url=new URL(row.productPageUrl);
  const tail=url.pathname.match(/(?:\/g\/|\/products\/|\/lipscosme\/)(\d+)(?:\/|$)/)
   ||url.pathname.match(/\/(\d+)\/?$/);
  return tail?.[1]||null;
 }catch{return null;}
}
