import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";
import { createOrganization } from "@/app/actions/organizations";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function CompaniesPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("organizations")
    .select("id,name,city,status,created_at")
    .order("created_at",{ascending:false})
    .limit(25);

  return (
    <AppShell active="Entreprises">
      <div className="page-head">
        <div><h2>Entreprises</h2><p>Organisations auxquelles votre compte est autorisé à accéder.</p></div>
      </div>

      {params.message === "created" && <div className="badge badge-green">Entreprise créée.</div>}
      {params.error && <div className="error" style={{margin:"14px 0"}}>Impossible de créer l’entreprise.</div>}

      <section className="card" style={{margin:"18px 0"}}>
        <h3>Ajouter une entreprise</h3>
        <form action={createOrganization} style={{display:"grid",gridTemplateColumns:"2fr 1fr auto",gap:12,alignItems:"end"}}>
          <div className="field" style={{margin:0}}>
            <label htmlFor="name">Nom</label>
            <input className="input" id="name" name="name" minLength={2} required />
          </div>
          <div className="field" style={{margin:0}}>
            <label htmlFor="city">Ville</label>
            <input className="input" id="city" name="city" placeholder="Abidjan" />
          </div>
          <button className="btn btn-primary" type="submit">Créer</button>
        </form>
      </section>

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
