# Connexion, session et deconnexion

## Objectif

Permettre a un utilisateur hors admin actif de se connecter, conserver sa session et se deconnecter.

## Perimetre fonctionnel

- Page de connexion publique.
- Connexion par email et mot de passe.
- Redirection vers l'URL demandee quand la connexion est declenchee par une page protegee.
- Redirection par defaut vers `/dashboard`.
- Session serveur valide pour l'espace distributeur.
- Deconnexion depuis l'interface.
- Retour vers la page de connexion apres deconnexion.

## Regles importantes

- Seuls les comptes actifs peuvent se connecter.
- Les comptes invites non actives ne sont pas authentifiables.
- La destination par defaut apres connexion est `/dashboard`.
- Une session invalide ou expiree renvoie vers `/login`.
- La deconnexion ferme la session et renvoie vers `/login`.
- L'option `Se souvenir de moi` n'est pas reprise dans le premier cycle.

## Definition de done

- Un utilisateur actif peut se connecter avec email et mot de passe.
- Une tentative d'acces a une page privee redirige vers la connexion.
- Apres connexion, l'utilisateur retrouve la page demandee ou le dashboard.
- La session permet de naviguer dans l'espace distributeur.
- La deconnexion invalide la session.
