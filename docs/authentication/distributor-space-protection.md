# Protection de l'espace distributeur

## Objectif

Proteger les pages de l'espace distributeur pour les rendre accessibles uniquement aux utilisateurs hors admin connectes et actifs.

## Perimetre fonctionnel

- Protection des pages portefeuille.
- Protection des souscriptions.
- Protection des commissions.
- Protection des distributeurs.
- Protection des actualites et ressources privees.
- Protection du compte utilisateur.
- Protection du parcours BSE connecte.
- Redirection vers la connexion pour les sessions absentes ou expirees.

## Regles importantes

- Une page privee exige une session valide.
- Une session absente renvoie vers `/login`.
- La redirection conserve la destination demandee quand c'est utile.
- L'utilisateur connecte hors admin reste dans l'espace distributeur.
- Les anomalies de rattachement ne sont pas traitees dans le premier cycle.
- Les droits fins par role et perimetre commercial sont traites dans
  [Roles et perimetres](../actors-and-access/roles-and-scopes.md).

## Hors perimetre initial

- Dashboard admin.
- Autorisations fines par role, cabinet, reseau ou partenaire.
- Cas d'erreur produit pour un compte sans rattachement.
- Onboarding Lilycare.

## Definition de done

- Une page privee n'est pas accessible sans session.
- Une session expiree renvoie vers la connexion.
- Apres connexion, l'utilisateur revient a la page demandee ou au portefeuille.
- Les pages admin ne sont pas incluses dans ce cycle.
