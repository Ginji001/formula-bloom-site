// 解析履歴は明示保存時だけ端末内に保存。旧履歴はそのまま閲覧できる。
import {readHistory,addHistory,clearHistory} from './history.js';

export function setupHistoryTools(getSnapshot){
 const $=id=>document.getElementById(id);
 let deleteArmed=false;
 const store=()=>{try{return window.localStorage;}catch{return null;}};
 function renderHistory(){
  const entries=readHistory(store()),root=$('historyList');
  root.replaceChildren();
  if(!entries.length){root.textContent='履歴はまだありません。';return;}
  for(const item of entries){
   const entry=document.createElement('div');entry.className='history-entry';
   const title=document.createElement('strong');
   title.textContent=item.formula.name+'（'+item.savedAt.slice(0,10)+'）';
   const meta=document.createElement('p');meta.className='muted';
   meta.textContent='全成分 '+(item.formula.ingredientCount||'未確認')+'件 ／ '+(item.formula.flowerName||'花の記録');
   entry.append(title,meta);
   root.append(entry);
  }
 }
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
  reset(){$('saveHistory').disabled=true;},
  ready(){$('saveHistory').disabled=false;}
 };
}
