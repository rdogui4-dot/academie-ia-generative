import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/connexion");

  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  const privileged = (roles ?? []).some(
    (r) => r.role === "aig_owner" || r.role === "aig_admin"
  );

  if (privileged) {
    const [{ data: factors }, { data: aal }] = await Promise.all([
      supabase.auth.mfa.listFactors(),
      supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    ]);

    const hasVerifiedTotp = (factors?.totp ?? []).some(
      (factor) => factor.status === "verified"
    );

    // Une fois un facteur MFA activé, aucune page protégée ne peut être
    // consultée avec une session aal1.
    if (hasVerifiedTotp && aal?.currentLevel !== "aal2") {
      redirect("/mfa");
    }
  }

  return children;
}
