// rc188 (2026-11-09) — Japanese product-name-only entries verified on official Japanese maker retail pages.
// Search-only: not domestic legal ingredient evidence, not ingredient order, not shade/JAN proof.
import {productFold} from './registered-products.js';
const verifiedOn='2026-11-09';
const rawGroups={
  "ルシェリ": [
    [
      "wrinkle-night",
      "リンクルリペア ナイトクリーム",
      null,
      "quasi",
      "本体",
      "https://maison.kose.co.jp/site/lecheri/g/gMJCN/"
    ],
    [
      "wrinkle-night-replace",
      "リンクルリペア ナイトクリーム（つけかえ用）",
      null,
      "quasi",
      "付けかえ用",
      "https://maison.kose.co.jp/site/lecheri/g/gMJCO/"
    ],
    [
      "wrinkle-uv35",
      "リンクルホワイト UVエマルジョン",
      "35g",
      "quasi",
      null,
      "https://maison.kose.co.jp/site/lecheri/g/gMJDB/"
    ],
    [
      "wrinkle-lotion",
      "リンクルリペア ローション",
      null,
      "quasi",
      "本体",
      "https://maison.kose.co.jp/site/lecheri/g/gMJLG/"
    ],
    [
      "wrinkle-lotion-refill",
      "リンクルリペア ローション（つめかえ用）",
      "150mL",
      "quasi",
      "つめかえ用",
      "https://maison.kose.co.jp/site/lecheri/g/gMJLH/"
    ],
    [
      "wrinkle-emulsion",
      "リンクルリペア エマルジョン",
      null,
      "quasi",
      "本体",
      "https://maison.kose.co.jp/site/lecheri/g/gMJEG/"
    ],
    [
      "wrinkle-emulsion-replace",
      "リンクルリペア エマルジョン（つけかえ用）",
      "120mL",
      "quasi",
      "付けかえ用",
      "https://maison.kose.co.jp/site/lecheri/g/gMJEH/"
    ],
    [
      "lift-cream",
      "リフトグロウ クリーム",
      "40g",
      "cosmetic",
      "本体",
      "https://www.kose.co.jp/lecheri/cream/"
    ],
    [
      "lift-cream-replace",
      "リフトグロウ クリーム（つけかえ用）",
      "40g",
      "cosmetic",
      "付けかえ用",
      "https://www.kose.co.jp/lecheri/cream/"
    ],
    [
      "lift-emulsion1",
      "リフトグロウ エマルジョン Ⅰ",
      "120mL",
      "cosmetic",
      "本体",
      "https://www.kose.co.jp/lecheri/emulsion/"
    ],
    [
      "lift-emulsion2",
      "リフトグロウ エマルジョン Ⅱ",
      "120mL",
      "cosmetic",
      "本体",
      "https://www.kose.co.jp/lecheri/emulsion/"
    ],
    [
      "lift-emulsion1-replace",
      "リフトグロウ エマルジョン Ⅰ（つけかえ用）",
      "120mL",
      "cosmetic",
      "付けかえ用",
      "https://www.kose.co.jp/lecheri/emulsion/"
    ],
    [
      "lift-emulsion2-replace",
      "リフトグロウ エマルジョン Ⅱ（つけかえ用）",
      "120mL",
      "cosmetic",
      "付けかえ用",
      "https://www.kose.co.jp/lecheri/emulsion/"
    ],
    [
      "cleansing-gel",
      "オイルイン クレンジングジェル",
      null,
      "cosmetic",
      null,
      "https://maison.kose.co.jp/site/lecheri/g/gMJCG/"
    ],
    [
      "enzyme-wash",
      "洗顔パウダー",
      null,
      "cosmetic",
      null,
      "https://maison.kose.co.jp/site/lecheri/g/gMJKY/"
    ],
    [
      "lift-lotion1",
      "リフトグロウ ローション Ⅰ",
      "160mL",
      "cosmetic",
      "本体",
      "https://www.kose.co.jp/lecheri/lotion/"
    ],
    [
      "lift-lotion2",
      "リフトグロウ ローション Ⅱ",
      "160mL",
      "cosmetic",
      "本体",
      "https://www.kose.co.jp/lecheri/lotion/"
    ],
    [
      "lift-lotion1-refill",
      "リフトグロウ ローション Ⅰ（つめかえ用）",
      "150mL",
      "cosmetic",
      "つめかえ用",
      "https://www.kose.co.jp/lecheri/lotion/"
    ],
    [
      "lift-lotion2-refill",
      "リフトグロウ ローション Ⅱ（つめかえ用）",
      "150mL",
      "cosmetic",
      "つめかえ用",
      "https://www.kose.co.jp/lecheri/lotion/"
    ]
  ],
  "プロメディアル": [
    [
      "moist-lotion115",
      "モイスチャーローション",
      "115mL",
      "unsure",
      "本体",
      "https://www.shop.rohto.co.jp/category/skincare/promedial/192427.html"
    ],
    [
      "moist-lotion-refill110",
      "モイスチャーローション（つめかえ用）",
      "110mL",
      "unsure",
      "つめかえ用",
      "https://www.shop.rohto.co.jp/category/skincare/promedial"
    ],
    [
      "moist-lotion-light115",
      "モイスチャーローションライト",
      "115mL",
      "unsure",
      null,
      "https://www.shop.rohto.co.jp/category/skincare/promedial/192434.html"
    ],
    [
      "moist-milk80",
      "モイスチャーミルクb",
      "80mL",
      "unsure",
      "本体",
      "https://www.shop.rohto.co.jp/category/skincare/promedial"
    ],
    [
      "moist-milk-refill75",
      "モイスチャーミルクb（つめかえ用）",
      "75mL",
      "unsure",
      "つめかえ用",
      "https://www.shop.rohto.co.jp/category/skincare/promedial/193745.html"
    ],
    [
      "moist-cream50",
      "モイスチャライズクリーム",
      "50g",
      "unsure",
      null,
      "https://www.shop.rohto.co.jp/category/skincare/promedial/192458.html"
    ],
    [
      "premium-veil-mask",
      "プレミアムベールマスク3D",
      "23mL×4枚",
      "unsure",
      null,
      "https://www.shop.rohto.co.jp/category/skincare/promedial"
    ],
    [
      "extra-moist-oil40",
      "エクストラモイストオイル",
      "40mL",
      "unsure",
      null,
      "https://www.shop.rohto.co.jp/category/skincare/promedial"
    ],
    [
      "moist-mist80",
      "モイスチャーミスト",
      "80g",
      "unsure",
      null,
      "https://www.shop.rohto.co.jp/category/skincare/promedial"
    ],
    [
      "white-lotion-a100",
      "ホワイトモイスチャーローションa（しっとり）",
      "100mL",
      "quasi",
      null,
      "https://www.shop.rohto.co.jp/category/skincare/promedial/138371.html"
    ],
    [
      "white-lotion-light100",
      "ホワイトモイスチャーローションライト（さっぱり）",
      "100mL",
      "quasi",
      null,
      "https://www.shop.rohto.co.jp/category/skincare/promedial/138388.html"
    ],
    [
      "white-milk70",
      "ホワイトモイスチャーミルクa",
      "70mL",
      "quasi",
      null,
      "https://www.shop.rohto.co.jp/category/skincare/promedial/138364.html"
    ],
    [
      "washing-cream120",
      "ウォッシングクリーム",
      "120g",
      "unsure",
      null,
      "https://www.shop.rohto.co.jp/category/skincare/promedial/134892.html"
    ]
  ],
  "ブルーミオ": [
    [
      "deep-boost-serum50",
      "ディープブーストセラム",
      "50g",
      "unsure",
      null,
      "https://www.shop.rohto.co.jp/category/skincare/bloomio/198702.html"
    ],
    [
      "deep-moist-lotion145",
      "ディープモイストローション",
      "145mL",
      "unsure",
      null,
      "https://www.shop.rohto.co.jp/category/skincare/bloomio/192809.html"
    ],
    [
      "moist-repair-cream30",
      "モイストリペアクリーム",
      "30g",
      "unsure",
      null,
      "https://www.shop.rohto.co.jp/category/skincare/bloomio/174560.html"
    ]
  ]
};
const brandSlugs={'ルシェリ':'lecheri','プロメディアル':'promedial','ブルーミオ':'bloomio'};
// Brand navigation aliases for existing manufacturer-rollup products, not new SKUs.
const existingCatalogIds={
 'deep-boost-serum50':'rc124-rohto-bloomio-serum-50',
 'deep-moist-lotion145':'rc54-rohto-bloomio-lotion-145',
 'moist-repair-cream30':'rc124-rohto-bloomio-cream-30'
};
export const officialNameOnlyRC188=Object.freeze(Object.entries(rawGroups).flatMap(([brand,rows])=>
 rows.map(([code,name,volume,kind,variant,url])=>Object.freeze({
   id:'rc188-'+brandSlugs[brand]+'-'+code,
   existingCatalogProductId:existingCatalogIds[code]||null,
   brand,name,volume,kind,variant,jan:null,sku:null,
   aliases:Object.freeze([brand+' '+name, ...(volume?[name+' '+volume,brand+' '+name+' '+volume]:[]),...(code==='enzyme-wash'?['酵素洗顔パウダー',brand+' 酵素洗顔パウダー']:[])]),
   url,registrationStatus:'name-only',rightsStatus:'reference-link-only',
   sourceScope:'japan-official-brand-lineup-name-only',
   sourceCheckedOn:verifiedOn,
   sourceListingNote:['moist-lotion-light115','white-lotion-light100'].includes(code)?'公式掲載に「なくなり次第終了」の注記あり。現在の在庫・終売日は未確認。':null,
   productIdentityNote:(kind==='unsure'?'製品区分は未確認です。':'')+'メーカー公式の日本語商品ページで名称を確認した検索用の候補です。国内向け法定日本語全成分・JAN・実物ラベル・最新ロットは未確認で、花の自動生成対象ではありません。販売状況は掲載時点と異なる場合があります。'
 }))));
export const namesByBrandRC188=Object.freeze(Object.fromEntries(Object.keys(rawGroups).map(b=>
 [b,Object.freeze(officialNameOnlyRC188.filter(p=>p.brand===b))])));
export const makerSourcesRC188=Object.freeze({
 'ルシェリ':'https://maison.kose.co.jp/site/lecheri/c/c53/',
 'プロメディアル':'https://www.shop.rohto.co.jp/category/skincare/promedial',
 'ブルーミオ':'https://www.shop.rohto.co.jp/category/skincare/bloomio'
});
const otherNames=Object.freeze({'promedial':'プロメディアル','lecheri':'ルシェリ','bloomio':'ブルーミオ'});
function exactBrand(q){return namesByBrandRC188[q]?q:otherNames[q]||null;}
export function nameOnlyProductsForBrandRC188(brand){
 return namesByBrandRC188[exactBrand(productFold(brand))||brand]||[];
}
export function nameOnlyMatchesRC188(query){
 const folded=productFold(query);
 if(!folded)return [];
 const direct=exactBrand(folded);
 if(direct)return nameOnlyProductsForBrandRC188(direct);
 const prefix=Object.keys(namesByBrandRC188).map(productFold).concat(Object.keys(otherNames))
   .sort((a,b)=>b.length-a.length).find(b=>folded.startsWith(b));
 const needle=prefix?folded.slice(prefix.length):folded;
 if(needle.length<(prefix?2:5))return [];
 const generic=new Set(['クレンジング','化粧水','ローション','セラム','クリーム','美容液','乳液','洗顔']);
 if(!prefix&&generic.has(needle))return [];
 const pool=prefix?nameOnlyProductsForBrandRC188(exactBrand(prefix)):officialNameOnlyRC188;
 return pool.filter(p=>[p.name,...p.aliases].some(x=>productFold(x).includes(needle)));
}
