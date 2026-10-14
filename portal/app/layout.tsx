import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIG — Services & Missions",
  description: "Portail sécurisé AIG pour entreprises, opérateurs, missions et services."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
