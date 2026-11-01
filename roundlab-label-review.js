// Local-only reconciliation helper. Input is never uploaded or persisted.
// User self-report / barcode checks NEVER create evidence of actual Japanese formula.
import {isValidEan13} from './barcode-reconciliation.js';

export const roundlabInquiryContactUrl='https://www.sioncosmetic.com/contact';
export const roundlabInquiryText=[
 'ROUND LAB「バーチジュース モイスチャライジングクリーム」80mLの国内向け表示について',
 '',
 'ROUND LABをお取り扱いの企業として貴社サイトを拝見し、製品情報の確認先をお伺いしたくご連絡しました。',
 '以下の点をご確認いただける範囲でご教示いただけますでしょうか。',
 '',
 '1. 日本国内の正規流通品（80mL）に表示される正式な商品名・JANコード',
 '2. 商品ページで見かける「8809738600221」と「8809624726400」が、それぞれどの商品・仕様を指すか',
 '3. 80mL国内流通品の容器・外箱に記載される製造販売元／輸入販売責任者の正式名称',
 '4. 当該JAN・仕様に対応する日本語の全成分表示（確認可能な公式ページ、または表示内容の確認方法）',
 '5. 製品改良・ラベル変更があった場合、その区別方法（変更日が判明する場合のみ）',
 '',
 '目的は化粧品の成分を学習向けに整理する際に、海外版・別商品・旧処方との混同を防ぐことです。',
 '公開利用できる参照元URLの有無についても教えていただければ幸いです。',
 '※貴社が当該商品の輸入販売責任者でない場合は、確認可能な窓口をご案内ください。'
].join('\n');

const digits=x=>String(x??'').normalize('NFKC').replace(/[\s\-ー－]/g,'');
export function reviewRoundlabPackage({ean='',volume='',responsibleCompany='',japaneseLabel=false,ingredientList=false}={}){
 const code=digits(ean);
 const measurement=String(volume??'').normalize('NFKC').toLowerCase().replace(/\s/g,'');
 const importer=String(responsibleCompany??'').trim().slice(0,160);
 const eanValid=isValidEan13(code);
 const codeStatus=!code?'missing':!eanValid?'invalid':
  code==='8809738600221'?'cream-reference':
  code==='8809624726400'?'category-conflict':'other-valid';
 const sourceNotes={
  missing:'現物のJANコードを入力すると、商品に付随する掲載資料と比較できます。',
  invalid:'13桁の数字またはEAN-13チェックデジットが一致しません。文字を原画像で再確認してください。',
  'cream-reference':'80mLクリームと対応する複数の販売資料がありますが、現物の国内向け法定表示までは確認できません。',
  'category-conflict':'同じ番号が80mLクリームとシートマスク10枚セットの双方に掲載されています。販売元への確認が必要です。',
  'other-valid':'13桁のEANとしては有効ですが、登録済みの比較資料に対応するJANはありません。'
 };
 const checks=[
  {id:'ean',label:'EAN-13の形式',passed:eanValid},
  {id:'volume',label:'容器の容量が80mL',passed:measurement==='80ml'},
  {id:'responsibleCompany',label:'国内の製造販売元・輸入販売責任者が読める',passed:Boolean(importer)},
  {id:'japaneseLabel',label:'日本語の容器・外箱表示を確認',passed:japaneseLabel===true},
  {id:'ingredientList',label:'容器の日本語全成分を原画像と比較',passed:ingredientList===true}
 ];
 const completeForManualReview=checks.every(x=>x.passed);
 return Object.freeze({
  type:'local-unverified-user-observation',codeStatus,
  ean:code.slice(0,13),eanValid,sourceNote:sourceNotes[codeStatus],
  checks:Object.freeze(checks.map(x=>Object.freeze(x))),
  completeForManualReview,formulaVerified:false,
  domesticJapanMarketVerified:false,canSaveAsVerified:false,
  canAddToPublicArchive:false,
  status:completeForManualReview
   ?'入力した項目はすべて揃いました。これは自己申告に基づく入力チェックであり、国内向け製品や全成分の第三者による検証ではありません。'
   :'不足項目を確認してください。いずれもこの場で入力確認するためのもので、国内版の成分を自動的に確定しません。',
  privacy:'入力はこの表示処理だけに使用し、自動保存・送信しません。'
 });
}
