// 入力成分名の組み合わせを特徴として解説。製品効能・濃度・メーカー意図は判定しない。
const norm=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/\s+/g,'');
function names(rows,re){return rows.filter(x=>re.test(x.key));}
function unique(xs){return [...new Map(xs.map(x=>[x.key,x])).values()];}
export function describeFormulaSignature(ingredients){
 if(!Array.isArray(ingredients)||!ingredients.length)
  return {title:'成分情報がありません',features:[],status:'insufficient'};
 const rows=unique(ingredients.filter(x=>x?.name).map(x=>({
  name:String(x.displayName||x.name),key:norm(x.displayName||x.name),group:x.group||'unknown'
 })));
 const known=rows.filter(x=>x.group!=='unknown');
 // The ingredient dictionary is incomplete: a directly matching Japanese display name
 // can still be concrete composition evidence even if its generic role is unknown.
 if(rows.length<3)
  return {title:'特徴を読み解くための成分情報が不足しています',features:[],status:'insufficient'};
 const found=[];
 function add(id,score,title,items,reading){
  items=unique(items);
  if(!items.length)return;
  found.push({id,score,title,ingredients:items.map(x=>x.name),reading});
 }
 const cer=names(rows,/セラミド(?:np|ap|eop|ng|ns|as|eos|[0-9])|ヘキサデシロキシpgヒドロキシエチルヘキサデカナミド/);
 const lipid=names(rows,/コレステロール|フィトステロール|レシチン|スクワラン/);
 if(cer.length>=2)add('ceramides',12,'複数のセラミド類',cer.slice(0,3).concat(lipid.slice(0,1)),'セラミド類を複数選び、保護系の成分を重ねた構成と読めます。');
 else if(cer.length&&lipid.length)add('ceramide-lipids',10,'セラミド類と脂質成分',cer.slice(0,1).concat(lipid.slice(0,1)),'セラミド関連の成分と脂質系の原料を組み合わせています。');
 const hya=names(rows,/ヒアルロン酸|ヒアルロネート/);
 if(hya.length>=2)add('hyals',11,'複数のヒアルロン酸類',hya.slice(0,3),'種類の異なるヒアルロン酸類を併用している点が特徴です。');
 const vc=names(rows,/アスコルビン|ascorb|ビタミンc|3-o-エチル/);
 if(vc.length>=2)add('vitamins',11,'複数のビタミンC関連成分',vc.slice(0,3),'ビタミンC関連成分を複数組み合わせた構成です。');
 const targeted=names(rows,/エクトイン|ポリグルタミン酸|エルゴチオネイン|シロキクラゲ多糖体/);
 if(targeted.length>=2)add('moisture-combo',11,'特徴の異なる保湿・コンディショニング成分',targeted.slice(0,3),'保湿・コンディショニング用途で扱われる複数の異なる原料を選んだ構成です。');
 const peptides=names(rows,/パルミトイル(?:トリ|テトラ|ペンタ)ペプチド|アセチル(?:トリ|テトラ|ヘキサ)ペプチド|オリゴペプチド/);
 if(peptides.length>=2)add('peptides',10,'複数のペプチド系成分',peptides.slice(0,3),'名前の異なるペプチド関連原料を併用している点が特徴です。');
 const bright=names(rows,/ナイアシンアミド|グルタチオン|アルブチン/);
 if(bright.length>=2)add('bright-combo',9,'整肌関連成分の組み合わせ',bright.slice(0,3),'一般的な整肌用途で知られる複数の原料の組み合わせが見られます。美白効果を判定するものではありません。');
 const teca=names(rows,/マデカッソシド|アシアチコシド|マデカシン酸|アシアチン酸/);
 const centella=names(rows,/ツボクサ(?:葉|根)?エキス/);
 if(teca.length>=2)add('centella',12,'ツボクサ関連成分の組み合わせ',centella.slice(0,1).concat(teca.slice(0,3)),'ツボクサ関連成分を複数選んだ構成です。整肌用途の想定に留まり、製品効果は判定できません。');
 const uv=names(rows,/エチルヘキシルトリアゾン|メトキシケイヒ酸エチルヘキシル|ビスエチルヘキシルオキシフェノール|ジエチルアミノヒドロキシベンゾイル|テレフタリリデンジカンフル|メチレンビスベンゾトリアゾリル|ポリシリコーン-15/);
 const mineral=names(rows,/^(酸化亜鉛|酸化チタン)$/);
 if(uv.length>=2)add('uv-combined',13,'複数の紫外線防御成分',uv.slice(0,3),'紫外線防御に関連する複数の成分を含みます。SPF・PAや防御性能は成分名だけでは分かりません。');
 else if(uv.length&&mineral.length)add('uv-mineral',12,'紫外線防御成分と粉体',uv.slice(0,1).concat(mineral.slice(0,1)),'種類の異なる紫外線防御関連成分を含んでいます。実際の防御性能は未確認です。');
 const ferment=names(rows,/発酵|培養溶解質|培養液|培養物|酵母エキス|ビフィズス菌/);
 if(ferment.length>=2)add('ferments',10,'複数の発酵・培養由来原料',ferment.slice(0,3),'発酵・培養由来の原料を複数取り入れている点が特徴です。');
 const care=names(rows,/ナイアシンアミド|パンテノール|アラントイン|グリチルリチン酸|トラネキサム酸/);
 if(care.length>=2)add('care',8,'複数の整肌関連成分',care.slice(0,3),'一般に整肌用途で扱われる複数成分を組み合わせています。');
 const extracts=names(rows,/[葉花根果実種子樹皮]エキス/).filter(x=>!x.key.includes('ツボクサ'));
 if(extracts.length>=3)add('botanicals',6,'種類の異なる植物エキス',extracts.slice(0,3),'植物由来エキスを複数併用した構成です。');
 const surf=names(rows,/ココイル|ラウロイル|コカミド|ラウレス硫酸|ラウリル硫酸/);
 if(surf.length>=2)add('surfactants',8,'複数の界面活性成分',surf.slice(0,3),'複数の界面活性成分を組み合わせた設計が考えられます。洗浄力は評価できません。');
 const texture=names(rows,/ジメチコン|シリカ|ポリメチルシルセスキオキサン|ナイロン-12|タルク|クロスポリマー/);
 if(texture.length>=2)add('textures',7,'感触・粉体・皮膜に関わる原料',texture.slice(0,3),'シリコーンや粉体・皮膜形成に関わる組み合わせが特徴です。仕上がりは断定できません。');
 const humect=names(rows,/グリセリン|ヒアルロン酸|^bg$|^dpg$|ペンチレングリコール|ベタイン|トレハロース|ソルビトール|エクトイン|ポリグルタミン酸/);
 if(humect.length>=3)add('humectants',4,'複数の保湿原料',humect.slice(0,3),'複数の保湿関連成分からなる基礎構成と読めます。');
 const selected=[];
 for(const item of found.sort((a,b)=>b.score-a.score)){
  if(selected.length===2)break;
  if(!selected.some(prev=>item.ingredients.filter(i=>prev.ingredients.includes(i)).length>=2))selected.push(item);
 }
 if(!selected.length){
  if(known.length<2)return {title:'分類できる成分が少なく、特徴の推論は保留します',features:[],status:'insufficient'};
  const specific=known.filter(x=>!/^(水|精製水|bg|dpg|グリセリン|エタノール|フェノキシエタノール)$/.test(x.key)).slice(0,2);
  if(specific.length<2)return {title:'特徴的な組み合わせの根拠はまだ不足しています',features:[],status:'limited'};
  return {title:'確認できた組み合わせ',features:[{id:'other',title:'分類できた成分',ingredients:specific.map(x=>x.name),reading:'この情報だけで独自の処方設計を特定することはできません。'}],status:'limited'};
 }
 return {title:selected[0].title,features:selected,status:'inferred'};
}
export function formatFormulaSignature(result){
 if(!result.features.length)return result.title;
 return result.features.map(f=>f.title+'：'+f.ingredients.join('・')+'。'+f.reading).join('\n');
}
