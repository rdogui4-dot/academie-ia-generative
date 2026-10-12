import { signIn, signUp } from "@/app/actions/auth";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const signup = params.mode === "signup";
  const hasError = Boolean(params.error);
  const verification = params.message === "verification";

  return (
    <main className="container">
      <section className="card form-card">
        <span className="eyebrow">ACCÈS SÉCURISÉ</span>
        <h1 style={{fontSize:36,marginBottom:8}}>{signup ? "Créer un compte" : "Connexion"}</h1>
        <p>{signup ? "Créez votre espace AIG." : "Accédez à votre espace AIG."}</p>

        {hasError && <div className="error">Impossible de poursuivre. Vérifiez les informations saisies.</div>}
        {verification && <div className="badge badge-green">Vérifiez votre e-mail pour activer le compte.</div>}

        <form action={signup ? signUp : signIn} style={{marginTop:24}}>
          {signup && (
            <div className="field">
              <label htmlFor="display_name">Nom affiché</label>
              <input className="input" id="display_name" name="display_name" minLength={2} required autoComplete="name" />
            </div>
          )}
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input className="input" id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <input className="input" id="password" name="password" type="password" minLength={signup ? 10 : 8} required autoComplete={signup ? "new-password" : "current-password"} />
          </div>
          <button className="btn btn-primary" type="submit" style={{width:"100%"}}>
            {signup ? "Créer mon compte" : "Se connecter"}
          </button>
        </form>

        <p style={{fontSize:13}}>
          {signup ? "Déjà inscrit ?" : "Pas encore de compte ?"}{" "}
          <a style={{color:"#2563EB",fontWeight:700}} href={signup ? "/connexion" : "/connexion?mode=signup"}>
            {signup ? "Se connecter" : "Créer un compte"}
          </a>
        </p>
      </section>
    </main>
  );
}
