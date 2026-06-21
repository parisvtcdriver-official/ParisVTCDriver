/* ParisVTCDriver — shared multilingual engine for pack pages */
(function(){
const COMMON={
 fr:{back:"← Retour à ma réservation",pk_loisir:"Pack Loisir & Visite",book:"Réserver ce pack",see:"Voir le détail",howto:"Comment ça marche",gal_eyebrow:"En images",cont:"Continuer ma réservation",cont_note:"Votre réservation en cours sur le site est conservée.",foot_copy:"Chauffeur Premium · Paris & France",backsite:"Retour au site",brandtag:"Chauffeur Premium · Paris",photonote:"Photos d'illustration — remplacez les fichiers image par vos visuels."},
 en:{back:"← Back to my booking",pk_loisir:"Leisure & Sightseeing Pack",book:"Book this pack",see:"See details",howto:"How it works",gal_eyebrow:"In pictures",cont:"Continue my booking",cont_note:"Your current booking on the site is kept.",foot_copy:"Premium Chauffeur · Paris & France",backsite:"Back to site",brandtag:"Premium Chauffeur · Paris",photonote:"Illustrative photos — replace the image files with your own visuals."},
 es:{back:"← Volver a mi reserva",pk_loisir:"Pack Ocio y Visitas",book:"Reservar este pack",see:"Ver detalles",howto:"Cómo funciona",gal_eyebrow:"En imágenes",cont:"Continuar mi reserva",cont_note:"Su reserva en curso en el sitio se conserva.",foot_copy:"Chófer Premium · París y Francia",backsite:"Volver al sitio",brandtag:"Chófer Premium · París",photonote:"Fotos ilustrativas — sustituya los archivos de imagen por sus propias fotos."},
 it:{back:"← Torna alla prenotazione",pk_loisir:"Pack Svago e Visite",book:"Prenota questo pack",see:"Vedi dettagli",howto:"Come funziona",gal_eyebrow:"Immagini",cont:"Continua la prenotazione",cont_note:"La tua prenotazione in corso sul sito viene conservata.",foot_copy:"Autista Premium · Parigi e Francia",backsite:"Torna al sito",brandtag:"Autista Premium · Parigi",photonote:"Foto illustrative — sostituisci i file immagine con i tuoi visual."},
 pt:{back:"← Voltar à minha reserva",pk_loisir:"Pack Lazer e Visitas",book:"Reservar este pack",see:"Ver detalhes",howto:"Como funciona",gal_eyebrow:"Em imagens",cont:"Continuar minha reserva",cont_note:"Sua reserva em curso no site é mantida.",foot_copy:"Motorista Premium · Paris e França",backsite:"Voltar ao site",brandtag:"Motorista Premium · Paris",photonote:"Fotos ilustrativas — substitua os arquivos de imagem pelos seus visuais."},
 tr:{back:"← Rezervasyonuma dön",pk_loisir:"Eğlence ve Gezi Paketi",book:"Bu paketi ayırt",see:"Ayrıntıları gör",howto:"Nasıl çalışır",gal_eyebrow:"Görsellerle",cont:"Rezervasyonuma devam et",cont_note:"Sitedeki mevcut rezervasyonunuz korunur.",foot_copy:"Premium Şoför · Paris ve Fransa",backsite:"Siteye dön",brandtag:"Premium Şoför · Paris",photonote:"Örnek görseller — görsel dosyalarını kendi fotoğraflarınızla değiştirin."},
 zh:{back:"← 返回我的预订",pk_loisir:"休闲与观光套餐",book:"预订此套餐",see:"查看详情",howto:"如何运作",gal_eyebrow:"图片展示",cont:"继续我的预订",cont_note:"您在网站上正在进行的预订将被保留。",foot_copy:"高级专属司机 · 巴黎及法国",backsite:"返回网站",brandtag:"高级专属司机 · 巴黎",photonote:"示意图 — 请用您自己的图片替换图像文件。"},
 ar:{back:"← العودة إلى حجزي",pk_loisir:"باقة ترفيه وسياحة",book:"احجز هذه الباقة",see:"عرض التفاصيل",howto:"كيف تعمل",gal_eyebrow:"بالصور",cont:"متابعة حجزي",cont_note:"يبقى حجزك الحالي على الموقع محفوظاً.",foot_copy:"سائق خاص فاخر · باريس وفرنسا",backsite:"العودة إلى الموقع",brandtag:"سائق خاص فاخر · باريس",photonote:"صور توضيحية — استبدل ملفات الصور بصورك الخاصة."}
};
const LANGS=["fr","en","tr","es","it","pt","zh","ar"];
const NATIVE={tr:["TR","Türkçe"],es:["ES","Español"],it:["IT","Italiano"],pt:["PT","Português"],zh:["中","中文"],ar:["ع","العربية"]};
let DICT={};LANGS.forEach(l=>{DICT[l]=Object.assign({},COMMON[l]||{},(window.PAGE_I18N&&window.PAGE_I18N[l])||{});});
let LANG="fr";
function pt(k){return (DICT[LANG]&&DICT[LANG][k])||DICT.en[k]||k;}
window.packT=pt;
window.packSetLang=function(l){
  if(!DICT[l])l="en";LANG=l;document.documentElement.lang=l;
  document.documentElement.dir=(l==="ar")?"rtl":"ltr";
  try{localStorage.setItem("pvtc_lang",l);}catch(e){}
  document.querySelectorAll("[data-lang]").forEach(b=>b.classList.toggle("active",b.dataset.lang===l));
  document.querySelectorAll("[data-i18n]").forEach(el=>{el.innerHTML=pt(el.dataset.i18n);});
  document.querySelectorAll("[data-i18n-ph]").forEach(el=>{el.placeholder=pt(el.dataset.i18nPh);});
  const more=document.getElementById("langMore");if(more)more.classList.toggle("active",["tr","es","it","pt","zh","ar"].includes(l));
  const menu=document.getElementById("langMenu");if(menu)menu.classList.remove("open");
};
window.packToggleMenu=function(e){e.stopPropagation();const m=document.getElementById("langMenu");if(m)m.classList.toggle("open");};
function injectCSS(){
  const css=`.lang{display:flex;position:relative;background:rgba(255,255,255,.04);border:1px solid var(--line-soft);border-radius:10px;padding:3px}
  .lang>button{background:none;border:none;color:var(--muted);font-family:inherit;font-weight:600;font-size:13px;padding:6px 12px;border-radius:7px;cursor:pointer;transition:all .2s}
  .lang>button.active{background:linear-gradient(145deg,var(--gold),var(--gold-2));color:#1a1404}
  .lang .lang-more{padding:6px 10px;font-size:15px;line-height:1;color:var(--gold-2)}
  .lang .lang-more.active{background:linear-gradient(145deg,var(--gold),var(--gold-2));color:#1a1404}
  .lang-menu{position:absolute;top:calc(100% + 8px);right:0;z-index:60;min-width:158px;background:#0c1424;border:1px solid var(--line);border-radius:12px;padding:6px;box-shadow:0 24px 50px -20px rgba(0,0,0,.9);display:none;flex-direction:column;gap:2px}
  .lang-menu.open{display:flex}
  .lang-menu button{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:none;border:none;color:var(--txt);font-family:inherit;font-size:14px;font-weight:500;padding:9px 11px;border-radius:8px;cursor:pointer;transition:background .15s}
  .lang-menu button:hover{background:rgba(201,162,74,.12)}
  .lang-menu button.active{background:rgba(201,162,74,.16);color:var(--gold-2)}
  .lang-menu button span{display:inline-grid;place-items:center;width:24px;height:20px;font-size:11px;font-weight:700;border-radius:5px;background:rgba(255,255,255,.06);color:var(--gold-2)}
  .nav-inner .lang{margin-left:auto}
  .nav-inner .lang + .btn{margin-left:14px}
  [dir="rtl"] body{font-family:'Outfit','Noto Sans Arabic','Segoe UI','Tahoma',system-ui,sans-serif}
  [dir="rtl"] .lang-menu{right:auto;left:0}
  [dir="rtl"] .nav-inner .lang{margin-left:0;margin-right:auto}
  [dir="rtl"] .nav-inner .lang + .btn{margin-left:0;margin-right:14px}
  [dir="rtl"] .eyebrow::before{margin-right:0;margin-left:10px;transform:scaleX(-1)}
  [dir="rtl"] .hero h1 em{font-style:normal}`;
  const s=document.createElement("style");s.textContent=css;document.head.appendChild(s);
}
function buildSwitcher(){
  const slot=document.getElementById("langSlot");if(!slot)return;
  let html='<div class="lang"><button data-lang="fr" onclick="packSetLang(\'fr\')">FR</button><button data-lang="en" onclick="packSetLang(\'en\')">EN</button><button class="lang-more" id="langMore" onclick="packToggleMenu(event)" aria-label="More languages">+</button><div class="lang-menu" id="langMenu">';
  ["tr","es","it","pt","zh"].forEach(l=>{html+=`<button data-lang="${l}" onclick="packSetLang('${l}')"><span>${NATIVE[l][0]}</span> ${NATIVE[l][1]}</button>`;});
  html+='</div></div>';
  slot.innerHTML=html;
}
function initLang(){
  let l=null;try{l=localStorage.getItem("pvtc_lang");}catch(e){}
  if(!l){try{const f=JSON.parse(localStorage.getItem("pvtc_formState")||"null");if(f&&f.lang)l=f.lang;}catch(e){}}
  if(!l||!DICT[l])l="fr";
  packSetLang(l);
}
function injectArabicFont(){try{var l=document.createElement("link");l.rel="stylesheet";l.href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap";document.head.appendChild(l);}catch(e){}}
function start(){injectCSS();injectArabicFont();buildSwitcher();initLang();
  document.addEventListener("click",e=>{if(!e.target.closest(".lang")){const m=document.getElementById("langMenu");if(m)m.classList.remove("open");}});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
})();
