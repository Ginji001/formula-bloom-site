// 花の種類は成分分類を解釈した視覚的比喩であり、効果・濃度の判定ではありません。
import {photoAssets} from './flower-photos.js';
export const flowerTypes=[
  {id:'hydrangea',name:'あじさい',short:'保湿・うるおい系の比喩',color:'#7a99ce'},
  {id:'camellia',name:'椿',short:'油性・保護成分の比喩',color:'#d95869'},
  {id:'chamomile',name:'カモミール',short:'整肌を連想する比喩',color:'#e6b946'},
  {id:'sunflower',name:'ひまわり',short:'ビタミンC関連成分の比喩',color:'#e7a32e'},
  {id:'rose',name:'バラ',short:'特徴成分が複数ある処方の比喩',color:'#be6279'},
  {id:'orchid',name:'ラン',short:'多種類の役割を含む処方の比喩',color:'#a17aca'},
  {id:'lily',name:'すずらん',short:'少ない種類の既知成分を含む処方の比喩',color:'#d7dfcc'},
  {id:'lavender',name:'ラベンダー',short:'香り関連成分がある処方の比喩',color:'#9473bc'},
  {id:'wildflower',name:'野の花',short:'特徴を特定しない中立の比喩',color:'#d6aa8d'}
];
const normalize=s=>String(s||'').normalize('NFKC').toLowerCase();
export function recommendFlower(ingredients){
  if(!Array.isArray(ingredients)||!ingredients.length)return {id:'wildflower',reasons:['まだ全成分を解析していません。'],limited:true};
  const known=ingredients.filter(x=>x.group&&x.group!=='unknown');
  const count=pattern=>known.filter(x=>pattern.test(normalize(x.name))).length;
  const group=id=>known.filter(x=>x.group===id).length;
  if(known.length<2)return {id:'wildflower',reasons:['分類できた成分は'+known.length+'種類です。花種の特徴を判断する情報が足りません。'],limited:true};
  if(known.length===2)return {id:'lily',reasons:['分類できた成分は2種類だけです。特徴を断定せず、暫定的にすずらんで表します。'],limited:true};
  const vitamin=count(/アスコルビン|ascorb|ビタミンc|vitamin c|3-o-ethyl|リン酸アスコルビル|ascorbyl/);
  const soothing=count(/ツボクサ|centella|madecassoside|asiaticoside|アラントイン|allantoin|パンテノール|panthenol|グリチルリチン酸|glycyrrhiz|カモミラ|chamomilla|カミツレ/);
  const lipid=count(/スクワラン|squalane|セラミド|ceramide|シア脂|shea butter|トリグリセリド|triglyceride|エチルヘキサン酸|ethylhexanoate|オレイン酸|oleate|ステアリン酸|stearate|ホホバ|jojoba|油|oil\b/);
  const fragrance=count(/香料|fragrance|parfum|精油|lavandula|ラベンダー|linalool|limonene|citronellol|geraniol/);
  const hydration=group('leaf'),active=group('petal');
  const diverse=['root','stem','leaf','petal','scent'].filter(x=>group(x)>0).length;
  // 種類数は配合量・効果の大きさを意味しない。成分名称・主分類の存在だけを使う。
  if(vitamin>=1)return {id:'sunflower',reasons:['ビタミンC関連の名称を含む分類済み成分が'+vitamin+'種類あります。'],limited:false};
  if(soothing>=2)return {id:'chamomile',reasons:['整肌を連想させる名称の成分が'+soothing+'種類あります。'],limited:false};
  if(lipid>=3)return {id:'camellia',reasons:['油性成分・セラミドなどに関連する名称の成分が'+lipid+'種類あります。'],limited:false};
  if(fragrance>=1)return {id:'lavender',reasons:['香りに関わる可能性のある名称が'+fragrance+'種類あります。実際の香りは未確認です。'],limited:false};
  if(known.length<=7)return {id:'lily',reasons:['分類済み成分が'+known.length+'種類で、少ない種類の既知成分を持つ花として描いています。'],limited:false};
  if(known.length>=25&&diverse>=3)return {id:'orchid',reasons:['分類済み'+known.length+'種類が'+diverse+'つの役割に分かれています。'],limited:false};
  if(active>=3&&diverse>=3)return {id:'rose',reasons:['花びら（特徴・整肌）に対応する成分が'+active+'種類あります。'],limited:false};
  if(hydration>=2)return {id:'hydrangea',reasons:['葉（保湿・保護）に対応する成分が'+hydration+'種類あります。'],limited:false};
  return {id:'wildflower',reasons:['特定の傾向を断定せず、中立の花で表現しています。'],limited:false};
}
const NS='http://www.w3.org/2000/svg';
const el=(name,attrs={})=>{const node=document.createElementNS(NS,name);for(const [k,v] of Object.entries(attrs))node.setAttribute(k,String(v));return node;};
const add=(g,name,attrs)=>{const e=el(name,attrs);g.append(e);return e;};
const ellipse=(g,x,y,rx,ry,fill,angle=0,stroke='#ffffff88')=>add(g,'ellipse',{cx:x,cy:y,rx,ry,fill,stroke,'stroke-width':1.4,transform:'rotate('+angle+' '+x+' '+y+')'});
const circle=(g,x,y,r,fill,stroke='none')=>add(g,'circle',{cx:x,cy:y,r,fill,stroke,'stroke-width':1});
const line=(g,d,stroke,fill='none',width=2)=>add(g,'path',{d,stroke,fill,'stroke-width':width,'stroke-linecap':'round','stroke-linejoin':'round'});
function radial(g,n,rx,ry,r,colors,rotation=0){
  for(let i=0;i<n;i++){
    const angle=i*360/n+rotation,a=angle*Math.PI/180;
    ellipse(g,260+Math.sin(a)*r,151-Math.cos(a)*r,rx,ry,colors[i%colors.length],angle);
  }
}
function center(g,r=18,fill='#e8b94d'){
  circle(g,260,151,r,fill,'#b68c43');
  for(let j=0;j<15;j++){const a=j*Math.PI*2/15;circle(g,260+Math.sin(a)*r*.68,151+Math.cos(a)*r*.68,1.65,'#9c713d');}
}
function head(g,type){
  switch(type){
    case 'hydrangea':{
      const clusters=[[-50,-35],[-22,-54],[15,-52],[48,-35],[-57,1],[-27,-5],[7,-13],[38,3],[58,25],[-42,39],[-9,35],[22,34]];
      clusters.forEach(([dx,dy],idx)=>{
        const colors=['#92aed9','#a6b5e3','#879dc7','#bbadda','#9abed5'];
        for(let i=0;i<4;i++){const a=i*Math.PI/2;ellipse(g,260+dx+Math.sin(a)*11,151+dy+Math.cos(a)*11,10,13,colors[(idx+i)%colors.length],-i*90);}
        circle(g,260+dx,151+dy,3.5,'#f7eacb');
      });
      return;
    }
    case 'camellia':
      radial(g,7,33,52,43,['#d64e68','#e76d75','#d84c59']);
      radial(g,5,27,34,18,['#f08882','#d95365','#ee7777'],22);
      center(g,17,'#efc44f');return;
    case 'chamomile':
      radial(g,16,10,53,50,['#fffdf7','#f0eee5','#fffefa']);
      center(g,27,'#e7b846');return;
    case 'sunflower':
      radial(g,20,13,55,52,['#f5b324','#e99b19','#f7c14d'],9);
      circle(g,260,151,36,'#67472f','#784a27');
      for(let i=0;i<42;i++){const a=i*2.39996,r=6+Math.sqrt(i)*4.1;circle(g,260+Math.cos(a)*r,151+Math.sin(a)*r,2.1,i%3===0?'#db9c4d':'#ad763b');}
      return;
    case 'rose':
      radial(g,8,31,47,40,['#bc496a','#d87285','#d05b71','#e38a92'],16);
      radial(g,6,24,30,19,['#e68a99','#b9506f','#d46d89'],13);
      ellipse(g,260,151,22,18,'#d66b83');
      line(g,'M245 153 Q250 130 266 142 Q279 156 264 165 Q249 171 253 153 Q263 145 268 154','#98445f','none',3);return;
    case 'orchid':
      ellipse(g,222,121,33,43,'#bca2dd',-38);ellipse(g,297,119,32,44,'#bb90ce',36);
      ellipse(g,259,103,27,37,'#e0bcd9');ellipse(g,216,171,27,47,'#aa86ce',46);
      ellipse(g,305,172,27,47,'#9972c4',-44);ellipse(g,260,174,27,23,'#f1c8a8');
      ellipse(g,260,168,13,18,'#bc6699');
      for(let i=0;i<7;i++)circle(g,250+i*3,168+(i%3)*3,1.8,'#8b5083');return;
    case 'lily':{
      line(g,'M261 242 Q224 163 250 80','#528a65','none',4);
      const bells=[[-27,122,-20],[22,97,10],[-38,167,-20],[30,154,20],[-2,70,0]];
      bells.forEach(([dx,dy,tilt])=>{
        line(g,'M'+(250+dx*.34)+' '+(dy-19)+' Q'+(260+dx)+' '+(dy-22)+' '+(260+dx)+' '+(dy-1),'#69916a');
        const bell=add(g,'g',{transform:'rotate('+tilt+' '+(260+dx)+' '+dy+')'});
        const x=260+dx,y=dy;
        const petals='M'+x+' '+(y-17)+' C'+(x-9)+' '+(y-14)+' '+(x-11)+' '+(y-5)+' '+(x-13)+' '+(y+7)
          +' C'+(x-16)+' '+(y+14)+' '+(x-12)+' '+(y+16)+' '+(x-7)+' '+(y+11)
          +' Q'+x+' '+(y+19)+' '+(x+7)+' '+(y+11)
          +' C'+(x+12)+' '+(y+16)+' '+(x+16)+' '+(y+14)+' '+(x+13)+' '+(y+7)
          +' C'+(x+11)+' '+(y-5)+' '+(x+9)+' '+(y-14)+' '+x+' '+(y-17)+' Z';
        line(bell,petals,'#a3bca3','#fcfdf7',1.4);
        line(bell,'M'+(x-6)+' '+(y-1)+' Q'+x+' '+(y+5)+' '+(x+6)+' '+(y-1),'#d9e5d7','none',1.2);
      });return;
    }
    case 'lavender':
      line(g,'M260 242 Q257 158 260 66','#5a825d','none',4);
      for(let i=0;i<13;i++){
        const y=77+i*10,spread=6+Math.min(i,12-i)*2.5;
        ellipse(g,260-spread*.55,y,8,13,i%2?'#9774bb':'#a791cc',-35);
        ellipse(g,260+spread*.55,y+3,8,13,i%2?'#7456ab':'#9270c2',35);
      }
      return;
    case 'wildflower':
      radial(g,7,23,46,35,['#dfac93','#f1c7a5','#d6a6a5'],12);
      center(g,15,'#e4c26f');return;
    default:radial(g,8,20,43,37,['#a8b9dd']);center(g);
  }
}
function plant(parts){
  const root=parts.root,stem=parts.stem,leaf=parts.leaf;
  line(root,'M260 383 C257 416 255 430 257 454 M257 412 Q228 417 217 450 M259 430 Q286 430 301 456 M257 445 Q246 460 239 484 M257 448 Q274 465 282 480','#947458','none',4);
  for(const d of ['M217 450 q-10 10 -13 28','M301 456 q8 10 12 28','M239 484 l-12 17','M282 480 l14 15','M260 452 q-5 20 -3 49'])line(root,d,'#b99778');
  line(stem,'M260 225 C251 289 263 340 260 403','#60896b','none',9);
  line(stem,'M259 235 C251 286 259 334 257 395','#a6c89b','none',2);
  line(leaf,'M255 289 Q201 229 146 274 Q190 313 255 298 Z','#527e64','#8aac79',2);
  line(leaf,'M263 337 Q324 285 376 308 Q335 368 263 345 Z','#588467','#93b789',2);
  line(leaf,'M248 293 Q199 280 167 278 M271 340 Q328 330 356 313','#c1d4aa');
}
export function renderFlower(svg,id){
  const chosen=flowerTypes.find(t=>t.id===id)||flowerTypes.at(-1);
  // 写真は純粋な花の写真のみ。ラベル・図形・説明文を画像に重ねない。
  const parts={};
  for(const key of ['root','stem','leaf','petal','scent']){
    const g=svg.querySelector('#visual'+key[0].toUpperCase()+key.slice(1));
    if(!g)return;
    g.replaceChildren();
    g.removeAttribute('clip-path');
    parts[key]=g;
  }
  const image=add(parts.petal,'image',{
    x:0,y:0,width:520,height:520,href:photoAssets[chosen.id],
    preserveAspectRatio:'xMidYMid slice','data-cc0-photo':chosen.id,
    'aria-hidden':'true','focusable':'false','tabindex':'-1'
  });
  image.style.pointerEvents='none';
  svg.style.visibility='visible';
  svg.setAttribute('aria-label',chosen.name+'の写真。花の種類は成分解析から自動で決まります。');
}
export function resetFlower(svg){
  // 未解析の状態でも空白にせず、野の花の写真を表示する。
  // 解析した商品に固有の花は必ず recommendFlower の結果で上書きする。
  renderFlower(svg,'wildflower');
  svg.setAttribute('aria-label','野の花の写真。全成分の解析後は自動判定された花に切り替わります。');
}
