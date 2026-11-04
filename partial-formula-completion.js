// 1,240 product source-backed partial records can be completed by the user
// against the exact Japan-market product. This module never fetches, stores or
// promotes manufacturer content and never guesses ingredient roles.
import {splitIngredients} from './engine.js';
import {isJapaneseIngredientsList} from './japan-market-policy.js';

export function ingredientMatchKey(value){
 return String(value||'').normalize('NFKC')
   .replace(/[＊*]+$/u,'')
   .replace(/[−－‐‑‒–—]/g,'-')
   .replace(/\s+/g,'')
   .toLowerCase();
}

export function sameProductSourceUrl(expected,actual){
 try{
  const a=new URL(expected),b=new URL(actual);
  if(a.protocol!=='https:'||b.protocol!=='https:'||a.username||b.username||
     a.password||b.password||a.port||b.port)return false;
  const path=u=>u.pathname.replace(/\/+$/,'')||'/';
  return a.hostname===b.hostname&&path(a)===path(b)&&a.search===b.search;
 }catch{return false;}
}

export function comparePartialCompletion(record,{sourceUrl='',ingredients='',kind=''}={}){
 if(!record?.productId||!Array.isArray(record.ingredients)||!record.ingredients.length)
  throw Error('登録済みの出典付き一部成分を確認できません。');
 const text=String(ingredients||'').trim();
 const names=splitIngredients(text);
 const present=new Set(names.map(ingredientMatchKey));
 const reference=[...new Set(record.ingredients.map(ingredientMatchKey))];
 const missing=record.ingredients.filter(name=>!present.has(ingredientMatchKey(name)));
 const sourceMatches=sameProductSourceUrl(record.sourceUrl,sourceUrl);
 const kindMatches=['cosmetic','quasi'].includes(kind)&&
  (!['cosmetic','quasi'].includes(record.kind)||record.kind===kind);
 const listFormatted=names.length>=5&&names.length<=300&&isJapaneseIngredientsList(text);
 const verifiedSubset=sourceMatches&&kindMatches&&listFormatted&&missing.length===0;
 return Object.freeze({
  productId:record.productId,
  sourceMatches,kindMatches,listFormatted,
  enteredCount:names.length,referenceCount:reference.length,
  matchedCount:reference.length-missing.length,
  missing:Object.freeze(missing),
  verifiedSubset,
  // Matching the known excerpt does not prove the pasted list is complete.
  verifiedFullFormula:false,
  requiresUserIdentityConfirmation:true,
  requiresUserFullListConfirmation:true,
  requiresPhysicalLabelCheck:true,
  requiresLatestLotCheck:true,
  sourceUrl:record.sourceUrl
 });
}
