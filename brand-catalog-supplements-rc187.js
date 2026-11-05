// rc187: 53 manufacturer-listed Japanese product names across five previously empty brands.
// Product-name lookup ONLY: no INCI, Japanese ingredient list, JAN, shade, current lot or approval inferred.
import {productFold} from './registered-products.js';
const checked='2026-11-06';
const definitions={
  "米肌": {
    "url": "https://maison.kose.co.jp/site/mk_maihada/c/c4710/",
    "rows": [
      [
        "moist-lotion",
        "肌潤化粧水",
        null,
        "cosmetic"
      ],
      [
        "moist-lotion-refill",
        "肌潤化粧水（つめかえ用）",
        null,
        "cosmetic"
      ],
      [
        "whitening-lotion",
        "肌潤美白化粧水",
        null,
        "quasi"
      ],
      [
        "whitening-lotion-refill",
        "肌潤美白化粧水（つめかえ用）",
        null,
        "quasi"
      ],
      [
        "moist-essence",
        "肌潤改善エッセンス",
        null,
        "quasi"
      ],
      [
        "moist-cream",
        "肌潤クリーム",
        null,
        "cosmetic"
      ],
      [
        "moist-gel-cream",
        "肌潤ジェルクリーム",
        null,
        "cosmetic"
      ],
      [
        "face-wash",
        "肌潤洗顔クリーム",
        null,
        "cosmetic"
      ],
      [
        "clear-cleansing",
        "澄肌クレンジングオイル",
        null,
        "cosmetic"
      ],
      [
        "lift-lotion",
        "活潤リフト化粧水",
        null,
        "cosmetic"
      ],
      [
        "lift-lotion-refill",
        "活潤リフト化粧水（つめかえ用）",
        null,
        "cosmetic"
      ],
      [
        "moist-oil",
        "肌潤トリートメントオイル",
        null,
        "cosmetic"
      ],
      [
        "clear-essence",
        "澄肌クリアエッセンス",
        null,
        "cosmetic"
      ]
    ]
  },
  "インフィニティ": {
    "url": "https://maison.kose.co.jp/site/infinity/c/c041020/",
    "rows": [
      [
        "repair-lotion120",
        "ザ リペア ローション",
        "120mL",
        "quasi"
      ],
      [
        "repair-lotion180",
        "ザ リペア ローション",
        "180mL",
        "quasi"
      ],
      [
        "repair-lotion-refill170",
        "ザ リペア ローション（つめかえ用）",
        "170mL",
        "quasi"
      ],
      [
        "bright-lotion",
        "イノベイティブ ブライト ローション XX",
        null,
        "quasi"
      ],
      [
        "bright-lotion-refill",
        "イノベイティブ ブライト ローション XX（つめかえ用）",
        null,
        "quasi"
      ],
      [
        "wrinkle-lotion",
        "インテンシブ リンクル ローション",
        null,
        "cosmetic"
      ],
      [
        "astringent",
        "アストリンゼント N",
        null,
        "cosmetic"
      ],
      [
        "astringent-refill",
        "アストリンゼント N（付けかえ用）",
        null,
        "cosmetic"
      ]
    ]
  },
  "雪肌精BLUE": {
    "url": "https://maison.kose.co.jp/site/sekkiseiblue/c/c88/",
    "rows": [
      [
        "deep-liquid1",
        "ディープ ハイドレイティング エッセンス リキッド Ⅰ",
        null,
        "cosmetic"
      ],
      [
        "deep-liquid2",
        "ディープ ハイドレイティング エッセンス リキッド Ⅱ",
        null,
        "cosmetic"
      ],
      [
        "bounce-oil",
        "バウンス バランシング オイル",
        null,
        "cosmetic"
      ],
      [
        "lively-oil",
        "ライブリー バランシング オイル",
        null,
        "cosmetic"
      ],
      [
        "hydro-oil",
        "ハイドロ バランシング オイル",
        null,
        "cosmetic"
      ],
      [
        "cleansing-oil",
        "クリア ソフニング クレンジング オイル",
        null,
        "cosmetic"
      ],
      [
        "cleansing-gel",
        "メルティ オフ クレンジング ジェル",
        null,
        "cosmetic"
      ],
      [
        "charcoal-wash",
        "チャコール スクラブ ウォッシュ",
        null,
        "cosmetic"
      ],
      [
        "moist-wash",
        "モイスト ステイ ジェル ウォッシュ",
        null,
        "cosmetic"
      ],
      [
        "clarifying-toner",
        "クラリファイング トナー",
        null,
        "cosmetic"
      ],
      [
        "bright-refiner30",
        "ブライト リファイナー",
        "30mL",
        "cosmetic"
      ],
      [
        "bright-refiner50",
        "ブライト リファイナー",
        "50mL",
        "cosmetic"
      ],
      [
        "bright-refiner-refill50",
        "ブライト リファイナー（付けかえ用）",
        "50mL",
        "cosmetic"
      ],
      [
        "smooth-cream",
        "スムース ハイドレイティング クリーム",
        null,
        "cosmetic"
      ],
      [
        "timeless-serum30",
        "タイムレス ラディアント セラム",
        "30mL",
        "cosmetic"
      ],
      [
        "timeless-serum50",
        "タイムレス ラディアント セラム",
        "50mL",
        "cosmetic"
      ],
      [
        "timeless-serum-refill50",
        "タイムレス ラディアント セラム（つめかえ用）",
        "50mL",
        "cosmetic"
      ]
    ]
  },
  "PrediaBLUE": {
    "url": "https://maison.kose.co.jp/site/prediablue/c/c89_dL/",
    "rows": [
      [
        "headclay250",
        "リペア ヘッドクレンズ クレイ",
        "250g",
        "cosmetic"
      ],
      [
        "headclay-refill500",
        "リペア ヘッドクレンズ クレイ（つめかえ用）",
        "500g",
        "cosmetic"
      ],
      [
        "cleanse-clay150",
        "クレンジング クレイ",
        "150g",
        "cosmetic"
      ],
      [
        "washing-clay",
        "ウォッシング クレイ",
        null,
        "cosmetic"
      ],
      [
        "shampoo-clay300",
        "シャンプー クレイ",
        "300mL",
        "cosmetic"
      ],
      [
        "hairmask-refill500",
        "ヘアマスク クレイ（つめかえ用）",
        "500g",
        "cosmetic"
      ],
      [
        "hairserum",
        "ヘアセラム シー リニュー",
        null,
        "cosmetic"
      ],
      [
        "shampoo-renew500",
        "シャンプー シー リニュー",
        "500mL",
        "cosmetic"
      ],
      [
        "shampoo-renew-refill400",
        "シャンプー シー リニュー（つめかえ用）",
        "400mL",
        "cosmetic"
      ],
      [
        "shampoo-renew300",
        "シャンプー シー リニュー",
        "300mL",
        "cosmetic"
      ],
      [
        "body-pate",
        "ボディ クレンジング パテ",
        null,
        "cosmetic"
      ]
    ]
  },
  "エスプリーク エクラ": {
    "url": "https://maison.kose.co.jp/site/espriqueeclat/c/c06/",
    "rows": [
      [
        "lift-bb",
        "リフト BB クリーム",
        null,
        "cosmetic"
      ],
      [
        "pact-ex-refill",
        "明るさ持続 パクト EX（レフィル）",
        null,
        "cosmetic"
      ],
      [
        "essence-base-ex",
        "明るさ持続 美容液下地 EX",
        null,
        "cosmetic"
      ],
      [
        "bb-liquid-uv",
        "明るさ持続 BB リキッド UV",
        null,
        "cosmetic"
      ]
    ]
  }
};
export const makerSourcesRC187=Object.freeze(Object.fromEntries(Object.entries(definitions).map(([brand,x])=>[brand,x.url])));
export const officialNameOnlyRC187=Object.freeze(Object.entries(definitions).flatMap(([brand,group])=>group.rows.map(([code,name,volume,kind])=>Object.freeze({
 id:'rc187-'+({'米肌':'maihada','インフィニティ':'infinity','雪肌精BLUE':'sekkiseiblue','PrediaBLUE':'prediablue','エスプリーク エクラ':'espriqueeclat'}[brand])+'-'+code,
 brand,name,volume,kind,jan:null,sku:null,variant:null,
 aliases:Object.freeze([brand+' '+name,...(volume?[brand+' '+name+' '+volume]:[])]),
 url:group.url,registrationStatus:'name-only',rightsStatus:'reference-link-only',
 sourceScope:'japan-official-brand-lineup-name-only',sourceCheckedOn:checked,
 productIdentityNote:'日本のメーカー公式商品一覧で名称を確認した検索用候補です。容量は一覧で個別に確かめた場合のみ表示。色番・JAN・国内向けの法定全成分・現物ラベル・最新ロットは未確認で、花の自動生成対象ではありません。'
}))));
export const namesByBrandRC187=Object.freeze(Object.fromEntries(Object.keys(definitions).map(b=>[b,Object.freeze(officialNameOnlyRC187.filter(p=>p.brand===b))])));
const brandKeys=Object.freeze({...Object.fromEntries(Object.keys(definitions).map(b=>[productFold(b),b])),[productFold('雪肌精 BLUE')]:'雪肌精BLUE',[productFold('Prédia BLUE')]:'PrediaBLUE',[productFold('Predia BLUE')]:'PrediaBLUE',[productFold('米肌（まいはだ）')]:'米肌'});
function explicitBrand(q){return brandKeys[q]||null;}
export function nameOnlyProductsForBrandRC187(brand){return namesByBrandRC187[explicitBrand(productFold(brand))||brand]||[];}
export function nameOnlyMatchesRC187(query){
 const q=productFold(query);if(!q)return [];
 const direct=explicitBrand(q);if(direct)return nameOnlyProductsForBrandRC187(direct);
 const prefix=Object.keys(brandKeys).sort((a,b)=>b.length-a.length).find(b=>q.startsWith(b));
 const term=prefix?q.slice(prefix.length):q;
 if(term.length<5||!prefix&&['クレンジング','化粧水','美容液','ローション','セラム','クリーム','ファンデーション','シャンプー','乳液','洗顔'].includes(term))return [];
 const pool=prefix?nameOnlyProductsForBrandRC187(brandKeys[prefix]):officialNameOnlyRC187;
 return pool.filter(p=>[p.name,...p.aliases,...(p.volume?[p.name+' '+p.volume]:[])].some(x=>productFold(x).includes(term)));
}
