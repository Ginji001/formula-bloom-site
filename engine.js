import {ingredientJapanese} from './japanese.js';
export const SOURCE='https://www.chifure.co.jp/products/skinlotion/2871';
export const RULE='https://www.tmiph.metro.tokyo.lg.jp/k_yakuji/i-kanshi/c_label/';
export const groups=[['root','根','ベース骨格','水や油剤など、処方の土台。'],['stem','茎','構造・安定性','乳化・可溶化・増粘や品質維持を支える成分。'],['leaf','葉','保湿・保護','水分を抱えたり、肌を保護する成分。'],['petal','花びら','機能性・訴求','整肌など、特徴として語られる成分。効能の証明ではありません。'],['scent','香り','香り・使用感','香りや感触に関わる成分。実際の使用感は未確認。']];
const rows=[['水','root','基剤'],['グリセリン','leaf','保湿'],['DPG','leaf','保湿'],['BG','leaf','保湿'],['ヒアルロン酸Na','leaf','保湿'],['トレハロース','leaf','保湿'],['ラウロイルグルタミン酸ジ(フィトステリル/オクチルドデシル)','leaf','油性エモリエント'],['トリエチルヘキサノイン','root','油性エモリエント'],['トリイソステアリン酸PEG-50水添ヒマシ油','stem','乳化'],['セテス-20','stem','乳化'],['PEG-60水添ヒマシ油','stem','可溶化'],['メチルパラベン','stem','防腐'],['プロピルパラベン','stem','防腐'],['リンゴ酸Na','stem','pH調整'],['リンゴ酸','stem','pH調整'],['トコフェロール','stem','成分の酸化防止']];
export const normalize=s=>s.normalize('NFKC').replace(/[‐‑–−ー]/g,'-').replace(/\s/g,'').toLowerCase();
const dictionary=new Map(rows.map(([name,group,role])=>[normalize(name),{group,role,evidence:'メーカー公表の配合目的に基づく説明。別製品での役割は推定。',url:SOURCE}]));
const general=[['エタノール','root','溶剤'],['スクワラン','root','エモリエント'],['ミネラルオイル','root','エモリエント'],['ジメチコン','scent','感触調整・保護'],['カルボマー','stem','増粘'],['キサンタンガム','stem','増粘'],['フェノキシエタノール','stem','防腐'],['ナイアシンアミド','petal','整肌'],['パンテノール','petal','整肌'],['アラントイン','petal','整肌'],['香料','scent','着香'],['セラミドNP','leaf','肌の保護'],['セラミドAP','leaf','肌の保護'],['セラミドEOP','leaf','肌の保護']];
for(const [name,group,role] of general)dictionary.set(normalize(name),{group,role,evidence:'一般的な用途からの推定。製品中の目的・効果は未確認。',url:'https://single-market-economy.ec.europa.eu/sectors/cosmetics/cosmetic-ingredient-database_en'});
const aliases={'Water':'水','Aqua':'水','Water/Aqua':'水','Aqua/Water':'水','Water / Aqua / Eau':'水','Water (Aqua)':'水','Glycerin':'グリセリン','Butylene Glycol':'BG','Dipropylene Glycol':'DPG','Sodium Hyaluronate':'ヒアルロン酸Na','Panthenol':'パンテノール','Allantoin':'アラントイン','Carbomer':'カルボマー','Xanthan Gum':'キサンタンガム','Niacinamide':'ナイアシンアミド','Tocopherol':'トコフェロール','Phenoxyethanol':'フェノキシエタノール','Fragrance':'香料','Parfum':'香料','정제수':'水','글리세린':'グリセリン','부틸렌글라이콜':'BG','나이아신아마이드':'ナイアシンアミド','판테놀':'パンテノール','알란토인':'アラントイン','카보머':'カルボマー','향료':'香料'};
for(const [alias,name] of Object.entries(aliases)){const entry=dictionary.get(normalize(name));if(entry)dictionary.set(normalize(alias),{...entry,displayName:name,evidence:'表示名を対応付けた一般的用途の推定。配合目的・製品効果は未確認。'});}
// 海外公式表示で頻出するINCI名。一般的な用途であり、各製品における配合目的・効果の裏付けではない。
const commonInciRoles=[
  ['1,2-Hexanediol','leaf','保湿・溶剤'],
  ['Betaine','leaf','保湿'],
  ['Isopentyldiol','leaf','保湿・溶剤'],
  ['Pentylene Glycol','leaf','保湿・溶剤'],
  ['Propanediol','leaf','保湿・溶剤'],
  ['Ethylhexylglycerin','leaf','保湿・皮膚コンディショニング'],
  ['Acrylates/C10-30 Alkyl Acrylate Crosspolymer','stem','増粘・安定化'],
  ['Disodium EDTA','stem','キレート'],
  ['Tromethamine','stem','pH調整'],
  ['Hydroxyethylcellulose','stem','増粘'],
  ['Citric Acid','stem','pH調整'],
  ['Sodium Citrate','stem','pH調整'],
  ['Polysorbate 20','stem','可溶化'],
  ['PEG-40 Hydrogenated Castor Oil','stem','可溶化'],
  ['Houttuynia Cordata Flower/Leaf/Stem Water','root','植物由来の水性原料'],
  ['Sea Water','root','水系原料'],
  ['Centella Asiatica Extract','petal','整肌用途の植物エキス'],
  ['Hydroxypropyltrimonium Hyaluronate','leaf','保湿・皮膚コンディショニング'],
  ['Hydrolyzed Hyaluronic Acid','leaf','保湿'],
  ['Sodium Acetylated Hyaluronate','leaf','保湿'],
  ['Hyaluronic Acid','leaf','保湿'],
  ['Sodium Hyaluronate Crosspolymer','leaf','保湿'],
  ['Potassium Hyaluronate','leaf','保湿'],
  ['Sodium PCA','leaf','保湿'],
  ['Snail Secretion Filtrate','petal','皮膚コンディショニング'],
  ['Sodium Polyacrylate','stem','増粘・皮膜形成'],
  ['Ethyl Hexanediol','root','溶剤'],
  ['Arginine','stem','pH調整など'],
  ['Glycereth-26','leaf','保湿'],
  ['Diphenyl Dimethicone','scent','感触調整・エモリエント'],
  ['Hydroxyacetophenone','stem','成分の酸化防止など'],
  ['Hydrogenated Lecithin','stem','乳化補助'],
  ['Polyglyceryl-10 Oleate','stem','乳化・可溶化'],
  ['Polyglyceryl-10 Laurate','stem','乳化・可溶化'],
  ['Octyldodeceth-16','stem','可溶化'],
  ['Dipotassium Glycyrrhizate','petal','皮膚コンディショニング'],
  ['Madecassoside','petal','皮膚コンディショニング'],
  ['Asiaticoside','petal','皮膚コンディショニング'],
  ['Madecassic Acid','petal','皮膚コンディショニング'],
  ['Asiatic Acid','petal','皮膚コンディショニング'],
  ['Cellulose Gum','stem','増粘・安定化'],
  ['Trehalose','leaf','保湿'],['Beta-Glucan','leaf','保湿・皮膚コンディショニング'],
  ['Hydrolyzed Sodium Hyaluronate','leaf','保湿'],['Hydroxypropyltrimonium Hyaluronate','leaf','保湿・皮膚コンディショニング'],
  ['Cholesterol','leaf','エモリエント'],['Adenosine','petal','皮膚コンディショニング'],
  ['Polyquaternium-51','stem','皮膜形成'],['Glyceryl Caprylate','stem','乳化補助'],
  ['Caprylyl Glycol','leaf','保湿・溶剤'],['Propylene Glycol','leaf','保湿・溶剤'],
  ['Mannitol','leaf','保湿'],['Sodium Stearoyl Glutamate','stem','乳化補助'],
  ['Sodium Metaphosphate','stem','キレート'],['Sodium Trimetaphosphate','stem','安定化など'],
  ['Phytosterols','leaf','エモリエント'],['Lecithin','stem','乳化補助'],
  ['Lauryl Glucoside','stem','界面活性・乳化補助'],['Myristyl Glucoside','stem','界面活性・乳化補助'],
  ['Glyceryl Oleate','stem','乳化補助'],['Polyglyceryl-6 Laurate','stem','可溶化・乳化補助'],
  ['Polyglyceryl-10 Stearate','stem','乳化補助'],['Sorbitan Isostearate','stem','乳化補助'],
  ['Polyglycerin-3','leaf','保湿'],['Hydrogenated Rice Bran Oil','root','エモリエント'],
  ['Camellia Sinensis Seed Oil','root','エモリエント'],
  ['Portulaca Oleracea Extract','petal','皮膚コンディショニング'],
  ['Scutellaria Baicalensis Root Extract','petal','皮膚コンディショニング'],
  ['Avena Sativa (Oat) Kernel Extract','petal','皮膚コンディショニング'],
  ['Cynara Scolymus (Artichoke) Leaf Extract','petal','皮膚コンディショニング'],
  ['Olea Europaea (Olive) Fruit Oil','root','エモリエント'],
  ['Rosmarinus Officinalis (Rosemary) Leaf Extract','petal','皮膚コンディショニング'],
  ['Rosmarinus Officinalis (Rosemary) Leaf Oil','scent','芳香・皮膚コンディショニング'],
  ['Paeonia Suffruticosa Root Extract','petal','皮膚コンディショニング'],
  ['PVM/MA Copolymer','stem','皮膜形成'],
  ['Ammonium Acryloyldimethyltaurate/VP Copolymer','stem','増粘・安定化'],
  ['PPG-13-Decyltetradeceth-24','stem','界面活性・可溶化'],
  ['Acetyl Tetrapeptide-2','petal','皮膚コンディショニング'],
  ['Hydroxyethyl Acrylate/Sodium Acryloyldimethyl Taurate Copolymer','stem','増粘・安定化'],
  ['Lavandula Hybrida Oil','scent','芳香'],
  ['Salvia Hispanica Seed Extract','petal','皮膚コンディショニング'],
  ['Linum Usitatissimum (Linseed) Seed Extract','petal','皮膚コンディショニング'],
  ['Pogostemon Cablin Oil','scent','芳香'],['Salvia Officinalis (Sage) Oil','scent','芳香'],
  ['Citrus Aurantium Bergamia (Bergamot) Fruit Oil','scent','芳香'],
  ['Citrus Sinensis (Orange) Peel Oil','scent','芳香'],
  ['Hydroxypropyl Starch Phosphate','stem','増粘・安定化'],
  ['Sodium Polyacryloyldimethyl Taurate','stem','増粘・安定化'],
  ['Acrylates/C10-30 Alkyl Acrylate Crosspolymer','stem','増粘・安定化'],
  ['Hydrogenated Polyisobutene','root','エモリエント'],
  ['Cetyl Alcohol','stem','乳化補助・増粘'],['Stearyl Alcohol','stem','乳化補助・増粘'],
  ['Cetearyl Alcohol','stem','乳化補助・増粘'],
  ['Glyceryl Stearate','stem','乳化補助'],['Glyceryl Stearate SE','stem','乳化補助'],
  ['Ceteareth-20','stem','界面活性・乳化補助'],
  ['Butyrospermum Parkii (Shea) Butter','root','エモリエント'],
  ['Tocopheryl Acetate','stem','酸化防止など'],['Sodium Benzoate','stem','防腐'],
  ['Potassium Sorbate','stem','防腐'],['Sodium Hydroxide','stem','pH調整'],
  ['Phytic Acid','stem','キレート'],['Sodium Phytate','stem','キレート'],
  ['Glycine Soja (Soybean) Oil','root','エモリエント'],
  ['Jojoba Esters','root','エモリエント'],['Simmondsia Chinensis (Jojoba) Seed Oil','root','エモリエント'],
  ['Sodium Chloride','stem','粘度調整'],['Sodium Lactate','leaf','保湿'],
  ['Lactic Acid','stem','pH調整・保湿'],
  ['Urea','leaf','保湿'],['Aloe Barbadensis Leaf Juice','petal','皮膚コンディショニング'],
  ['Oryza Sativa (Rice) Bran Oil','root','エモリエント'],
  ['Oryza Sativa (Rice) Extract','petal','皮膚コンディショニング'],
  ['Mica','scent','感触・着色'],['Titanium Dioxide','scent','着色・紫外線散乱'],
  ['Iron Oxides','scent','着色'],
  ['Triethylhexanoin','root','エモリエント'],
  ['アスコルビン酸','petal','整肌・成分の酸化防止など'],
  ['Ascorbic Acid','petal','整肌・成分の酸化防止など'],
  ['アスコルビルグルコシド','petal','整肌・製品の特徴となる成分'],
  ['Ascorbyl Glucoside','petal','整肌・製品の特徴となる成分'],
  ['Sodium Ascorbyl Phosphate','petal','整肌・成分の酸化防止など'],
  ['リン酸アスコルビルMg','petal','整肌・製品の特徴となる成分'],
  ['3-O-Ethyl Ascorbic Acid','petal','整肌・製品の特徴となる成分'],
  ['Tetrahexyldecyl Ascorbate','petal','整肌・製品の特徴となる成分'],
];
for(const [name,group,role] of commonInciRoles)dictionary.set(normalize(name),{
  group,role,evidence:'一般的な配合用途に基づく推定。個別文献の確認、当該製品中の配合目的・濃度・効果は未確認。',
  url:'https://single-market-economy.ec.europa.eu/sectors/cosmetics/cosmetic-ingredient-database_en'
});
export const product={name:'ちふれ 保湿化粧水 とてもしっとりタイプ',date:'2026-10-28',source:SOURCE,order:'メーカーの目的別表・配合順ではありません',ingredients:rows.map(r=>r[0]).join('、')};
export function splitIngredients(input){let depth=0,current='',out=[];const text=input.normalize('NFKC').replace(/^\s*(全成分|成分)\s*[:：]?/,'').trim();for(let i=0;i<text.length;i++){const c=text[i];if('(['.includes(c))depth++;if(')]'.includes(c))depth=Math.max(0,depth-1);const numericComma=c===','&&/\d/.test(text[i-1]||'')&&/\d/.test(text[i+1]||'');if(depth===0&&!numericComma&&'、,，\n;；'.includes(c)){if(current.trim())out.push(current.trim());current='';}else current+=c;}if(current.trim())out.push(current.trim());return out;}
export function analyze(input){const names=splitIngredients(input);if(!names.length)throw Error('全成分を入力してください。');if(input.length>20000||names.length>300)throw Error('300成分・20,000文字以内で入力してください。');return names.map((name,index)=>{const entry=dictionary.get(normalize(name))||{group:'unknown',role:'未確認',evidence:'辞書に未収録。誤読・表記違いも考えられます。',url:null};const translated=ingredientJapanese(name)||entry.displayName;return {name,index,...entry,displayName:translated&&normalize(translated)!==normalize(name)?translated:undefined};});}
export function pickIngredientVariant(variants,query){
  if(!Array.isArray(variants)||!query)return null;
  if(variants.length===1)return variants[0];
  if(/^https?:/i.test(query.trim()))return null;
  // A shared official page may list several formulas; only auto-select
  // when every explicit search word identifies exactly one named formula.
  const words=query.normalize('NFKC').replace(/^(?:トゥヴェール|TOUT\s*VERT|ちふれ|キュレル)\s*/i,'')
    .trim().split(/\s+/).map(normalize).filter(Boolean);
  if(!words.length)return null;
  const matched=variants.filter(v=>words.every(word=>normalize(String(v.label||'')).includes(word)));
  return matched.length===1?matched[0]:null;
}
export function pickAutomaticProduct(results,query){if(results[0]?.searchName)query=results[0].searchName;const q=normalize(query.replace(/ちふれ|chifure|オルビス|orbis|ファンケル|fancl/gi,''));const exact=results.filter(x=>x.officialVerified&&normalize(x.name.replace(/ちふれ|chifure|オルビス|orbis|ファンケル|fancl/gi,''))===q);const products=exact.filter(x=>/\/(?:item|small|products)\//.test(new URL(x.url).pathname));if(products.length===1)return products[0];if(exact.length===1)return exact[0];return results.length===1&&results[0].officialVerified?results[0]:null;}
