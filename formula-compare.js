// 2製品の成分名・分類数を並べるだけ。濃度や効能、優劣は判定しない。
import {splitIngredients,analyze,groups} from './engine.js';
import {recommendFlower,flowerTypes} from './flower-types.js';

export const HISTORY_KEY='formula-bloom:formula-history:v1';
const normalize=name=>String(name||'').normalize('NFKC').toLowerCase().replace(/[\s\u3000‐‑–—−ー－]/g,'');
const compact=value=>String(value||'').trim();
export function makeSnapshot({name,ingredients,kind='cosmetic',source='利用者入力'}={}){
 const product=compact(name||'利用者入力の処方'),body=compact(ingredients);
 if(product.length>180||!body||body.length>20000||!['cosmetic','quasi'].includes(kind))throw Error('比較する商品情報を確認してください。');
 const names=splitIngredients(body);
 if(names.length>300)throw Error('成分数が多すぎます。');
 const items=analyze(body),choice=recommendFlower(items);
 return {version:1,name:product,ingredients:body,kind,source:compact(source).slice(0,450),
  flowerId:choice.id,flowerName:flowerTypes.find(x=>x.id===choice.id)?.name||'野の花',
  counts:Object.fromEntries(groups.map(([key])=>[key,items.filter(x=>x.group===key).length])),
  ingredientCount:names.length};
}
const count=list=>{const result=new Map();for(const x of list){const id=normalize(x);result.set(id,(result.get(id)||0)+1);}return result;};
export function compareSnapshots(a,b){
 if(!a||!b)throw Error('比較するA・Bの2製品を選んでください。');
 const alpha=splitIngredients(a.ingredients),beta=splitIngredients(b.ingredients);
 const ca=count(alpha),cb=count(beta);
 const same=[],onlyA=[],onlyB=[];
 for(const name of alpha){const k=normalize(name),n=cb.get(k)||0;if(n>0){same.push(name);cb.set(k,n-1);}else onlyA.push(name);}
 const remainder=count(alpha);
 for(const name of beta){const k=normalize(name),n=remainder.get(k)||0;if(n>0)remainder.set(k,n-1);else onlyB.push(name);}
 // 両方に同じ成分名を含む場合も掲載回数に応じて重複数を保持。
 const orderChanged=onlyA.length===0&&onlyB.length===0&&alpha.map(normalize).join('|')!==beta.map(normalize).join('|');
 return {a,b,same,onlyA,onlyB,orderChanged,
  message:'成分名と一般的な役割の比較です。濃度・効果・肌への適合性・優劣は比較できません。'};
}
export function readHistory(storage){
 if(!storage)return [];
 try{
  const data=JSON.parse(storage.getItem(HISTORY_KEY)||'[]');
  if(!Array.isArray(data))return [];
  return data.filter(item=>item&&typeof item.id==='string'&&typeof item.savedAt==='string'&&item.formula&&
   item.formula.version===1&&typeof item.formula.ingredients==='string'&&item.formula.ingredients.length<=20000).slice(0,20);
 }catch{return [];}
}
export function addHistory(storage,snapshot,{id,savedAt}={}){
 if(!storage||!snapshot||!id||!savedAt)throw Error('保存できませんでした。');
 const entry={id,savedAt,formula:snapshot};
 const entries=[entry,...readHistory(storage)].slice(0,20);
 try{storage.setItem(HISTORY_KEY,JSON.stringify(entries));}catch{throw Error('端末の保存領域を利用できません。');}
 return entries;
}
export function clearHistory(storage){
 if(!storage)return false;
 try{storage.removeItem(HISTORY_KEY);return true;}catch{return false;}
}
