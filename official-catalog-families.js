// Reviewed 2026-11-01: Japanese manufacturer-published family names, NOT individual verified SKUs.
// Each name is indexed solely to help find a product; never infer any ingredient or variant.
const reviewedFamilyGroups=[
  {brand:"キュレル",source:"https://www.kao-kirei.com/ja/brand/kbb/curel/",names:["ジェルメイク落とし", "オイルメイク落とし", "潤浸保湿 乳液ケアメイク落とし", "潤浸保湿 泡ジェル洗顔料", "潤浸保湿 泡洗顔料", "皮脂トラブルケア 泡洗顔料", "ディープモイスチャースプレー", "皮脂トラブルケア 化粧水", "シミ・ソバカス予防ケア 化粧水", "エイジングケアシリーズ 化粧水", "皮脂トラブルケア 保湿ジェル", "シミ・ソバカス予防ケア 乳液", "潤浸保湿 パウダーバーム", "シミ・ソバカス予防ケア フェイスクリーム", "エイジングケアシリーズ フェイスジェルクリーム", "エイジングケアシリーズ フェイスクリーム", "潤浸保湿 モイストリペアシートマスク", "潤浸保湿 定着保湿オイル美容液", "潤浸保湿 角層深部バリア美容液", "潤浸保湿 泡美容液", "潤浸保湿 美容液", "シミ・ソバカス予防ケア 美容液", "潤浸保湿 モイストリペアアイクリーム", "リップケア クリーム", "リップケア バーム", "リップケア クリーム（美発色シリーズ）", "ベースメイク しっとり肌パウダーファンデーション", "ベースメイク ＢＢクリーム", "ベースメイク 透明感パウダー（おしろい）", "ハンドクリーム", "泡ボディウォッシュ", "ボディウォッシュ", "ローション", "ジェルローション", "バスタイム モイストバリアクリーム", "クリーム ジャー", "モイスチャーバーム ジャー", "スキンケアシート １０枚", "お手入れ底上げ かかとケアマスク", "お手入れ底上げ ハンドケアマスク", "潤浸保湿 スキンリペアＵＶセラム", "潤浸保湿 ＵＶローション", "潤浸保湿 ＵＶエッセンス", "潤浸保湿 ファンデ負担防止ベース"]},
  {brand:"ベネフィーク",source:"https://www.shiseido.co.jp/benefique/product/",names:["セラム", "ローション", "エマルジョン", "ローションEX", "エマルジョンEX", "ホットクレンジングジェル", "クレンジングフォーム", "ナイトクリーム", "デイバリアクリーム",  "メイククリア オイル", "メイククリア クリーム", "クリアミルク", "クリアUVエッセンス（UV&IR）", "ホリスティックブライト", "ホリスティックブライトUV", "レチノリフトジーニアス", "クリアマッサージ", "リペアジーニアス", "リュクスリセットセラム", "リュクスリフトモイスチャーライザー", "リュクスファーミングローション", "リュクスリブルームナイトクリーム", "エッセンシャルオールインワン ローション", "エッセンシャルオールインワン ジュレ", "エッセンシャルオールインワン クリーム", "エッセンシャルワンステップクレンズ", "クリアアップベース", "プリズムパウダリー", "プリズムリキッド", "リュクスフォルミングパクト", "エッセンシャルワンステップBBパクト", "セオティリップエッセンス", "セオティスマートアイライナー", "セオティスマートアイライナー（リキッド）", "セオティスマートアイブロー", "クリアハンドクリーム"]},
  {brand:"HAKU",source:"https://www.shiseido.co.jp/haku/lineup/",names:["ブライトニング クリームM", "デイブライトニングUV", "リファイナー", "ブライトニング ファンデーション", "エッセンスF", "メラノディープモイスチャー", "アクティブメラノリリーサー", "インナーメラノディフェンサー"]},
  {brand:"資生堂",source:"https://brand.shiseido.co.jp/products/skincare/collections/benefiance/",names:["SHISEIDO ベネフィアンス リンクル スムージング コントア セラム", "SHISEIDO ベネフィアンス リンクル スムージングデーエマルジョン", "SHISEIDO ベネフィアンス ブライトニング マイクロS セラム", "SHISEIDO ベネフィアンス ブライトニング ジェル クリーム", "SHISEIDO ベネフィアンス ブライトニング スキンケアパウダー", "SHISEIDO ベネフィアンス リンクル スムージング アイクリーム N", "SHISEIDO ベネフィアンス リンクル スムージングクリーム", "SHISEIDO ベネフィアンス リンクル スムージングクリーム エンリッチド"]},
  {brand:"オバジ",source:"https://www.shop.rohto.co.jp/category/skincare/obagi",names:["C25セラム ネオ", "C20セラム", "C10セラム（ラージ）", "C10セラム", "C5セラム", "オバジC 酵素洗顔パウダー", "オバジC 酵素洗顔パウダーDP", "ダーマパワーX ステムシャープアイ", "X フレームリフトローション つめかえ用", "X バイタライズリフトクリーム", "ダーマパワーX リップエッセンス", "X フレームリフトエマルジョン つめかえ用", "X フレームリフトローション", "C セラムゲル", "X バイタライズリフトクリーム つけかえ用レフィル", "X ディープアドバンスドリフト セラム", "アクティブベース クリアミルク", "アクティブベース クリアクレンジング", "アクティブベース クリアウォッシュ"]},
  {brand:"アクアレーベル",source:"https://www.shiseido.co.jp/aqua/product/",names:["スペシャルジェルクリームEX（モイストスムース）", "スペシャルジェルクリームEX（モイストスムース）つめかえ用", "スペシャルジェルクリームEX（ブライトニング）", "スペシャルジェルクリームEX（ブライトニング）つめかえ用", "スペシャルジェルクリームEX（オイルイン）", "スペシャルジェルクリームEX（オイルイン）つめかえ用", "オールインワンシートマスク（モイストスムース）", "トリートメントローション（ブライトニング）", "トリートメントローション（ブライトニング）つめかえ用", "トリートメントローション（モイストスムース）", "トリートメントミルク（ブライトニング）", "トリートメントローション（オイルイン）", "トリートメントミルク（オイルイン）", "エステ洗顔ジェル", "アクアローション さっぱり・しっとり", "アクアローション さっぱり・しっとり（つめかえ用）", "アクアミルク", "アクアミルク（つめかえ用）", "マルチアクアバーム", "ミルキームースフォーム", "モイストパウダリー（レフィル）", "スペシャルジュレ", "スペシャルジュレ（つめかえ用）"]},
];
const compactId=(brand,i)=>'rc92-official-family-'+({キュレル:'curel',ベネフィーク:'benefique',HAKU:'haku',資生堂:'shiseido',オバジ:'obagi',アクアレーベル:'aqualabel'}[brand])+'-'+String(i+1).padStart(3,'0');
export const officialCatalogFamilyNames=Object.freeze(reviewedFamilyGroups.flatMap(group=>
 group.names.map((name,i)=>Object.freeze({
  id:compactId(group.brand,i),brand:group.brand,name,
  aliases:Object.freeze([group.brand+' '+name]),url:group.source,
  registrationStatus:'name-only',sourceScope:'domestic-manufacturer-official-product-family-index',
  identityVerifiedAt:'2026-11-01',rightsStatus:'reference-link-only',
  volume:null,variant:null,jan:null,kind:null,
  productIdentityNote:'日本国内メーカーの商品一覧で商品系列の名称を確認。個別の色・容量・JAN・在庫・現物ラベル・日本語全成分を確認したものではありません。掲載一覧への参照のみです。'
 }))
));
export const officialCatalogSources=Object.freeze(Object.fromEntries(reviewedFamilyGroups.map(group=>[group.brand,group.source])));
