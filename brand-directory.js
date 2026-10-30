// 日本・韓国の主要ブランド探索台帳。登録は全製品の成分取得成功を意味しない。
const catalog=[];
const add=(country,maker,site,items,strategy='manual')=>{
  for(const entry of items.split(';')){
    const [name,...alias]=entry.split('~');
    if(name)catalog.push({country,maker,name,aliases:[name,...alias].filter(Boolean),site,strategy});
  }
};
// 企業公式のブランド一覧に基づくグループ。検索・抽出は別途実機検証が必要。
add('JP','資生堂','https://www.shiseido.co.jp/','資生堂~SHISEIDO;エリクシール~ELIXIR;アネッサ~ANESSA;dプログラム~d program~d-program;イハダ~IHADA;アクアレーベル~AQUALABEL;HAKU~ハク;マキアージュ~MAQUILLAGE;インテグレート~INTEGRATE;マジョリカ マジョルカ~MAJOLICA MAJORCA;クレ・ド・ポー ボーテ~Cle de Peau Beaute;ベネフィーク~BENEFIQUE;プリオール~PRIOR;リバイタル~REVITAL;インウイ~INOUI;BAUM~バウム;IPSA~イプサ');
add('JP','花王・カネボウ','https://www.kao-kirei.com/','花王~Kao;キュレル~Curel;ビオレ~Biore;ソフィーナ iP~SOFINA iP;エスト~est;カネボウ~KANEBO;スイサイ~suisai;DEW~デュウ;ALBLANC~アルブラン;KATE~ケイト;ALLIE~アリィー;LUNASOL~ルナソル;freeplus~フリープラス;Primavista~プリマヴィスタ;TWANY~トワニー;LISSAGE~リサージ');
add('JP','コーセー','https://www.kose.co.jp/','コーセー~KOSE;雪肌精~SEKKISEI;コスメデコルテ~DECORTE;ONE BY KOSE~ワンバイコーセー;ヴィセ~VISEE;エスプリーク~ESPRIQUE;ADDICTION~アディクション;ジルスチュアート~JILL STUART;プレディア~Predia;セラムヴェール');
add('JP','ロート製薬','https://www.rohto.co.jp/','ロート製薬~ROHTO;肌ラボ~Hada Labo;メラノCC~Melano CC;ケアセラ~CareCera;オバジ~Obagi;スキンアクア~Skin Aqua;デオコ~Deoco;50の恵');
add('JP','ちふれ','https://www.chifure.co.jp/products/skinlotion/2871','ちふれ~CHIFURE','chifure');
add('JP','ちふれグループ','https://www.chifure.co.jp/','綾花~AYAKA;HIKARIMIRAI~ヒカリミライ');
add('JP','オルビス','https://www.orbis.co.jp/small/1201010/','オルビス~ORBIS','orbis');
add('JP','ファンケル','https://www.fancl.co.jp/beauty/','ファンケル~FANCL','fancl');
add('JP','ポーラ','https://www.pola.co.jp/','ポーラ~POLA;B.A~ポーラB.A;リンクルショット');
add('JP','アテニア','', 'アテニア~Attenir');
add('JP','DHC','https://www.dhc.co.jp/','DHC~ディーエイチシー');
add('JP','無印良品','https://www.muji.com/','無印良品~MUJI');
add('JP','トゥヴェール','https://www.tvert.jp/','トゥヴェール~TOUT VERT');
add('JP','富士フイルム','https://www.fujifilm.com/','アスタリフト~ASTALIFT;ルナメア~Lunamer');
add('JP','第一三共ヘルスケア','https://www.daiichisankyo-hc.co.jp/','ミノン~MINON;トランシーノ~TRANSINO');
add('JP','ノエビアグループ','https://noevirgroup.jp/','ノブ~NOV;サナ~SANA;なめらか本舗;エクセル~excel');
add('JP','クラシエ','https://www.kracie.co.jp/','肌美精~HADABISEI;ナイーブ~naive;いち髪~ICHIKAMI');
add('JP','マンダム','https://www.mandom.co.jp/','ギャツビー~GATSBY;ルシード~LUCIDO;ビフェスタ~Bifesta');
add('JP','セザンヌ化粧品','', 'セザンヌ~CEZANNE');
add('JP','井田ラボラトリーズ','', 'キャンメイク~CANMAKE');
add('KR','アモーレパシフィック','https://www.apgroup.com/jp/ja/','ラネージュ~LANEIGE~라네즈;イニスフリー~innisfree~이니스프리;エチュード~ETUDE~에뛰드;エストラ~AESTURA~에스트라;ヘラ~HERA~헤라;ソルファス~Sulwhasoo~설화수;プリメラ~primera;IOPE~アイオペ;ハンユル~HANYUL;マモンド~MAMONDE;イリユン~ILLIYOON;エスポア~espoir');
add('KR','LG生活健康','', 'CNP~CNP Laboratory~シーエヌピー;ビリーフ~belif;ザ・フェイスショップ~THE FACE SHOP;VDL~ブイディーエル;ザ・フー~THE WHOO;ビヨンド~BEYOND');
add('KR','ANUA','https://anua.com/','アヌア~ANUA~아누아','shopify');
add('KR','ROUND LAB','https://roundlab.com/','ラウンドラボ~ROUND LAB~라운드랩','shopify');
add('KR','COSRX','https://www.cosrx.com/','COSRX~コスアールエックス~코스알엑스','shopify');
add('KR','Beauty of Joseon','https://beautyofjoseon.com/','Beauty of Joseon~ビューティーオブジョソン~朝鮮美女','shopify');
add('KR','SKIN1004','https://www.skin1004.com/','SKIN1004~スキン1004~スキンサウザンドフォー','shopify');
add('KR','MEDIHEAL','https://mediheal.com/','MEDIHEAL~メディヒール~메디힐','shopify');
add('KR','mixsoon','https://mixsoon.us/','mixsoon~ミクスン','shopify');
add('KR','Torriden','https://www.torriden.com/','Torriden~トリデン~토리든');
add('KR','VT COSMETICS','', 'VT~VTコスメティックス~VT COSMETICS');
add('KR','numbuzin','', 'numbuzin~ナンバーズイン');
add('KR','Dr.G','', 'Dr.G~ドクタージー');
add('KR','Dr.Jart+','', 'Dr.Jart+~ドクタージャルト');
add('KR','ma:nyo','https://manyo-japanese.com/','ma:nyo~manyo~魔女工場');
add('KR','medicube','', 'medicube~メディキューブ');
add('KR','TIRTIR','', 'TIRTIR~ティルティル');
add('KR',"d'Alba",'', "d'Alba~ダルバ");
add('KR','Abib','', 'Abib~アビブ');
add('KR','Isntree','', 'Isntree~イズエンツリー');
add('KR','SOME BY MI','', 'SOME BY MI~サムバイミー');
add('KR','PURITO','', 'PURITO~ピュリト');
add('KR','SKINFOOD','', 'SKINFOOD~スキンフード');
add('KR','MISSHA','', 'MISSHA~ミシャ;A’pieu~アピュー');
add('KR','CLIO','', 'CLIO~クリオ;peripera~ペリペラ;goodal~グーダル');
add('KR','rom&nd','', 'rom&nd~ロムアンド');
add('KR','3CE','', '3CE~スリーコンセプトアイズ');
add('KR','Banila Co','', 'BANILA CO~バニラコ');
add('KR','AHC','', 'AHC~エーエイチシー');
add('KR','celimax','', 'celimax~セリマックス');
add('KR','Dr.Althea','', 'Dr.Althea~ドクターエルシア');
add('KR','BIODANCE','', 'BIODANCE~バイオダンス');
add('KR','beplain','', 'beplain~ビープレーン');
add('KR','haruharu wonder','', 'haruharu wonder~ハルハルワンダー');
add('KR','AXIS-Y','', 'AXIS-Y~アクシスワイ');
add('KR','TOCOBO','', 'TOCOBO~トコボ');
add('KR','Heimish','', 'heimish~ヘイミッシュ');
add('KR','Benton','', 'Benton~ベントン');
add('KR','iUNIK','', 'iUNIK~アイユニック');
add('KR','WELLAGE','', 'WELLAGE~ウェラージュ');
add('KR','BIOHEAL BOH','', 'BIOHEAL BOH~バイオヒールボ');
add('KR','Dr.Ceuracle','', 'Dr.Ceuracle~ドクターセラクル');
add('KR','Centellian24','', 'Centellian24~センテリアン24');
add('KR','fwee','', 'fwee~フィー');
add('KR','hince','', 'hince~ヒンス');
add('KR','dasique','', 'dasique~デイジーク');
add('KR','WAKEMAKE','', 'WAKEMAKE~ウェイクメイク');
add('KR','AMUSE','', 'AMUSE~アミューズ');
add('KR','REJURAN','', 'REJURAN~リジュラン');
// Only routes with tested product-search behavior are marked automated.
for(const b of catalog){
  if(b.name==='キュレル'){
    b.site='https://www.kao-kirei.com/ja/official/curel/products/skincare_moisturizers/';
    b.strategy='kao-curel';
  }else if(b.name==='DHC'){
    b.site='https://www.dhc.co.jp/';
    b.strategy='dhc';
  }else if(b.name==='celimax'){b.site='https://celimax.com/';b.strategy='shopify';}
  else if(b.name==='TIRTIR'){b.site='https://tirtir.global/';b.strategy='shopify';}
  else if(b.maker==='ロート製薬'){
    b.site='https://www.shop.rohto.co.jp/';
    b.strategy='rohto';
  }
}
// Verified global/US public brand storefront search endpoints (2026-10-29).
const newOfficialStores=new Map([
  ['ラネージュ','https://us.laneige.com/'],
  ['イニスフリー','https://us.innisfree.com/'],
  ['Torriden','https://torriden.us/'],
  ['medicube','https://medicube.us/'],
  ['Isntree','https://isntree-global.com/'],
  ['BIODANCE','https://biodance.com/'],
  ['Dr.Althea','https://doctoraltheaglobal.com/'],
  ['SKINFOOD','https://theskinfood.us/'],
  ['haruharu wonder','https://haruharuwonder.com/'],
  ['AXIS-Y','https://axis-y.com/'],
  ['TOCOBO','https://tocobo.us/'],
  ['BANILA CO','https://banilausa.com/'],
]);
for(const b of catalog){
  if(b.country==='KR'&&newOfficialStores.has(b.name)){
    b.site=newOfficialStores.get(b.name);
    b.strategy='shopify';
  }
  if(b.country==='JP'&&b.name==='トゥヴェール'){
    b.site='https://www.tvert.jp/shop';
    b.strategy='tvert-catalog';
  }
}
// 日本向け公式サイトと日本語の全成分欄が確認できた韓国ブランド。
const japanKoreanStores=new Map([
  ['アヌア','https://www.anuashop.jp/'],
  ['イニスフリー','https://www.innisfree.jp/'],
  ['Torriden','https://torriden.jp/'],
  ['MEDIHEAL','https://mediheal.jp/']
]);
for(const b of catalog){
  if(japanKoreanStores.has(b.name)){
    b.site=japanKoreanStores.get(b.name);
    // Shopify検索APIの成功は未確認のため、公式URLか日本語の成分表から利用する。
    b.strategy='manual';
  }
}
// 日本公式の実サイトを検証。海外版・代理店の紹介ページへは置換しない。
const verifiedKoreanJapanStores=new Map([
 ['ラネージュ','https://jp.laneige.com/'],
 ['ヘラ','https://jp.hera.com/'],
 ['エチュード','https://etude.jp/'],
 ['MISSHA','https://www.missha.co.jp/'],
 ['A’pieu','https://www.missha.co.jp/'],
 ['VT','https://www.vtcosmetics.jp/'],
 ['celimax','https://celimax.jp/'],
 ['SKINFOOD','https://www.skinfood.co.jp/'],
 ['fwee','https://fwee.jp/'],
 ['hince','https://hince.jp/']
]);
for(const b of catalog){
 if(b.country==='KR'&&verifiedKoreanJapanStores.has(b.name)){
  b.site=verifiedKoreanJapanStores.get(b.name);
  b.strategy='manual';
 }
}
export const brands=Object.freeze(catalog.map((b,i)=>Object.freeze({id:i+1,...b})));
const compact=s=>String(s).normalize('NFKC').toLowerCase().replace(/[\s\p{P}\p{S}]+/gu,'');
export function identifyBrand(query){
  const q=compact(query);if(!q)return null;
  const aliases=brands.flatMap(b=>b.aliases.map(alias=>({b,alias,key:compact(alias)})));
  aliases.sort((a,b)=>b.key.length-a.key.length);
  const match=aliases.find(x=>x.key.length>=2&&q.startsWith(x.key));
  if(!match)return null;
  return {...match.b,matchedAlias:match.alias,searchTerm:String(query).replace(new RegExp('^\\s*'+match.alias.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'),'').trim()};
}
export function brandStats(){return {total:brands.length,japan:brands.filter(x=>x.country==='JP').length,korea:brands.filter(x=>x.country==='KR').length,japanMakers:new Set(brands.filter(x=>x.country==='JP').map(x=>x.maker)).size,koreaMakers:new Set(brands.filter(x=>x.country==='KR').map(x=>x.maker)).size,automated:brands.filter(x=>x.strategy!=='manual').length};}
