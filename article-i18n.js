/* =====================================================================
   ParisVTCDriver — Traduction des articles/guides
   • FR / EN / TR : pages HTML dédiées (indexées) → navigation
   • ES / IT / PT / ZH / AR : traduction de la page à la volée
     (endpoint public Google gtx + repli MyMemory), sans page HTML.
   ===================================================================== */
(function(){
  var PRIMARY=[["fr","FR"],["en","EN"],["tr","TR"]];
  var EXTRA=[["es","Español"],["it","Italiano"],["pt","Português"],["zh","中文"],["ar","العربية"]];
  var box=document.querySelector(".lang"); if(!box) return;
  var pageLang=(document.documentElement.getAttribute("lang")||"fr").toLowerCase();
  var urls={};
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(function(l){ urls[l.getAttribute("hreflang")]=l.getAttribute("href"); });
  function isExtra(c){ return EXTRA.some(function(x){return x[0]===c;}); }

  var st=document.createElement("style");
  st.textContent=".lang{position:relative}"
    +".lang .menu{position:absolute;top:calc(100% + 8px);right:0;background:#0d1730;border:1px solid rgba(201,162,74,.32);border-radius:12px;padding:6px;display:none;flex-direction:column;min-width:150px;box-shadow:0 12px 40px rgba(0,0,0,.55);z-index:60}"
    +".lang .menu.open{display:flex}"
    +".lang .menu a{padding:9px 12px;border-radius:8px;color:#cfd6e6;font-size:13.5px;white-space:nowrap;text-align:left}"
    +".lang .menu a:hover,.lang .menu a.active{background:rgba(201,162,74,.14);color:#e7c878}"
    +".lang .more.busy{opacity:.6;pointer-events:none}";
  document.head.appendChild(st);

  var html="";
  PRIMARY.forEach(function(x){ html+='<a data-l="'+x[0]+'" data-nav="'+(urls[x[0]]||"")+'" class="'+(x[0]===pageLang?"active":"")+'">'+x[1]+'</a>'; });
  html+='<span class="morewrap"><a data-more href="javascript:void(0)" class="more '+(isExtra(pageLang)?"active":"")+'" title="Traduire la page">+</a>'
    +'<span class="menu">'+EXTRA.map(function(x){return '<a data-l="'+x[0]+'" href="javascript:void(0)" class="'+(x[0]===pageLang?"active":"")+'">'+x[1]+'</a>';}).join("")+'</span></span>';
  box.innerHTML=html;
  var menu=box.querySelector(".menu"), moreBtn=box.querySelector("[data-more]");

  box.addEventListener("click",function(e){
    var m=e.target.closest("[data-more]"); if(m){ e.preventDefault(); menu.classList.toggle("open"); return; }
    var a=e.target.closest("a[data-l]"); if(!a) return; e.preventDefault();
    var c=a.getAttribute("data-l");
    if(!isExtra(c)){ var nav=a.getAttribute("data-nav"); if(nav) location.href=nav; return; }
    menu.classList.remove("open"); setActive(c); translatePage(c);
  });
  document.addEventListener("click",function(e){ if(!box.contains(e.target)) menu.classList.remove("open"); });
  function setActive(c){
    box.querySelectorAll("a[data-l]").forEach(function(a){ a.classList.toggle("active",a.getAttribute("data-l")===c); });
    if(moreBtn) moreBtn.classList.toggle("active",isExtra(c));
  }

  // ---------- traduction ----------
  var CACHE={}, origin=null, busy=false;
  function targets(){
    var scope=document.querySelector(".post")||document;
    var list=[].slice.call(scope.querySelectorAll("h1,h2,p,.adv li div b,.adv li div span,table th,table td,.cta h3,.cta p,.cta a"));
    var bk=document.querySelector(".btn-book"); if(bk) list.push(bk);
    var ey=document.querySelector(".eyebrow"); if(ey) list.push(ey);
    return list;
  }
  async function gtx(text,tl){
    var u="https://translate.googleapis.com/translate_a/single?client=gtx&sl="+encodeURIComponent(pageLang)+"&tl="+encodeURIComponent(tl)+"&dt=t&q="+encodeURIComponent(text);
    var r=await fetch(u); if(!r.ok) return null;
    var j=await r.json();
    if(Array.isArray(j)&&Array.isArray(j[0])){ var o=j[0].map(function(s){return (s&&s[0])?s[0]:"";}).join(""); if(o.trim()) return o; }
    return null;
  }
  async function mm(text,tl){
    var u="https://api.mymemory.translated.net/get?q="+encodeURIComponent(text.slice(0,480))+"&langpair="+encodeURIComponent(pageLang+"|"+tl);
    var r=await fetch(u); var j=await r.json();
    var tx=j&&j.responseData&&j.responseData.translatedText;
    if(!tx||/MYMEMORY WARNING|INVALID LANGUAGE|QUERY LENGTH LIMIT|YOU USED ALL/i.test(tx)) return null;
    var t=document.createElement("textarea"); t.innerHTML=tx; return t.value;
  }
  async function trans(text,tl){
    try{ var g=await gtx(text,tl); if(g) return g; }catch(e){}
    try{ var m=await mm(text,tl); if(m) return m; }catch(e){}
    return null;
  }
  async function translatePage(tl){
    if(busy) return; busy=true; if(moreBtn) moreBtn.classList.add("busy");
    var els=targets();
    if(!origin) origin=els.map(function(el){ return el.textContent; });
    document.documentElement.setAttribute("lang",tl);
    document.documentElement.dir=(tl==="ar")?"rtl":"ltr";
    var idx=0;
    async function worker(){
      while(idx<els.length){
        var i=idx++, el=els[i], src=origin[i];
        if(!src||!src.trim()) continue;
        var ck=tl+"::"+src;
        if(CACHE[ck]!=null){ el.textContent=CACHE[ck]; continue; }
        var t=await trans(src,tl);
        if(t){ CACHE[ck]=t; el.textContent=t; }
      }
    }
    var pool=[]; for(var k=0;k<5;k++) pool.push(worker());
    try{ await Promise.all(pool); }catch(e){}
    busy=false; if(moreBtn) moreBtn.classList.remove("busy");
  }
})();
