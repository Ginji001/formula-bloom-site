// Educational inference for name-only source listings. These are NOT disclosed ingredients.
// The source listing ID and source product URL identify a *listing*, not a formula or a JAN.
const templates=[
 {kind:'化粧水',pattern:/化粧水|ローション/,names:['水','グリセリン','BG']},
 {kind:'乳液',pattern:/乳液|エマルジョン/,names:['水','グリセリン','トリエチルヘキサノイン']},
 {kind:'美容液',pattern:/美容液|セラム/,names:['水','グリセリン','BG']},
 {kind:'クリーム',pattern:/クリーム|保湿バーム/,names:['水','グリセリン','セテアリルアルコール']},
 {kind:'シャンプー',pattern:/シャンプー/,names:['水','ココイルグルタミン酸TEA','BG']},
 {kind:'洗顔料',pattern:/洗顔(?!用ブラシ)|フェイスウォッシュ/,names:['水','グリセリン','ココイルグルタミン酸TEA']},
 {kind:'クレンジング',pattern:/クレンジング|メイク落とし/,names:['トリエチルヘキサノイン','PEG-20水添ヒマシ油','水']},
 {kind:'日焼け止め',pattern:/日焼け止め|UVミルク|UVジェル/,names:['水','グリセリン','酸化チタン']}
];
const normalize=s=>String(s||'').normalize('NFKC');
export function inferNameOnlyFormula(row){
 if(!row||!row.name||!row.brandName||!row.productPageUrl||!row.source)return null;
 const name=normalize(row.name);
 if(!/[ぁ-んァ-ヶ一-龥々]/.test(name))return null;
 if(/医薬部外品|薬用|医薬品|第[１２12]類|オーラル|歯磨き|サプリ|食品|詰替|詰め替え|リフィル|セット|キット|メンズシェーバー|本体のみ|容器のみ|専用ケース/.test(name))return null;
 const matching=templates.filter(x=>x.pattern.test(name));
 if(matching.length!==1)return null;
 const type=matching[0];
 if(/^(?:ローション|セラム|クリーム)$/.test(type.kind))return null;
 return {
  status:'hypothetical-unverified',
  productTypeHint:type.kind,
  names:[...type.names],
  basis:'掲載商品名に含まれる剤型の語のみ。個別製品の実際の成分情報・濃度・配合順・商品版の根拠ではありません。',
  identityStatus:'source-listing-only-SKU-and-JAN-unverified',
  actualIngredientEvidence:'none'
 };
}
export function generateProvisionalNameOnlyPreview(row){
 const prediction=inferNameOnlyFormula(row);
 if(!prediction)return null;
 return {
  hypotheses:prediction.names.map(name=>({name,classification:'AI推測・未確認',confidence:'配合の証拠なし'})),
  reason:'商品名から読み取れる剤型「'+prediction.productTypeHint+'」の一般的な構成例を仮に示しています。',
  caution:'製品への配合は一切未確認。JAN・SKU、国内版、色・容量、薬用区分、実物ラベルとは照合していません。'
 };
}
