import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const [{ count: missions }, { count: companies }, { count: requests }] = await Promise.all([
    supabase.from("missions").select("*",{head:true,count:"exact"}),
    supabase.from("organizations").select("*",{head:true,count:"exact"}),
    supabase.from("service_requests").select("*",{head:true,count:"exact"})
  ]);

  return (
    <AppShell active="Vue d’ensemble">
      <div className="page-head">
        <div><h2>Vue d’ensemble</h2><p>Pilotez les services, missions et entreprises depuis un seul espace.</p></div>
        <span className="badge badge-green">Backend sécurisé</span>
      </div>
      <section className="grid grid-4">
        <div className="card kpi"><span>Missions visibles</span><strong>{missions ?? 0}</strong></div>
        <div className="card kpi"><span>Entreprises accessibles</span><strong>{companies ?? 0}</strong></div>
        <div className="card kpi"><span>Demandes accessibles</span><strong>{requests ?? 0}</strong></div>
        <div className="card kpi"><span>RLS</span><strong>Actif</strong></div>
      </section>
    </AppShell>
  );
}
