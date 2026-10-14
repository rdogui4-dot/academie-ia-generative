import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { MfaEnrollment } from "@/components/mfa-enrollment";
import { createClient } from "@/lib/supabase/server";

export const dynamic="force-dynamic";

export default async function EnrollMfaPage(){
  const supabase=await createClient();
  const {data:claims}=await supabase.auth.getClaims();
  const userId=claims?.claims?.sub;
  if(!userId) redirect("/connexion");

  const {data:roles}=await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id",userId);

  const privileged=(roles??[]).some(r=>r.role==="aig_owner" || r.role==="aig_admin");
  if(!privileged) redirect("/securite/mfa");

  return (
    <AppShell active="Sécurité">
      <div className="page-head">
        <div>
          <h2>Activer la double authentification</h2>
          <p>Obligatoire pour sécuriser les opérations sensibles de direction.</p>
        </div>
      </div>
      <MfaEnrollment />
    </AppShell>
  );
}
