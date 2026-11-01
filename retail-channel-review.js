// Source-attributed channel triage for one Japan-facing cosmetic SKU.
// A Japanese page or a local store's inventory NEVER proves Japanese statutory ingredients.
// Static references are manually reviewed; absolutely no retailer scraping occurs in the app.
const reviewed={
 'https://mitsui-shopping-park.com/ec/p/1104800000305?mallColor=9501':{id:'mitsui-80',kind:'domestic-listing-no-label',titleVolume:'80mL',specVolume:'80mL',shipping:'domestic-listing',ingredients:'unreliable-translation'},
 'https://www.yodobashi.com/product/100000001009269391/':{id:'yodobashi-80',kind:'domestic-listing-no-label',titleVolume:'80mL',specVolume:'80mL',shipping:'domestic-listing',ingredients:'garbled'},
 'https://plus-q.jp/products/roundlab-birch-juice-moisturizing-cream':{id:'plusq-conflict',kind:'crossborder-with-volume-conflict',titleVolume:'80mL',specVolume:'50mL',shipping:'korea-direct',ingredients:'translation-unverified'},
 'https://item.rakuten.co.jp/joyance-m/10000454/':{id:'joyance-personal-import',kind:'personal-import-from-korea',titleVolume:'80mL',specVolume:'80mL',shipping:'korea-direct',ingredients:'not-confirmed'}
};
export function evaluateRetailChannels(input){
 if(!Array.isArray(input)||input.length!==4)throw Error('販売経路の出典資料数が不正です');
 const seen=new Set();
 const permittedKeys=['id','targetProductId','sourceName','sourceUrl','checkedOn','kind','titleVolume','specVolume','shipping','ingredients','japanLegalLabelConfirmed','currentFormulaConfirmed'].sort().join('|');
 const output=input.map(entry=>{
  if(!entry||Object.keys(entry).sort().join('|')!==permittedKeys)throw Error('出典資料の想定外の主張・項目を拒否します');
  const ref=reviewed[entry?.sourceUrl];
  if(!ref||seen.has(entry.sourceUrl)||entry.id!==ref.id||entry.kind!==ref.kind||
     entry.titleVolume!==ref.titleVolume||entry.specVolume!==ref.specVolume||
     entry.shipping!==ref.shipping||entry.ingredients!==ref.ingredients||
     entry.targetProductId!=='rc82-roundlab-birch-80'||
     entry.japanLegalLabelConfirmed!==false||entry.currentFormulaConfirmed!==false||
     entry.checkedOn!=='2026-11-01'||typeof entry.sourceName!=='string'||!entry.sourceName.trim())throw Error('販売経路・容量・出典・現物状態が監査資料と一致しません');
  seen.add(entry.sourceUrl);
  const localRetailPage=ref.shipping==='domestic-listing';
  const titleSpecMismatch=ref.titleVolume!==ref.specVolume;
  const needsCorrection=titleSpecMismatch||ref.ingredients==='garbled';
  const findings=[
   localRetailPage?'日本国内向け小売ページでの商品掲載を確認。現物の輸入販売元・法定表示は未確認。':'韓国からの直送・個人輸入。日本語の商品ページでも国内正規流通のラベルとはみなしません。',
   titleSpecMismatch?'商品名の80mLと詳細欄の50mLが不一致。容量を確定できません。':null,
   ref.ingredients==='garbled'?'成分欄に重複・機械翻訳と思われる不自然な名称があり、転記・補正して収録しません。':null,
   ref.ingredients==='translation-unverified'?'日本語の成分欄は韓国発送品の掲載情報。日本の法定全成分表示として登録しません。':null,
   ref.ingredients==='unreliable-translation'?'成分欄の翻訳・表記に不自然な箇所があり、現物との照合前に転載しません。':null
  ].filter(Boolean);
  return Object.freeze({
   id:ref.id,sourceName:entry.sourceName,sourceUrl:entry.sourceUrl,checkedOn:entry.checkedOn,
   kind:ref.kind,shipping:ref.shipping,titleVolume:ref.titleVolume,specVolume:ref.specVolume,
   titleSpecMismatch,needsCorrection,localRetailPage,
   ingredientSourceStatus:ref.ingredients,
   findings:Object.freeze(findings),
   eligibleAsJapaneseFullFormula:false,
   eligibleAsJapanesePartialFormula:false,
   evidenceOfDomesticLegalLabel:false
  });
 });
 if(output.filter(x=>x.localRetailPage).length!==2||output.filter(x=>!x.localRetailPage).length!==2)throw Error('国内販売と海外発送の照合数が不正');
 return Object.freeze({
  targetProductId:'rc82-roundlab-birch-80',
  status:'retail-channel-divided-not-label-verified',
  domesticListingCount:2,crossborderCount:2,
  conflictingVolumeListingCount:output.filter(x=>x.titleSpecMismatch).length,
  corruptedIngredientListingCount:output.filter(x=>x.ingredientSourceStatus==='garbled').length,
  japaneseLegalLabelVerified:false,ingredientNamesVerified:[],
  exactJapanJanVerified:false,canSaveAsFormula:false,canExportAsVerified:false,
  cases:Object.freeze(output),
  nextAction:'国内流通品の外箱・容器に記載されたJAN、容量、製造販売元、全成分を同時に確認してください。店舗の日本語ページだけでは判断できません。'
 });
}
