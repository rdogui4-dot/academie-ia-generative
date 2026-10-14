"use client";

import Link from "next/link";
import { useEffect,useState } from "react";
import { createClient } from "@/lib/supabase/client";

type State={
  currentLevel:string|null;
  nextLevel:string|null;
  verified:number;
};

export function MfaSettings({privileged}:{privileged:boolean}){
  const [state,setState]=useState<State|null>(null);
  const [error,setError]=useState("");

  useEffect(()=>{
    let active=true;
    (async()=>{
      const supabase=createClient();
      const [aal,factors]=await Promise.all([
        supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
        supabase.auth.mfa.listFactors()
      ]);
      if(!active) return;
      if(aal.error || factors.error){
        setError("Impossible de charger l’état MFA.");
        return;
      }
      setState({
        currentLevel:aal.data.currentLevel,
        nextLevel:aal.data.nextLevel,
        verified:factors.data.totp.filter(f=>f.status==="verified").length
      });
    })();
    return()=>{active=false};
  },[]);

  return (
    <section className="card stack">
      <div>
        <span className="eyebrow">SÉCURITÉ DU COMPTE</span>
        <h3 style={{marginTop:12}}>Double authentification</h3>
      </div>
      {error && <div className="error">{error}</div>}
      {!state ? <p>Chargement de l’état de sécurité…</p> : (
        <>
          <div className="grid grid-4">
            <div className="card kpi"><span>Niveau actuel</span><strong>{state.currentLevel ?? "—"}</strong></div>
            <div className="card kpi"><span>Niveau disponible</span><strong>{state.nextLevel ?? "—"}</strong></div>
            <div className="card kpi"><span>Facteurs TOTP</span><strong>{state.verified}</strong></div>
            <div className="card kpi"><span>Rôle privilégié</span><strong>{privileged ? "Oui":"Non"}</strong></div>
          </div>
          {state.verified===0 ? (
            <div>
              <div className="security-note" style={{marginBottom:14}}>
                {privileged
                  ? "Ce compte de direction doit activer la MFA avant le durcissement final aal2."
                  : "La MFA est recommandée pour renforcer la sécurité du compte."}
              </div>
              <Link className="btn btn-primary" href="/securite/mfa/enroler">Activer la MFA</Link>
            </div>
          ) : state.currentLevel!=="aal2" ? (
            <div>
              <div className="security-note" style={{marginBottom:14}}>
                Un facteur est activé, mais cette session n’a pas encore été vérifiée en aal2.
              </div>
              <Link className="btn btn-primary" href="/mfa">Vérifier maintenant</Link>
            </div>
          ) : (
            <span className="badge badge-green">Session protégée en aal2</span>
          )}
        </>
      )}
    </section>
  );
}
