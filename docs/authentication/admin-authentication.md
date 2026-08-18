# Authentification administration

## Objectif

Permettre a un compte admin actif de se connecter exclusivement a l'application d'administration.

## Regles

- Un compte admin est distinct d'un compte web, y compris lorsque les deux portent la meme adresse e-mail.
- Seul un compte admin actif peut ouvrir une session admin.
- Une session web ne permet pas d'acceder aux routes ni aux ecrans d'administration.
- Une session admin ne permet pas d'acceder aux routes privees du site web.
- Les invitations de comptes web conservent l'operateur admin qui les a emises.

## Perimetre actuel

- Connexion, deconnexion et identification du compte admin courant.
- Donnees de demonstration fournies par le seeder de developpement.
