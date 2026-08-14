# Cycle utilisateur hors admin

## Objectif

Piloter le cycle complet d'authentification des utilisateurs hors dashboard admin.

## Perimetre

- Creation de la fiche utilisateur par un administrateur, suivie d'une invitation interne.
- Activation de compte avec definition du mot de passe.
- Connexion email et mot de passe.
- Session utilisateur et protection des pages privees.
- Deconnexion.
- Reinitialisation de mot de passe pour les comptes actifs.
- Profil utilisateur en lecture seule.

## Hors perimetre initial

- Dashboard admin.
- Gestion complete des comptes et roles par l'administration.
- Onboarding partenaire Lilycare.
- Creation publique de compte hors parcours partenaire.
- Option `Se souvenir de moi`.
- Modification de l'email par l'utilisateur.
- Changement de mot de passe depuis le profil connecte.

## Decisions metier

- Le cycle classique hors admin concerne les utilisateurs rattaches a un distributeur.
- Un utilisateur classique ne cree pas son compte librement.
- Un compte invite devient actif seulement apres acceptation de l'invitation.
- Le mot de passe est defini pendant l'activation du compte.
- Apres activation reussie, l'utilisateur peut etre connecte automatiquement.
- Le reset de mot de passe utilise un message generique pour ne pas exposer l'existence d'un compte.
- Le reset concerne uniquement les comptes deja actifs.
- Le profil expose les informations utilisateur sans permettre la modification de l'email.

## Definition de done

- Le cycle invitation, activation, connexion, deconnexion et reset est documente et testable.
- Les pages publiques et privees sont clairement separees.
- Un utilisateur hors admin arrive sur `/dashboard` apres connexion sans destination demandee.
- Les ecarts volontaires avec la v1 sont explicites.
