import {photoAssets} from './flower-photos.js';
// 花の共有カードをブラウザ内で生成する。サーバーへの送信・永続保存なし。
const clip=(value,len)=>{const chars=[...String(value||'')];return chars.slice(0,len).join('')+(chars.length>len?'…':'');};
export function shareCaption(data){
 return ['処方の花｜'+clip(data?.productName||'成分解析',80),
  '花のタイプ：'+(data?.flower?.name||'野の花')+'（成分の役割を表す比喩）',
  (data?.known||0)+' / '+(data?.total||0)+' 成分を分類。',
  '濃度・効能・安全性・製品の優劣は判定していません。',
  '出典：'+(data?.source||'利用者入力'),'#処方の花'].join('\n');
}
export function createPoster(data){
 if(!data||!data.flower||!Number.isInteger(data.total)||data.total<1)throw Error('先に全成分を解析してください。');
 const photo=photoAssets[data.flower.id];
 if(!photo||!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(photo))throw Error('花の写真を確認できません。');
 // 共有用PNGも写真のみ。商品情報や出典は画像の外にある共有テキストに残す。
 return '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">'
   +'<image x="0" y="0" width="1080" height="1350" preserveAspectRatio="xMidYMid slice" href="'+photo+'"/>'
   +'</svg>';
}
export async function pngBlob(poster){
 if(typeof poster!=='string'||poster.length>1000000)throw Error('画像データが不正です。');
 const url=URL.createObjectURL(new Blob([poster],{type:'image/svg+xml;charset=utf-8'}));
 try{
   const img=new Image();
   await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(Error('花の画像を描画できませんでした。'));img.src=url;});
   const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;
   const ctx=canvas.getContext('2d');if(!ctx)throw Error('画像描画を使用できません。');
   ctx.drawImage(img,0,0,1080,1350);
   return await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('PNGを生成できません。')),'image/png'));
 }finally{URL.revokeObjectURL(url);}
}
async function saveBlob(blob){
 const url=URL.createObjectURL(blob);
 try{const a=document.createElement('a');a.href=url;a.download='処方の花.png';a.style.display='none';document.body.append(a);a.click();a.remove();}
 finally{setTimeout(()=>URL.revokeObjectURL(url),1000);}
}
export async function savePoster(poster){await saveBlob(await pngBlob(poster));}
export async function sharePoster(poster,caption){
 const blob=await pngBlob(poster);const file=new File([blob],'処方の花.png',{type:'image/png'});
 if(typeof navigator.share==='function'&&typeof navigator.canShare==='function'&&navigator.canShare({files:[file]})){
   try{await navigator.share({files:[file],title:'処方の花',text:caption});return 'shared';}
   catch(e){if(e?.name==='AbortError')return 'cancelled';throw e;}
 }
 await saveBlob(blob);return 'saved';
}
