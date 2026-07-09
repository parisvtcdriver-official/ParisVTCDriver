/* =====================================================================
   ParisVTCDriver — Encart vidéo YouTube Short (chargement au clic)
   • Aucune requête YouTube avant le clic (Core Web Vitals + RGPD).
   • Lecture via youtube-nocookie.com (pas de cookie de suivi au repos).
   • Format vertical (9/16) adapté aux Shorts.
   Usage :
     <div class="yt-short" data-id="VIDEO_ID"
          data-title="Titre accessible" data-caption="Légende sous la vidéo"></div>
   ===================================================================== */
(function(){
  var nodes = document.querySelectorAll('.yt-short[data-id]');
  if(!nodes.length) return;

  var st = document.createElement('style');
  st.textContent =
    ".yt-short{max-width:340px;margin:28px auto;border:1px solid var(--line-soft);border-radius:16px;overflow:hidden;background:#000;box-shadow:0 10px 34px rgba(0,0,0,.45)}"
  + ".yt-short .yt-fac{position:relative;display:block;width:100%;aspect-ratio:9/16;cursor:pointer;background-size:cover;background-position:center;border:0;padding:0}"
  + ".yt-short .yt-fac::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.35))}"
  + ".yt-short .yt-play{position:absolute;inset:0;display:grid;place-items:center;z-index:1}"
  + ".yt-short .yt-play svg{width:64px;height:64px;filter:drop-shadow(0 4px 14px rgba(0,0,0,.55));transition:transform .2s}"
  + ".yt-short .yt-fac:hover .yt-play svg{transform:scale(1.08)}"
  + ".yt-short iframe{width:100%;aspect-ratio:9/16;border:0;display:block}"
  + ".yt-short .yt-cap{padding:10px 14px;font-size:13px;color:var(--muted);background:var(--panel);text-align:center}";
  document.head.appendChild(st);

  nodes.forEach(function(el){
    var id = el.getAttribute('data-id');
    var title = el.getAttribute('data-title') || 'YouTube';
    var cap = el.getAttribute('data-caption') || '';

    var fac = document.createElement('button');
    fac.type = 'button';
    fac.className = 'yt-fac';
    fac.setAttribute('aria-label', title);
    fac.style.backgroundImage = "url('https://i.ytimg.com/vi/" + id + "/hqdefault.jpg')";
    fac.innerHTML =
      '<span class="yt-play"><svg viewBox="0 0 68 48" aria-hidden="true">'
      + '<path d="M66.5 7.7c-.8-3-2.5-5.4-5.5-6.2C55.5 0 34 0 34 0S12.5 0 7 1.5C4 2.3 2.3 4.7 1.5 7.7 0 13.2 0 24 0 24s0 10.8 1.5 16.3c.8 3 2.5 5.4 5.5 6.2C12.5 48 34 48 34 48s21.5 0 27-1.5c3-.8 4.7-3.2 5.5-6.2C68 34.8 68 24 68 24s0-10.8-1.5-16.3z" fill="#f00"/>'
      + '<path d="M27 34l18-10-18-10z" fill="#fff"/></svg></span>';

    fac.addEventListener('click', function(){
      var ifr = document.createElement('iframe');
      ifr.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1';
      ifr.title = title;
      ifr.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; web-share');
      ifr.setAttribute('allowfullscreen', '');
      ifr.loading = 'lazy';
      el.replaceChild(ifr, fac);
    });

    el.insertBefore(fac, el.firstChild);
    if(cap){
      var c = document.createElement('div');
      c.className = 'yt-cap';
      c.textContent = cap;
      el.appendChild(c);
    }
  });
})();
