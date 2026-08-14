# Securite et tests auth

## Regles de securite

- Refuser la connexion des comptes non `active`.
- Refuser la connexion des comptes sans mot de passe.
- Utiliser une reponse generique pour les demandes de reset.
- Stocker les tokens d'invitation et reset uniquement sous forme hashee.
- Marquer les tokens de reset comme utilises.
- Revoquer l'invitation precedente lors d'un renvoi.
- Appliquer un rate limit de 10 tentatives par minute sur login, forgot password et reset, par IP et par identifiant.
- Ne jamais exposer `users.password`.
- Ne jamais exposer la raison precise d'un echec de login public.

## Tests e2e minimum

Connexion :

- un compte actif peut se connecter
- un mot de passe invalide est refuse
- un compte invite est refuse
- un compte desactive est refuse
- la route login est interdite a un utilisateur deja connecte

Session :

- une route privee refuse un visiteur anonyme
- une route privee accepte une session valide
- logout invalide la session

Invitation :

- une invitation cree un token expire dans sept jours
- une invitation acceptee active le compte
- une invitation expiree est refusee
- une invitation deja acceptee est refusee
- un renvoi revoque l'ancien token

Reset :

- forgot repond generiquement pour email inconnu
- forgot n'envoie pas de token pour un compte invite
- forgot cree un token pour un compte actif
- reset refuse un token invalide
- reset refuse un token expire
- reset refuse un token deja utilise
- reset met a jour le mot de passe

Profil :

- le profil expose les informations du compte connecte
- le profil n'expose pas le hash du mot de passe
- le profil expose les roles, cabinet et reseau attendus

## Tests unitaires minimum

- policy login
- policy logout
- generation et verification de token d'invitation
- generation et verification de token de reset
- resolution du perimetre commercial d'un utilisateur
- mapping des roles historiques vers les roles v2

## Donnees de test

Prevoir des factories pour :

- utilisateur actif
- utilisateur invite
- utilisateur desactive
- administrateur
- commercial GO/Epartim
- manager reseau
- distributeur rattache cabinet
- partenaire Lilycare
- cabinet
- reseau
