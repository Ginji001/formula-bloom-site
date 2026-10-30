// Copies from a product page often contain storefront words, a size and a price.
// Keep the actual product name (including formula variants), never infer a formula.
const knownBrands=[
  ['トゥヴェール',/(?:トゥヴェール|TOUT\s*VERT)/i],
  ['ちふれ',/(?:ちふれ|CHIFURE)/i],
  ['キュレル',/(?:キュレル|Curel)/i],
  ['オルビス',/(?:オルビス|ORBIS)/i],
  ['ファンケル',/(?:ファンケル|FANCL)/i],
  ['アヌア',/(?:アヌア|ANUA)/i],
  ['トリデン',/(?:トリデン|Torriden)/i],
  ['メディヒール',/(?:メディヒール|MEDIHEAL)/i],
  ['資生堂',/(?:資生堂|SHISEIDO)/i],
];
const brandFrom=s=>knownBrands.find(([,pattern])=>pattern.test(s))?.[0]||'';
const dropLine=/^(?:販売価格|価格|税込価格|定価|ポイント|レビュー|口コミ|配送|送料|ランキング|在庫|購入|数量|カート|お気に入り|商品詳細|商品説明|評価|お気に入り登録|ブランド名|商品コード|JANコード|品番)\s*[:：]?/;
const onlyPrice=/^(?:[¥￥]\s*[\d,.]+(?:円)?|[\d,.]+\s*円(?:\s*\(税込\))?|\d+(?:\.\d+)?\s*(?:税込|税別))$/i;
const brandOnly=/^(?:トゥヴェール|TOUT\s*VERT|ちふれ|キュレル|Curel|アヌア|ANUA|トリデン|Torriden|オルビス|ファンケル|資生堂)(?:\s*公式(?:通販|サイト)?)?$/i;
const trailingNoise=/(?:\s*[（(]?\s*(?:送料無料|正規品|国内発送|ポイント\d+倍|即日発送|期間限定|日本国内配送|税込価格|特別価格|クーポン対象|レビュー高評価|お得なセット)\s*[)）]?\s*)+$/i;

export function cleanPastedProductName(input){
  const raw=String(input||'').normalize('NFKC').replace(/[\u200b-\u200d\ufeff]/g,'').trim();
  if(!raw)return '';
  // An official URL alone can be submitted through the normal official-URL flow.
  if(/^https?:\/\/\S+$/i.test(raw))return raw;
  const lines=raw.split(/[\r\n]+/).map(s=>s.trim()).filter(Boolean);
  const line=lines.find(x=>!dropLine.test(x)&&!onlyPrice.test(x)&&!brandOnly.test(x)&&!/^https?:\/\//i.test(x)&&!/^[-ー―•*★☆◎]\s*$/.test(x)&&x.length>=3)||lines[0]||raw;
  const globalBrand=brandFrom(raw);
  let name=line
    .replace(/^(?:【[^】]{1,32}】|\[[^\]]{1,32}\]|[（(](?:公式|正規販売店|日本公式)[)）])\s*/g,'')
    .replace(/^(?:商品名|製品名|アイテム名|名称)\s*[:：]\s*/,'')
    .replace(/^\s*(?:商品情報|商品詳細|商品ページ)\s*[-:：]\s*/,'')
    .replace(/\s*(?:[|｜]\s*|[-–—]\s+)(?:[^|｜]{0,40}?(?:公式通販|公式オンライン|公式サイト|Qoo10|楽天市場|Amazon|Yahoo!ショッピング|ショップ|ストア|オンラインストア))\s*$/i,'')
    .replace(/\s*[|｜]\s*(?:トゥヴェール|ちふれ|キュレル|Curel|ANUA|アヌア)(?:公式)?\s*$/i,'')
    .replace(/[（(]\s*\d+(?:\.\d+)?\s*(?:ml|mL|g|枚|個|本|包)(?:入り)?\s*[)）]/gi,' ')
    .replace(/(?:\s+|^)\d+(?:\.\d+)?\s*(?:ml|mL|g|枚|個|本|包)(?:入り)?(?=\s|$)/gi,' ')
    .replace(/[¥￥]\s*[\d,]+(?:\s*円)?/g,' ')
    .replace(/\s+(?:税込)?[\d,]{4,}円(?:\s*[（(]税込[)）])?/g,' ')
    .replace(/\b(?:[0-9]{1,2}[%％]OFF|送料無料|正規品|国内発送|クーポン|SALE|セール|ポイント\d+倍)\b/gi,' ')
    .replace(trailingNoise,'')
    .replace(/^[『「"'“”]+|[』」"'“”]+$/g,'')
    .replace(/\s+/g,' ').trim();
  if(!name)return '';
  if(globalBrand&&!brandFrom(name)&&!/^https?:\/\//.test(name))name=globalBrand+' '+name;
  return name.slice(0,100);
}
// Fallbacks must not lose a named formula variant such as モイスト / Ⅲ.
export function productNameQueries(input){
 const cleaned=cleanPastedProductName(input);
 if(!cleaned)return [];
 const queries=[cleaned];
 const brand=brandFrom(cleaned);
 if(brand){
   const noBrand=cleaned.replace(new RegExp('^'+brand+'\\s*','i'),'').trim();
   // If the brand is repeated or a site returned a redundant title, retry once without duplicate.
   if(noBrand&&noBrand!==cleaned&&cleaned.startsWith(brand+' '+brand))queries.push(brand+' '+noBrand.replace(new RegExp('^'+brand+'\\s*','i'),''));
 }
 return [...new Set(queries)].filter(x=>x.length>=2);
}
