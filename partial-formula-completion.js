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


// Rank only the user's copied candidates against the existing product's
// source-backed Japanese names. This is not an identity or full-list proof.
export function rankCopiedCandidates(record,candidates,sourceUrl,kind){
 if(!Array.isArray(candidates))return [];
 return candidates.map((candidate,index)=>{
  const check=comparePartialCompletion(record,{
   sourceUrl,kind,ingredients:candidate.text
  });
  const expectedActive=(record.sourceActiveIngredientNames||[]).map(ingredientMatchKey);
  const actualActive=(candidate.group?.active||[]).map(ingredientMatchKey);
  const medicinalReady=record.kind!=='quasi'||Boolean(candidate.group&&
   expectedActive.every(name=>actualActive.includes(name)));
  return Object.freeze({...candidate,index,check,medicinalReady,
   eligibleForPrefill:check.verifiedSubset&&medicinalReady});
 }).sort((a,b)=>
  Number(b.eligibleForPrefill)-Number(a.eligibleForPrefill)||
  b.check.matchedCount-a.check.matchedCount||
  a.check.missing.length-b.check.missing.length||a.index-b.index);
}
