/* =====================================================================
   ParisVTCDriver — Bandeau de consentement cookies + Google Consent Mode v2
   Le mode "default = denied" est posé en <head> de chaque page (inline).
   Ce fichier affiche le bandeau et applique le choix du visiteur.
   ===================================================================== */
(function(){
  var KEY='pvtc_consent';
  function gtag(){ (window.dataLayer=window.dataLayer||[]).push(arguments); }
  function applyConsent(grant){
    var v=grant?'granted':'denied';
    gtag('consent','update',{ad_storage:v,ad_user_data:v,ad_personalization:v,analytics_storage:v});
  }
  // Déjà choisi → ne rien afficher (le <head> a déjà restauré le choix)
  var saved=null; try{ saved=localStorage.getItem(KEY); }catch(e){}
  if(saved==='granted'||saved==='denied') return;

  // Langue (au mieux) : stockage du site → attribut <html lang> → navigateur
  var SUP=['fr','en','es','it','pt','tr','zh','ar'], L='fr';
  try{
    var ls=(localStorage.getItem('pvtc_lang')||localStorage.getItem('lang')||localStorage.getItem('LANG')||'').toLowerCase().slice(0,2);
    var hl=(document.documentElement.getAttribute('lang')||'').toLowerCase().slice(0,2);
    var nv=(navigator.language||'').toLowerCase().slice(0,2);
    var cand=ls||hl||nv||'fr';
    L = SUP.indexOf(cand)>=0 ? cand : (cand==='fr'?'fr':'en');
  }catch(e){}

  var T={
    txt:{
      fr:"Nous utilisons des cookies pour mesurer l'audience et personnaliser nos publicités. Vous pouvez accepter ou refuser.",
      en:"We use cookies to measure traffic and personalise our ads. You can accept or decline.",
      es:"Usamos cookies para medir la audiencia y personalizar nuestros anuncios. Puede aceptar o rechazar.",
      it:"Usiamo i cookie per misurare il traffico e personalizzare gli annunci. Puoi accettare o rifiutare.",
      pt:"Usamos cookies para medir o tráfego e personalizar os nossos anúncios. Pode aceitar ou recusar.",
      tr:"Trafiği ölçmek ve reklamlarımızı kişiselleştirmek için çerez kullanıyoruz. Kabul edebilir veya reddedebilirsiniz.",
      zh:"我们使用 Cookie 来统计访问量并个性化广告。您可以接受或拒绝。",
      ar:"نستخدم ملفات تعريف الارتباط لقياس الزيارات وتخصيص إعلاناتنا. يمكنك القبول أو الرفض."
    },
    accept:{fr:"Accepter",en:"Accept",es:"Aceptar",it:"Accetta",pt:"Aceitar",tr:"Kabul et",zh:"接受",ar:"قبول"},
    refuse:{fr:"Refuser",en:"Decline",es:"Rechazar",it:"Rifiuta",pt:"Recusar",tr:"Reddet",zh:"拒绝",ar:"رفض"},
    more:{fr:"En savoir plus",en:"Learn more",es:"Más información",it:"Maggiori info",pt:"Saber mais",tr:"Daha fazla",zh:"了解更多",ar:"معرفة المزيد"}
  };
  function tr(k){ return (T[k][L]||T[k].fr); }

  var css="#pvtc-consent{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;background:rgba(13,23,48,.97);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-top:1px solid rgba(201,162,74,.35);color:#eef2fb;font-family:'Outfit',system-ui,-apple-system,sans-serif;padding:15px 20px;display:flex;gap:16px;align-items:center;justify-content:center;flex-wrap:wrap;box-shadow:0 -8px 30px rgba(0,0,0,.45)}"
    +"#pvtc-consent .pvtc-c-txt{font-size:13.5px;line-height:1.5;max-width:760px}"
    +"#pvtc-consent a{color:#e7c878;text-decoration:underline}"
    +"#pvtc-consent .pvtc-c-btns{display:flex;gap:10px;flex:none}"
    +"#pvtc-consent button{font-family:inherit;cursor:pointer;border-radius:9px;padding:9px 18px;font-size:13.5px;font-weight:600;border:1px solid transparent;transition:filter .2s,background .2s}"
    +"#pvtc-consent .pvtc-c-refuse{background:transparent;color:#eef2fb;border-color:rgba(255,255,255,.28)}"
    +"#pvtc-consent .pvtc-c-refuse:hover{background:rgba(255,255,255,.06)}"
    +"#pvtc-consent .pvtc-c-accept{background:linear-gradient(135deg,#f1d894,#c9a24a 60%,#a9842f);color:#1c1604}"
    +"#pvtc-consent .pvtc-c-accept:hover{filter:brightness(1.06)}"
    +"#pvtc-consent[dir=rtl]{direction:rtl}"
    +"@media(max-width:640px){#pvtc-consent{padding:13px 16px}#pvtc-consent .pvtc-c-btns{width:100%}#pvtc-consent button{flex:1}}";

  function build(){
    var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
    var bar=document.createElement('div'); bar.id='pvtc-consent';
    if(L==='ar') bar.setAttribute('dir','rtl');
    bar.setAttribute('role','dialog'); bar.setAttribute('aria-live','polite');
    bar.innerHTML='<div class="pvtc-c-txt">'+tr('txt')+' <a href="cookies.html">'+tr('more')+'</a></div>'
      +'<div class="pvtc-c-btns"><button type="button" class="pvtc-c-refuse">'+tr('refuse')+'</button>'
      +'<button type="button" class="pvtc-c-accept">'+tr('accept')+'</button></div>';
    document.body.appendChild(bar);
    function choose(grant){ try{localStorage.setItem(KEY,grant?'granted':'denied');}catch(e){} applyConsent(grant); bar.parentNode&&bar.parentNode.removeChild(bar); }
    bar.querySelector('.pvtc-c-accept').addEventListener('click',function(){choose(true);});
    bar.querySelector('.pvtc-c-refuse').addEventListener('click',function(){choose(false);});
  }
  if(document.body) build(); else document.addEventListener('DOMContentLoaded',build);
})();
