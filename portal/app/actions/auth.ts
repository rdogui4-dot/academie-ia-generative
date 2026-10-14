"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function strongPassword(password: string) {
  return password.length >= 12
    && /[a-z]/.test(password)
    && /[A-Z]/.test(password)
    && /\d/.test(password)
    && /[^A-Za-z0-9]/.test(password);
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || password.length < 8) redirect("/connexion?error=identifiants");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/connexion?error=connexion");

  // Toute connexion passe par le garde MFA. Les utilisateurs non privilégiés
  // sont redirigés immédiatement vers le dashboard.
  redirect("/mfa");
}

export async function signUp(formData: FormData) {
  const display_name = String(formData.get("display_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (display_name.length < 2 || !email || !strongPassword(password)) {
    redirect("/connexion?mode=signup&error=validation");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name, country_code: "CI", preferred_language: "fr" },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/auth/callback`
    }
  });

  if (error) redirect("/connexion?mode=signup&error=inscription");
  redirect("/connexion?message=verification");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
