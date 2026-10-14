import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MfaChallenge } from "@/components/mfa-challenge";

export const dynamic="force-dynamic";

export default async function MfaGatePage(){
  const supabase=await createClient();
  const {data:claims}=await supabase.auth.getClaims();
  const userId=claims?.claims?.sub;
  if(!userId) redirect("/connexion");

  const {data:roles}=await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id",userId);

  const privileged=(roles??[]).some(r=>r.role==="aig_owner" || r.role==="aig_admin");
  if(!privileged) redirect("/dashboard");

  const {data:factors}=await supabase.auth.mfa.listFactors();
  const hasVerified=(factors?.totp??[]).some(f=>f.status==="verified");
  if(!hasVerified) redirect("/securite/mfa/enroler");

  const {data:aal}=await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if(aal?.currentLevel==="aal2") redirect("/dashboard");

  return <main className="container"><MfaChallenge /></main>;
}
