import {staticGetJSON} from './static-api.js';
import {analyze,groups,product,SOURCE,normalize,pickAutomaticProduct,pickIngredientVariant} from './engine.js';
import {productJapaneseAid,japaneseBrandLabel,brandQueryMatches} from './japanese.js';
import {japaneseIngredientLabel} from './japan-market.js';
import {isJapaneseIngredientsList} from './japan-market-policy.js';
import {cleanPastedProductName} from './product-query.js';
import {registeredProducts,registeredBrands,productsForBrand,findRegisteredProducts,chooseExactRegisteredProduct} from './registered-products.js';
import {flowerTypes,recommendFlower,renderFlower,resetFlower} from './flower-types.js';
import {summarizeFormulaIntent} from './formula-intent.js';
import {provenance,provenanceText} from './provenance.js';
import {checkProductIdentity} from './product-identity.js';
import {recordForProduct,validateFormulaRecords,compareFormulaRecord} from './formula-archive.js';
import {createOCRLexicon,findOCRCorrections,applyOCRCorrection} from './ocr-review.js';
import {prepareSharedFormula} from './shared-source.js';
import {makeSnapshot} from './history.js';
import {setupHistoryTools} from './history-ui.js';
import {readMyFormulas,saveMyFormula,deleteMyFormula,searchMyFormulas,exactMyFormula} from './my-formulas.js';
import {createPoster,shareCaption,savePoster,sharePoster} from './share.js';
let lookupVersion=0,lookupAbort=null,typingTimer=null;
function beginLookup(){lookupAbort?.abort();lookupAbort=new AbortController();return {version:++lookupVersion,signal:lookupAbort.signal};}
function busy(value){$('searchBtn').disabled=value;$('fetchOfficial').disabled=value;$('searchBtn').textContent=value?'検索中…':'商品を探す ↗';$('search').setAttribute('aria-busy',String(value));}
const $=id=>document.getElementById(id);let remoteProduct=null;let current=[],selected='root',inputMode='search',official=false,ocrRequired=false,worker,report='',reportCore='',bloomRecommendation=null,posterState=null;
const japaneseName=x=>japaneseIngredientLabel(x.name,{kind:$('kind').value})||'日本語表示名未確認';
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
$('guideParts').innerHTML=groups.map(([,name,title,desc])=>`<div><b>${name}</b><p>${title}<br>${desc}</p></div>`).join('');
function tab(name){lookupAbort?.abort();++lookupVersion;clearTimeout(typingTimer);busy(false);inputMode=name;if(name!=='image')hideOCRReview();else if(ocrRequired)refreshOCRReview();document.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.tab===name)));document.querySelectorAll('.pane').forEach(p=>p.hidden=p.id!==name);$('editorDetails').open=name!=='search';}
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>tab(b.dataset.tab));
function loadProduct(){invalidate();$('japanConfirmed').checked=true;remoteProduct=null;$('sourceInfo').replaceChildren();official=true;ocrRequired=false;$('ingredients').value=product.ingredients;$('kind').value='cosmetic';$('origin').textContent=product.order;$('error').textContent='';tab('search');run();}
$('sample').onclick=loadProduct;
async function getJSON(path,signal){return staticGetJSON(path,{signal});}
function sourceLink(container,url,title){const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';a.textContent=title+' ↗';container.append(a);}
let formulaArchivePromise=null;
function formulaArchive(){
 if(!formulaArchivePromise)formulaArchivePromise=getJSON('/formula-records.json').then(validateFormulaRecords).catch(()=>null);
 return formulaArchivePromise;
}
async function storedFormulaFor(expected){return recordForProduct(await formulaArchive(),expected);}
function useStoredFormula(record){
 invalidate();official=false;ocrRequired=false;
 remoteProduct={
  name:record.productName+'（保存版）',url:record.sourceUrl,region:'jp',sourceType:'archive',
  kind:record.kind,rows:[],ingredients:record.ingredients,order:record.order,activeIngredients:record.activeIngredients,otherIngredients:record.otherIngredients,
  label:record.variant||'単一処方',fetchedAt:record.verifiedAt,
  archiveVerifiedAt:record.verifiedAt,japanMarketConfirmed:true
 };
 $('query').value=record.brand+' '+record.productName;
 $('ingredients').value=record.ingredients;
 $('origin').textContent=record.order;$('kind').value=record.kind;
 $('japanConfirmed').checked=true;
 $('sourceInfo').replaceChildren();
 const msg=document.createElement('p');msg.className='muted';
 msg.textContent='公式掲載の保存版（'+record.verifiedAt.slice(0,10)+'確認）'+(record.sku?'／商品番号 '+record.sku:'')+(record.volume?'／'+record.volume:'')+'。最新処方・現物との一致は未確認です。';
 $('sourceInfo').append(msg);
 sourceLink($('sourceInfo'),record.sourceUrl,'保存元の公式ページ');
 showMedicatedCategories(remoteProduct);
 run();
 $('officialStatus').textContent=$('error').textContent?'保存版を解析できませんでした。':'保存版から花を生成しました（最新処方は未確認）。';
}
function offerStoredFormula(record){
 if(!record)return;
 const b=document.createElement('button');b.className='secondary';b.type='button';
 b.textContent='保存版で花にする（'+record.verifiedAt.slice(0,10)+'）';
 b.onclick=()=>useStoredFormula(record);
 $('officialStatus').append(b);
}
async function reviewStoredFormula(expected,p,v,accept){
 const version=lookupVersion,stored=await storedFormulaFor(expected);
 if(version!==lookupVersion)return;
 const comparison=compareFormulaRecord(stored,v);
 if(stored&&comparison.status==='changed'){
  $('officialStatus').replaceChildren();
  const msg=document.createElement('p');
  msg.textContent='処方変更の可能性：'+comparison.text+'。実物と公式表示を確認してください。';
  $('officialStatus').append(msg);
  const current=document.createElement('button');current.className='secondary';current.type='button';
  current.textContent='現在の掲載成分を確認して花にする';
  current.onclick=()=>{if(version===lookupVersion)accept();};
  $('officialStatus').append(current);
  offerStoredFormula(stored);
  sourceLink($('officialStatus'),p.url,'現在の公式ページ');
  return;
 }
 accept();
}
let savedFormulaListLoaded=false;
$('savedFormulas').ontoggle=async()=>{
 if(!$('savedFormulas').open||savedFormulaListLoaded)return;
 const container=$('savedFormulaList');
 container.textContent='保存版を確認しています…';
 const archive=await formulaArchive();
 if(!archive){container.textContent='保存データを読み込めませんでした。';return;}
 container.replaceChildren();
 for(const record of archive.records){
  const b=document.createElement('button');
  b.className='product-option';b.type='button';
  b.textContent=record.brand+' '+record.productName+' ／ '+record.verifiedAt.slice(0,10);
  b.onclick=()=>useStoredFormula(record);
  container.append(b);
 }
 savedFormulaListLoaded=true;
};
function identityGate(expected,p,v,accept){
  const variantTitle=p.variants?.length>1?v.label?.match(/全成分[：:]\s*(.+)$/)?.[1]?.trim():null;
  const check=checkProductIdentity(expected,{...p,...v,name:variantTitle||p.name});
  if(check.status==='blocked'){
    $('officialStatus').replaceChildren();
    const notice=document.createElement('p');
    notice.textContent='商品情報が一致しないため、花の自動生成を止めました：'+check.errors.join('／');
    $('officialStatus').append(notice);
    sourceLink($('officialStatus'),p.url,'掲載元を確認');
    return;
  }
  if(check.status==='review'){
    $('officialStatus').replaceChildren();
    const notice=document.createElement('p');
    notice.textContent='商品情報を確認：'+check.reviews.join('／');
    const details=document.createElement('p');
    details.className='muted';
    details.textContent='選択：'+expected.name+' ／ 掲載：'+p.name+' ／ '+(v.label||'全成分');
    const confirm=document.createElement('button');
    confirm.type='button';confirm.className='secondary';
    confirm.textContent='この商品・処方を確認して花にする';
    confirm.onclick=()=>accept(check);
    $('officialStatus').append(notice,details,confirm);
    sourceLink($('officialStatus'),p.url,'掲載元を確認');
    return;
  }
  accept(check);
}
function showMedicatedCategories(item){
 if(item.kind!=='quasi')return;
 const note=document.createElement('p');note.className='muted';
 if(item.activeIngredients&&item.otherIngredients){
  note.textContent='医薬部外品の表示区分：有効成分＝'+item.activeIngredients+
   ' ／ その他の成分＝'+item.otherIngredients+
   '。成分の並びから濃度や配合順を推定しません。';
 }else{
  note.textContent='医薬部外品の成分です。公式掲載の有効成分・その他の成分の内訳は、この保存版では未確認です。';
 }
 $('sourceInfo').append(note);
}
function showIdentityNote(check){
  const note=document.createElement('p');
  note.className='muted';
  note.textContent='商品確認：'+(check.status==='unverified'?'未照合':check.status==='review'?'利用者確認': '一致項目あり')+' ／ '+check.text;
  $('sourceInfo').append(note);
}
async function fetchProduct(url,confirmed=false,auto=false,depth=0,ctx=null,preferredVariant=null,expected=null){ctx=ctx||beginLookup();if(depth===0){invalidate();remoteProduct=null;official=false;}busy(true);$('officialStatus').textContent='公式ページの全成分を確認しています…';$('fetchOfficial').disabled=true;try{const p=await getJSON('/api/official?url='+encodeURIComponent(url)+(confirmed||$('officialConfirmed').checked?'&confirmed=1':''),ctx.signal);if(ctx.version!==lookupVersion)return;$('officialStatus').replaceChildren();sourceLink($('officialStatus'),p.url,p.name);if(auto&&p.variants.length===0&&p.ingredientPages?.length===1&&depth<2){await fetchProduct(p.ingredientPages[0].url,confirmed,true,depth+1,ctx,preferredVariant,expected);return;}const hint=document.createElement('p');hint.textContent='商品と処方を確認して、全成分表を選んでください。';$('officialStatus').append(hint);for(const link of p.ingredientPages||[]){const b=document.createElement('button');b.className='secondary';b.textContent=link.name+'の成分表を開く';b.onclick=()=>fetchProduct(link.url,confirmed,auto,depth+1,ctx);$('officialStatus').append(b);}const selectedVariant=auto?pickIngredientVariant(p.variants,$('query').value):null;const registeredVariant=expected?.id?p.variants.find(v=>v.productId===expected.id):preferredVariant?p.variants.find(v=>preferredVariant==='通常版'?!v.label.includes('モイスト'):v.label.includes(preferredVariant)):null;for(const v of p.variants){const b=document.createElement('button');b.className='secondary';b.textContent=v.label+'を取り込む';b.onclick=()=>identityGate(expected,p,v,check=>reviewStoredFormula(expected,p,v,()=>{
  invalidate();official=false;ocrRequired=false;remoteProduct={...p,...v,identityCheck:check};
  $('ingredients').value=v.ingredients;$('origin').textContent=v.order;$('kind').value=p.kind;
  $('sourceInfo').replaceChildren();sourceLink($('sourceInfo'),p.url,p.name);
  $('japanConfirmed').checked=true;
  const info=document.createElement('p');info.className='muted';
  info.textContent=(v.label||'全成分')+' / '+v.order+'。販売地域や処方の違いをご確認ください。';
  $('sourceInfo').append(info);showMedicatedCategories(remoteProduct);showIdentityNote(check);
  $('officialStatus').textContent='全成分を取り込みました。';
  run();
  if(!$('error').textContent)$('officialStatus').textContent='全成分から花を自動生成しました。';
 }));
 $('officialStatus').append(b);
 if(auto&&(registeredVariant||selectedVariant)===v){b.onclick();return;}}}catch(e){if(e.name!=='AbortError'&&ctx.version===lookupVersion){$('officialStatus').textContent=e.message+' 公式ページの全成分をコピーして「全成分」に貼り付けるか、「写真」をお試しください。';try{if(new URL(url).protocol==='https:')sourceLink($('officialStatus'),url,'該当ページを開く');}catch{}if(expected){const record=await storedFormulaFor(expected);if(ctx.version===lookupVersion)offerStoredFormula(record);}}}finally{if(ctx.version===lookupVersion){$('fetchOfficial').disabled=false;busy(false);}}}
$('searchSite').oninput=()=>{$('searchSiteConfirmed').checked=false;};
$('officialUrl').oninput=()=>{$('officialConfirmed').checked=false;invalidate();remoteProduct=null;official=false;};
$('fetchOfficial').onclick=()=>fetchProduct($('officialUrl').value.trim());
for(const id of ['sharedUrl','sharedName','sharedIngredients'])$(id).oninput=()=>{$('sharedConfirmed').checked=false;};
$('sharedKind').onchange=()=>{$('sharedConfirmed').checked=false;};
$('sharedImportBtn').onclick=()=>{
 invalidate();remoteProduct=null;official=false;ocrRequired=false;
 $('sharedImportStatus').textContent='';
 try{
  const entry=prepareSharedFormula({
   url:$('sharedUrl').value,name:$('sharedName').value,
   ingredients:$('sharedIngredients').value,kind:$('sharedKind').value,confirmed:$('sharedConfirmed').checked
  });
  remoteProduct=entry;
  $('ingredients').value=entry.ingredients;$('kind').value=entry.kind;
  $('origin').textContent=entry.order;$('japanConfirmed').checked=true;
  $('sourceInfo').replaceChildren();
  const note=document.createElement('p');note.className='muted';
  note.textContent=entry.siteName+'の掲載内容を利用者が転記（メーカー・現物未確認）。';
  $('sourceInfo').append(note);
  sourceLink($('sourceInfo'),entry.url,'掲載元を開く');
  run();
  $('sharedImportStatus').textContent=$('error').textContent?'成分を確認してください。':'掲載された日本語全成分から花を生成しました（現物未確認）。';
 }catch(error){$('sharedImportStatus').textContent=error.message;}
};
async function fetchRetailProduct(url,ctx=null){
  const lookup=ctx||beginLookup();
  invalidate();remoteProduct=null;official=false;
  busy(true);
  $('officialStatus').textContent='日本の販売店・コスメ情報サイトに掲載された全成分を確認しています…';
  try{
    const p=await getJSON('/api/retail?url='+encodeURIComponent(url),lookup.signal);
    if(lookup.version!==lookupVersion)return;
    const v=p.variants?.[0];
    if(!v)throw Error('この販売ページの日本語全成分を確認できませんでした。');
    identityGate(lookup.expected||null,p,v,check=>{
    invalidate();official=false;ocrRequired=false;
    remoteProduct={...p,...v,identityCheck:check};
    $('ingredients').value=v.ingredients;
    $('origin').textContent=v.order;
    $('kind').value=p.kind;
    $('japanConfirmed').checked=false;
    $('sourceInfo').replaceChildren();
    const notice=document.createElement('p');
    notice.className='muted';
    notice.textContent=(p.sourceType==='beauty'?'外部サイト':'外部サイト')+'の掲載成分です。実物表示で確認してください。';
    $('sourceInfo').append(notice);
    sourceLink($('sourceInfo'),p.url,p.name+' / '+'商品ページ');
    showIdentityNote(check);
    run();
    $('officialStatus').textContent=$('error').textContent?'掲載された成分を解析できませんでした。':'掲載された日本語全成分から花を自動生成しました（メーカー・実物未確認）。';
    });
  }catch(e){
    if(e.name!=='AbortError'&&lookup.version===lookupVersion){
      $('officialStatus').textContent=e.message;
      if(/^https:\/\//.test(url)){
        sourceLink($('officialStatus'),url,'掲載元のページを開く');
        $('shareImport').open=true;
        $('sharedUrl').value=url;
        if(lookup.expected?.name)$('sharedName').value=lookup.expected.name;
        $('sharedConfirmed').checked=false;
        $('sharedImportStatus').textContent='掲載元の利用条件を確認し、許可される範囲で日本語の全成分を入力してください。';
      }
    }
  }finally{if(lookup.version===lookupVersion)busy(false);}
}
function appendRetailLinks(container,data){
  if(!data.shopLinks?.length)return;
  const div=document.createElement('div');div.className='retail-sources';
  const heading=document.createElement('p');heading.className='muted';heading.textContent='ほかのサイトで探す';
  div.append(heading);
  for(const item of data.shopLinks){
    const a=document.createElement('a');a.href=item.url;a.target='_blank';a.rel='noopener noreferrer';
    a.textContent=item.name+'で検索';
    div.append(a);
  }
  container.append(div);
}
function offerJapaneseIngredients(){
  const action=document.createElement('button');
  action.className='secondary';
  action.type='button';
  action.textContent='日本語の全成分から花にする';
  action.onclick=()=>{
    tab('text');
    $('editorDetails').open=true;
    $('ingredients').focus();
    $('error').textContent='日本で販売されている製品の日本語の全成分を入力し、確認欄にチェックして「この処方を、花にする」を押してください。';
  };
  $('searchResults').append(action);
}
function presentRegisteredProducts(products,heading='日本向け公式商品'){
  $('searchResults').replaceChildren();
  const notice=document.createElement('p');notice.className='muted';
  notice.textContent=heading+'：登録された商品候補 '+products.length+'件。国内公式の成分保存版がある場合は花を生成できます。未確認品は成分表の入力が必要です。';
  $('searchResults').append(notice);
  for(const item of products){
    const b=document.createElement('button');b.className='product-option';b.type='button';
    const title=document.createElement('strong');title.textContent=item.brand+' '+item.name;
    const hint=document.createElement('small');hint.textContent='保存版の日本語全成分で花にする（要照合）';
    b.append(title,hint);
    b.onclick=()=>{
      $('query').value=item.brand+' '+item.name;
      $('searchResults').textContent='日本公式の成分表を確認しています：'+item.brand+' '+item.name;
      fetchProduct(item.url,false,true,0,null,item.variant,item);
    };
    $('searchResults').append(b);
  }
  const more=document.createElement('button');more.type='button';more.className='secondary';more.textContent='登録済み以外の日本向け製品を探す';more.onclick=()=>search({forceOfficial:true});$('searchResults').append(more);
}
function showBrandProducts(data){
  const holder=$('searchResults');
  holder.replaceChildren();
  const brand=data.brand?.name||'ブランド';
  if(!data.products?.length){
    const text=document.createElement('p');
    text.className='muted';
    text.textContent=data.brand?.japanSiteVerified?
      '候補が見つかりません。サイトで探すか、全成分を入力してください。':
      '商品候補が見つかりません。下のサイトで探してください。';
    holder.append(text);
    if(data.brand?.site)sourceLink(holder,data.brand.site,brand+'の日本向け公式サイト');
    appendRetailLinks(holder,data);
    offerJapaneseIngredients();
    return;
  }
  const h=document.createElement('p');h.className='muted';
  h.textContent='商品候補：'+data.products.length+'件　※ 掲載成分は要確認';
  holder.append(h);
  appendRetailLinks(holder,data);
  let shown=0;
  const batch=()=>{
    const entries=data.products.slice(shown,shown+25);
    for(const item of entries){
      const b=document.createElement('button');b.className='product-option';b.type='button';
      const strong=document.createElement('strong');strong.textContent=item.name;
      const small=document.createElement('small');
      small.textContent=item.registered?'国内公式の成分保存版（現物未確認）':item.sourceType==='shop'||item.sourceType==='beauty'?'外部サイト・成分未確認':'公式商品・成分未確認';
      b.append(strong,small);
      b.onclick=()=>{
        $('query').value=item.name;
        if(item.sourceType==='shop'||item.sourceType==='beauty')fetchRetailProduct(item.url,{...beginLookup(),expected:item});
        else {holder.textContent='日本公式の全成分を確認しています：'+item.name;fetchProduct(item.url,false,true,0,null,item.variant||null,item);}
      };
      holder.append(b);
    }
    shown+=entries.length;
    more.hidden=shown>=data.products.length;
    more.textContent='さらに表示（'+shown+' / '+data.products.length+'）';
  };
  const more=document.createElement('button');more.type='button';more.className='secondary';
  more.onclick=batch;
  holder.append(more);
  batch();
}
async function openBrandProducts(brand){
  const ctx=beginLookup();
  $('searchResults').textContent='商品を探しています…';
  busy(true);
  try{
    const data=await getJSON('/api/brand-products?q='+encodeURIComponent(brand),ctx.signal);
    if(ctx.version!==lookupVersion)return;
    if(data.found)showBrandProducts(data);
    else $('searchResults').textContent='ブランドを特定できませんでした。';
  }catch(e){
    if(e.name!=='AbortError'&&ctx.version===lookupVersion){
      $('searchResults').textContent='ブランドの商品一覧を表示できませんでした：'+e.message;
      offerJapaneseIngredients();
    }
  }finally{if(ctx.version===lookupVersion)busy(false);}
}
function presentRegisteredBrand(brand){
  const entries=productsForBrand(brand);
  if(!entries.length)return false;
  presentRegisteredProducts(entries,brand);
  return true;
}
function quickRegisteredBrands(){
  const zone=$('registeredQuick');if(!zone)return;
  zone.replaceChildren();
  for(const brand of registeredBrands){
    const b=document.createElement('button');b.className='registered-chip';b.type='button';
    b.textContent=brand+'（'+productsForBrand(brand).length+'）';
    b.onclick=()=>{tab('search');$('query').value=brand;invalidate();openBrandProducts(brand);};
    zone.append(b);
  }
}
quickRegisteredBrands();

async function search({instant=false,forceOfficial=false}={}){clearTimeout(typingTimer);const raw=$('query').value.trim();const q=instant?raw:cleanPastedProductName(raw);if(!instant&&raw!==q)$('query').value=q;if(q.length<2)return;
if(!forceOfficial&&!/^https:\/\//.test(q)){
 const mine=searchMyFormulas(myFormulaStore(),q);
 if(mine.length){
  const exact=!instant?exactMyFormula(myFormulaStore(),q):null;
  if(exact){useMyFormula(exact);return;}
  presentMyFormulas(mine);return;
 }
}
const ctx=beginLookup();
if(!forceOfficial&&!/^https:\/\//.test(q)){
  try{
    const brandData=await getJSON('/api/brand-products?q='+encodeURIComponent(q)+(instant?'&retail=0':''),ctx.signal);
    if(ctx.version!==lookupVersion)return;
    if(brandData.found&&brandData.brandOnly){
      showBrandProducts(brandData);
      return;
    }
    if(brandData.found&&brandData.products?.length&&!chooseExactRegisteredProduct(q)){
      showBrandProducts(brandData);
      return;
    }
  }catch(e){if(e.name==='AbortError'||ctx.version!==lookupVersion)return;}
}
const matches=findRegisteredProducts(q);
if(!forceOfficial&&!/^https:\/\//.test(q)&&matches.length){
  if(!instant){
    const matched=chooseExactRegisteredProduct(q);
    if(matched){
      $('searchResults').textContent='日本公式の商品情報を確認しています：'+matched.brand+' '+matched.name;
      await fetchProduct(matched.url,false,true,0,ctx,matched.variant,matched);
      return;
    }
  }
  presentRegisteredProducts(matches.map(x=>x.product));
  return;
}
busy(true);$('searchResults').textContent='候補を探しています…';$('officialStatus').textContent='';try{if(/^https:\/\//.test(q)){if(!instant){if(/^https:\/\/(?:www\.)?(?:amazon\.co\.jp|item\.rakuten\.co\.jp|store\.shopping\.yahoo\.co\.jp|qoo10\.jp|cosme\.net|lipscosme\.com)\//i.test(q))await fetchRetailProduct(q,ctx);else await fetchProduct(q,false,true,0,ctx);}$('searchResults').textContent='';return;}const data=await getJSON('/api/search?q='+encodeURIComponent(q)+($('searchSite').value.trim()?'&site='+encodeURIComponent($('searchSite').value.trim())+($('searchSiteConfirmed').checked?'&confirmed=1':''):''),ctx.signal);if(ctx.version!==lookupVersion)return;$('searchResults').replaceChildren();if(!data.results.length){$('searchResults').textContent='公式の商品候補が見つからないため、まだ花は生成していません。日本で販売されている製品の日本語の全成分表から花にできます。';if(data.brand?.japanSiteVerified&&data.brand.site)sourceLink($('searchResults'),data.brand.site,data.brand.name+'の日本向け公式サイトを開く');offerJapaneseIngredients();return;}const automatic=pickAutomaticProduct(data.results,q);if(!instant&&automatic){$('searchResults').textContent=automatic.name;await fetchProduct(automatic.url,false,true,0,ctx,null,automatic);return;}const lead=document.createElement('p');lead.className='muted';lead.textContent='候補から実際の商品を選んでください。日本語の全成分が確認できると、自動で花になります。';$('searchResults').append(lead);for(const item of (instant?data.results.slice(0,5):data.results)){const b=document.createElement('button');b.className='product-option';const title=document.createElement('strong');const aid=productJapaneseAid(item.name);title.textContent=aid||item.name;const meta=document.createElement('small');meta.textContent=(aid?'日本語補助表記（非公式）／公式名：'+item.name+' ／ ':'')+(item.officialVerified?'公式サイトから解析 ↗':'公式サイトか確認する ↗');b.append(title,meta);b.onclick=()=>{if(!item.officialVerified){$('moreInput').open=true;$('officialConfirmed').checked=false;$('officialUrl').value=item.url;$('officialStatus').replaceChildren();sourceLink($('officialStatus'),item.url,'候補ページ');$('officialStatus').append(' 公式ページか確認し、URLを読み込んでください。');return;}$('searchResults').textContent='選択：'+item.name;fetchProduct(item.url,false,true,0,null,null,item);};$('searchResults').append(b);}}catch(e){if(e.name==='AbortError'||ctx.version!==lookupVersion)return;$('searchResults').textContent='商品候補を確認できませんでした。';const b=document.createElement('button');b.className='secondary';b.textContent='公式URLで調べる';b.onclick=()=>{$('moreInput').open=true;$('officialUrl').focus();};$('searchResults').append(b);offerJapaneseIngredients();}finally{if(ctx.version===lookupVersion)busy(false);}}
$('searchBtn').onclick=()=>search();$('query').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();search();}};
$('query').onpaste=e=>{
  const pasted=e.clipboardData?.getData('text');
  if(!pasted)return;
  const name=cleanPastedProductName(pasted);
  if(!name)return;
  e.preventDefault();
  $('query').value=name;
  $('query').dispatchEvent(new Event('input',{bubbles:true}));
  clearTimeout(typingTimer);
  $('searchHint').textContent='貼り付けた製品名から、日本向け公式商品を探しています…';
  typingTimer=setTimeout(()=>search({instant:false}),80);
};
$('query').oninput=()=>{clearTimeout(typingTimer);lookupAbort?.abort();++lookupVersion;busy(false);invalidate();remoteProduct=null;$('japanConfirmed').checked=false;$('searchResults').replaceChildren();$('officialStatus').textContent='';if($('query').value.trim().length>=3)typingTimer=setTimeout(()=>search({instant:true}),500);};
document.querySelectorAll('[data-example]').forEach(b=>b.onclick=()=>{$('query').value=b.dataset.example;search();});
function invalidate(){historyTools?.reset();$('ingredientRows').replaceChildren();$('sourceInfo').replaceChildren();$('officialStatus').replaceChildren();$('summary').textContent='';$('coverage').textContent='';posterState=null;$('exportImage').disabled=true;$('shareImage').disabled=true;$('sourceQuality').textContent='解析前：出典・処方を確認してください。';$('shareStatus').textContent='';current=[];bloomRecommendation=null;report=reportCore='';$('flowerTypeTag').textContent='解析後に自動決定';$('flowerTypeReason').textContent='全成分の役割から花の種類を自動で決めます。';resetFlower($('flower'));$('flowerCaptionName').textContent='野の花';$('flowerCaptionNote').textContent='全成分から花を選びます。';$('formulaAim').textContent='';$('formulaAim').hidden=true;$('uncertainty').textContent='';$('analysisDetails').hidden=true;$('flowerTitle').textContent='入力後に、花にしてみましょう。';$('flowerSubtitle').textContent='内容を確認して解析ボタンを押してください。';$('resultBadge').textContent='未解析';buttons();}
$('japanConfirmed').onchange=invalidate;
$('kind').onchange=invalidate;$('claim').oninput=invalidate;
$('ingredients').oninput=()=>{invalidate();$('japanConfirmed').checked=false;remoteProduct=null;$('sourceInfo').replaceChildren();official=false;$('origin').textContent='利用者入力・配合量は未確認';if(inputMode!=='image')ocrRequired=false;if(ocrRequired)$('ocrChecked').checked=false;if(inputMode==='image'&&ocrRequired){$('origin').textContent='写真の文字読み取り・確認中';refreshOCRReview();}else hideOCRReview();};
function part(id){selected=id;const g=groups.find(g=>g[0]===id),list=current.filter(x=>x.group===id);$('partDetail').replaceChildren();const title=document.createElement('strong');title.textContent=`${g[1]}｜${g[2]}`;$('partDetail').append(title);const p=document.createElement('p');p.textContent=current.length?(list.length?list.map(x=>`${japaneseName(x)}（${x.role}）`).join('、'):'該当する成分を辞書では確認できません。未収録成分が担う可能性はあります。'):g[3];$('partDetail').append(p);document.querySelectorAll('[data-part]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.part===id)));$('visualPetal').style.opacity='1';}
function buttons(){ $('partButtons').replaceChildren();for(const [id,name] of groups){const b=document.createElement('button');b.dataset.part=id;b.textContent=name;const small=document.createElement('small');small.textContent=current.length?`${current.filter(x=>x.group===id).length}成分`:'—';b.append(small);b.onclick=()=>part(id);$('partButtons').append(b);}part(selected);}
// 花の種類は解析した成分の既知分類から自動決定し、画面・レポートへ反映する。
function showAutomaticFlower(){
  if(!current.length)return;
  const choice=bloomRecommendation||recommendFlower(current);
  const flower=flowerTypes.find(f=>f.id===choice.id)||flowerTypes.at(-1);
  renderFlower($('flower'),flower.id);
  $('flowerCaptionName').textContent=flower.name;
  $('flowerCaptionNote').textContent=flower.short.replace('の比喩','のイメージ')+'。';
  const intent=summarizeFormulaIntent(current);
  $('formulaAim').textContent='処方の狙い（成分からの推定）：'+intent;
  $('formulaAim').hidden=false;
  $('flowerTypeTag').textContent=flower.name+'（自動判定）';
  $('flowerTypeReason').textContent='選定理由：'+choice.reasons.join(' ')+' 花の種類は視覚的な比喩であり、濃度・効果・安全性・優劣を表しません。';
  report=reportCore+'\n\n出典・処方: '+$('sourceQuality').textContent+'\n\n処方の狙い（成分からの推定）: '+intent+'\n花の種類: '+flower.name+'（自動判定）\n選定理由: '+choice.reasons.join(' ')+'\n花種は視覚的比喩であり、処方の効果・安全性・配合濃度を評価しません。';
  part(selected);
}
function run(){try{$('error').textContent='';if(!official&&!remoteProduct&&!$('japanConfirmed').checked)throw Error('日本国内で販売する製品の日本語表示を確認し、チェックを入れてください。');if(!official&&!remoteProduct&&!isJapaneseIngredientsList($('ingredients').value))throw Error('日本向け容器・外箱に記載された日本語の成分名を入力してください。海外版INCIや英語の成分表では解析できません。');if($('kind').value==='unsure')throw Error('化粧品か医薬部外品か区分を確認してください。容器に記載された区分をご確認ください。');if(ocrRequired&&!$('ocrChecked').checked)throw Error('写真と読み取り結果を確認・修正し、チェックを入れてください。');if(remoteProduct&&!remoteProduct.japanMarketConfirmed)throw Error('日本向け成分表示を確認できない商品は解析できません。');const result=analyze($('ingredients').value);current=result;$('sourceQuality').textContent=remoteProduct?provenanceText(provenance(remoteProduct)):official?'収録サンプル：'+product.name+'／メーカーの配合目的別表・配合順ではありません／出典：'+SOURCE:'利用者入力：メーカー公式原文・販売地域・処方バージョンは未確認です。';if(remoteProduct){for(const x of current){const row=remoteProduct.rows.find(r=>normalize(r.name)===normalize(x.name));if(row){const role=row.role;const mapped=/基剤/.test(role)?'root':/保湿|エモリエント|保護/.test(role)?'leaf':/乳化|可溶化|増粘|防腐|調整|酸化防止|キレート|安定/.test(role)?'stem':/着香|香料|感触/.test(role)?'scent':/整肌/.test(role)?'petal':null;if(mapped)x.group=mapped;x.role=row.role;x.evidence=row.evidence||'公式ページに記載された配合目的。分類は本アプリの解釈。';x.url=remoteProduct.url;}}}bloomRecommendation=recommendFlower(current);selected='petal';const counts=groups.map(([id])=>current.filter(x=>x.group===id).length),unknown=current.filter(x=>x.group==='unknown').length;const leaf=counts[2]>0;const known=current.length-unknown;const missingJapanese=current.filter(x=>japaneseName(x)==='日本語表示名未確認').length;$('flowerTitle').textContent=known?(unknown?'確認できた成分の花':leaf?'うるおいの葉を広げる、一輪。':'土台と構造から、処方を眺める。'):'まだ、花のかたちはわかりません。';$('flowerSubtitle').textContent=remoteProduct?(productJapaneseAid(remoteProduct.name)?productJapaneseAid(remoteProduct.name)+'（公式名：'+remoteProduct.name+'）':remoteProduct.name):official?product.name:'入力された成分からの、役割の仮説です。';$('resultBadge').textContent=`${known} / ${current.length}成分を分類`;$('analysisDetails').hidden=false;$('uncertainty').textContent=unknown?`未確認 ${unknown}成分あり・根拠は下で確認できます`:'成分の役割から描いたイメージです';if($('kind').value==='quasi')$('uncertainty').textContent+='／薬用製品は成分の一般的役割のみを分類。効能・濃度は判定していません。';if(matchMedia('(max-width: 850px)').matches)$('flower').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});const summary=`${counts[0]?`根のベース成分${counts[0]}種`:'ベース骨格は未確認'}、${counts[1]?`茎の構造・安定性成分${counts[1]}種`:'構造成分は未確認'}、${counts[2]?`葉の保湿・保護成分${counts[2]}種`:'保湿・保護成分は未確認'}として読み解きました。${counts[3]?`花びらには機能性・訴求に関わる${counts[3]}種を対応させています。`:'花びらに当たる成分は今回の辞書では確認できません。'}${counts[4]?`香り・使用感に関わる成分は${counts[4]}種です。`:'香り・使用感に関わる成分は未確認です。'} 成分の種類数は配合量や効果の強さを表しません。`;$('summary').textContent=summary;$('coverage').textContent=`分類済み ${known}種 ／ 未確認 ${unknown}種。${missingJapanese?'日本語表示名未確認 '+missingJapanese+'種。':''}多機能の成分を一つの主分類に整理した説明用の図です。`;
$('boundaryTitle').textContent=$('kind').value==='quasi'?'医薬部外品：1%境界は推定対象外':'位置は推定不能・濃度は表示しません';$('boundaryText').textContent=(official||remoteProduct?.order?.includes('目的別')?'この公式データは配合目的別の表で、配合順ではありません。':'表示順だけでは1%以下になる位置を特定できません。')+' 1%以下の成分と着色剤には順不同の例外があります。防腐剤や増粘剤の位置は考察の手がかりになっても、境界の証拠にはなりません。メーカーの配合量資料がない入力には、数値を補いません。';if($('kind').value==='quasi')$('boundaryText').textContent='この製品は医薬部外品（薬用）として取り扱います。有効成分・その他の成分という表示区分と、化粧品の全成分表示の配合順ルールは同じではありません。成分の並びから1%境界や濃度は推定できず、配合しているだけで有効性を証明するものでもありません。';if(remoteProduct?.region==='global'&&$('kind').value!=='quasi')$('boundaryText').textContent='海外公式版の全成分表示です。販売地域や改良によって国内版と異なる場合があります。日本の表示順ルールをそのまま適用せず、記載順だけで濃度や1%境界を断定しません。';const claim=$('claim').value.trim();$('adText').textContent=claim?`入力された訴求「${claim}」は未検証です。今回の成分分類では、この広告の正確さや効能を判定できません。`:'広告の訴求が未入力のため、個別の比較は行っていません。';$('ingredientRows').innerHTML=current.map(x=>`<tr><td>${x.index+1}${official?'（表順）':''}</td><td>${escape(japaneseName(x))}</td><td>${groups.find(g=>g[0]===x.group)?.[1]||'未確認'} / ${escape(x.role)}</td><td>${escape(official&&x.url===SOURCE?'この製品のメーカー公表目的。花への対応付けは本アプリの解釈。':x.evidence)}${x.url?`<br><a href="${x.url}" target="_blank" rel="noopener">参考出典 ↗</a>`:''}</td></tr>`).join('');buttons();reportCore=`処方の花 / ${new Date().toISOString()}\n${remoteProduct?(productJapaneseAid(remoteProduct.name)?productJapaneseAid(remoteProduct.name)+'（公式名：'+remoteProduct.name+'）':remoteProduct.name):official?product.name:'利用者入力'}\n${summary}\n${$('boundaryText').textContent}\n${$('adText').textContent}\n\n${current.map(x=>`${x.index+1}. ${japaneseName(x)} / ${x.role} / ${x.evidence} ${x.url||''}`).join('\n')}\n\n全成分の出典: ${remoteProduct?.url|| (official?SOURCE:'利用者入力')}\n参考: ${SOURCE}\n濃度・製品効果・安全性は評価していません。`;showAutomaticFlower();historyTools.ready();$('exportImage').disabled=false;$('shareImage').disabled=false; }catch(e){$('error').textContent=e.message;$('editorDetails').open=true;}}
const historyTools=setupHistoryTools(()=>makeSnapshot({
 name:remoteProduct?.name||(official?product.name:($('query').value.trim()||'利用者入力の処方')),
 ingredients:$('ingredients').value,kind:$('kind').value,
 source:remoteProduct?.url||(official?SOURCE:'利用者入力・出典未確認')
}));
function myFormulaStore(){try{return localStorage;}catch{return null;}}
function useMyFormula(entry){
 invalidate();official=false;ocrRequired=false;
 remoteProduct={name:(entry.brand?entry.brand+' ':'')+entry.name,sourceType:'user-saved',region:'jp',
  kind:entry.kind,ingredients:entry.ingredients,url:entry.sourceUrl||'',rows:[],
  japanMarketConfirmed:true,order:'利用者が国内向け成分表から保存した処方（製品同一性・現物未検証）',
  label:'端末保存の全成分（'+entry.savedAt.slice(0,10)+'登録）'};
 $('query').value=remoteProduct.name;$('ingredients').value=entry.ingredients;
 $('origin').textContent=remoteProduct.order;$('kind').value=entry.kind;
 $('japanConfirmed').checked=true;$('sourceInfo').replaceChildren();
 const note=document.createElement('p');note.className='muted';
 note.textContent='この端末に保存した成分表です。実物と最新処方を確認してください。';
 $('sourceInfo').append(note);
 if(entry.sourceUrl)sourceLink($('sourceInfo'),entry.sourceUrl,'確認元のページ');
 run();
}
function presentMyFormulas(items){
 $('searchResults').replaceChildren();
 const lead=document.createElement('p');lead.className='muted';
 lead.textContent='端末に保存した処方 '+items.length+'件。選ぶと全成分から花にします。';
 $('searchResults').append(lead);
 for(const entry of items){
  const button=document.createElement('button');button.className='product-option';button.type='button';
  button.textContent=(entry.brand?entry.brand+' ':'')+entry.name+'（端末保存 '+entry.savedAt.slice(0,10)+'）';
  button.onclick=()=>useMyFormula(entry);$('searchResults').append(button);
 }
}
function renderMyFormulaList(){
 const root=$('myFormulaList');root.replaceChildren();
 const items=readMyFormulas(myFormulaStore());
 if(!items.length){root.textContent='保存した商品はありません。';return;}
 for(const entry of items){
  const div=document.createElement('div');div.className='history-entry';
  const name=document.createElement('strong');
  name.textContent=(entry.brand?entry.brand+' ':'')+entry.name+'（'+entry.savedAt.slice(0,10)+'）';
  const select=document.createElement('button');select.type='button';select.className='secondary';
  select.textContent='この処方で花にする';select.onclick=()=>useMyFormula(entry);
  const del=document.createElement('button');del.type='button';del.className='secondary';
  del.textContent='削除';let armed=false;
  del.onclick=()=>{
   if(!armed){armed=true;del.textContent='もう一度押して削除';return;}
   const ok=deleteMyFormula(myFormulaStore(),entry.id);
   $('myFormulaStatus').textContent=ok?'端末から削除しました。':'削除できませんでした。';
   renderMyFormulaList();
  };
  div.append(name,select,del);root.append(div);
 }
}
$('myFormulas').ontoggle=()=>{if($('myFormulas').open)renderMyFormulaList();};
for(const id of ['myName','myBrand','mySource'])$(id).oninput=()=>{$('myConfirmed').checked=false;};
$('saveMyFormula').onclick=()=>{
 try{
  const result=saveMyFormula(myFormulaStore(),{
   name:$('myName').value,brand:$('myBrand').value,sourceUrl:$('mySource').value,
   ingredients:$('ingredients').value,kind:$('kind').value,
   confirmed:$('myConfirmed').checked&&$('japanConfirmed').checked
  },{id:crypto.randomUUID(),savedAt:new Date().toISOString()});
  $('myFormulaStatus').textContent=result.saved?'この端末に登録しました。商品名で検索できます。':'同じ全成分の登録が既にあります。';
  $('myConfirmed').checked=false;renderMyFormulaList();
 }catch(e){$('myFormulaStatus').textContent=e.message;}
};

$('analyze').onclick=run;buttons();resetFlower($('flower'));$('flowerCaptionName').textContent='野の花';$('flowerCaptionNote').textContent='全成分から花を選びます。';
$('download').onclick=()=>{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([report],{type:'text/plain;charset=utf-8'}));a.href=url;a.download='処方の花-解析.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
let photoURL,photoFile;
let ocrReviewGeneration=0;
function hideOCRReview(){
 ++ocrReviewGeneration;
 $('ocrReview').hidden=true;
 $('ocrReviewSummary').textContent='';
 $('ocrSuggestions').replaceChildren();
}
async function refreshOCRReview(){
 const generation=++ocrReviewGeneration,raw=$('ingredients').value;
 if(!ocrRequired||inputMode!=='image'||!photoFile||!raw.trim()){
  $('ocrReview').hidden=true;
  $('ocrSuggestions').replaceChildren();
  return;
 }
 $('ocrReview').hidden=false;
 $('ocrReviewSummary').textContent='成分名の候補を確認しています…';
 const archive=await formulaArchive();
 if(generation!==ocrReviewGeneration||raw!==$('ingredients').value)return;
 $('ocrSuggestions').replaceChildren();
 if(!archive){
  $('ocrReviewSummary').textContent='校正候補を読み込めません。成分表を直接確認してください。';
  return;
 }
 const known=createOCRLexicon(archive.records);
 const suggestions=findOCRCorrections(raw,known,{limit:12});
 $('ocrReviewSummary').textContent=suggestions.length?
  '修正候補 '+suggestions.length+'件。写真と照らして、必要なものだけ選んでください。':
  '修正候補は見つかりませんでした。読み取り結果の正しさを保証するものではありません。';
 for(const issue of suggestions){
  const row=document.createElement('div');row.className='ocr-suggestion';
  const title=document.createElement('strong');title.textContent='読み取り：'+issue.original;
  const help=document.createElement('small');help.textContent=issue.reason+'（国内公式の掲載成分から候補を提示）';
  row.append(title,help);
  for(const label of issue.candidates){
   const button=document.createElement('button');button.type='button';button.className='secondary';
   button.textContent='「'+label+'」に修正';
   button.onclick=()=>{
    try{
     if(raw!==$('ingredients').value)throw Error('文字が変更されています。');
     $('ingredients').value=applyOCRCorrection(raw,issue,label);
     $('ingredients').dispatchEvent(new Event('input',{bubbles:true}));
     $('editorDetails').open=true;
     $('ocrStatus').textContent='候補を反映しました。写真を確認してからチェックしてください。';
    }catch(e){$('ocrStatus').textContent=e.message+'もう一度候補を確認してください。';refreshOCRReview();}
   };
   row.append(button);
  }
  $('ocrSuggestions').append(row);
 }
}
$('photo').onchange=()=>{const f=$('photo').files[0];if(!f)return;invalidate();$('japanConfirmed').checked=false;remoteProduct=null;$('sourceInfo').replaceChildren();official=false;ocrRequired=true;hideOCRReview();$('ocrChecked').checked=false;$('ocr').disabled=true;$('ingredients').value='';$('origin').textContent='画像読み取り・要確認';$('ocrStatus').textContent='';if(!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>10*1024*1024){photoFile=null;$('photoPreview').hidden=true;$('ocrStatus').textContent='10MB以下のJPEG・PNG・WebPを選択してください。';return;}if(photoURL)URL.revokeObjectURL(photoURL);photoFile=f;photoURL=URL.createObjectURL(f);$('photoPreview').src=photoURL;$('photoPreview').hidden=false;$('ocr').disabled=false;};
async function loadOCR(){if(window.Tesseract)return;await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';s.onload=resolve;s.onerror=()=>reject(Error('OCRを読み込めませんでした。通信を確認するか、全成分テキストを入力してください。'));document.head.append(s);});}
$('ocr').onclick=async()=>{if(!photoFile)return;$('ocr').disabled=true;const targetFile=photoFile;try{$('ocrStatus').textContent='OCRを準備中です。初回は辞書の読み込みに時間がかかります。';await loadOCR();worker=await window.Tesseract.createWorker('jpn+eng',1,{logger:m=>{$('ocrStatus').textContent=`読み取り中… ${Math.round((m.progress||0)*100)}%`;}});const {data}=await worker.recognize(targetFile);if(targetFile!==photoFile||inputMode!=='image')return;$('ingredients').value=data.text;official=false;ocrRequired=true;$('ocrChecked').checked=false;$('ocrStatus').textContent=data.text.trim()?'読み取りが終わりました。写真で改行・成分名を確認し、必要に応じて修正してください。':'文字を検出できませんでした。明るく鮮明な画像か、手入力をお使いください。';refreshOCRReview();}catch(e){$('ocrStatus').textContent='読み取りできませんでした。全成分の手入力も利用できます。 '+e.message;}finally{if(worker){await worker.terminate();worker=null;}$('ocr').disabled=false;}};

// SVGは説明用の画像として扱い、キーボード操作は画面下の実際のボタンに集約。
for(const [id] of groups){const node=$('visual'+id[0].toUpperCase()+id.slice(1));node.style.cursor='pointer';node.onclick=()=>part(id);}

let brandCatalog=null,brandLoading=false,verifiedBrandCounts=new Map(),coverageLoaded=false;
function showBrands(){
  if(!brandCatalog)return;
  const query=$('brandFilter').value.trim();
  const matches=brandCatalog.brands.filter(b=>!query||brandQueryMatches(b,query));
  $('brandList').replaceChildren();
  const visible=[...matches].sort((a,b)=>(verifiedBrandCounts.get(b.name)||0)-(verifiedBrandCounts.get(a.name)||0)||
 Number(b.japanSiteVerified)-Number(a.japanSiteVerified)||a.name.localeCompare(b.name,'ja'));
  for(const brand of visible){
    const cell=document.createElement('div');cell.className='brand-entry';
    const select=document.createElement('button');select.type='button';select.className='brand-choice';
    select.textContent=japaneseBrandLabel(brand);
    select.onclick=()=>{
      tab('search');invalidate();remoteProduct=null;$('query').value=brand.name;
      $('brandDirectory').open=false;
      openBrandProducts(brand.name);
      $('query').focus();
    };
    const meta=document.createElement('small');
    const savedCount=verifiedBrandCounts.get(brand.name)||0;
    meta.textContent=savedCount?'日本公式の全成分保存版 '+savedCount+'処方':
      '日本語全成分：未収録（ブランド登録のみ）';
    cell.append(select,meta);
    if(brand.japanSiteVerified&&brand.site){const link=document.createElement('a');link.href=brand.site;link.target='_blank';link.rel='noopener noreferrer';link.textContent='サイト';link.setAttribute('aria-label',brand.name+'の関連公式サイト');cell.append(link);}
    $('brandList').append(cell);
  }
  const stats=brandCatalog.stats;
  const verifiedBrands=[...verifiedBrandCounts].filter(([,count])=>count>0).length;
  const verifiedFormulas=[...verifiedBrandCounts.values()].reduce((sum,count)=>sum+count,0);
  $('brandCounts').textContent='登録 '+stats.total+'ブランド ／ 国内公式の成分保存版 '+verifiedBrands+'ブランド・'+verifiedFormulas+'処方。ブランド内の全商品を網羅した意味ではありません。';
  if(!matches.length)$('brandList').textContent='該当ブランドは未登録です。メーカー公式のURLからも調べられます。';
}
$('brandFilter').oninput=showBrands;
$('brandDirectory').ontoggle=async()=>{
  if(!$('brandDirectory').open||brandCatalog||brandLoading)return;
  brandLoading=true;
  try{
   const [catalog,archive]=await Promise.all([getJSON('/api/brands'),formulaArchive()]);
   brandCatalog=catalog;
   verifiedBrandCounts=new Map();
   for(const record of archive?.records||[]){
     verifiedBrandCounts.set(record.brand,(verifiedBrandCounts.get(record.brand)||0)+1);
   }
   coverageLoaded=!!archive;
   showBrands();
  }
  catch(e){$('brandCounts').textContent='ブランド一覧を表示できませんでした。検索・直接入力は引き続き利用できます。';}
  finally{brandLoading=false;}
};

// エクスポートは明示的な利用者操作のときだけ実行し、画像をサーバーへ送信しない。
function posterData(){
 const flowerId=bloomRecommendation?.id;
 const flower=flowerTypes.find(x=>x.id===flowerId)||flowerTypes.at(-1);
 return {productName:remoteProduct?.name|| (official?product.name:'利用者入力の処方'),flower,
   known:current.filter(x=>x.group!=='unknown').length,total:current.length,
   count:Object.fromEntries(groups.map(([id])=>[id,current.filter(x=>x.group===id).length])),
   source:remoteProduct?.url|| (official?SOURCE:'利用者入力・原文未確認'),
   region:remoteProduct?.sourceType==='user-shared'?'外部サイト掲載・利用者確認・現物未確認':remoteProduct?.sourceType==='beauty'?'国内コスメ情報サイト・現物未確認':remoteProduct?.sourceType==='shop'?'国内通販掲載・現物未確認':remoteProduct?.region==='global'?'海外公式版（国内版との違いに注意）':remoteProduct?'公式サイト掲載版':'入力データ',
   date:new Date().toLocaleDateString('ja-JP')};
}
$('exportImage').onclick=async()=>{
 try{$('shareStatus').textContent='画像を作成しています…';await savePoster(createPoster(posterData()));$('shareStatus').textContent='PNG画像を保存しました。';}
 catch(e){$('shareStatus').textContent='画像の保存に失敗しました：'+e.message;}
};
$('shareImage').onclick=async()=>{
 try{$('shareStatus').textContent='共有画像を作成しています…';const data=posterData();const outcome=await sharePoster(createPoster(data),shareCaption(data));
 $('shareStatus').textContent=outcome==='shared'?'共有先へ渡しました。':outcome==='saved'?'画像を保存しました。共有できない端末では画像を添付してください。':'操作をキャンセルしました。';}
 catch(e){$('shareStatus').textContent='共有できませんでした：'+e.message;}
};
