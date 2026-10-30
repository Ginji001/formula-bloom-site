import {splitIngredients} from './engine.js';
import {isJapaneseIngredientsList} from './japan-market-policy.js';

export const MY_FORMULAS_KEY='formula-bloom:my-formulas:v1';
const fold=x=>String(x||'').normalize('NFKC').toLowerCase().replace(/[\s\u3000‐‑–—－_・「」『』()（）]/g,'');
export function validateMyFormula({name,brand='',ingredients,kind='cosmetic',sourceUrl='',confirmed=false}={}){
 if(!confirmed)throw Error('製品と国内向け日本語全成分を確認してください。');
 const title=String(name||'').trim(),label=String(brand||'').trim();
 const body=String(ingredients||'').trim();
 if(title.length<3||title.length>160||label.length>100)throw Error('商品名は3〜160文字、ブランド名は100文字以内で入力してください。');
 if(body.length>20000||!isJapaneseIngredientsList(body))throw Error('日本語の全成分を入力してください。');
 const rows=splitIngredients(body);
 if(rows.length<5||rows.length>300)throw Error('全成分の網羅性を確認してください（5〜300成分）。');
 if(!['cosmetic','quasi'].includes(kind))throw Error('商品区分を確認してください。');
 let url='';
 if(sourceUrl){
  try{const parsed=new URL(String(sourceUrl).trim());if(parsed.protocol!=='https:'||parsed.username||parsed.password||parsed.port)throw Error();url=parsed.href;}
  catch{throw Error('掲載元URLはhttpsの商品ページを入力してください。');}
 }
 return {version:1,name:title,brand:label,ingredients:body,kind,sourceUrl:url};
}
export function readMyFormulas(storage){
 try{
  if(!storage)return [];
  const raw=JSON.parse(storage.getItem(MY_FORMULAS_KEY)||'[]');
  if(!Array.isArray(raw))return [];
  return raw.filter(x=>x&&x.version===1&&typeof x.id==='string'&&typeof x.savedAt==='string'&&typeof x.name==='string'&&typeof x.ingredients==='string'&&x.ingredients.length<=20000&&['cosmetic','quasi'].includes(x.kind)).slice(0,50);
 }catch{return [];}
}
export function saveMyFormula(storage,input,{id,savedAt}={}){
 if(!storage)throw Error('このブラウザでは端末保存を利用できません。');
 if(!id||!savedAt)throw Error('保存情報を確認できません。');
 const formula=validateMyFormula(input);
 const existing=readMyFormulas(storage);
 const repeated=existing.find(x=>fold(x.name)===fold(formula.name)&&fold(x.brand)===fold(formula.brand)&&x.ingredients===formula.ingredients&&x.kind===formula.kind);
 if(repeated)return {items:existing,saved:false,id:repeated.id};
 const items=[{...formula,id,savedAt},...existing].slice(0,50);
 try{storage.setItem(MY_FORMULAS_KEY,JSON.stringify(items));}catch{throw Error('端末の保存領域に書き込めませんでした。');}
 return {items,saved:true,id};
}
export function deleteMyFormula(storage,id){
 if(!storage)return false;
 const list=readMyFormulas(storage),updated=list.filter(x=>x.id!==id);
 if(list.length===updated.length)return false;
 try{if(!updated.length)storage.removeItem(MY_FORMULAS_KEY);else storage.setItem(MY_FORMULAS_KEY,JSON.stringify(updated));return true;}
 catch{return false;}
}
export function searchMyFormulas(storage,query){
 const q=fold(query);if(q.length<2)return [];
 return readMyFormulas(storage).filter(x=>
  fold(x.name).includes(q)||fold(x.brand+' '+x.name).includes(q)||fold(x.brand)===q
 ).slice(0,30);
}
export function exactMyFormula(storage,query){
 const q=fold(query),matches=readMyFormulas(storage).filter(x=>fold(x.name)===q||fold(x.brand+' '+x.name)===q);
 return matches.length===1?matches[0]:null;
}
