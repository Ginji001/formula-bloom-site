// 日本向け製品の同一性を、ページに実際にある識別子だけで比較する。
// 欠けたJAN・容量・処方改良日は推測しない。出典の取得日と改良日は別。
import {splitIngredients} from './engine.js';
const fold=value=>String(value||'').normalize('NFKC').toLowerCase().replace(/[\s\u3000\-‐‑–—_・「」『』【】()（）:：]+/g,'');
const word=value=>String(value||'').normalize('NFKC');
function janFromUrl(url){
 try{
  const u=new URL(url);
  if(!['www.kao-kirei.com','kao-kirei.com'].includes(u.hostname))return '';
  return u.pathname.match(/^\/ja\/item\/kbb\/[^/]+\/(\d{13})\/?$/)?.[1]||'';
 }catch{return '';}
}
export function productJAN(item={}){
 const provided=word(item.jan||item.janCode||item.gtin||'').replace(/\D/g,'');
 if(/^\d{13}$/.test(provided))return provided;
 const title=word(item.name||'')+' '+word(item.description||'');
 return title.match(/(?:JAN(?:コード)?|GTIN(?:-?13)?|バーコード)\s*[:：]?\s*(\d{13})(?!\d)/i)?.[1]||janFromUrl(item.url||'');
}
export function productCapacity(item={}){
 const raw=word(item.capacity||item.size||item.name||'');
 const matches=[...raw.matchAll(/(\d+(?:\.\d+)?)\s*(mL|ml|L|kg|g|枚|本|個|包)(?![a-zA-Z])/gi)]
  .map(m=>{let amount=Number(m[1]),unit=m[2].toLowerCase();if(unit==='l'){amount*=1000;unit='ml';}if(unit==='kg'){amount*=1000;unit='g';}return amount+unit;});
 const unique=[...new Set(matches)];
 return unique.length===1?unique[0]:'';
}
export function productVariant(text=''){
 const s=fold(text);
 if(/とてもしっとり/.test(s))return 'very-rich';
 if(/ややしっとり/.test(s))return 'slightly-rich';
 if(/さっぱり/.test(s))return 'light';
 if(/しっとり/.test(s))return 'rich';
 if(/モイスト|moist/.test(s))return 'moist';
 if(/通常版|ノーマルタイプ/.test(s))return 'normal';
 const n=s.match(/化粧水(iii|ii|i)(?![a-z])/i);
 return n?'lotion-'+n[1].toLowerCase():'';
}
function observedVariant(item={}){
 // 個別の成分表ラベルを最優先。単なる「全成分」なら商品名を見る。
 const label=productVariant(item.label||item.variant||'');
 return label||productVariant(item.name||'');
}
export function checkProductIdentity(expected,observed={}){
 const errors=[],reviews=[],checked=[],unknown=[];
 if(!expected?.name){
  return {status:'unverified',errors,reviews,checked,unknown:['商品名・容量・JANは未照合'],text:'商品名・容量・JANは未照合'};
 }
 const eName=String(expected.name),oName=String(observed.name||'');
 const eJan=productJAN(expected),oJan=productJAN(observed);
 if(eJan&&oJan){if(eJan!==oJan)errors.push('JANが異なります');else checked.push('JAN一致');}
 else unknown.push('JAN未確認');
 const eSize=productCapacity(expected),oSize=productCapacity(observed);
 if(eSize&&oSize){if(eSize!==oSize)errors.push('容量・数量が異なります');else checked.push('容量一致');}
 else unknown.push('容量未確認');
 const eVariant=productVariant(expected.variant||'')||productVariant(eName);
 const oVariant=observedVariant(observed);
 if(eVariant&&oVariant){
  if(eVariant!==oVariant)errors.push('種類・バリエーションが異なります');
  else checked.push('種類一致');
 }else if(eVariant)reviews.push('種類を確認してください');
 if(eName&&oName){
  const a=fold(eName),b=fold(oName);
  const brand=fold(expected.brand||'');
  const name=brand&&a.startsWith(brand)?a.slice(brand.length):a;
  if(a===b||name.length>=4&&b.includes(name)||b.length>=4&&name.includes(b))checked.push('商品名一致');
  else reviews.push('商品名を確認してください');
 }else reviews.push('掲載商品名が不明です');
 if(expected.ingredientsExpected&&observed.ingredients){
  const count=splitIngredients(observed.ingredients).length;
  if(count!==expected.ingredientsExpected)reviews.push('登録時'+expected.ingredientsExpected+'成分／掲載'+count+'成分');
  else checked.push('成分数一致');
 }
 if(!observed.formulaUpdatedAt)unknown.push('処方の改良日未確認');
 const status=errors.length?'blocked':reviews.length?'review':'matched';
 return {status,errors,reviews,checked,unknown,text:[...errors,...reviews,...checked,...unknown].join('／')};
}
