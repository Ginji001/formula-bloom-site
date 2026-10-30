// 日本語表示補助。一般的な成分名だけを明示的に対応付け、未知の名称は推測翻訳しない。
// 公式の英語・韓国語原文を常に保持する。日本の医薬部外品の承認名称は保証しない。
const pairs=[
 ['Water','水'],['Aqua','水'],['Aqua/Water','水'],['Water/Aqua','水'],['Water / Aqua / Eau','水'],['Purified Water','水'],
 ['Glycerin','グリセリン'],['Butylene Glycol','BG'],['Dipropylene Glycol','DPG'],['Propanediol','プロパンジオール'],
 ['1,2-Hexanediol','1,2-ヘキサンジオール'],['Pentylene Glycol','ペンチレングリコール'],
 ['Betaine','ベタイン'],['Methylpropanediol','メチルプロパンジオール'],
 ['Sodium Hyaluronate','ヒアルロン酸Na'],['Hyaluronic Acid','ヒアルロン酸'],['Hydrolyzed Hyaluronic Acid','加水分解ヒアルロン酸'],
 ['Sodium Acetylated Hyaluronate','アセチルヒアルロン酸Na'],['Sodium Hyaluronate Crosspolymer','ヒアルロン酸クロスポリマーNa'],
 ['Sodium PCA','PCA-Na'],['Panthenol','パンテノール'],['Allantoin','アラントイン'],['Niacinamide','ナイアシンアミド'],
 ['Centella Asiatica Extract','ツボクサエキス'],['Houttuynia Cordata Extract','ドクダミエキス'],
 ['Snail Secretion Filtrate','カタツムリ分泌液'],['Camellia Sinensis Leaf Extract','チャ葉エキス'],
 ['Madecassoside','マデカッソシド'],['Asiaticoside','アシアチコシド'],['Madecassic Acid','マデカシン酸'],['Asiatic Acid','アシアチン酸'],
 ['Dipotassium Glycyrrhizate','グリチルリチン酸2K'],['Glycyrrhiza Glabra (Licorice) Root Extract','カンゾウ根エキス'],
 ['Cellulose Gum','セルロースガム'],['Carbomer','カルボマー'],['Xanthan Gum','キサンタンガム'],
 ['Hydroxyethylcellulose','ヒドロキシエチルセルロース'],['Sodium Polyacrylate','ポリアクリル酸Na'],
 ['Phenoxyethanol','フェノキシエタノール'],['Ethylhexylglycerin','エチルヘキシルグリセリン'],
 ['Ethyl Hexanediol','エチルヘキサンジオール'],['Glycereth-26','グリセレス-26'],
 ['Disodium EDTA','EDTA-2Na'],['Tromethamine','トロメタミン'],['Citric Acid','クエン酸'],['Sodium Citrate','クエン酸Na'],
 ['Arginine','アルギニン'],['Tocopherol','トコフェロール'],['Hydrogenated Lecithin','水添レシチン'],
 ['Polysorbate 20','ポリソルベート20'],['PEG-40 Hydrogenated Castor Oil','PEG-40水添ヒマシ油'],
 ['Polyglyceryl-10 Oleate','オレイン酸ポリグリセリル-10'],['Polyglyceryl-10 Laurate','ラウリン酸ポリグリセリル-10'],
 ['Caprylic/Capric Triglyceride','トリ（カプリル酸／カプリン酸）グリセリル'],
 ['Squalane','スクワラン'],['Dimethicone','ジメチコン'],['Cyclohexasiloxane','シクロヘキサシロキサン'],
 ['Ceramide NP','セラミドNP'],['Ceramide AP','セラミドAP'],['Ceramide EOP','セラミドEOP'],
 ['Fragrance','香料'],['Parfum','香料'],['Alcohol','エタノール'],['Ethanol','エタノール'],
 ['Ascorbic Acid','アスコルビン酸'],['Ascorbyl Glucoside','アスコルビルグルコシド'],
 ['Sodium Ascorbyl Phosphate','リン酸アスコルビルNa'],['3-O-Ethyl Ascorbic Acid','3-O-エチルアスコルビン酸'],
 ['Trehalose','トレハロース'],['Beta-Glucan','β-グルカン'],['Hydrolyzed Sodium Hyaluronate','加水分解ヒアルロン酸Na'],
 ['Hydroxypropyltrimonium Hyaluronate','ヒアルロン酸ヒドロキシプロピルトリモニウム'],
 ['Hydroxyacetophenone','ヒドロキシアセトフェノン'],['Cholesterol','コレステロール'],['Adenosine','アデノシン'],
 ['Polyquaternium-51','ポリクオタニウム-51'],['Glyceryl Caprylate','カプリル酸グリセリル'],
 ['Caprylyl Glycol','カプリリルグリコール'],['Propylene Glycol','PG'],
 ['Mannitol','マンニトール'],['Sodium Stearoyl Glutamate','ステアロイルグルタミン酸Na'],
 ['Sodium Metaphosphate','メタリン酸Na'],['Sodium Trimetaphosphate','トリメタリン酸Na'],
 ['Phytosterols','フィトステロールズ'],['Lecithin','レシチン'],['Lauryl Glucoside','ラウリルグルコシド'],
 ['Myristyl Glucoside','ミリスチルグルコシド'],['Glyceryl Oleate','オレイン酸グリセリル'],
 ['Polyglyceryl-6 Laurate','ラウリン酸ポリグリセリル-6'],
 ['Polyglyceryl-10 Stearate','ステアリン酸ポリグリセリル-10'],
 ['Sorbitan Isostearate','イソステアリン酸ソルビタン'],['Polyglycerin-3','ポリグリセリン-3'],
 ['Hydrogenated Rice Bran Oil','水添コメヌカ油'],['Camellia Sinensis Seed Oil','チャ種子油'],
 ['Portulaca Oleracea Extract','スベリヒユエキス'],['Scutellaria Baicalensis Root Extract','オウゴン根エキス'],
 ['Avena Sativa (Oat) Kernel Extract','カラスムギ穀粒エキス'],
 ['Cynara Scolymus (Artichoke) Leaf Extract','アーチチョーク葉エキス'],
 ['Olea Europaea (Olive) Fruit Oil','オリーブ果実油'],
 ['Rosmarinus Officinalis (Rosemary) Leaf Extract','ローズマリー葉エキス'],
 ['Rosmarinus Officinalis (Rosemary) Leaf Oil','ローズマリー葉油'],
 ['Paeonia Suffruticosa Root Extract','ボタンエキス'],['PVM/MA Copolymer','PVM/MAコポリマー'],
 ['Ammonium Acryloyldimethyltaurate/VP Copolymer','（アクリロイルジメチルタウリンアンモニウム／VP）コポリマー'],
 ['PPG-13-Decyltetradeceth-24','PPG-13デシルテトラデセス-24'],
 ['Acetyl Tetrapeptide-2','アセチルテトラペプチド-2'],
 ['Hydroxyethyl Acrylate/Sodium Acryloyldimethyl Taurate Copolymer','（アクリル酸ヒドロキシエチル／アクリロイルジメチルタウリンNa）コポリマー'],
 ['Lavandula Hybrida Oil','ラバンデュラハイブリダ油'],
 ['Salvia Hispanica Seed Extract','サルビアヒスパニカ種子エキス'],
 ['Linum Usitatissimum (Linseed) Seed Extract','アマ種子エキス'],
 ['Pogostemon Cablin Oil','パチョリ油'],['Salvia Officinalis (Sage) Oil','セージ油'],
 ['Citrus Aurantium Bergamia (Bergamot) Fruit Oil','ベルガモット果実油'],
 ['Citrus Sinensis (Orange) Peel Oil','オレンジ果皮油'],
 ['Hydroxypropyl Starch Phosphate','ヒドロキシプロピルデンプンリン酸'],
 ['Sodium Polyacryloyldimethyl Taurate','ポリアクリロイルジメチルタウリンNa'],
 ['Acrylates/C10-30 Alkyl Acrylate Crosspolymer','（アクリレーツ／アクリル酸アルキル（C10-30））クロスポリマー'],
 ['Hydrogenated Polyisobutene','水添ポリイソブテン'],
 ['Cetyl Alcohol','セタノール'],['Stearyl Alcohol','ステアリルアルコール'],
 ['Cetearyl Alcohol','セテアリルアルコール'],
 ['Glyceryl Stearate','ステアリン酸グリセリル'],['Glyceryl Stearate SE','ステアリン酸グリセリル（SE）'],
 ['Ceteareth-20','セテアレス-20'],['Butyrospermum Parkii (Shea) Butter','シア脂'],
 ['Tocopheryl Acetate','酢酸トコフェロール'],['Sodium Benzoate','安息香酸Na'],
 ['Potassium Sorbate','ソルビン酸K'],['Sodium Hydroxide','水酸化Na'],
 ['Phytic Acid','フィチン酸'],['Sodium Phytate','フィチン酸Na'],
 ['Glycine Soja (Soybean) Oil','ダイズ油'],
 ['Jojoba Esters','ホホバエステル'],['Simmondsia Chinensis (Jojoba) Seed Oil','ホホバ種子油'],
 ['Sodium Chloride','塩化Na'],['Sodium Lactate','乳酸Na'],
 ['Lactic Acid','乳酸'],['Urea','尿素'],
 ['Aloe Barbadensis Leaf Juice','アロエベラ液汁'],
 ['Oryza Sativa (Rice) Bran Oil','コメヌカ油'],['Oryza Sativa (Rice) Extract','コメエキス'],
 ['Mica','マイカ'],['Titanium Dioxide','酸化チタン'],['Iron Oxides','酸化鉄'],
 ['Daucus Carota Sativa (Carrot) Root Extract','ニンジン根エキス']
];
const norm=s=>String(s||'').normalize('NFKC').trim().toLowerCase().replace(/\s+/g,' ');
const ingredientMap=new Map(pairs.map(([en,ja])=>[norm(en),ja]));
export function ingredientJapanese(original){
  return typeof original==='string'?ingredientMap.get(norm(original))||null:null;
}
export const ingredientJapaneseCount=ingredientMap.size;

// 英語の商品名に対する検索補助訳。正式な国内商品名を断定しない。
const productWords=[
 ['madagascar','マダガスカル'],['centella','センテラ'],['probio-cica','プロバイオシカ'],['teca','TECA'],
 ['madecassoside','マデカッソシド'],['heartleaf','ドクダミ'],['snail','スネイル'],['mucin','ムチン'],
 ['water bank','ウォーターバンク'],['green tea','グリーンティー'],['dive in','ダイブイン'],
 ['dark spot','ダークスポット'],['clean it zero','クリーンイットゼロ'],
 ['hyaluronic acid','ヒアルロン酸'],['hyaluronic','ヒアルロン酸'],['collagen','コラーゲン'],
 ['vitamin c','ビタミンC'],['carrot','キャロット'],['carotene','カロテン'],
 ['toner pad','トナーパッド'],['toner','トナー'],['ampoule','アンプル'],['serum','セラム'],
 ['essence','エッセンス'],['cream','クリーム'],['lotion','ローション'],['milk','ミルク'],
 ['mask','マスク'],['pad','パッド'],['cleansing','クレンジング'],['cleanser','洗顔料'],
 ['gel','ジェル'],['oil','オイル'],['soothing','スージング'],['intensive','インテンシブ'],
 ['barrier','バリア'],['repair','リペア'],['moisture','モイスチャー'],['hydrating','保湿'],
 ['sunscreen','日焼け止め'],['sun stick','サンスティック']
];
const productRules=productWords.map(([en,ja])=>[new RegExp('(^|[^a-z])('+en.replace(/ /g,'[\\s-]+')+')(?=$|[^a-z])','gi'),ja]);
export function productJapaneseAid(name){
  if(typeof name!=='string'||name.length>200)return null;
  let text=name,changes=0;
  for(const [pattern,ja] of productRules){
    text=text.replace(pattern,(_all,before)=>{changes++;return before+ja;});
  }
  return changes?text.trim():null;
}
export function japaneseBrandLabel(brand){
  if(!brand||typeof brand.name!=='string')return '';
  const aliases=Array.isArray(brand.aliases)?brand.aliases:[];
  const japanese=/[\u3040-\u30ff\u3400-\u9fff]/;
  const best=japanese.test(brand.name)?brand.name:aliases.find(a=>japanese.test(a));
  return best&&best!==brand.name?best+'（'+brand.name+'）':brand.name;
}
export function brandQueryMatches(brand,query){
  if(!brand)return false;
  const haystack=[brand.name,brand.maker,...(brand.aliases||[])].join(' ').normalize('NFKC').toLowerCase().replace(/\s/g,'');
  return haystack.includes(String(query||'').normalize('NFKC').toLowerCase().replace(/\s/g,''));
}
