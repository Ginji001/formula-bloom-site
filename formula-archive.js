// 国内向けに掲載された日本語全成分の出典・版・製品照合。
// 公開日・取得日は処方の改良日ではない。自動更新・推測・利用者データの保存はしない。
import {splitIngredients} from './engine.js';
import {isJapaneseIngredientsList} from './japan-market-policy.js';

const key=s=>String(s||'').normalize('NFKC').replace(/\s+/g,'').toLowerCase();
const tokens=source=>splitIngredients(source||'').map(key).filter(Boolean);
const safeDate=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}T/.test(d)&&!Number.isNaN(Date.parse(d));

export function recordForProduct(catalog,product){
 if(!product?.id||!catalog||!Array.isArray(catalog.records))return null;
 return catalog.records.find(r=>r.productId===product.id)||null;
}
export function validateFormulaRecords(catalog){
 if(!catalog||catalog.schemaVersion!==1||!Array.isArray(catalog.records))throw Error('保存成分データの形式が不正です。');
 const ids=new Set();
 for(const r of catalog.records){
  if(!r.productId||ids.has(r.productId))throw Error('保存成分に重複や商品IDの欠落があります。');
  ids.add(r.productId);
  if(!['official','shop','beauty'].includes(r.sourceType)||r.region!=='jp'||!/^https:\/\//.test(r.sourceUrl||''))
   throw Error('国内向けの出典を確認できません。');
  // A publicly offered product does not prove that any web listing matches its label.
  // Non-manufacturer sources are eligible after explicit item/ingredients verification.
  if(r.sourceType!=='official'&&(
   r.sourceReview?.jpMarketConfirmed!==true||
   r.sourceReview?.productNameMatched!==true||
   r.sourceReview?.fullIngredientsChecked!==true||
   !r.sourceTitle))
   throw Error('販売店・美容サイトの成分表は国内版・商品同一性・全成分を確認してください。');
  if(r.formulaStatus!==undefined&&!['listed','historical-reference'].includes(r.formulaStatus))
   throw Error('旧処方の位置づけが不正です。');
  if(!safeDate(r.verifiedAt)||r.formulaUpdatedAt!==null)throw Error('保存確認日時と改良日の扱いが不正です。');
  if(!isJapaneseIngredientsList(r.ingredients)||tokens(r.ingredients).length!==r.ingredientCount)throw Error('保存成分の日本語表示または数が不正です。');
  if(r.kind==='quasi'&&(r.activeIngredients||r.otherIngredients)){
   if(!r.activeIngredients||!r.otherIngredients||
      !isJapaneseIngredientsList(r.activeIngredients)||!isJapaneseIngredientsList(r.otherIngredients)||
      tokens(r.activeIngredients).length+tokens(r.otherIngredients).length!==r.ingredientCount||
      [...tokens(r.activeIngredients),...tokens(r.otherIngredients)].join('|')!==tokens(r.ingredients).join('|'))
     throw Error('医薬部外品の有効成分・その他の成分の区分が不正です。');
   if(!String(r.order).includes('配合順'))throw Error('医薬部外品の表示区分と配合順の注意が不足しています。');
  }

  if(!Array.isArray(r.history))throw Error('処方変更履歴の形式が不正です。');
 }
 return catalog;
}
export function compareFormulaRecord(record,current){
 if(!record)return {status:'not-saved',text:'保存版なし',added:[],removed:[],reordered:false};
 if(!current?.ingredients)return {status:'unavailable',text:'現在の全成分を確認できません',added:[],removed:[],reordered:false};
 const old=tokens(record.ingredients),now=tokens(current.ingredients);
 const count=list=>{const result=new Map();for(const x of list)result.set(x,(result.get(x)||0)+1);return result;};
 const a=count(old),b=count(now),added=[],removed=[];
 for(const [v,n] of b){for(let i=0;i<n-(a.get(v)||0);i++)added.push(v);}
 for(const [v,n] of a){for(let i=0;i<n-(b.get(v)||0);i++)removed.push(v);}
 const reordered=added.length===0&&removed.length===0&&old.join('|')!==now.join('|');
 const changed=added.length>0||removed.length>0||reordered;
 return {
  status:changed?'changed':'same',
  oldCount:old.length,newCount:now.length,added,removed,reordered,
  text:changed?'保存版と掲載成分が異なります（'+old.length+'→'+now.length+'成分）'+(reordered?'／成分順の変更あり':''):'保存版と掲載成分が一致（'+old.length+'成分）'
 };
}
