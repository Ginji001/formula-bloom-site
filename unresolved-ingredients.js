// 日本国内向け製品の「名前だけ登録」状態を、利用者に説明する短い案内。
// ここには全成分の原文・推定成分・濃度・効能を保存しない。
export const unresolvedIngredientGuidance = Object.freeze({
 'ナイーブ':{type:'source-conflict',reason:'同じ530mL・JANでも販売店間で成分名・表示順が一致していません。',next:'現物パッケージの日本語全成分を確認してください。'},
 'celimax':{type:'japanese-label-needed',reason:'現行ノニエネルギーアンプル2.0の国内向け日本語全成分を確定できていません。',next:'2.0・30mLと分かる日本語ラベルを確認してください。'},
 '3CE':{type:'multi-part',reason:'9色のパレットには色ごとに成分欄があり、［＋／－］は着色剤の候補です。',next:'各色の実際の着色剤を確認できる表示と照合してください。'},
 'BIODANCE':{type:'source-conflict',reason:'同じJANの国内販売店で植物エキスの表示名称が異なります。',next:'JAN8809937361022の現物パッケージを確認してください。'},
 'セラムヴェール':{type:'rights-pending',reason:'本体と付けかえ用は別JANです。全成分の公開用資料はまだ未確定です。',next:'本体・付けかえ用の区別と日本語全成分を確認してください。'},
 'VDL':{type:'shade-identity',reason:'販売ページに複数の色があり、掲載JANがどの色に対応するか未確定です。',next:'色番と単品JANが読める日本語表示を確認してください。'},
 'TOCOBO':{type:'source-text-anomaly',reason:'販売店の成分欄で長い成分名の途中に不自然な空白などがあります。',next:'原文を勝手に直さず、実物の日本語全成分と照合してください。'},
 'BIOHEAL BOH':{type:'different-jans',reason:'同名50mL製品に別JANの掲載があり、処方の同一性を確認できていません。',next:'手元のJANと容量を確認し、該当品の全成分を確認してください。'},
 'Centellian24':{type:'source-text-anomaly',reason:'小売掲載の成分欄に文字連結や文字欠落が見られます。',next:'成分名を推測で修正せず、現物ラベルと照合してください。'},
 'TIRTIR':{type:'different-products',reason:'クッション15Cと80mLフィクサーは別製品です。',next:'製品名と色番・容量が一致する全成分を確認してください。'},
 'Dr.G':{type:'different-products',reason:'クリアスージングとクリアモイスチャーは別製品です。',next:'クリームの種類とJANを合わせて全成分を確認してください。'},
 'WAKEMAKE':{type:'multi-part',reason:'多色アイパレットの成分を、各色の確定配合として扱えません。',next:'色番22と各色の表示を照合してください。'},
 'AMUSE':{type:'japanese-label-needed',reason:'日本限定の東京モモ色について、国内向け日本語全成分が確定していません。',next:'東京モモの日本語ラベルと他色の区別を確認してください。'},
 'Beauty of Joseon':{type:'different-products',reason:'アクアフレッシュと従来の米ぬかサンクリームは別製品です。',next:'アクアフレッシュ50mL・該当JANの日本語全成分を確認してください。'},
 'numbuzin':{type:'distribution-identity',reason:'国内流通版と個人輸入版で成分の掲載内容が異なります。',next:'国内流通版30mL・JAN8809652583389のラベルを確認してください。'},
 'リバイタル':{type:'quasi-drug',reason:'医薬部外品のため、有効成分とその他の成分を区別して扱う必要があります。',next:'150mL本体の日本語表示を区分ごとに確認してください。'},
 'クレ・ド・ポー ボーテ':{type:'different-products',reason:'ローションAの170mLと小容量品、ローションCは別の製品候補です。',next:'ローションA・170mLの表示を確認してください。'},
 '無印良品':{type:'rights-pending',reason:'敏感肌用化粧水には複数の容量・タイプがあります。現物の現行表示は未照合です。',next:'高保湿300mL・JAN4550583434991の全成分を確認してください。'},
 'エスポア':{type:'different-variants',reason:'サンクリームには種類があり、CICAと別タイプの成分を混用できません。',next:'CICA60mL・JAN8809563937752の日本語表示を確認してください。'},
 'SKIN1004':{type:'distribution-identity',reason:'TECAアンプルとTECAセラムの名称が使われ、海外発送品には別JANがあります。',next:'国内販売50mL・JAN8809913834557の日本語表示を確認してください。'}
});
export function reviewGuidanceForProduct(item){
 if(!item||item.registrationStatus!=='name-only')return null;
 return unresolvedIngredientGuidance[item.brand]||null;
}
