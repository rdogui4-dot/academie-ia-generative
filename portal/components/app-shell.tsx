import Link from "next/link";
import { signOut } from "@/app/actions/auth";

const items = [
  ["Vue d’ensemble","/dashboard"],
  ["Entreprises","/entreprises"],
  ["Demandes","/demandes"],
  ["Missions","/missions"],
  ["Portfolio","/portfolio"],
  ["Paiements","/paiements"],
  ["Support","/support"]
] as const;

export function AppShell({ children, active }: { children: React.ReactNode; active: string }) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">AIG</div>
        <div style={{fontSize:12,color:"#94A3B8"}}>Services & Missions</div>
        <nav className="side-nav" aria-label="Navigation principale">
          {items.map(([label,href]) => (
            <Link key={href} className={`side-link ${active===label ? "active":""}`} href={href}>{label}</Link>
          ))}
        </nav>
        <form action={signOut} style={{marginTop:28}}>
          <button className="btn" type="submit" style={{width:"100%"}}>Déconnexion</button>
        </form>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
