// 成分の一般的な役割の組み合わせを、一文の処方意図（仮説）に要約する。
// メーカーの開発意図や実際の製品性能を断定しない。配合濃度も推定しない。
export function summarizeFormulaIntent(ingredients){
  if(!Array.isArray(ingredients)||!ingredients.length)
    return '成分情報がないため、処方の狙いは判断できません。';
  const known=ingredients.filter(x=>x&&['root','stem','leaf','petal','scent'].includes(x.group));
  if(known.length<3 || known.length/ingredients.length<0.5)
    return '分類できた成分が少ないため、この組み合わせの狙いは十分に推定できません。';
  const count=id=>known.filter(x=>x.group===id).length;
  const leaf=count('leaf'),stem=count('stem'),petal=count('petal'),root=count('root'),scent=count('scent');
  const text=known.map(x=>String(x.name||'').normalize('NFKC').toLowerCase());
  const vitamin=text.some(n=>/アスコルビン|ascorb|vitamin c|ビタミンc|3-o-ethyl/.test(n));
  const ceramide=text.some(n=>/セラミド|ceramide/.test(n));
  if(vitamin && leaf)
    return 'ビタミンC関連成分と保湿成分を組み合わせ、整肌に関わる特徴とうるおいの両立を意識した構成と考えられます。';
  if(ceramide && leaf>=2)
    return 'セラミドなどの保護成分と保湿成分を組み合わせ、肌のうるおいを支える役割を想定した構成と考えられます。';
  if(petal>=2 && leaf>=1)
    return '複数の整肌関連成分と保湿・保護成分を組み合わせ、肌を整える役割とうるおいの両方を考えた構成と推定されます。';
  if(leaf>=2 && petal>=1)
    return '保湿・保護成分に整肌関連成分を加え、うるおいと肌を整える役割を組み合わせた構成と考えられます。';
  if(leaf>=2 && stem>=1)
    return '複数の保湿・保護成分と製剤の構造・品質維持に関わる成分を組み合わせた構成と考えられます。';
  if(petal>=1 && stem>=1)
    return '整肌関連成分と処方を支える成分を組み合わせ、特徴づけと製剤の維持を考えた構成と推定されます。';
  if(leaf>=1 && root>=1)
    return '処方の土台となる成分に保湿・保護成分を組み合わせ、肌のうるおいを支える方向の構成と考えられます。';
  if(scent>=1 && stem>=1)
    return '感触・香りなどに関わる成分と製剤の構造・品質維持に関わる成分を組み合わせた構成と考えられます。';
  if(stem>=2)
    return '複数の製剤補助成分を組み合わせ、製剤の構造や品質維持を考えた構成と推定されます。';
  return '成分の一般的な役割から、処方の土台と複数の機能を組み合わせた構成と考えられます。';
}
