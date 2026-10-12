import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <header className="container topbar">
        <div className="brand">AIG</div>
        <nav className="nav">
          <a href="#services">Services</a>
          <a href="#missions">Missions</a>
          <a href="#entreprises">Entreprises</a>
          <a href="#securite">Sécurité</a>
        </nav>
        <div style={{display:"flex",gap:10}}>
          <Link className="btn" href="/connexion">Se connecter</Link>
          <Link className="btn btn-primary" href="/connexion?mode=signup">Créer un compte</Link>
        </div>
      </header>

      <main className="container hero">
        <section>
          <span className="eyebrow">AIG MVP · Côte d’Ivoire</span>
          <h1>Des compétences IA vers des missions réelles.</h1>
          <p style={{fontSize:19,maxWidth:720}}>
            Un portail sécurisé pour connecter entreprises et opérateurs autour de demandes concrètes,
            de livrables contrôlés et de paiements traçables.
          </p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:26}}>
            <Link className="btn btn-primary" href="/connexion">Trouver une mission</Link>
            <Link className="btn" href="/connexion">Déposer une demande</Link>
          </div>
        </section>

        <aside className="card">
          <span className="eyebrow">Flux AIG</span>
          <h2 style={{marginTop:18}}>Du besoin au paiement, avec contrôle humain.</h2>
          <div className="flow" style={{marginTop:24}}>
            <div className="flow-step">1. Demande qualifiée</div>
            <div className="flow-step">2. Mission assignée</div>
            <div className="flow-step">3. Livraison vérifiée</div>
            <div className="flow-step">4. Paiement confirmé</div>
          </div>
        </aside>
      </main>
    </>
  );
}
