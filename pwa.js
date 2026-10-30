const status=document.getElementById('pwaStatus');
const update=document.getElementById('pwaUpdate');
const install=document.getElementById('pwaInstall');
let registration,installPrompt,applying=false;
let controlled=Boolean(navigator.serviceWorker?.controller);
const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
function connection(){status.textContent=navigator.onLine?'初回の準備後は、通信なしでも検索・花生成が使えます。':'オフラインです。保存版の検索・花生成を利用できます。OCRの初回準備には通信が必要です。';}
connection();addEventListener('online',connection);addEventListener('offline',connection);
addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;if(!standalone)install.hidden=false;});
install.addEventListener('click',async()=>{if(!installPrompt)return;await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;install.hidden=true;});
addEventListener('appinstalled',()=>{install.hidden=true;});
let notification;
function updateNotice(){
 if(notification)return;
 notification=document.createElement('div');
 notification.className='pwa-update-notice';
 notification.setAttribute('role','status');
 const message=document.createElement('span');
 message.textContent='新しい画面を利用できます。';
 const action=document.createElement('button');
 action.type='button';
 action.textContent='最新版に更新';
 action.addEventListener('click',()=>update.click());
 notification.append(message,action);
 document.body.append(notification);
}
function showUpdate(){
 if(!registration?.waiting)return;
 update.hidden=false;update.disabled=false;
 update.closest('details').open=true;
 updateNotice();
}
update.addEventListener('click',()=>{
 if(!registration?.waiting){location.reload();return;}
 applying=true;update.disabled=true;registration.waiting.postMessage({type:'APPLY_UPDATE'});
});
if('serviceWorker' in navigator){
 navigator.serviceWorker.addEventListener('controllerchange',()=>{
  if(applying){location.reload();return;}
  if(!controlled){controlled=true;return;}
  update.hidden=false;update.closest('details').open=true;
  update.disabled=false;update.textContent='最新版を表示';updateNotice();
 });
 navigator.serviceWorker.register(new URL('./sw.js',import.meta.url),{scope:new URL('./',import.meta.url).pathname,updateViaCache:'none'}).then(async value=>{
  registration=value;showUpdate();
  const watchInstalling=()=>{
   const installing=registration.installing;
   installing?.addEventListener('statechange',()=>{if(installing.state==='installed'){
    if(navigator.serviceWorker.controller)showUpdate();
    else status.textContent='オフラインで使う準備ができました。';
   }});
  };
  registration.addEventListener('updatefound',watchInstalling);
  watchInstalling();
  await navigator.serviceWorker.ready;
  if(navigator.onLine){await registration.update().catch(()=>{});showUpdate();}
  if(!registration.waiting&&navigator.onLine)status.textContent='オフラインで使う準備ができました。';
 }).catch(()=>{status.textContent='オフラインの準備ができませんでした。通信中は通常どおり利用できます。';});
 const check=()=>registration?.update().catch(()=>{});
 addEventListener('online',check);
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')check();});
}
