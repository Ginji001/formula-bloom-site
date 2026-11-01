// Educational analogical ingredient candidates, not predictions of target INCI.
// Only exact Japanese displayed names from source-checked Japanese products.
// Independent brand counts are *not* statistical confidence or ingredient probabilities.
import {analyze,normalize,splitIngredients} from './engine.js';
import {inferStructure} from './inference-flower.js';
const makeNames=x=>Array.isArray(x.ingredients)?x.ingredients:splitIngredients(String(x.ingredients||''));
const archetype=r=>inferStructure({product:{id:r.productId,brand:r.brand,name:r.productName}})?.archetypeId||null;
const getMakeupSubtype=name=>{
 const n=String(name||'');
 return /(?:リップ|ティント|ルージュ|グロス)/i.test(n)?'lip':/(?:アイ|シャドウ|パレット|マスカラ)/i.test(n)?'eye':/(?:クッション|ファンデ|コンシーラー|ベース|パウダー)/i.test(n)?'base':/チーク/i.test(n)?'cheek':null;
};
const comparable=(archetypeId,targetName,sourceName)=>{
 if(archetypeId!=='makeup')return true;
 const t=getMakeupSubtype(targetName),s=getMakeupSubtype(sourceName);
 // For unknown makeup subtype do not mix lip tint and foundation evidence.
 return t!==null&&s!==null&&t===s;
};
export function inferIngredientEvidence({hypothesis,product=null,archiveRecords=[],partialRecords=[],limit=8}={}){
 if(!hypothesis?.hypothesis||!hypothesis.archetypeId)throw Error('剤型仮説が必要です');
 if(product?.id&&hypothesis.productId!==product.id)throw Error('比較対象の製品IDが一致しません');
 if(!Array.isArray(archiveRecords)||!Array.isArray(partialRecords))throw Error('出典資料の形式が不正です');
 const result={kind:'analogue-comparison-v1',targetProductId:product?.id||null,archetypeId:hypothesis.archetypeId,
  ingredientConfirmedForTarget:false,orderConfirmed:false,concentrationKnown:false,effectVerified:false,canExport:false,canSave:false,
  confirmedInExactProduct:[],analogues:[],sourceProductCount:0,sourceBrandCount:0,unknownExplanation:'推定候補以外も含め、対象商品の実際の配合成分と配合順は未確認です。候補が載っていないことは不配合の証明ではありません。',
  warning:'別商品に掲載された成分の共通性は、対象商品の配合を証明しません。選定資料は代表性のある無作為標本ではなく、製品単位の配合確率や濃度・効能を表しません。'};
 const exactArchive=product?archiveRecords.find(r=>r.productId===product.id):null;
 const exactPartial=product?partialRecords.find(r=>r.productId===product.id):null;
 if(exactArchive&&exactArchive.region==='jp'){
  for(const name of makeNames(exactArchive))result.confirmedInExactProduct.push({name,market:'jp',evidenceKind:'published-full',sourceUrl:exactArchive.sourceUrl,checkedOn:exactArchive.verifiedAt,sourceType:exactArchive.sourceType,labelCompared:false});
 }else if(exactPartial){
  for(const name of makeNames(exactPartial))result.confirmedInExactProduct.push({name,market:'jp',evidenceKind:exactPartial.sourceType==='japanese-domestic-launch-announcement'?'historical-series-common':'published-excerpt',sourceUrl:exactPartial.sourceUrl,checkedOn:exactPartial.checkedOn,sourceType:exactPartial.sourceType,labelCompared:false});
 }
 // Distinct source classes and product identities; never mix overseas INCI with Japanese ingredients.
 const sources=[
 ...archiveRecords.filter(r=>r.kind==='cosmetic'&&r.region==='jp'&&r.sourceType==='official'&&r.formulaStatus!=='historical-reference').map(r=>({...r,sourceKind:'メーカー掲載の日本語全成分',checkedOn:r.verifiedAt})),
 ...partialRecords.filter(r=>r.kind==='cosmetic'&&r.coverage==='partial-only'&&r.labelCompared===false&&r.sourceType!=='japanese-domestic-launch-announcement').map(r=>({...r,sourceKind:r.sourceType==='japanese-manufacturer-website'?'メーカー掲載の日本語部分成分':'国内販売店掲載の日本語部分成分'}))
 ].filter(r=>r.productId!==product?.id&&archetype(r)===hypothesis.archetypeId&&comparable(hypothesis.archetypeId,product?.name||'',r.productName));
 result.sourceProductCount=sources.length;
 result.sourceBrandCount=new Set(sources.map(s=>s.brand)).size;
 result.ingredientConfirmedForTarget=result.confirmedInExactProduct.length>0;
 if(result.sourceBrandCount<3)return result;
 const buckets=new Map();
 for(const source of sources){
  const within=new Map();
  for(const name of makeNames(source)){
   const key=normalize(String(name));
   if(!key||within.has(key))continue;
   within.set(key,String(name).normalize('NFKC').trim());
  }
  for(const [key,name] of within){
   let group=buckets.get(key);
   if(!group){group={key,name,items:[]};buckets.set(key,group);}
   group.items.push({brand:source.brand,productName:source.productName,productId:source.productId,
    sourceUrl:source.sourceUrl,checkedOn:source.checkedOn,sourceKind:source.sourceKind,
    originalSourceType:source.sourceType});
  }
 }
 result.ingredientConfirmedForTarget=result.confirmedInExactProduct.length>0;
 const exactKeys=new Set(result.confirmedInExactProduct.map(x=>normalize(x.name)));
 const candidates=[];
 for(const {key,name,items} of buckets.values()){
  if(exactKeys.has(key))continue;
  const brands=[...new Set(items.map(x=>x.brand))];
  if(brands.length<3||!items.some(x=>x.originalSourceType==='official'))continue;
  const analysis=analyze(name)[0];
  if(analysis.group==='unknown')continue;
  const examples=[];const usedBrands=new Set();
  for(const item of items){
   if(usedBrands.has(item.brand))continue;
   examples.push(item);usedBrands.add(item.brand);
  }
  // Source links are examples in OTHER products, never evidence for the target.
  candidates.push({name,group:analysis.group,generalRole:analysis.role,evidenceLevel:'analogue-only',
   targetIncluded:'not-confirmed',brandExamples:brands.length,productExamples:items.length,
   makerOfficialExampleCount:items.filter(x=>x.originalSourceType==='official').length,
   comparisonExamples:examples.slice(0,3).map(({brand,productName,productId,sourceUrl,checkedOn,sourceKind})=>({brand,productName,productId,sourceUrl,checkedOn,sourceKind}))});
 }
 candidates.sort((a,b)=>b.brandExamples-a.brandExamples||b.makerOfficialExampleCount-a.makerOfficialExampleCount||a.name.localeCompare(b.name,'ja'));
 const used=new Map();
 for(const candidate of candidates){
  const count=used.get(candidate.group)||0;
  if(count>=2)continue; // Avoid an entire 'flower' consisting only of solvents.
  result.analogues.push(candidate);used.set(candidate.group,count+1);
  if(result.analogues.length>=Math.max(1,Math.min(10,limit)))break;
 }
 return result;
}
