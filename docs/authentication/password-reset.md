# Reinitialisation de mot de passe

## Objectif

Permettre a un utilisateur hors admin actif de reinitialiser son mot de passe de maniere securisee.

## Perimetre fonctionnel

- Page publique de demande de reinitialisation.
- Saisie de l'email du compte.
- Envoi d'un email de reinitialisation lorsque le compte actif existe.
- Message generique apres demande, que l'email existe ou non.
- Page publique de saisie du nouveau mot de passe avec token.
- Validation du token de reinitialisation.
- Mise a jour du mot de passe.
- Retour vers la connexion apres reinitialisation.

## Regles importantes

- Le reset concerne uniquement les comptes actifs.
- Un compte invite non active doit passer par le lien d'activation ou le renvoi d'invitation.
- Le message de demande est generique : si un compte existe, un email est envoye.
- Le message generique est un ecart volontaire avec la v1.
- Un token invalide ou expire affiche un echec controle.

## Hors perimetre initial

- Message specifique pour email inconnu.
- Reset des invitations non acceptees.
- Changement de mot de passe depuis le profil connecte.

## Definition de done

- Un utilisateur actif peut demander une reinitialisation.
- La demande ne permet pas de savoir si l'email existe.
- Le lien de reset permet de definir un nouveau mot de passe.
- Le nouveau mot de passe permet une connexion.
- Les comptes invites non actives ne sont pas traites par le reset.
