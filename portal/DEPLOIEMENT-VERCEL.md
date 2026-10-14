# AIG MVP — Mise en ligne Vercel (prévisualisation sécurisée)

## Périmètre et comptes

- Compte Vercel : **Rddoguidot** (`rdogui4@gmail.com`)
- Équipe Vercel : **rdogui4-dot's projects** (`team_aGanDHbfcZNUQWYVG25xCMkb`)
- Projet à créer : `aig-mvp-portal`
- Source GitHub : `rdogui4-dot/academie-ia-generative`
- Branche de travail : `aig-mvp-portal`
- Dossier racine (Root Directory) : `portal`
- Framework : `Next.js`
- Infrastructure données : Supabase AIG MVP, **distincte du site de formation**

> Le 12 octobre 2026, la création par l'intégration Vercel ChatGPT a renvoyé `403 Forbidden`. Le compte est néanmoins listé comme propriétaire de son équipe et GitHub comme namespace disponible. Le projet **n'a pas été créé** par cette intégration.

## 1. Importer dans le compte Rddoguidot

1. Ouvrir [le tableau de bord Vercel](https://vercel.com/dashboard) avec le compte `rdogui4@gmail.com`.
2. Choisir l'équipe **rdogui4-dot's projects** dans le sélecteur d'organisation.
3. Cliquer sur **Add New → Project**, choisir **Import Git Repository** et sélectionner `rdogui4-dot/academie-ia-generative`.
4. Vérifier le nom `aig-mvp-portal`, le framework **Next.js**, et régler **Root Directory = portal** (indispensable).
5. Ne pas fusionner la Pull Request n°1 dans `main` pour résoudre un souci de déploiement : `main` ne contient pas encore l'application `portal`.
6. Conserver `main` comme branche de production tant qu'une mise en ligne publique n'a pas été décidée ; déclencher la **prévisualisation** sur la branche `aig-mvp-portal` après connexion Git.

**Attention :** un premier build déclenché automatiquement sur `main` peut échouer, car le dossier `portal` n'y existe pas. Ce n'est pas une raison pour exposer la branche de travail en production. Utiliser une prévisualisation de la branche `aig-mvp-portal`.

## 2. Variables d'environnement Vercel

Configurer dans **Project Settings → Environment Variables** (au minimum pour **Preview**) :

| Nom | Valeur |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://izjhdcexyeasnlpkkljp.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clé *publishable* fournie par Supabase, **jamais** une clé secrète |
| `NEXT_PUBLIC_APP_URL` | URL HTTPS exacte de la prévisualisation utilisée pour l'inscription, sans `/` final |

La variable `NEXT_PUBLIC_APP_URL` est utilisée dans `app/actions/auth.ts` pour le callback de confirmation d'email. Si l'URL de prévisualisation n'est connue qu'après le premier build, l'ajouter ensuite puis relancer une prévisualisation.

**Interdictions :** ne pas ajouter de clé `service_role`, `sb_secret_...`, mot de passe SQL, secret SMTP ou jeton GitHub à une variable préfixée `NEXT_PUBLIC_`. Ne pas commiter un vrai fichier `.env.local`.

## 3. Configurer l'authentification Supabase

Dans le projet Supabase AIG MVP, configurer **Authentication → URL Configuration** :

- Ajouter en **Redirect URLs** l'URL précise : `https://<URL-DU-PREVIEW>/auth/callback`.
- Éviter d'autoriser des domaines génériques qui ne sont pas contrôlés.
- Conserver les paramètres de confirmation d'email, la limitation de débit et les règles d'accès RLS adaptées au projet.
- Avant une mise en production, remplacer les URLs de prévisualisation par celles du domaine public validé.

## 4. Contrôles de sécurité avant diffusion

- [ ] Prévisualisation non rendue publique avant validation ; protection Vercel activée lorsque disponible.
- [ ] Policies RLS de toutes les tables métier actives et testées pour les utilisateurs anonymes et authentifiés.
- [ ] Aucun `service_role` ni secret serveur exposé au code client ou au dépôt.
- [ ] Auth SSR : cookies de session, navigation anonyme vers les pages protégées, déconnexion testés.
- [ ] Inscription, email de confirmation et callback `/auth/callback` testés avec l'URL de prévisualisation.
- [ ] Vérification de l'isolation des entreprises, demandes et missions entre deux comptes distincts.
- [ ] `npm run typecheck`, `npm run lint`, `npm run build` et contrôles GitHub CI validés.
- [ ] Pas de publication sur le domaine de production tant que ces contrôles ne sont pas terminés.

## 5. Contrôles d'interface

Examiner sur mobile et ordinateur : contraste, navigation clavier, états chargement/erreur, connexion/inscription, tableau de bord, entreprises, demandes, missions et cohérence graphique AIG. Vérifier les ancres du menu de la page d'accueil, actuellement susceptibles de pointer vers des sections absentes.

## Déblocage Vercel

Si le tableau de bord refuse lui aussi la création, relever le code d'erreur et ouvrir un ticket via le support Vercel du compte concerné. Si la création manuelle fonctionne, reprendre la connexion Git puis le déploiement **Preview**, sans réessayer de créer un doublon avec les outils automatisés.
