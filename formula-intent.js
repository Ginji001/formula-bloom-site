// 成分の一般的な役割の組み合わせを、一文の処方意図（仮説）に要約する。
// 分類できた成分だけでなく、全成分の名前から読み取れる手がかりも使う。
// メーカーの開発意図や実際の製品性能を断定しない。配合濃度も推定しない。
export function summarizeFormulaIntent(ingredients){
  if(!Array.isArray(ingredients)||!ingredients.length)
    return '配合成分全体の組み合わせから、肌を整える方向の構成と考えられます。';
  const rawNames=ingredients.map(x=>String((x&&x.name)||'').trim()).filter(Boolean);
  const text=rawNames.map(n=>n.normalize('NFKC').toLowerCase());
  const has=re=>text.some(n=>re.test(n));
  const known=ingredients.filter(x=>x&&['root','stem','leaf','petal','scent'].includes(x.group));
  const count=id=>known.filter(x=>x.group===id).length;
  const leaf=count('leaf'),stem=count('stem'),petal=count('petal'),root=count('root'),scent=count('scent');
  const moist=leaf>=1||has(/ヒアルロン酸|グリセリン|セラミド|スクワラン|パンテノール|コラーゲン|トレハロース|アミノ酸|尿素|アラントイン|ベタイン|ソルビトール|プロパンジオール|ブチレングリコール|ペンチレングリコール|hyaluron|glycerin|squalane|panthenol|collagen|betaine|allantoin/);
  const vitamin=has(/アスコルビン|ascorb|ビタミンc|3-o-ethyl/);
  const ceramide=has(/セラミド|ceramide/);
  const niacinamide=has(/ナイアシンアミド|niacinamide/);
  const tranexamic=has(/トラネキサム酸|tranexamic/);
  const retinol=has(/レチノール|retinol/);
  const acids=has(/サリチル酸|グリコール酸|グルコノラクトン|salicylic|glycolic|gluconolactone/);
  const uv=has(/メトキシケイヒ酸|オキシベンゾン|ジベンゾイルメタン|ビスエチルヘキシルオキシフェノール|エチルヘキシルトリアゾン|酸化チタン|酸化亜鉛|titanium dioxide|zinc oxide/);
  const cleansing=has(/ラウレス|ラウリル|ココイル|スルホン酸|石ケン|石けん|カリ石|laureth|sulfate|cocoyl/);
  const pigment=has(/酸化鉄|マイカ|グンジョウ|コンジョウ|カーボンブラック|赤[0-9０-９]|黄[0-9０-９]|青[0-9０-９]|黒[0-9０-９]/);
  if(uv&&moist)
    return '紫外線防止に関わる成分と保湿成分を組み合わせ、紫外線対策とうるおいの両方を考えた構成と考えられます。';
  if(uv)
    return '紫外線防止に関わる成分を中心に、製剤を支える成分を組み合わせた構成と考えられます。';
  if(cleansing&&moist)
    return '洗浄に関わる成分を土台に保湿成分を組み合わせ、洗い上がりの肌のうるおいを支える方向を意識した構成と考えられます。';
  if(cleansing)
    return '洗浄に関わる成分を中心に、感触や製剤の安定を支える成分を組み合わせた構成と考えられます。';
  if(pigment&&moist)
    return '色材を中心に、保湿や質感に関わる成分を組み合わせて仕上がりを整える方向の構成と考えられます。';
  if(pigment)
    return '色材を中心に、質感や付きを整える成分を組み合わせた構成と考えられます。';
  if(vitamin&&moist)
    return 'ビタミンC関連成分と保湿成分を組み合わせ、整肌に関わる特徴とうるおいの両立を意識した構成と考えられます。';
  if((niacinamide||tranexamic)&&moist)
    return 'ナイアシンアミドなどの整肌・訴求成分と保湿成分を組み合わせ、肌を整えることとうるおいの両立を意識した構成と考えられます。';
  if(retinol&&moist)
    return 'レチノールなどの整肌関連成分と保湿成分を組み合わせ、肌を整える役割とうるおいを両立させる方向の構成と考えられます。';
  if(retinol)
    return 'レチノールなどの整肌関連成分を含み、肌を整える役割を意識した構成と考えられます。';
  if(ceramide&&moist)
    return 'セラミドなどの保護成分と保湿成分を組み合わせ、肌のうるおいを支える役割を想定した構成と考えられます。';
  if(acids&&moist)
    return '角質ケアに関わる酸の成分と保湿成分を組み合わせ、肌をなめらかに整えることとうるおいを両立させる方向の構成と考えられます。';
  if(acids)
    return '角質ケアに関わる酸の成分を含み、肌をなめらかに整える方向を意識した構成と考えられます。';
  if(petal>=2&&leaf>=1)
    return '複数の整肌関連成分と保湿・保護成分を組み合わせ、肌を整える役割とうるおいの両方を考えた構成と推定されます。';
  if(leaf>=2&&petal>=1)
    return '保湿・保護成分に整肌関連成分を加え、うるおいと肌を整える役割を組み合わせた構成と考えられます。';
  if(leaf>=2&&stem>=1)
    return '複数の保湿・保護成分と製剤の構造・品質維持に関わる成分を組み合わせた構成と考えられます。';
  if(petal>=1&&stem>=1)
    return '整肌関連成分と処方を支える成分を組み合わせ、特徴づけと製剤の維持を考えた構成と推定されます。';
  if(leaf>=1&&root>=1)
    return '処方の土台となる成分に保湿・保護成分を組み合わせ、肌のうるおいを支える方向の構成と考えられます。';
  if(scent>=1&&stem>=1)
    return '感触・香りなどに関わる成分と製剤の構造・品質維持に関わる成分を組み合わせた構成と考えられます。';
  if(stem>=2)
    return '複数の製剤補助成分を組み合わせ、製剤の構造や品質維持を考えた構成と推定されます。';
  if(moist)
    return '複数の保湿関連成分を組み合わせ、肌のうるおいを支える方向を意識した構成と考えられます。';
  const lead=rawNames.slice(0,2).join('・');
  if(lead)
    return lead+'を処方の前面に置き、配合成分全体の組み合わせで肌を整える方向の構成と考えられます。';
  return '配合成分全体の組み合わせから、肌を整える方向の構成と考えられます。';
}
