// 端末の任意保存データ。旧履歴キー・形式は維持し、既存データを消さない。
import {splitIngredients,analyze,groups} from './engine.js';
import {recommendFlower,flowerTypes} from './flower-types.js';
export const HISTORY_KEY='formula-bloom:formula-history:v1';
const normalize=name=>String(name||'').normalize('NFKC').toLowerCase().replace(/[\s\u3000‐‑–—−ー－]/g,'');
const compact=value=>String(value||'').trim();
export function makeSnapshot({name,ingredients,kind='cosmetic',source='利用者入力'}={}){
 const product=compact(name||'利用者入力の処方'),body=compact(ingredients);
 if(product.length>180||!body||body.length>20000||!['cosmetic','quasi'].includes(kind))throw Error('保存する商品情報を確認してください。');
 const names=splitIngredients(body);
 if(names.length>300)throw Error('成分数が多すぎます。');
 const items=analyze(body),choice=recommendFlower(items);
 return {version:1,name:product,ingredients:body,kind,source:compact(source).slice(0,450),
  flowerId:choice.id,flowerName:flowerTypes.find(x=>x.id===choice.id)?.name||'野の花',
  counts:Object.fromEntries(groups.map(([key])=>[key,items.filter(x=>x.group===key).length])),
  ingredientCount:names.length};
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
