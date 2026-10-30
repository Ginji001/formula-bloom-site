// 国内向けの外部サイト掲載情報を、利用者の明示確認で一時的に取り込む。
// 公式API・自動巡回・アクセス制限の回避は行わない。
import {isJapaneseIngredientsList} from './japan-market-policy.js';
import {splitIngredients} from './engine.js';

const specs=Object.freeze({
 'lipscosme.com':{id:'lips',label:'LIPS',type:'beauty',pattern:/^\/products\/\d{2,12}\/?$/},
 'cosme.net':{id:'cosme',label:'@cosme',type:'beauty',pattern:/^\/products\/\d{6,10}\/?$/},
 'amazon.co.jp':{id:'amazon',label:'Amazon.co.jp',type:'shop',pattern:/^\/(?:[^/]+\/)?dp\/[A-Z0-9]{10}(?:\/|$)/i},
 'item.rakuten.co.jp':{id:'rakuten',label:'楽天市場',type:'shop',pattern:/^\/[^/]{2,100}\/[^/]{2,160}\/?$/},
 'store.shopping.yahoo.co.jp':{id:'yahoo',label:'Yahoo!ショッピング',type:'shop',pattern:/^\/[^/]{2,100}\/[^/]{3,160}\.html$/},
 'qoo10.jp':{id:'qoo10',label:'Qoo10',type:'shop',pattern:/^\/gmkt\.inc\/(?:Goods\/Goods\.aspx|Mobile\/Goods\/Goods\.aspx)$/i}
});
export function sharedSource(url){
 let u;try{u=new URL(String(url||''));}catch{return null;}
 if(u.protocol!=='https:'||u.username||u.password||u.port)return null;
 let host=u.hostname.toLowerCase();
 if(host==='www.item.rakuten.co.jp')return null;
 if(host.startsWith('www.'))host=host.slice(4);
 const spec=specs[host];
 if(spec){
  if(!spec.pattern.test(u.pathname))return null;
  if(spec.id==='qoo10'&&!/^\d{6,16}$/.test(u.searchParams.get('goodscode')||''))return null;
  return {...spec,url:u.href,hostname:u.hostname};
 }
 // Accept any HTTPS source as a user-transcribed citation, not as proof.
 // Do not fetch external content or imply that a retailer matches the formula.
 if(String(url).length>2048||!u.hostname.includes('.')||
    ['amazon.com','www.amazon.com','amazon.co.uk','www.amazon.co.uk','ebay.com','www.ebay.com'].includes(u.hostname)||
    /^(?:localhost|\d+(?:\.\d+){3})$/i.test(host)||
    /\.(?:local|internal|test|example|invalid|localhost|onion)$/i.test(host))return null;
 // Known-platform lookalikes never inherit the platform's trust.
 if(Object.keys(specs).some(known=>host.includes(known+'.')))return null;
 return {id:'external',label:'外部サイト（'+u.hostname+'）',type:'external',url:u.href,hostname:u.hostname};
}
export function prepareSharedFormula({url,name,ingredients,kind='cosmetic',confirmed=false}={}){
 const site=sharedSource(url);
 if(!site)throw Error('成分表を確認したHTTPSの掲載元URLを入力してください。');
 if(!confirmed)throw Error('商品ページと日本語全成分を確認してください。');
 const title=String(name||'').trim(),input=String(ingredients||'').trim();
 if(title.length<3||title.length>180||/[<>]/.test(title))throw Error('商品名を3〜180文字で入力してください。');
 if(!['cosmetic','quasi'].includes(kind))throw Error('製品区分を確認してください。');
 if(input.length>20000||!isJapaneseIngredientsList(input))throw Error('国内向けの日本語全成分を入力してください。');
 const items=splitIngredients(input);
 if(items.length<5||items.length>300||items.some(x=>x.length>120||/主な成分|主要成分|成分例|配合しています|使用方法|おすすめ|効果/.test(x)))
  throw Error('広告文ではなく、全成分が揃っているか確認してください。');
 return {
  name:title,url:site.url,sourceType:'user-shared',siteName:site.label,retailer:site.id,region:'jp',
  japanMarketConfirmed:true,kind,ingredients:input,rows:[],label:'利用者が商品ページから転記',
  order:'入力順。販売者・メーカーの原文および現物表示は未確認',
  fetchedAt:'',origin:'shared'
 };
}


// Local-only candidate extraction from text *explicitly copied by the user*.
// No network requests or implicit saving. Every candidate still needs review.
export function extractIngredientCandidates(text){
 const raw=String(text||'');
 if(raw.length<20||raw.length>40000)return [];
 const lines=raw.replace(/\r/g,'').split('\n').map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean);
 const heading=/^(?:【|\[)?(?:全成分(?:表示|一覧)?|配合全成分|配合成分一覧)(?:】|\])?\s*[:：]?\s*(.*)$/;
 const stop=/^(?:使用方法|使い方|おすすめ|特徴|注意事項|ご使用|内容量|商品情報|販売価格|レビュー|クチコミ|関連記事|口コミ|配送|送料|香り|主な成分|主要成分|注目成分)/;
 const found=[];
 for(let i=0;i<lines.length;i++){
  const match=heading.exec(lines[i]);
  if(!match)continue;
  const parts=match[1]?[match[1]]:[];
  for(let j=i+1;j<Math.min(lines.length,i+9);j++){
   const line=lines[j];
   if(stop.test(line)||heading.test(line)||/[。！？]/.test(line)||/https?:\/\//.test(line))break;
   if(line.length>3000||!/[、,，]/.test(line))break;
   parts.push(line);
  }
  const candidate=parts.join('、').replace(/[、,，]\s*$/,'');
  const items=splitIngredients(candidate);
  if(items.length>=5&&items.length<=300&&items.every(x=>x.length<=120)&&
     isJapaneseIngredientsList(candidate)&&
     !/主な成分|主要成分|成分例|配合しています|使用方法|おすすめ|効果/.test(candidate)&&
     !found.includes(candidate))found.push(candidate);
 }
 return found;
}
