"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type EnrollState={
  factorId:string;
  qrCode:string;
  secret:string;
};

export function MfaEnrollment(){
  const router=useRouter();
  const [state,setState]=useState<EnrollState|null>(null);
  const [code,setCode]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);

  async function start(){
    setBusy(true);
    setError("");
    const supabase=createClient();

    const existing=await supabase.auth.mfa.listFactors();
    if(existing.error){
      setError("Impossible de vérifier les facteurs existants.");
      setBusy(false);
      return;
    }

    const verified=existing.data.totp.find(f=>f.status==="verified");
    if(verified){
      router.replace("/securite/mfa");
      return;
    }

    const enrolled=await supabase.auth.mfa.enroll({
      factorType:"totp",
      friendlyName:"AIG Sécurité"
    });

    if(enrolled.error){
      setError("Impossible de créer le facteur MFA.");
      setBusy(false);
      return;
    }

    setState({
      factorId:enrolled.data.id,
      qrCode:enrolled.data.totp.qr_code,
      secret:enrolled.data.totp.secret
    });
    setBusy(false);
  }

  async function activate(){
    if(!state) return;
    setBusy(true);
    setError("");
    const supabase=createClient();

    const challenge=await supabase.auth.mfa.challenge({factorId:state.factorId});
    if(challenge.error){
      setError("Impossible de démarrer la vérification.");
      setBusy(false);
      return;
    }

    const verified=await supabase.auth.mfa.verify({
      factorId:state.factorId,
      challengeId:challenge.data.id,
      code:code.trim()
    });

    if(verified.error){
      setError("Code incorrect. Vérifiez l’heure de votre téléphone et réessayez.");
      setBusy(false);
      return;
    }

    router.replace("/securite/mfa?message=enabled");
    router.refresh();
  }

  return (
    <section className="card" style={{maxWidth:680}}>
      <span className="eyebrow">MFA TOTP</span>
      <h2 style={{marginTop:12}}>Protéger le compte de direction</h2>
      <p>
        Utilisez une application compatible TOTP comme Google Authenticator, 1Password, Authy ou un gestionnaire compatible.
      </p>

      {error && <div className="error" style={{margin:"16px 0"}}>{error}</div>}

      {!state ? (
        <button className="btn btn-primary" type="button" onClick={start} disabled={busy}>
          {busy ? "Préparation…" : "Configurer l’authentificateur"}
        </button>
      ) : (
        <div className="stack">
          <div className="security-note">
            Scannez le QR code. Ne partagez jamais la clé secrète et ne l’envoyez pas par e-mail ou messagerie.
          </div>
          <div style={{background:"#fff",padding:16,borderRadius:12,width:"fit-content",border:"1px solid #E2E8F0"}}>
            <Image src={state.qrCode} alt="QR code MFA AIG" width={220} height={220} unoptimized />
          </div>
          <details>
            <summary style={{cursor:"pointer",fontWeight:700}}>Saisie manuelle</summary>
            <code style={{display:"block",marginTop:10,overflowWrap:"anywhere"}}>{state.secret}</code>
          </details>
          <div className="field">
            <label htmlFor="enroll-code">Code à 6 chiffres</label>
            <input
              id="enroll-code"
              className="input"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={e=>setCode(e.target.value.replace(/\D/g,"").slice(0,6))}
            />
          </div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={activate}
            disabled={busy || code.length!==6}
          >
            {busy ? "Activation…" : "Activer la MFA"}
          </button>
        </div>
      )}
    </section>
  );
}
