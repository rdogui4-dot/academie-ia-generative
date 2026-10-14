"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const allowedTypes = new Set(["case_study","prototype","workflow","document","other"]);

export async function createPortfolioArtifact(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const artifact_type = String(formData.get("artifact_type") ?? "other").trim();
  const external_url = String(formData.get("external_url") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (title.length < 3 || title.length > 160) {
    redirect("/portfolio?error=title");
  }
  if (!allowedTypes.has(artifact_type)) {
    redirect("/portfolio?error=type");
  }
  if (description && description.length > 2000) {
    redirect("/portfolio?error=description");
  }
  if (external_url) {
    try {
      const url = new URL(external_url);
      if (!["https:","http:"].includes(url.protocol)) throw new Error("invalid");
    } catch {
      redirect("/portfolio?error=url");
    }
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/connexion");

  const { error } = await supabase.from("portfolio_artifacts").insert({
    user_id: userId,
    title,
    artifact_type,
    external_url: external_url || null,
    description: description || null,
    status: "pending"
  });

  if (error) redirect("/portfolio?error=creation");
  revalidatePath("/portfolio");
  redirect("/portfolio?message=created");
}
