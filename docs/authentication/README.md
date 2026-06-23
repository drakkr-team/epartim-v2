# Authentification et acces

## Objectif

Reconstruire le socle d'authentification et d'acces de `epartim-v2` en partant
du projet Adonis existant, sans recopier les colonnes Devise de la v1 Rails.

## Perimetre initial

- Invitation interne des utilisateurs hors admin.
- Activation de compte avec definition du mot de passe.
- Connexion email et mot de passe.
- Session utilisateur pour l'espace connecte.
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
