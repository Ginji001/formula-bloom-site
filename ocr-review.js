// OCR文字列は原文を保持し、利用者が押した1件だけ修正する。
// 国内向けの実際に取得できた日本語全成分を参照候補とし、正式名称の保証はしない。
import {splitIngredients} from './engine.js';

const folded=value=>String(value||'').normalize('NFKC').toLowerCase()
 .replace(/[\u0020\u3000\t\r\n]+/g,'').replace(/[‐‑‒–—―−ー－]/g,'-').replace(/／/g,'/');
const clean=value=>String(value||'').trim();
const jp=/[ぁ-んァ-ヶ一-龥々]/;
function segments(text){
 const input=String(text||'');
 let depth=0,start=0,parts=[];
 const push=end=>{
  const part=input.slice(start,end);
  const a=part.match(/^\s*/)?.[0].length||0,b=part.match(/\s*$/)?.[0].length||0;
  if(end-start-a-b>0)parts.push({start:start+a,end:end-b,value:input.slice(start+a,end-b)});
  start=end+1;
 };
 for(let i=0;i<input.length;i++){
  const c=input[i];
  if('(['.includes(c))depth++;
  else if(')]'.includes(c))depth=Math.max(0,depth-1);
  const numericComma=(c===','||c==='，')&&/[\d０-９]/.test(input[i-1]||'')&&/[\d０-９]/.test(input[i+1]||'');
  if(!depth&&!numericComma&&'、,，\n;；'.includes(c))push(i);
 }
 const remaining=input.slice(start),a=remaining.match(/^\s*/)?.[0].length||0,b=remaining.match(/\s*$/)?.[0].length||0;
 if(remaining.length>a+b)parts.push({start:start+a,end:input.length-b,value:input.slice(start+a,input.length-b)});
 return parts;
}
function withinOneEdit(a,b){
 const x=[...a],y=[...b];
 if(Math.abs(x.length-y.length)>1)return false;
 let i=0,j=0,changes=0;
 while(i<x.length&&j<y.length){
  if(x[i]===y[j]){i++;j++;continue;}
  if(++changes>1)return false;
  if(x.length>y.length)i++;
  else if(y.length>x.length)j++;
  else{i++;j++;}
 }
 return changes+Number(i<x.length||j<y.length)===1;
}
export function createOCRLexicon(records){
 const out=new Map();
 for(const record of records||[]){
  if(record.sourceType!=='official'||record.region!=='jp')continue;
  for(const name of splitIngredients(record.ingredients||'')){
   const label=clean(name),id=folded(label);
   if(label.length>=2&&jp.test(label)&&id&&!out.has(id))out.set(id,label);
  }
 }
 return [...out.values()];
}
export function findOCRCorrections(source,lexicon,{limit=12}={}){
 if(typeof source!=='string'||!Array.isArray(lexicon)||source.length>20000)return [];
 const dictionary=new Map();
 for(const name of lexicon){
  const label=clean(name),id=folded(label);
  if(id&&jp.test(label)&&!dictionary.has(id))dictionary.set(id,label);
 }
 const tokens=segments(source),issues=[];
 function suggest(part,joined=false){
  const original=part.value,key=folded(original);
  if(!jp.test(original)||key.length<3)return null;
  let candidates=[],reason='';
  if(original.replace(/\s/g,'')!==original&&dictionary.has(key)){
   candidates=[dictionary.get(key)];reason=joined?'改行の分割候補':'空白の混入候補';
  }else if(!dictionary.has(key)&&!joined&&[...key].length>=5&&[...key].length<=35){
   for(const [id,label] of dictionary){
    if(Math.abs([...id].length-[...key].length)>1||!withinOneEdit(key,id))continue;
    // 接尾辞の識別子（NP/AP、Na/K、番号など）の取り違えは補完しない。
    const a=key.match(/(?:[a-z]{1,3}|\d{1,3})$/)?.[0],b=id.match(/(?:[a-z]{1,3}|\d{1,3})$/)?.[0];
    if(a&&b&&a!==b)continue;
    candidates.push(label);
    if(candidates.length>=3)break;
   }
   if(candidates.length)reason='読み違いの可能性';
  }
  if(!candidates.length)return null;
  return {start:part.start,end:part.end,original,candidates,reason};
 }
 for(let i=0;i<tokens.length&&issues.length<Math.max(0,limit);i++){
  const t=tokens[i];
  // 改行をまたぐ完全一致は1文字の曖昧な誤読候補より先に示す。
  if(i+1<tokens.length&&!dictionary.has(folded(t.value))&&!dictionary.has(folded(tokens[i+1].value))){
   const next=tokens[i+1],separator=source.slice(t.end,next.start);
   if(/^\s*\n\s*$/.test(separator)){
    const pair={start:t.start,end:next.end,value:source.slice(t.start,next.end)};
    const combined=dictionary.get(folded(pair.value));
    if(combined){
     issues.push({...pair,original:pair.value,candidates:[combined],reason:'改行の分割候補'});
     i++;
     continue;
    }
   }
  }
  const single=suggest(t);
  if(single)issues.push(single);
 }
 return issues;
}
export function applyOCRCorrection(source,issue,choice){
 if(typeof source!=='string'||!issue||!Number.isInteger(issue.start)||!Number.isInteger(issue.end)||
  issue.start<0||issue.end>source.length||issue.start>=issue.end||
  source.slice(issue.start,issue.end)!==issue.original||
  !issue.candidates?.includes(choice))throw Error('候補が更新されたため、もう一度確認してください。');
 return source.slice(0,issue.start)+choice+source.slice(issue.end);
}
