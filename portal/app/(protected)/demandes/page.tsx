import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";

export default async function RequestsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("service_requests").select("id,title,status,budget_xof,created_at").order("created_at",{ascending:false}).limit(25);
  return (
    <AppShell active="Demandes">
      <div className="page-head"><div><h2>Demandes</h2><p>Demandes de services visibles selon vos droits.</p></div></div>
      <div className="card table">
        {(data ?? []).length === 0 ? <p style={{padding:18}}>Aucune demande disponible.</p> :
          data!.map(r => (
            <div className="row" key={r.id}>
              <div><strong>{r.title}</strong><div style={{fontSize:12,color:"#64748B"}}>{r.budget_xof ? new Intl.NumberFormat("fr-FR").format(r.budget_xof)+" FCFA" : "Budget à définir"}</div></div>
              <span className="badge badge-blue">{r.status}</span>
              <span style={{fontSize:12,color:"#64748B"}}>{new Date(r.created_at).toLocaleDateString("fr-FR")}</span>
            </div>
          ))}
      </div>
    </AppShell>
  );
}
