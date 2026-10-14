import { AppShell } from "@/components/app-shell";
import { MfaSettings } from "@/components/mfa-settings";
import { createClient } from "@/lib/supabase/server";

export const dynamic="force-dynamic";

export default async function SecurityMfaPage(){
  const supabase=await createClient();
  const {data:claims}=await supabase.auth.getClaims();
  const userId=claims?.claims?.sub;

  const {data:roles}=userId
    ? await supabase.from("user_roles").select("role").eq("user_id",userId)
    : {data:[] as {role:string}[]};

  const privileged=(roles??[]).some(r=>r.role==="aig_owner" || r.role==="aig_admin");

  return (
    <AppShell active="Sécurité">
      <div className="page-head">
        <div>
          <h2>Sécurité du compte</h2>
          <p>Contrôlez le niveau d’assurance de votre session et votre double authentification.</p>
        </div>
      </div>
      <MfaSettings privileged={privileged} />
    </AppShell>
  );
}
