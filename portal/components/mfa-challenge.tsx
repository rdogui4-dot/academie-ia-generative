"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function MfaChallenge() {
  const router = useRouter();
  const [code,setCode]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);

  async function verify() {
    setError("");
    setBusy(true);
    const supabase=createClient();

    const factors=await supabase.auth.mfa.listFactors();
    if(factors.error){
      setError("Impossible de charger les facteurs MFA.");
      setBusy(false);
      return;
    }

    const factor=factors.data.totp.find(f=>f.status==="verified") ?? factors.data.totp[0];
    if(!factor){
      router.replace("/securite/mfa/enroler");
      return;
    }

    const challenge=await supabase.auth.mfa.challenge({factorId:factor.id});
    if(challenge.error){
      setError("Impossible de démarrer la vérification MFA.");
      setBusy(false);
      return;
    }

    const verified=await supabase.auth.mfa.verify({
      factorId:factor.id,
      challengeId:challenge.data.id,
      code:code.trim()
    });

    if(verified.error){
      setError("Code invalide ou expiré.");
      setBusy(false);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <section className="card form-card">
      <span className="eyebrow">DOUBLE AUTHENTIFICATION</span>
      <h1 style={{fontSize:34,marginBottom:8}}>Vérification MFA</h1>
      <p>Entrez le code à 6 chiffres généré par votre application d’authentification.</p>
      {error && <div className="error">{error}</div>}
      <div className="field" style={{marginTop:20}}>
        <label htmlFor="mfa-code">Code de sécurité</label>
        <input
          id="mfa-code"
          className="input"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          maxLength={6}
          value={code}
          onChange={e=>setCode(e.target.value.replace(/\D/g,"").slice(0,6))}
          aria-describedby="mfa-help"
        />
        <small id="mfa-help" style={{color:"#64748B"}}>Le code change environ toutes les 30 secondes.</small>
      </div>
      <button
        className="btn btn-primary"
        type="button"
        onClick={verify}
        disabled={busy || code.length!==6}
        style={{width:"100%"}}
      >
        {busy ? "Vérification…" : "Valider le code"}
      </button>
    </section>
  );
}
