/* =====================================================================
   ParisVTCDriver — Accès réservé aux applications
   À inclure en tout premier dans le <head> de chaque appli :
   <script src="../access-gate.js" data-app="kifkif"></script>
   La personne saisit son téléphone + un code (usage unique) généré depuis
   l'espace admin. L'accès reste ensuite actif sur ce téléphone, jusqu'à
   révocation depuis l'admin.
   ===================================================================== */
(function () {
  "use strict";
  var SB_URL = "https://uufumatxtpfdczqotpvi.supabase.co";
  var SB_KEY = "sb_publishable_jNM0Y2Fs5uAYLLTjihSX_A_exnFesGz";
  var KEY = "pvtcd_access_v1";
  var OFFLINE_DAYS = 30;                 // ouverture hors ligne tolérée après la dernière vérification
  var WA = "33749198318";

  var me = document.currentScript;
  var APP = (me && me.getAttribute("data-app")) || "app";
  var NAMES = { "kifkif": "KifKif", "frais-reels": "PVTCD PILOT", "pvtcd-fleet": "PVTCD FLEET", "pvtcd-relais": "PVTCD RELAIS", "pvtcd-sign": "PVTCD SIGN" };
  var APPNAME = NAMES[APP] || "l'application";
  var ICON = me ? (me.getAttribute("data-icon") || "icon-192.png") : "icon-192.png";

  /* ---------- verrouillage immédiat (avant l'affichage de l'appli) ---------- */
  var root = document.documentElement;
  root.classList.add("pvtcd-lock");
  var st = document.createElement("style");
  st.textContent =
    "html.pvtcd-lock body{display:none!important}html.pvtcd-lock body>*:not(#pvtcd-gate){display:none!important}" +
    "html.pvtcd-lock,html.pvtcd-lock body{background:#070a12!important;overflow:hidden!important}" +
    "#pvtcd-gate{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:calc(20px + env(safe-area-inset-top)) 18px calc(20px + env(safe-area-inset-bottom));" +
    "background:radial-gradient(900px 500px at 80% -10%,rgba(201,162,74,.14),transparent 60%),radial-gradient(700px 420px at 0% 0%,rgba(20,40,90,.5),transparent 60%),#070a12;" +
    "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#eef2fb;overflow:auto;-webkit-text-size-adjust:100%}" +
    "#pvtcd-gate *{box-sizing:border-box}" +
    "#pvtcd-gate .g-card{width:100%;max-width:400px;background:linear-gradient(165deg,#121d33,#0e1626);border:1px solid rgba(201,162,74,.22);border-radius:22px;padding:26px 22px;box-shadow:0 30px 70px -30px rgba(0,0,0,.9)}" +
    "#pvtcd-gate .g-ic{width:76px;height:76px;border-radius:19px;display:block;margin:0 auto 14px;object-fit:cover;box-shadow:0 10px 26px -10px rgba(0,0,0,.8)}" +
    "#pvtcd-gate h1{font-size:21px;margin:0 0 4px;text-align:center;font-weight:800;letter-spacing:-.01em}" +
    "#pvtcd-gate .g-sub{text-align:center;color:#9aa6bf;font-size:14px;margin:0 0 20px;line-height:1.45}" +
    "#pvtcd-gate label{display:block;font-size:12.5px;color:#9aa6bf;font-weight:600;margin:0 0 6px 2px}" +
    "#pvtcd-gate .g-row{display:grid;grid-template-columns:104px 1fr;gap:8px;margin-bottom:14px}" +
    "#pvtcd-gate input,#pvtcd-gate select{width:100%;min-height:50px;background:#0a1122;border:1px solid rgba(255,255,255,.1);border-radius:12px;color:#eef2fb;font-size:16px;padding:12px;font-family:inherit;outline:none;-webkit-appearance:none;appearance:none}" +
    "#pvtcd-gate input:focus,#pvtcd-gate select:focus{border-color:#c9a24a;box-shadow:0 0 0 3px rgba(201,162,74,.18)}" +
    "#pvtcd-gate .g-code{text-transform:uppercase;letter-spacing:3px;font-weight:800;text-align:center;font-size:20px;margin-bottom:16px}" +
    "#pvtcd-gate button{width:100%;min-height:52px;border:0;border-radius:14px;font-size:16px;font-weight:800;font-family:inherit;cursor:pointer;color:#1c1604;background:linear-gradient(135deg,#f1d894,#c9a24a 55%,#a9842f);box-shadow:0 12px 28px -12px rgba(201,162,74,.7)}" +
    "#pvtcd-gate button[disabled]{opacity:.6}" +
    "#pvtcd-gate .g-err{display:none;background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.35);color:#fca5a5;border-radius:12px;padding:11px 12px;font-size:13.5px;margin:0 0 14px;line-height:1.4}" +
    "#pvtcd-gate .g-help{text-align:center;font-size:13px;color:#9aa6bf;margin:18px 0 0;line-height:1.5}" +
    "#pvtcd-gate .g-help a{color:#e7c878;font-weight:700;text-decoration:none}" +
    "#pvtcd-gate .g-brand{text-align:center;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#6f7c97;margin-top:18px}";
  (document.head || root).appendChild(st);

  /* ---------- stockage local ---------- */
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function save(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} }
  function covers(g) { return g && g.apps && (g.apps.indexOf("all") > -1 || g.apps.indexOf(APP) > -1); }
  function findGrant() { var a = load(); for (var i = 0; i < a.length; i++) if (covers(a[i])) return a[i]; return null; }
  function dropToken(tok) { save(load().filter(function (g) { return g.token !== tok; })); }
  function touch(tok) { var a = load(); a.forEach(function (g) { if (g.token === tok) g.ok_at = Date.now(); }); save(a); }

  function rpc(fn, body) {
    return fetch(SB_URL + "/rest/v1/rpc/" + fn, {
      method: "POST",
      headers: { "apikey": SB_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(function (r) { if (!r.ok) throw new Error("http " + r.status); return r.json(); });
  }

  /* ---------- ouverture ---------- */
  var unlocked = false;
  function unlock() {
    unlocked = true;
    root.classList.remove("pvtcd-lock");
    document.documentElement.classList.remove("pvtcd-lock");
    var g = document.getElementById("pvtcd-gate"); if (g) g.remove();
  }
  function lock(msg) {
    unlocked = false;
    root.classList.add("pvtcd-lock");
    whenReady(function () { showGate(msg); });
  }
  function whenReady(fn) { if (document.body) fn(); else document.addEventListener("DOMContentLoaded", fn); }

  function attempt(prevMsg) {
    var grant = findGrant();
    if (!grant) { if (prevMsg) lock(prevMsg); else whenReady(function () { if (!unlocked) showGate(); }); return; }
    var fresh = grant.ok_at && (Date.now() - grant.ok_at) < OFFLINE_DAYS * 864e5;
    if (fresh && !unlocked) unlock();                    // ouverture immédiate, vérification en arrière-plan
    rpc("check_app_access", { p_token: grant.token, p_app: APP }).then(function (r) {
      if (r && r.ok) { touch(grant.token); if (!unlocked) unlock(); }
      else {                                              // accès retiré : on essaie un autre accès enregistré
        dropToken(grant.token);
        attempt(r && r.error === "app" ? "Votre accès ne couvre pas " + APPNAME + "." : "Votre accès a été retiré. Demandez un nouveau code.");
      }
    }).catch(function () {
      if (!unlocked) lock("Connexion internet nécessaire pour vérifier votre accès.");
    });
  }

  /* ---------- écran d'accès ---------- */
  var DIALS = [["FR",33],["BE",32],["CH",41],["LU",352],["MC",377],["GB",44],["US",1],["DE",49],["ES",34],["IT",39],["PT",351],["NL",31],["TR",90],["MA",212],["DZ",213],["TN",216],["SN",221],["CI",225],["CM",237],["AE",971],["RE",262],["GP",590],["MQ",596]];
  function flag(c) { return c.replace(/./g, function (x) { return String.fromCodePoint(127397 + x.charCodeAt(0)); }); }
  function fullPhone(dial, num) {
    num = (num || "").trim();
    if (num.charAt(0) === "+") return "+" + num.replace(/\D/g, "");
    var d = num.replace(/\D/g, ""); if (d.charAt(0) === "0") d = d.slice(1);
    return "+" + dial + d;
  }

  function showGate(msg) {
    if (document.getElementById("pvtcd-gate")) { setErr(msg); return; }
    var g = document.createElement("div");
    g.id = "pvtcd-gate";
    g.innerHTML =
      '<form class="g-card" autocomplete="off" novalidate>' +
      '<img class="g-ic" src="' + ICON + '" alt="" onerror="this.style.display=\'none\'">' +
      "<h1>Accès réservé</h1>" +
      '<p class="g-sub">' + APPNAME + " est réservée. Entrez votre numéro de téléphone et le code d'accès reçu.</p>" +
      '<div class="g-err" id="g-err"></div>' +
      "<label>Votre téléphone</label>" +
      '<div class="g-row"><select id="g-dial">' + DIALS.map(function (d) { return '<option value="' + d[1] + '">' + flag(d[0]) + " +" + d[1] + "</option>"; }).join("") + "</select>" +
      '<input id="g-phone" type="tel" inputmode="tel" placeholder="6 12 34 56 78" autocomplete="tel-national"></div>' +
      "<label>Code d'accès</label>" +
      '<input id="g-code" class="g-code" placeholder="Ex : RLY-AB12CD" autocapitalize="characters" autocorrect="off" spellcheck="false" maxlength="14">' +
      '<button type="submit" id="g-btn">Accéder</button>' +
      '<p class="g-help">Pas de code ? <a href="https://wa.me/' + WA + "?text=" + encodeURIComponent("Bonjour, je souhaite un code d'accès pour " + APPNAME + ".") + '">Demandez-le sur WhatsApp</a></p>' +
      '<div class="g-brand">ParisVTCDriver</div>' +
      "</form>";
    attachGate(g);
    if (msg) setErr(msg);
    var form = g.querySelector("form");
    form.addEventListener("submit", function (e) { e.preventDefault(); submit(); });
  }
  /* L'écran est placé hors du <body> (que certaines applis réécrivent) et remis
     en place s'il est retiré tant que l'appli est verrouillée. */
  var guard = null;
  function attachGate(g) {
    var html = document.documentElement;
    if (!html.classList.contains("pvtcd-lock")) html.classList.add("pvtcd-lock");
    if (!g.isConnected) html.appendChild(g);
    if (!guard) guard = setInterval(function () {
      if (unlocked) { clearInterval(guard); guard = null; return; }
      var h = document.documentElement;
      if (!h.classList.contains("pvtcd-lock")) h.classList.add("pvtcd-lock");
      if (!g.isConnected) h.appendChild(g);
    }, 300);
  }
  function setErr(m) { var e = document.getElementById("g-err"); if (!e) return; e.textContent = m || ""; e.style.display = m ? "block" : "none"; }

  var ERR = {
    phone: "Numéro de téléphone invalide.",
    code: "Code incorrect. Vérifiez le code reçu.",
    used: "Ce code a déjà été utilisé. Demandez un nouveau code.",
    app: "Ce code n'est pas valable pour " + APPNAME + "."
  };
  function submit() {
    var dial = document.getElementById("g-dial").value;
    var phone = fullPhone(dial, document.getElementById("g-phone").value);
    var code = document.getElementById("g-code").value.trim();
    if (phone.replace(/\D/g, "").length < 8) { setErr(ERR.phone); return; }
    if (code.replace(/[^A-Za-z0-9]/g, "").length < 4) { setErr("Saisissez le code d'accès."); return; }
    var btn = document.getElementById("g-btn"); btn.disabled = true; btn.textContent = "Vérification…"; setErr("");
    rpc("redeem_app_code", { p_phone: phone, p_code: code, p_app: APP, p_device: (navigator.userAgent || "").slice(0, 200) })
      .then(function (r) {
        if (r && r.ok) {
          var a = load().filter(function (x) { return x.token !== r.token; });
          a.unshift({ token: r.token, apps: r.apps, phone: r.phone, ok_at: Date.now() });
          save(a);
          unlock();
        } else { setErr(ERR[r && r.error] || ERR.code); }
      })
      .catch(function () { setErr("Pas de connexion internet. Réessayez une fois connecté."); })
      .then(function () { btn.disabled = false; btn.textContent = "Accéder"; });
  }
  attempt();                         // démarrage (en dernier : tout est défini)
})();
