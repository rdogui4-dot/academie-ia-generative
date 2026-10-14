"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createServiceRequest(formData: FormData) {
  const organization_id = String(formData.get("organization_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const rawBudget = String(formData.get("budget_xof") ?? "").replace(/\s/g, "");
  const budget_xof = rawBudget ? Number(rawBudget) : null;

  if (!organization_id || title.length < 3 || description.length < 10) {
    redirect("/demandes?error=validation");
  }
  if (budget_xof !== null && (!Number.isFinite(budget_xof) || budget_xof < 0)) {
    redirect("/demandes?error=budget");
  }

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect("/connexion");

  const { error } = await supabase.from("service_requests").insert({
    organization_id,
    created_by: userId,
    title,
    description,
    budget_xof,
    status: "submitted"
  });

  if (error) redirect("/demandes?error=creation");
  revalidatePath("/demandes");
  redirect("/demandes?message=created");
}
