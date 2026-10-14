import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";

export default async function MissionsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("missions")
    .select("id,title,status,budget_xof,due_on,created_at")
    .order("created_at",{ascending:false})
    .limit(25);

  return (
    <AppShell active="Missions">
      <div className="page-head">
        <div>
          <h2>Missions</h2>
          <p>Missions ouvertes ou accessibles à votre organisation.</p>
        </div>
      </div>

      <div className="card table">
        {(data ?? []).length === 0 ? (
          <p style={{padding:18}}>Aucune mission visible pour le moment.</p>
        ) : data!.map(m => (
          <div className="row" key={m.id}>
            <div>
              <strong>{m.title}</strong>
              <div style={{fontSize:12,color:"#64748B"}}>
                {m.budget_xof ? new Intl.NumberFormat("fr-FR").format(m.budget_xof)+" FCFA" : "Budget à définir"}
                {" · "}
                {m.due_on ? "Échéance "+new Date(m.due_on).toLocaleDateString("fr-FR") : "Échéance non définie"}
              </div>
            </div>
            <span className="badge badge-blue">{m.status}</span>
            <Link className="btn" href={`/missions/${m.id}`}>Ouvrir</Link>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
