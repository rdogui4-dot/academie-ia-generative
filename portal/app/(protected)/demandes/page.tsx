import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";
import { createServiceRequest } from "@/app/actions/requests";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function RequestsPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();

  const [{ data: requests }, { data: organizations }] = await Promise.all([
    supabase
      .from("service_requests")
      .select("id,title,status,budget_xof,created_at")
      .order("created_at",{ascending:false})
      .limit(25),
    supabase
      .from("organizations")
      .select("id,name")
      .order("name")
  ]);

  return (
    <AppShell active="Demandes">
      <div className="page-head">
        <div><h2>Demandes</h2><p>Décrivez un besoin réel avant qualification et mise en mission.</p></div>
      </div>

      {params.message === "created" && <div className="badge badge-green">Demande soumise.</div>}
      {params.error && <div className="error" style={{margin:"14px 0"}}>Vérifiez les informations de la demande.</div>}

      <section className="card" style={{margin:"18px 0"}}>
        <h3>Nouvelle demande</h3>
        {(organizations ?? []).length === 0 ? (
          <p>Créez d’abord une entreprise pour déposer une demande.</p>
        ) : (
          <form action={createServiceRequest}>
            <div className="field">
              <label htmlFor="organization_id">Entreprise</label>
              <select className="input" id="organization_id" name="organization_id" required>
                <option value="">Sélectionner</option>
                {organizations!.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="title">Titre</label>
              <input className="input" id="title" name="title" minLength={3} required placeholder="Ex. Automatiser le suivi client" />
            </div>
            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea className="input" id="description" name="description" minLength={10} rows={5} required />
            </div>
            <div className="field">
              <label htmlFor="budget_xof">Budget indicatif (FCFA)</label>
              <input className="input" id="budget_xof" name="budget_xof" type="number" min={0} step={1000} />
            </div>
            <button className="btn btn-primary" type="submit">Soumettre pour qualification</button>
          </form>
        )}
      </section>

      <div className="card table">
        {(requests ?? []).length === 0 ? <p style={{padding:18}}>Aucune demande disponible.</p> :
          requests!.map(r => (
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
