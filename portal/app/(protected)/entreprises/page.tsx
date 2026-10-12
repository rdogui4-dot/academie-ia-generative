import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";

export default async function CompaniesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("organizations").select("id,name,city,status,created_at").order("created_at",{ascending:false}).limit(25);
  return (
    <AppShell active="Entreprises">
      <div className="page-head"><div><h2>Entreprises</h2><p>Organisations auxquelles votre compte est autorisé à accéder.</p></div></div>
      <div className="card table">
        {(data ?? []).length === 0 ? <p style={{padding:18}}>Aucune entreprise accessible pour le moment.</p> :
          data!.map(o => (
            <div className="row" key={o.id}>
              <div><strong>{o.name}</strong><div style={{fontSize:12,color:"#64748B"}}>{o.city ?? "Ville non renseignée"}</div></div>
              <span className={`badge ${o.status==="active"?"badge-green":"badge-amber"}`}>{o.status}</span>
              <span style={{fontSize:12,color:"#64748B"}}>{new Date(o.created_at).toLocaleDateString("fr-FR")}</span>
            </div>
          ))}
      </div>
    </AppShell>
  );
}
