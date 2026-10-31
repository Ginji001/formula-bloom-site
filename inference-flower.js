// Pure educational heuristics: never evidence of an individual ingredient, formula, efficacy or concentration.
// Do not map guesses into public ingredient archives or verified flower analysis.
export const inferredArchetypes=Object.freeze([
 {id:'cream',name:'クリーム・乳液',keywords:['クリーム','乳液','ミルク','ジェル'],flags:{root:'想定',stem:'想定',leaf:'想定',petal:'不明',scent:'不明'},
 why:'乳化・ゲル化などで感触や塗布後の膜を整える剤型が一般的です。水系と油系の組合せや比率は製品ごとに異なります。',
 rows:{root:'水系・油系などの基剤候補（どちらが主か不明）',stem:'乳化・増粘・安定化の仕組みが必要になり得る',leaf:'保湿・エモリエント・被膜の役割が候補',petal:'整肌目的の配合は製品固有の出典がなければ不明',scent:'香料や香り成分の有無は不明'}},
 {id:'toner',name:'化粧水・トナー',keywords:['化粧水','トナー','ローション','エッセンスウォーター'],flags:{root:'想定',stem:'条件付き',leaf:'想定',petal:'不明',scent:'不明'},
 why:'流動性のある水系製品が多い一方、油分・可溶化剤を含むものや無水のものもあり得ます。',
 rows:{root:'水系を軸とする基剤が候補（無水処方の可能性も残る）',stem:'可溶化・安定化が必要かは成分構成による',leaf:'保湿・水分保持を助ける役割が候補',petal:'整肌目的の配合成分は製品固有の情報が必要',scent:'香料の有無は製品固有の情報が必要'}},
 {id:'serum',name:'美容液・アンプル',keywords:['美容液','セラム','アンプル','エッセンス','C23'],flags:{root:'想定',stem:'条件付き',leaf:'条件付き',petal:'条件付き',scent:'不明'},
 why:'美容液は幅広い剤型を含み、商品名・広告から実際の有効成分や濃度を特定できません。',
 rows:{root:'水性・油性・乳化系のいずれも候補',stem:'増粘や溶解・安定化が必要な場合がある',leaf:'保湿・使用感調整の役割はあり得るが未確認',petal:'製品名で訴求された目的は成分の配合証拠ではない',scent:'香料や精油の有無は不明'}},
 {id:'cleanser',name:'洗顔・クレンジング',keywords:['洗顔','クレンジング','ウォッシュ','ソープ','洗浄'],flags:{root:'想定',stem:'想定',leaf:'条件付き',petal:'不明',scent:'不明'},
 why:'汚れを除去するための界面作用や溶解の設計が一般的ですが、石けん・合成界面活性剤・油性処方の別は未確認です。',
 rows:{root:'水系または油系のベースが候補',stem:'界面作用・可溶化・洗浄を支える構造が候補',leaf:'洗い上がりの保湿や感触調整があり得る',petal:'整肌目的の成分は配合証拠がなく不明',scent:'香りの有無は不明'}},
 {id:'makeup',name:'色物・メイクアップ',keywords:['ティント','リップ','ルージュ','パレット','シャドウ','クッション','ファンデ','チーク','マスカラ'],flags:{root:'想定',stem:'想定',leaf:'条件付き',petal:'不明',scent:'不明'},
 why:'顔料・染料・皮膜・粉体等の設計が考えられますが、色番号ごとに実際の色材は変わり得ます。',
 rows:{root:'水・油・ワックス・粉体などの基剤候補',stem:'分散・皮膜形成・色材保持・感触を整える構造が候補',leaf:'保湿・エモリエントは製品によって異なる',petal:'着色や広告の目的を整肌成分の実在証拠とはしない',scent:'香りやフレーバーの有無は不明'}},
 {id:'sunscreen',name:'日焼け止め',keywords:['日焼け止め','サンスクリーン','サンクリーム','UV'],flags:{root:'想定',stem:'想定',leaf:'条件付き',petal:'不明',scent:'不明'},
 why:'紫外線防御の目的に沿った材料・分散等が考えられますが、吸収剤・散乱剤・SPF値を製品名から特定できません。',
 rows:{root:'乳化系・油系・水系などの基剤候補',stem:'紫外線防御材料の分散や安定化の構造が候補',leaf:'塗布時の感触や保護の役割があり得る',petal:'紫外線防御成分の種類・濃度・表示効能は不明',scent:'香料の有無は不明'}},
 {id:'pad',name:'シート・パッド',keywords:['トナーパッド','シート','パック','マスク'],flags:{root:'想定',stem:'条件付き',leaf:'想定',petal:'不明',scent:'不明'},
 why:'支持体（シート等）に液状処方を保持させる設計が一般的ですが、素材と液の配合は未確認です。',
 rows:{root:'含浸液の水系基剤などが候補',stem:'液を均一に保つ安定化や可溶化が必要な場合がある',leaf:'含浸液の保湿・保護の役割が候補',petal:'整肌成分の種類は不明',scent:'香料の有無は不明'}}
]);
export const inferRoleOrder=Object.freeze(['root','stem','leaf','petal','scent']);
const validArchetype=id=>inferredArchetypes.find(x=>x.id===id)||null;
export function inferStructure({product=null,archetypeId=null}={}){
 if(product && (!product.id||!product.name||!product.brand))throw Error('商品名・ブランド・IDが不十分です');
 const priority=['pad','sunscreen','cleanser','makeup','toner','serum','cream'];
 const resolved=archetypeId?validArchetype(archetypeId):priority.map(id=>validArchetype(id)).find(t=>t.keywords.some(k=>(product?.name||'').toLowerCase().includes(k.toLowerCase())));
 if(!resolved)return null;
 const kind=product?'registered-product-type':'user-selected-general-type';
 const title=product?product.brand+' '+product.name:'剤型を選択した一般的な処方モデル';
 return Object.freeze({
  hypothesis:true,ingredientEvidence:false,eligibleForVerifiedArchive:false,canSave:false,canExport:false,
  scope:kind,productId:product?.id||null,productTitle:title,archetypeId:resolved.id,archetypeName:resolved.name,
  productSourceUrl:product?.url||null,
  note:product?'登録済み商品名の剤型・名称からの一般論。該当製品に成分が配合された証拠ではありません。':'ブランドと商品が特定されていないため、選択剤型の一般論です。ブランド固有の処方仮説ではありません。',
  why:resolved.why,
  roles:Object.freeze(inferRoleOrder.map(group=>Object.freeze({group,status:resolved.flags[group],description:resolved.rows[group]}))),
  ingredientNames:Object.freeze([]),
  confidence:'処方の個別成分について判定不可',
  checkedOn:null,
  formulaMatch:false,
  assumptions:['剤型を示す名称／利用者が選んだ剤型','化粧品の一般的な処方設計'],
  unknowns:['日本国内向け全成分','容量・色・ロットでの処方差','実際の基剤と原料','濃度・配合順','効果・安全性']
 });
}
