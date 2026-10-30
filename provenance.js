import {splitIngredients} from './engine.js';
export function provenance(product){
 if(!product)return {state:'manual',label:'利用者が入力した成分',details:'メーカー公式の原文は未確認です。',region:'未確認',count:0};
 const count=splitIngredients(product.ingredients||'').length;
 const region=product.sourceType==='user-saved'?'利用者が端末に保存した国内向け成分表（現物未検証）':product.sourceType==='user-shared'?'利用者が転記した国内向け掲載情報（現物未確認）':product.sourceType==='archive'?'日本公式掲載の保存版（現在の処方は未確認）':product.sourceType==='beauty'?'日本のコスメ情報サイト掲載（実物の国内向け表示は未確認）':product.sourceType==='shop'?'日本の通販掲載（実物の国内向け表示は未確認）':product.region==='jp'?'日本国内向けの公式成分表示':product.region==='global'?'海外公式版（日本向けと異なる可能性）':'掲載地域はページで確認';
 const order=product.order||'配合順は未確認';
 const label=product.sourceType==='user-saved'?'利用者が確認して端末に保存した全成分（第三者未検証）':product.sourceType==='user-shared'?'利用者が転記した外部掲載成分（正確さ・網羅性は未検証）':product.sourceType==='archive'?'国内公式サイトの保存成分（確認日 '+String(product.archiveVerifiedAt||'不明').slice(0,10)+'／現物未確認）':product.sourceType==='beauty'?'国内コスメ情報サイトの全成分掲載（メーカー・実物表示は未確認）':product.sourceType==='shop'?'国内通販の販売者による全成分掲載（メーカー・実物表示は未確認）':(product.url&&count>=4)?'公式ページの成分情報（販売地域・処方の版は要確認）':'原文を確認してください';
 return {state:'source',label,details:order,region,count,variant:product.label||'単一の処方として掲載',url:product.url||'',date:product.fetchedAt||''};
}
export function provenanceText(data){
 if(!data)return '成分の出典と処方バージョンは未確認です。';
 return [data.label,data.count?data.count+'成分':'',data.region,data.variant,data.details,
   ''].filter(Boolean).join('／');
}
