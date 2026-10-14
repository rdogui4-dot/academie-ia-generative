# AIG MVP Portal

Portail Next.js + Supabase pour l'écosystème AIG hors formation.

## Périmètre v0.1

- Landing page
- Authentification Supabase
- Dashboard protégé
- Entreprises
- Demandes de services
- Missions
- Base UI alignée avec le Design System AIG

## Variables d'environnement

Copier `.env.example` vers `.env.local` et renseigner :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_APP_URL`

Ne jamais exposer de clé `service_role` dans le navigateur.

## Développement

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

## Sécurité

Le front suppose que Supabase RLS reste la source d'autorisation. Les contrôles d'interface ne remplacent jamais les policies SQL.
