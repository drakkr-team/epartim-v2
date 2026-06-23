# Invitation et activation de compte

## Objectif

Permettre a un utilisateur hors admin invite d'activer son compte et de definir son mot de passe.

## Perimetre fonctionnel

- Creation d'une invitation par une action interne.
- Envoi d'un lien d'activation.
- Expiration du lien apres sept jours.
- Page d'activation accessible sans session.
- Saisie du mot de passe et de sa confirmation.
- Acceptation de l'invitation.
- Connexion automatique apres activation reussie.
- Renvoi d'un lien d'activation pour une invitation non acceptee.

## Regles importantes

- Une invitation expire apres une semaine.
- Un compte invite ne peut pas se connecter avant activation.
- Le mot de passe n'est pas defini par l'equipe interne.
- Le mot de passe est defini par l'utilisateur pendant l'activation.
- Une invitation expiree ne doit pas activer le compte.
- Le renvoi de lien concerne uniquement les invitations non acceptees.

## Hors perimetre initial

- Creation publique de compte.
- Activation sans definition de mot de passe.
- Onboarding Lilycare.
- Gestion avancee des erreurs d'integrite de rattachement.

## Definition de done

- Un utilisateur invite recoit un lien d'activation.
- Le lien permet de definir un mot de passe valide.
- Le compte passe de invite a actif apres acceptation.
- Le lien expire apres sept jours.
- Une invitation expiree affiche un echec controle.
- Un lien peut etre renvoye pour une invitation non acceptee.
