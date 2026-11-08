/* ParisVTCDriver — barre Appeler / WhatsApp + suivi des conversions Google Ads */
(function(){
  var AW="AW-18387320769", SEND={tel:AW+"/eBfmCJGMq7QdEMH_4L9E", wa:AW+"/RkhOCI6Mq7QdEMH_4L9E"};
  var PHONE="+33749198318", en=(document.documentElement.lang||"fr").slice(0,2)!=="fr";
  function track(kind){
    try{ if(typeof gtag==="function"){
      gtag("event","conversion",{send_to:SEND[kind]});
      gtag("event","generate_lead",{method:kind==="tel"?"phone":"whatsapp"});
    } }catch(e){}
  }
  document.addEventListener("click",function(e){
    var a=e.target.closest&&e.target.closest("a[href]"); if(!a) return;
    var h=a.getAttribute("href")||"";
    if(h.indexOf("tel:")===0) track("tel");
    else if(/wa\.me|api\.whatsapp\.com|whatsapp:/i.test(h)) track("wa");
  },true);
  function bar(){
    if(document.getElementById("pvtc-contact")) return;
    var msg=encodeURIComponent(en?"Hello, I would like a quote for a private transfer.":"Bonjour, je souhaite un devis pour un transfert avec chauffeur.");
    var s=document.createElement("style");
    s.textContent="#pvtc-contact{position:fixed;right:18px;bottom:18px;z-index:60;display:flex;gap:10px;font-family:inherit}"+
      "#pvtc-contact a{display:flex;align-items:center;gap:8px;padding:12px 16px;border-radius:999px;font-weight:600;font-size:14px;text-decoration:none;box-shadow:0 10px 26px -10px rgba(0,0,0,.7)}"+
      "#pvtc-contact .c-tel{background:linear-gradient(135deg,#f1d894,#c9a24a 55%,#a9842f);color:#1c1604}"+
      "#pvtc-contact .c-wa{background:#1fa855;color:#fff}"+
      "#pvtc-contact svg{width:18px;height:18px;flex:none}"+
      "@media(max-width:720px){#pvtc-contact{left:0;right:0;bottom:0;gap:0;padding:8px 10px calc(8px + env(safe-area-inset-bottom));background:rgba(7,10,18,.92);backdrop-filter:blur(10px);border-top:1px solid rgba(201,162,74,.2)}"+
      "#pvtc-contact a{flex:1;justify-content:center;margin:0 4px}body{padding-bottom:70px}}";
    document.head.appendChild(s);
    var d=document.createElement("div"); d.id="pvtc-contact";
    d.innerHTML='<a class="c-tel" href="tel:'+PHONE+'" aria-label="'+(en?"Call":"Appeler")+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>'+(en?"Call":"Appeler")+'</a>'+
      '<a class="c-wa" href="https://wa.me/33749198318?text='+msg+'" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2.5A9.5 9.5 0 0 0 3.86 16.78L2.5 21.5l4.84-1.27A9.5 9.5 0 1 0 12.04 2.5zm5.5 13.53c-.23.65-1.36 1.25-1.87 1.29-.5.05-.97.23-3.27-.68-2.77-1.09-4.52-3.92-4.66-4.1-.13-.18-1.11-1.48-1.11-2.82s.7-2 .95-2.28c.25-.27.55-.34.73-.34h.52c.17 0 .4-.06.62.48.23.55.78 1.89.85 2.03.07.14.11.3.02.48-.09.18-.14.3-.27.46l-.41.48c-.14.14-.28.29-.12.56.16.27.71 1.17 1.52 1.9 1.05.93 1.93 1.22 2.2 1.36.27.14.43.11.59-.07.16-.18.68-.8.86-1.07.18-.27.36-.23.61-.14.25.09 1.59.75 1.86.89.27.14.45.2.52.32.07.11.07.66-.16 1.31z"/></svg>WhatsApp</a>';
    document.body.appendChild(d);
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",bar); else bar();
})();
