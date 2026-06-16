/* =====================================================================
   ParisVTCDriver — Connexion partagée à Supabase
   Chargé après le SDK : <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   ===================================================================== */
const SUPABASE_URL = "https://uufumatxtpfdczqotpvi.supabase.co";
const SUPABASE_KEY = "sb_publishable_jNM0Y2Fs5uAYLLTjihSX_A_exnFesGz";

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
window.sb = sb;

/* ---------- Session & profil ---------- */
async function getSession(){
  const { data } = await sb.auth.getSession();
  return data.session || null;
}
async function getProfile(){
  const s = await getSession();
  if(!s) return null;
  const { data, error } = await sb
    .from("profiles")
    .select("*")
    .eq("id", s.user.id)
    .single();
  if(error){ console.warn("profile", error.message); return null; }
  return data;
}

/* ---------- Gardes d'accès ---------- */
async function requireAuth(redirect="connexion.html"){
  const s = await getSession();
  if(!s){ location.replace(redirect); return null; }
  return s;
}
async function requireAdmin(redirect="connexion.html"){
  const s = await getSession();
  if(!s){ location.replace(redirect); return null; }
  const p = await getProfile();
  if(!p || p.role !== "admin"){ location.replace("espace-client.html"); return null; }
  return p;
}
async function signOut(redirect="connexion.html"){
  await sb.auth.signOut();
  location.replace(redirect);
}

/* ---------- Fidélité ----------
   On attache à window SANS redéclarer (évite tout conflit avec les
   fonctions déjà définies dans index.html, ex. eur). */
window.loyalty = window.loyalty || function(points){
  points = points || 0;
  const tiers = [
    { name:"Diamant", min:5000, off:20 },
    { name:"Or",      min:1000, off:15 },
    { name:"Argent",  min:500,  off:10 },
    { name:"Bronze",  min:100,  off:5  },
    { name:"Membre",  min:0,    off:0  }
  ];
  const cur = tiers.find(t => points >= t.min);
  const idx = tiers.indexOf(cur);
  const next = idx > 0 ? tiers[idx-1] : null;       // palier supérieur
  const progress = next ? Math.min(100, Math.round((points-cur.min)/(next.min-cur.min)*100)) : 100;
  return { name:cur.name, off:cur.off, next, progress, points };
};

/* ---------- Formatage ---------- */
window.eur = window.eur || function(n){ return new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR"}).format(n||0); };
window.dateFR = window.dateFR || function(d){ if(!d) return "—"; return new Date(d).toLocaleString("fr-FR",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}); };
window.escapeHtml = window.escapeHtml || function(s){ return String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); };
