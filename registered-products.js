// 公式の国内向け商品ページで日本語成分表を実際に確認できた製品だけを登録。
// ブランドの登録と製品の登録は区別する。これらは日本での販売継続や薬機法適合の保証ではない。
export const registeredProducts=Object.freeze([
 {id:"ihada-moist-lotion",brand:'イハダ',name:"薬用うるおいローション（しっとり）",
  aliases:["イハダ うるおいローション しっとり", "IHADA 薬用うるおいローション しっとり"],url:"https://www.shiseido.co.jp/ihada/products/skincare-lotion.html",variant:"しっとり",kind:'quasi',volume:"180mL",ingredientsExpected:23},
 {id:"ihada-rich-lotion",brand:'イハダ',name:"薬用うるおいローション（とてもしっとり）",
  aliases:["イハダ うるおいローション とてもしっとり", "IHADA 薬用うるおいローション とてもしっとり"],url:"https://www.shiseido.co.jp/ihada/products/skincare-lotion.html",variant:"とてもしっとり",kind:'quasi',volume:"180mL",ingredientsExpected:26},
 {id:"ihada-moist-emulsion",brand:'イハダ',name:"薬用うるおいエマルジョン",
  aliases:["イハダ 薬用うるおい乳液"],url:"https://www.shiseido.co.jp/ihada/products/skincare-emulsion.html",variant:null,kind:'quasi',volume:"135mL",ingredientsExpected:27},
 {id:"ihada-clear-lotion",brand:'イハダ',name:"薬用クリアローション",
  aliases:["イハダ クリアローション"],url:"https://www.shiseido.co.jp/ihada/products/skincare-clear-lotion.html",variant:null,kind:'quasi',volume:"180mL",ingredientsExpected:26},
 {id:"ihada-clear-emulsion",brand:'イハダ',name:"薬用クリアエマルジョン",
  aliases:["イハダ クリアエマルジョン"],url:"https://www.shiseido.co.jp/ihada/products/skincare-clear-emulsion.html",variant:null,kind:'quasi',volume:"135mL",ingredientsExpected:27},
 {id:'orbis-aquanist-lm',brand:'オルビス',name:'アクアニスト ローション LM（さっぱり高保湿タイプ）',
  aliases:['オルビス アクアニスト ローション LM','オルビス アクアニスト さっぱり'],url:'https://www.orbis.co.jp/small/11010852/',variant:'LM（さっぱり高保湿タイプ）',ingredientsExpected:19,sku:'9041',volume:'180mL'},
 {id:'orbis-aquanist-rm',brand:'オルビス',name:'アクアニスト ローション RM（しっとり高保湿タイプ）',
  aliases:['オルビス アクアニスト ローション RM','オルビス アクアニスト しっとり'],url:'https://www.orbis.co.jp/small/11010852/',variant:'RM（しっとり高保湿タイプ）',ingredientsExpected:27,sku:'9043',volume:'180mL'},
 {id:'orbis-encore-lotion',brand:'オルビス',name:'オルビスユー アンコール ローション',
  aliases:['オルビス アンコール ローション'],url:'https://www.orbis.co.jp/small/11010502/',variant:null,ingredientsExpected:15,sku:'9340',volume:'180mL'},
 {id:'fancl-bc-lotion',brand:'ファンケル',name:'BC 化粧液',
  aliases:['ファンケル BC 化粧液'],url:'https://www.fancl.co.jp/item/Seibun?category=01&item_id=3792-11',variant:null,ingredientsExpected:29,sku:'3792-11'},
 {id:'tvert-ga-moist',brand:'トゥヴェール',name:'バランシングGAローション モイスト',
  aliases:['トゥヴェール モイスト','バランシングGAローション モイスト','TOUT VERT バランシングGAローション モイスト'],
  url:'https://www.tvert.jp/shop/products/tvt002-2508tv0384',variant:'モイスト',ingredientsExpected:50},
 {id:'tvert-ga-normal',brand:'トゥヴェール',name:'バランシングGAローション',
  aliases:['トゥヴェール GAローション','バランシングGAローション 通常版'],
  url:'https://www.tvert.jp/shop/products/tvt002-2508tv0384',variant:'通常版',ingredientsExpected:33},
 {id:'chifure-moist-deep',brand:'ちふれ',name:'保湿化粧水 とてもしっとりタイプ',
  aliases:['ちふれ 保湿化粧水 とてもしっとり','ちふれ とてもしっとり'],
  url:'https://www.chifure.co.jp/products/skinlotion/2871',variant:null},
 {id:'chifure-lotion-light',brand:'ちふれ',name:'保湿化粧水 さっぱりタイプ',
  aliases:['ちふれ 保湿化粧水 さっぱり'],url:'https://www.chifure.co.jp/products/skinlotion/2875',variant:null},
 {id:'chifure-lotion-rich',brand:'ちふれ',name:'保湿化粧水 しっとりタイプ',
  aliases:['ちふれ 保湿化粧水 しっとり'],url:'https://www.chifure.co.jp/products/skinlotion/2873',variant:null},
 {id:'chifure-lotion-base',brand:'ちふれ',name:'保湿化粧水',
  aliases:['ちふれ 保湿化粧水 通常版'],url:'https://www.chifure.co.jp/products/skinlotion/2920',variant:null},
 {id:'chifure-milk-rich',brand:'ちふれ',name:'濃厚 乳液',
  aliases:['ちふれ 濃厚乳液'],url:'https://www.chifure.co.jp/products/milkylotion/2630',variant:null},
 {id:'chifure-milk-base',brand:'ちふれ',name:'保湿乳液',
  aliases:['ちふれ 保湿乳液'],url:'https://www.chifure.co.jp/products/milkylotion/2877',variant:null},
 {id:'torriden-dive-toner',brand:'Torriden',name:'ダイブイン トナー',
  aliases:['トリデン ダイブイン トナー','Torriden DIVE IN トナー'],url:'https://torriden.jp/products/no0002',variant:null},
 {id:'innisfree-green-tea-milk',brand:'イニスフリー',name:'グリーンティー セラミド ミルク エッセンストナー',
  aliases:['innisfree グリーンティー セラミド ミルク エッセンストナー'],url:'https://www.innisfree.jp/products/green-tea-ceramide-milk',variant:null},
 {id:'laneige-cream-skin',brand:'ラネージュ',name:'クリームスキン ローション',
  aliases:['LANEIGE クリームスキン ローション','ラネージュ クリームスキン'],url:'https://jp.laneige.com/products/cream-skin-cerapeptide-refiner',variant:null,ingredientsExpected:26},
 {id:'hera-hydro-reflecting-toner',brand:'ヘラ',name:'ハイドロ リフレクティング トナー',
  aliases:['HERA ハイドロ リフレクティング トナー'],url:'https://jp.hera.com/products/hydro-reflecting-toner',variant:null,ingredientsExpected:44},
 {id:'missha-vitac-pack-cleanser',brand:'MISSHA',name:'ビタシープラス 泡マスク洗顔',
  aliases:['ミシャ ビタシープラス 泡マスク洗顔','ミシャ ビタシープラス 泡マスク洗顔 140mL','MISSHA ビタシープラス 泡マスク洗顔 MS103671'],url:'https://www.missha.co.jp/product/vitac_packformcleanser/',variant:'洗顔料・洗い流すパック',sku:'MS103671',volume:'140mL',kind:'cosmetic',ingredientsExpected:54},
 {id:'etude-cloud-filter-cushion',brand:'エチュード',name:'クラウドフィルタークッション',
  aliases:['ETUDE クラウドフィルタークッション'],url:'https://etude.jp/etude_product/213010464',variant:null,ingredientsExpected:31},
 {id:'hince-second-skin-primer',brand:'hince',name:'セカンドスキンハイドレイティングプライマー',
  aliases:['ヒンス セカンドスキンハイドレイティングプライマー'],url:'https://hince.jp/c/event/2026/brandweek_2026_s/HC085',variant:null,ingredientsExpected:37},
 {id:'curel-lotion-i',brand:'キュレル',name:'潤浸保湿 化粧水 Ⅰ ややしっとり',
  aliases:['キュレル 化粧水 I ややしっとり','キュレル 潤浸保湿 化粧水 ややしっとり'],
  url:'https://www.kao-kirei.com/ja/item/kbb/curel/4901301236043/',variant:null},
 {id:'curel-lotion-ii',brand:'キュレル',name:'潤浸保湿 化粧水 Ⅱ しっとり',
  aliases:['キュレル 化粧水 II しっとり','キュレル 潤浸保湿 化粧水 しっとり'],
  url:'https://www.kao-kirei.com/ja/item/kbb/curel/4901301236197/',variant:null},
 {id:'curel-lotion-iii',brand:'キュレル',name:'潤浸保湿 化粧水 Ⅲ とてもしっとり',
  aliases:['キュレル 化粧水 III とてもしっとり','キュレル 潤浸保湿 化粧水 とてもしっとり'],
  url:'https://www.kao-kirei.com/ja/item/kbb/curel/4901301236180/',variant:null},
 {id:'curel-emulsion',brand:'キュレル',name:'潤浸保湿 乳液',
  aliases:['キュレル 乳液'],url:'https://www.kao-kirei.com/ja/item/kbb/curel/4901301236173/',variant:null},
 {id:'curel-facecream',brand:'キュレル',name:'潤浸保湿 フェイスクリーム',
  aliases:['キュレル フェイスクリーム'],
  url:'https://www.kao-kirei.com/ja/item/kbb/curel/4901301236210/',variant:null},
 {id:'cezanne-skin-conditioner',brand:'セザンヌ',name:'スキンコンディショナー',
  aliases:['セザンヌ スキンコンディショナー'],url:'https://www.cezanne.co.jp/lineup/seibun/',variant:'スキンコンディショナー',
  ingredientsExpected:59,sourcePageId:'4939553013501'},
 {id:'cezanne-skin-conditioner-high-moisture',brand:'セザンヌ',name:'スキンコンディショナー高保湿',
  aliases:['セザンヌ スキンコンディショナー高保湿'],url:'https://www.cezanne.co.jp/lineup/seibun/',variant:'スキンコンディショナー高保湿',
  ingredientsExpected:41,sourcePageId:'4939553040019'},
 {id:'cezanne-rich-skin-conditioner-milk',brand:'セザンヌ',name:'濃密スキンコンディショナー ミルク',
  aliases:['セザンヌ 濃密スキンコンディショナー ミルク'],url:'https://www.cezanne.co.jp/lineup/seibun/',variant:'濃密スキンコンディショナー ミルク',
  ingredientsExpected:56,sourcePageId:'4939553042198'},
 {id:'cezanne-makeup-fix-mist',brand:'セザンヌ',name:'メイクフィックスミスト',
  aliases:['セザンヌ メイクフィックスミスト'],url:'https://www.cezanne.co.jp/lineup/seibun/',variant:'メイクフィックスミスト',
  ingredientsExpected:17,sourcePageId:'4939553042044'},
 {id:'cezanne-natural-lotion',brand:'セザンヌ',name:'ナチュラルローション',
  aliases:['セザンヌ ナチュラルローション'],url:'https://www.cezanne.co.jp/lineup/seibun/',variant:'ナチュラルローション',
  ingredientsExpected:39,sourcePageId:'4939553042587'},
 {id:'cezanne-cleansing-balm',brand:'セザンヌ',name:'うるオフクレンジングバーム',
  aliases:['セザンヌ うるオフクレンジングバーム'],url:'https://www.cezanne.co.jp/lineup/seibun/',variant:'うるオフクレンジングバーム',
  ingredientsExpected:32,sourcePageId:'4939553043416'},
 {id:'cezanne-rich-hydro-mask',brand:'セザンヌ',name:'濃密ハイドロマスク',
  aliases:['セザンヌ 濃密ハイドロマスク'],url:'https://www.cezanne.co.jp/lineup/seibun/',variant:'濃密ハイドロマスク',
  ingredientsExpected:36,sourcePageId:'4939553530213'},
 {id:"cezanne-4939553041580-9e557e50c",brand:'セザンヌ',name:"アイブロウコートEX（クリア）",aliases:["セザンヌ アイブロウコートEX（クリア）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"クリア",kind:"cosmetic",ingredientsExpected:23,sourcePageId:"4939553041580"},
 {id:"cezanne-4939553042518-acac93472",brand:'セザンヌ',name:"マスカラリムーバー",aliases:["セザンヌ マスカラリムーバー"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:null,kind:"cosmetic",ingredientsExpected:23,sourcePageId:"4939553042518"},
 {id:"cezanne-4939553043386-81c5c917f",brand:'セザンヌ',name:"耐久カールスリムマスカラ（S1）",aliases:["セザンヌ 耐久カールスリムマスカラ（S1）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"S1",kind:"cosmetic",ingredientsExpected:20,sourcePageId:"4939553043386"},
 {id:"cezanne-4939553530114-e6b81adda",brand:'セザンヌ',name:"トリートメントリップバーム",aliases:["セザンヌ トリートメントリップバーム"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:null,kind:"cosmetic",ingredientsExpected:27,sourcePageId:"4939553530114"},
 {id:"cezanne-4939553013730-f5bdda936",brand:'セザンヌ',name:"BBクリーム パール入り（P2）",aliases:["セザンヌ BBクリーム パール入り（P2）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"P2",kind:"cosmetic",ingredientsExpected:35,sourcePageId:"4939553013730"},
 {id:"cezanne-4939553042792-d63d078fe",brand:'セザンヌ',name:"皮脂テカリ防止下地（ソフトイエロー）",aliases:["セザンヌ 皮脂テカリ防止下地（ソフトイエロー）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"ソフトイエロー",kind:"cosmetic",ingredientsExpected:31,sourcePageId:"4939553042792"},
 {id:"cezanne-4939553530602-c3f77fbaf",brand:'セザンヌ',name:"皮脂テカリ防止下地50（ナチュラルベージュ）",aliases:["セザンヌ 皮脂テカリ防止下地50（ナチュラルベージュ）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"ナチュラルベージュ",kind:"cosmetic",ingredientsExpected:40,sourcePageId:"4939553530602"},
 {id:"cezanne-4939553011262-ed8208505",brand:'セザンヌ',name:"ハイライトコンシーラー（クリアベージュ）",aliases:["セザンヌ ハイライトコンシーラー（クリアベージュ）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"クリアベージュ",kind:"cosmetic",ingredientsExpected:29,sourcePageId:"4939553011262"},
 {id:"cezanne-4939553040095-e7274f514",brand:'セザンヌ',name:"ストレッチコンシーラー（30）",aliases:["セザンヌ ストレッチコンシーラー（30）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"30",kind:"cosmetic",ingredientsExpected:34,sourcePageId:"4939553040095"},
 {id:"cezanne-4939553040644-5f1589ad2",brand:'セザンヌ',name:"赤み補正コンシーラー（ソフトグリーン）",aliases:["セザンヌ 赤み補正コンシーラー（ソフトグリーン）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"ソフトグリーン",kind:"cosmetic",ingredientsExpected:39,sourcePageId:"4939553040644"},
 {id:"cezanne-4939553043171-231dc003e",brand:'セザンヌ',name:"ナチュラルバランシングクリーム",aliases:["セザンヌ ナチュラルバランシングクリーム"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:null,kind:"cosmetic",ingredientsExpected:40,sourcePageId:"4939553043171"},
 {id:"cezanne-4939553530718-074edaa26",brand:'セザンヌ',name:"ナチュラルクリアマスク",aliases:["セザンヌ ナチュラルクリアマスク"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:null,kind:"cosmetic",ingredientsExpected:46,sourcePageId:"4939553530718"},
 {id:"cezanne-4939553041917-a3762a90c",brand:'セザンヌ',name:"濃密スキンコンディショナー",aliases:["セザンヌ 濃密スキンコンディショナー"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:null,kind:"cosmetic",ingredientsExpected:42,sourcePageId:"4939553041917"},
 {id:"cezanne-4939553042785-66596cddb",brand:'セザンヌ',name:"ウォータリーグロウリップ（P0）",aliases:["セザンヌ ウォータリーグロウリップ（P0）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"P0",kind:"cosmetic",ingredientsExpected:19,sourcePageId:"4939553042785"},
 {id:"cezanne-4939553042990-2e21bac61",brand:'セザンヌ',name:"スタイリングアイブロウマスカラ（00　クリア）",aliases:["セザンヌ スタイリングアイブロウマスカラ（00　クリア）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"00　クリア",kind:"cosmetic",ingredientsExpected:10,sourcePageId:"4939553042990"},
 {id:"cezanne-4939553530534-9c2a6856e",brand:'セザンヌ',name:"アイブロウ&シェードパウダー（01）",aliases:["セザンヌ アイブロウ&シェードパウダー（01）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"01",kind:"cosmetic",ingredientsExpected:22,sourcePageId:"4939553530534"},
 {id:"cezanne-4939553530534-65c77480e",brand:'セザンヌ',name:"アイブロウ&シェードパウダー（02）",aliases:["セザンヌ アイブロウ&シェードパウダー（02）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"02",kind:"cosmetic",ingredientsExpected:22,sourcePageId:"4939553530534"},
 {id:"cezanne-4939553530909-c1b22d597",brand:'セザンヌ',name:"超細芯ソフトアイブロウ（03）",aliases:["セザンヌ 超細芯ソフトアイブロウ（03）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"03",kind:"cosmetic",ingredientsExpected:20,sourcePageId:"4939553530909"},
 {id:"cezanne-4939553530909-8b36667bd",brand:'セザンヌ',name:"超細芯ソフトアイブロウ（08）",aliases:["セザンヌ 超細芯ソフトアイブロウ（08）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"08",kind:"cosmetic",ingredientsExpected:20,sourcePageId:"4939553530909"},
 {id:"cezanne-4939553042136-33e766c7a",brand:'セザンヌ',name:"耐久カールマスカラ（00）",aliases:["セザンヌ 耐久カールマスカラ（00）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"00",kind:"cosmetic",ingredientsExpected:13,sourcePageId:"4939553042136"},
 {id:"cezanne-4939553042136-e8a939daa",brand:'セザンヌ',name:"耐久カールマスカラ（01）",aliases:["セザンヌ 耐久カールマスカラ（01）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"01",kind:"cosmetic",ingredientsExpected:19,sourcePageId:"4939553042136"},
 {id:"cezanne-4939553530435-02d522858",brand:'セザンヌ',name:"グロウコートマスカラ（00）",aliases:["セザンヌ グロウコートマスカラ（00）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"00",kind:"cosmetic",ingredientsExpected:19,sourcePageId:"4939553530435"},
 {id:"cezanne-4939553530435-fd98f8950",brand:'セザンヌ',name:"グロウコートマスカラ（01）",aliases:["セザンヌ グロウコートマスカラ（01）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"01",kind:"cosmetic",ingredientsExpected:26,sourcePageId:"4939553530435"},
 {id:"cezanne-4939553530664-3e6e570ba",brand:'セザンヌ',name:"アンダーアイライナー（01）",aliases:["セザンヌ アンダーアイライナー（01）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"01",kind:"cosmetic",ingredientsExpected:19,sourcePageId:"4939553530664"},
 {id:"cezanne-4939553530664-37a82fef4",brand:'セザンヌ',name:"アンダーアイライナー（02）",aliases:["セザンヌ アンダーアイライナー（02）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"02",kind:"cosmetic",ingredientsExpected:17,sourcePageId:"4939553530664"},
 {id:"cezanne-4939553530671-d9da23e2d",brand:'セザンヌ',name:"極細アイライナーEXプラス（00）",aliases:["セザンヌ 極細アイライナーEXプラス（00）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"00",kind:"cosmetic",ingredientsExpected:24,sourcePageId:"4939553530671"},
 {id:"cezanne-4939553530671-370872e48",brand:'セザンヌ',name:"極細アイライナーEXプラス（10）",aliases:["セザンヌ 極細アイライナーEXプラス（10）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"10",kind:"cosmetic",ingredientsExpected:25,sourcePageId:"4939553530671"},
 {id:"cezanne-4939553043034-644a2a265",brand:'セザンヌ',name:"アイジェニックカラーライナー（10）",aliases:["セザンヌ アイジェニックカラーライナー（10）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"10",kind:"cosmetic",ingredientsExpected:23,sourcePageId:"4939553043034"},
 {id:"cezanne-4939553043034-5ed6a9867",brand:'セザンヌ',name:"アイジェニックカラーライナー（20）",aliases:["セザンヌ アイジェニックカラーライナー（20）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"20",kind:"cosmetic",ingredientsExpected:26,sourcePageId:"4939553043034"},
 {id:"cezanne-4939553043355-231aa66a5",brand:'セザンヌ',name:"ブレぴたライナー（00）",aliases:["セザンヌ ブレぴたライナー（00）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"00",kind:"cosmetic",ingredientsExpected:15,sourcePageId:"4939553043355"},
 {id:"cezanne-4939553043355-8f9276273",brand:'セザンヌ',name:"ブレぴたライナー（20）",aliases:["セザンヌ ブレぴたライナー（20）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"20",kind:"cosmetic",ingredientsExpected:21,sourcePageId:"4939553043355"},
 {id:"cezanne-4939553530251-57e775541",brand:'セザンヌ',name:"フェイスアイパレット（01）",aliases:["セザンヌ フェイスアイパレット（01）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"01",kind:"cosmetic",ingredientsExpected:31,sourcePageId:"4939553530251"},
 {id:"cezanne-4939553530251-4b0025034",brand:'セザンヌ',name:"フェイスアイパレット（02）",aliases:["セザンヌ フェイスアイパレット（02）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"02",kind:"cosmetic",ingredientsExpected:30,sourcePageId:"4939553530251"},
 {id:"cezanne-4939553043294-eaaa9cd39",brand:'セザンヌ',name:"ペールトーンアイシャドウ（01）",aliases:["セザンヌ ペールトーンアイシャドウ（01）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"01",kind:"cosmetic",ingredientsExpected:32,sourcePageId:"4939553043294"},
 {id:"cezanne-4939553043294-8b019205d",brand:'セザンヌ',name:"ペールトーンアイシャドウ（02）",aliases:["セザンヌ ペールトーンアイシャドウ（02）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"02",kind:"cosmetic",ingredientsExpected:36,sourcePageId:"4939553043294"},
 {id:"cezanne-4939553042921-b9bd12abe",brand:'セザンヌ',name:"ビタートーンアイシャドウ（01　オレンジガナッシュ）",aliases:["セザンヌ ビタートーンアイシャドウ（01　オレンジガナッシュ）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"01　オレンジガナッシュ",kind:"cosmetic",ingredientsExpected:35,sourcePageId:"4939553042921"},
 {id:"cezanne-4939553042921-0fc60e805",brand:'セザンヌ',name:"ビタートーンアイシャドウ（02　ドライローズ）",aliases:["セザンヌ ビタートーンアイシャドウ（02　ドライローズ）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"02　ドライローズ",kind:"cosmetic",ingredientsExpected:36,sourcePageId:"4939553042921"},
 {id:"cezanne-4939553530152-d6cf7d35e",brand:'セザンヌ',name:"ライティングアップアイシャドウ（01）",aliases:["セザンヌ ライティングアップアイシャドウ（01）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"01",kind:"cosmetic",ingredientsExpected:38,sourcePageId:"4939553530152"},
 {id:"cezanne-4939553530152-c3b045705",brand:'セザンヌ',name:"ライティングアップアイシャドウ（02）",aliases:["セザンヌ ライティングアップアイシャドウ（02）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"02",kind:"cosmetic",ingredientsExpected:40,sourcePageId:"4939553530152"},
 {id:"cezanne-4939553043157-ee9161cf1",brand:'セザンヌ',name:"アイメイクベース（クリア）",aliases:["セザンヌ アイメイクベース（クリア）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"クリア",kind:"cosmetic",ingredientsExpected:32,sourcePageId:"4939553043157"},
 {id:"cezanne-4939553043157-f6a932b3e",brand:'セザンヌ',name:"アイメイクベース（ラベンダー）",aliases:["セザンヌ アイメイクベース（ラベンダー）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"ラベンダー",kind:"cosmetic",ingredientsExpected:36,sourcePageId:"4939553043157"},
 {id:"cezanne-4939553042709-984b21637",brand:'セザンヌ',name:"リップカラーシールド（01）",aliases:["セザンヌ リップカラーシールド（01）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"01",kind:"cosmetic",ingredientsExpected:24,sourcePageId:"4939553042709"},
 {id:"cezanne-4939553042709-cf44e606a",brand:'セザンヌ',name:"リップカラーシールド（02）",aliases:["セザンヌ リップカラーシールド（02）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"02",kind:"cosmetic",ingredientsExpected:24,sourcePageId:"4939553042709"},
 {id:"cezanne-4939553530305-eaa29db42",brand:'セザンヌ',name:"ブレンドカラーシェーディング（01）",aliases:["セザンヌ ブレンドカラーシェーディング（01）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"01",kind:"cosmetic",ingredientsExpected:17,sourcePageId:"4939553530305"},
 {id:"cezanne-4939553530305-583a17a83",brand:'セザンヌ',name:"ブレンドカラーシェーディング（02）",aliases:["セザンヌ ブレンドカラーシェーディング（02）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"02",kind:"cosmetic",ingredientsExpected:17,sourcePageId:"4939553530305"},
 {id:"cezanne-4939553530725-42ec09a35",brand:'セザンヌ',name:"セラムクッションファンデーション（P5）",aliases:["セザンヌ セラムクッションファンデーション（P5）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"P5",kind:"cosmetic",ingredientsExpected:44,sourcePageId:"4939553530725"},
 {id:"cezanne-4939553530725-7736ebef2",brand:'セザンヌ',name:"セラムクッションファンデーション（N10）",aliases:["セザンヌ セラムクッションファンデーション（N10）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"N10",kind:"cosmetic",ingredientsExpected:44,sourcePageId:"4939553530725"},
 {id:"cezanne-4939553043089-820134346",brand:'セザンヌ',name:"グロウスキンベース（クリアグロウ）",aliases:["セザンヌ グロウスキンベース（クリアグロウ）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"クリアグロウ",kind:"cosmetic",ingredientsExpected:37,sourcePageId:"4939553043089"},
 {id:"cezanne-4939553043089-cc565e9e4",brand:'セザンヌ',name:"グロウスキンベース（ラベンダーグロウ）",aliases:["セザンヌ グロウスキンベース（ラベンダーグロウ）"],url:"https://www.cezanne.co.jp/lineup/seibun/",variant:"ラベンダーグロウ",kind:"cosmetic",ingredientsExpected:41,sourcePageId:"4939553043089"},
].map(x=>Object.freeze({...x,aliases:Object.freeze(x.aliases)})));

export const registeredBrands=Object.freeze([...new Set(registeredProducts.map(x=>x.brand))]);

export function productFold(value){
 return String(value||'').normalize('NFKC').toLowerCase()
  .replace(/[\s\u3000\-_「」『』【】()（）・:：]+/g,'')
  .replace(/(Ⅰ|ⅰ)/g,'i').replace(/(Ⅱ|ⅱ)/g,'ii').replace(/(Ⅲ|ⅲ)/g,'iii');
}
export function productsForBrand(brand){
 const folded=productFold(brand);
 return registeredProducts.filter(x=>productFold(x.brand)===folded);
}
export function findRegisteredProducts(query){
 const q=productFold(query);
 if(!q)return [];
 const matches=registeredProducts.map(p=>{
  const names=[p.brand+' '+p.name,p.name,...p.aliases].map(productFold);
  const exact=names.some(x=>x===q);
  const contains=names.some(x=>x.includes(q)||q.includes(x));
  const tokens=String(query||'').normalize('NFKC').split(/[\s　]+/).map(productFold).filter(Boolean);
  const wordMatch=tokens.length>1&&tokens.every(t=>names.some(x=>x.includes(t)));
  const brandOnly=productFold(p.brand)===q;
  if(!exact&&!contains&&!wordMatch&&!brandOnly)return null;
  const score=exact?100:brandOnly?50:wordMatch?40:contains?30:0;
  return {product:p,score,exact};
 }).filter(Boolean);
 return matches.sort((a,b)=>b.score-a.score||a.product.name.localeCompare(b.product.name,'ja')).map(x=>x);
}
export function chooseExactRegisteredProduct(query){
 const matched=findRegisteredProducts(query);
 const exact=matched.filter(x=>x.exact);
 if(exact.length!==1)return null;
 const name=productFold(exact[0].product.name);
 // 「保湿化粧水」「GAローション」など総称は、派生処方が登録されているとき自動選択しない。
 return matched.some(x=>x!==exact[0]&&productFold(x.product.name).includes(name))?null:exact[0].product;
}
