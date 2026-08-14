# Authentification et acces

## Objectif

Reconstruire le socle d'authentification et d'acces de `epartim-v2` en partant
du projet Adonis existant, sans recopier les colonnes Devise de la v1 Rails.

## Perimetre initial

- Création des utilisateurs et invitation interne depuis l'administration.
- Activation de compte avec definition du mot de passe.
- Connexion email et mot de passe.
- Session utilisateur pour l'espace connecte.
- Connexion unique depuis l'application principale, avec redirection vers l'application adaptee au role.
- Protection des routes privees.
- Deconnexion.
- Reinitialisation de mot de passe pour les comptes actifs.
- Profil utilisateur en lecture seule.
- Roles metier et perimetre commercial minimal.

## Hors perimetre initial

- Creation publique de compte, sauf parcours partenaire Lilycare dedie.
- Option `Se souvenir de moi`.
- Modification de l'email par l'utilisateur.
- Changement de role, cabinet ou reseau par l'utilisateur.
- Guard API token.
- Table de sessions applicative tant que le guard session Adonis suffit.

## Decisions structurantes

- La base technique reste `@adonisjs/auth` avec le guard session `web`.
- `users.email` et `users.password` restent les colonnes d'auth Adonis.
- Un compte invite peut exister sans mot de passe.
- Seuls les comptes `active` avec mot de passe peuvent se connecter.
- Les invitations et les resets sont stockes dans des tables dediees.
- Les tokens stockes en base sont hashes.
- Les roles metier sont portes par `roles` et `user_roles`.
- Le perimetre commercial est derive du rattachement cabinet/reseau.
- Le reset de mot de passe repond toujours de maniere generique cote public.
- Les tentatives de connexion et de reset sont limitees a 10 par minute, par IP et par identifiant.

## Documents

- [Cycle utilisateur](user-lifecycle.md)
- [Invitation et activation](invitation-activation.md)
- [Connexion, session et deconnexion](login-session-logout.md)
- [Protection de l'espace distributeur](distributor-space-protection.md)
- [Reinitialisation de mot de passe](password-reset.md)
- [Profil utilisateur](user-profile.md)
- [Contrats API](api-contracts.md)
- [Securite et tests](security-and-tests.md)
- [Roles et perimetres commerciaux](../actors-and-access/roles-and-scopes.md)

## Architecture technique

Le projet contient deja le socle technique requis :

- `@adonisjs/auth`
- `@adonisjs/session`
- `@adonisjs/lucid`
- `@adonisjs/core/services/hash`
- `withAuthFinder` sur le modele `User`
- guard session `web`
- middleware `auth` et `guest`

Regles techniques :

- Ne pas ajouter de table `auth_access_tokens` tant qu'aucun guard API token
  n'est utilise.
- Ne pas ajouter de table applicative `sessions` tant que la session Adonis
  suffit.
- Stocker les invitations et les resets dans des tables dediees.
- Stocker uniquement des hashes de tokens applicatifs.
- Garder les reponses auth en JSON.
- L'application d'administration ne possede pas de page de connexion : elle utilise la session creee par l'application principale et verifie le role administrateur cote API.

## Premier administrateur

Le premier compte administrateur est cree explicitement au deploiement, apres les migrations :

```bash
BOOTSTRAP_ADMIN_EMAIL=admin@example.com \
BOOTSTRAP_ADMIN_PASSWORD='un-mot-de-passe-fort' \
pnpm --filter @workspace/api bootstrap:admin
```

Les administrateurs suivants sont crees depuis `/users` dans l'application d'administration.
