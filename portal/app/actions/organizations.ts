"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createOrganization(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();

  if (name.length < 2) redirect("/entreprises?error=validation");

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect("/connexion");

  const { error } = await supabase.from("organizations").insert({
    name,
    city: city || null,
    created_by: userId,
    country_code: "CI",
    org_type: "company"
  });

  if (error) redirect("/entreprises?error=creation");
  revalidatePath("/entreprises");
  redirect("/entreprises?message=created");
}
