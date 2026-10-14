import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

export default async function MissionDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: mission, error } = await supabase
    .from("missions")
    .select("id,organization_id,title,description,budget_xof,status,starts_on,due_on,deliverables,requirements,created_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !mission) notFound();

  const { data: organization } = await supabase
    .from("organizations")
    .select("name,city")
    .eq("id", mission.organization_id)
    .maybeSingle();

  return (
    <AppShell active="Missions">
      <div className="page-head">
        <div>
          <span className="eyebrow">MISSION</span>
          <h2 style={{marginTop:10}}>{mission.title}</h2>
          <p>
            {organization?.name ?? "Organisation"}
            {organization?.city ? ` · ${organization.city}` : ""}
          </p>
        </div>
        <span className="badge badge-blue">{mission.status}</span>
      </div>

      <div className="detail-grid">
        <section className="card stack">
          <div>
            <h3>Objectif</h3>
            <p>{mission.description}</p>
          </div>

          <div>
            <h3>Exigences</h3>
            <p>{mission.requirements || "Aucune exigence additionnelle publiée."}</p>
          </div>

          <div>
            <h3>Livrables attendus</h3>
            <p>{mission.deliverables || "Les livrables seront précisés par AIG avant exécution."}</p>
          </div>
        </section>

        <aside className="card stack">
          <div>
            <span className="meta-label">Budget</span>
            <strong className="meta-value">
              {mission.budget_xof
                ? new Intl.NumberFormat("fr-FR").format(mission.budget_xof)+" FCFA"
                : "À définir"}
            </strong>
          </div>
          <div>
            <span className="meta-label">Début</span>
            <strong>{mission.starts_on ? new Date(mission.starts_on).toLocaleDateString("fr-FR") : "Non défini"}</strong>
          </div>
          <div>
            <span className="meta-label">Échéance</span>
            <strong>{mission.due_on ? new Date(mission.due_on).toLocaleDateString("fr-FR") : "Non définie"}</strong>
          </div>
          <p className="security-note">
            Les actions sensibles restent contrôlées par les règles RLS et les workflows AIG côté serveur.
          </p>
        </aside>
      </div>
    </AppShell>
  );
}
