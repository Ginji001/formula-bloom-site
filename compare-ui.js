// 比較・任意保存の画面。文字列は textContent で表示し、履歴は明示操作のみ。
import {compareSnapshots,readHistory,addHistory,clearHistory} from './formula-compare.js';

export function setupCompareTools(getSnapshot){
 const $=id=>document.getElementById(id);
 let first=null,second=null,deleteArmed=false;
 const store=()=>{try{return window.localStorage;}catch{return null;}};
 const status=()=>{$('compareStatus').textContent='A：'+(first?.name||'未選択')+' ／ B：'+(second?.name||'未選択');};
 const clearResult=()=>{$('compareResult').replaceChildren();};
 function assign(slot,value){
  if(slot==='A')first=value;else second=value;
  status();clearResult();
 }
 function line(label,parts){
  const p=document.createElement('p'),strong=document.createElement('strong');
  strong.textContent=label+'：';
  p.append(strong,document.createTextNode(parts.length?parts.join('、'):'該当なし'));
  $('compareResult').append(p);
 }
 function renderHistory(){
  const entries=readHistory(store()),root=$('historyList');
  root.replaceChildren();
  if(!entries.length){root.textContent='履歴はまだありません。';return;}
  for(const item of entries){
   const entry=document.createElement('div');entry.className='history-entry';
   const title=document.createElement('strong');
   title.textContent=item.formula.name+'（'+item.savedAt.slice(0,10)+'）';
   entry.append(title);
   for(const slot of ['A','B']){
    const button=document.createElement('button');button.type='button';button.className='secondary';
    button.textContent=slot+'に設定';
    button.onclick=()=>assign(slot,item.formula);
    entry.append(button);
   }
   root.append(entry);
  }
 }
 $('captureA').onclick=()=>{try{assign('A',getSnapshot());}catch(e){$('compareStatus').textContent=e.message;}};
 $('captureB').onclick=()=>{try{assign('B',getSnapshot());}catch(e){$('compareStatus').textContent=e.message;}};
 $('compareNow').onclick=()=>{
  clearResult();
  try{
   const outcome=compareSnapshots(first,second);
   line('共通する成分',outcome.same);
   line('Aだけの成分',outcome.onlyA);
   line('Bだけの成分',outcome.onlyB);
   const p=document.createElement('p');p.className='muted';
   p.textContent='花：A='+first.flowerName+'、B='+second.flowerName+'。'+(outcome.orderChanged?'表示順が異なります。':'')+outcome.message;
   $('compareResult').append(p);
   status();
  }catch(e){$('compareStatus').textContent=e.message;}
 };
 $('historyDetails').ontoggle=()=>{if($('historyDetails').open)renderHistory();};
 $('saveHistory').onclick=()=>{
  try{
   addHistory(store(),getSnapshot(),{id:crypto.randomUUID(),savedAt:new Date().toISOString()});
   $('historyStatus').textContent='この端末に保存しました（最大20件）。';
   deleteArmed=false;$('clearHistory').textContent='保存履歴をすべて削除';renderHistory();
  }catch(e){$('historyStatus').textContent=e.message;}
 };
 $('clearHistory').onclick=()=>{
  if(!deleteArmed){
   deleteArmed=true;$('clearHistory').textContent='もう一度押して削除';
   $('historyStatus').textContent='保存した全成分・出典を削除します。';return;
  }
  const ok=clearHistory(store());
  deleteArmed=false;$('clearHistory').textContent='保存履歴をすべて削除';
  $('historyStatus').textContent=ok?'保存履歴を削除しました。':'端末の保存領域を使用できません。';
  renderHistory();
 };
 return {
  reset(){for(const id of ['captureA','captureB','saveHistory'])$(id).disabled=true;},
  ready(){for(const id of ['captureA','captureB','saveHistory'])$(id).disabled=false;}
 };
}
