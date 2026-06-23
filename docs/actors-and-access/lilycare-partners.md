# Partenaires et Lilycare

## Objectif

Modeliser le role Partenaire comme un role generique et Lilycare comme un provider specifique portant ses variantes d'onboarding, de rattachement, de parcours BSE et de commissionnement.

## Perimetre fonctionnel

- Role d'acces Partenaire.
- Provider partenaire.
- Onboarding Lilycare public.
- Cabinet Lilycare.
- Rattachement automatique au cabinet Lilycare.
- Referent commission Lilycare.
- Parcours BSE standard par defaut.
- Exception Lilycare de saut de tarification.
- Suivi partenaire restreint.
- Extension future a d'autres partenaires.

## Regles importantes

- Un partenaire n'a pas son propre role applicatif dedie par marque.
- Le provider partenaire porte les variantes de parcours et de rattachement.
- Pour Lilycare, le cabinet Lilycare doit exister.
- Un compte Lilycare est cree comme partenaire avec provider Lilycare.
- Un compte Lilycare est rattache au cabinet Lilycare.
- Le referent commission Lilycare est determine a l'onboarding.
- Le compte partenaire Lilycare n'est pas beneficiaire direct des commissions par defaut.
- Les futurs partenaires suivent le parcours BSE standard sauf exception explicite de leur provider.

## Decisions deja tranchees

- Le role Partenaire est generique.
- Lilycare est reconnu par provider Lilycare et rattachement au cabinet Lilycare.
- L'onboarding Lilycare cree le compte, rattache le cabinet, determine le referent commission et connecte l'utilisateur.
- L'exception Lilycare est limitee par defaut au saut de l'etape Frais du contrat / tarification.
- Le createur et le rattachement initial d'une BSE Lilycare restent le compte partenaire.
- Le commissionnement d'un compte Lilycare est porte par le referent commission.
- Le partenaire Lilycare garde un suivi restreint de ses dossiers et entreprises.
- Le partenaire Lilycare ne consulte pas les commissions et n'a pas de portefeuille cabinet.

## Reste a cadrer

- Definir le modele de donnees exact pour `provider partenaire`.
- Definir le comportement si le cabinet Lilycare ou le referent commission Lilycare est absent.
- Preciser les controles d'onboarding Lilycare et les messages d'erreur.
- Lister les futures options de provider sans les implementer maintenant.
- Verifier si d'autres exceptions Lilycare que la tarification existent dans les dossiers reels.

## Definition de done

- Un compte partenaire Lilycare peut etre cree depuis le parcours public.
- Le compte est rattache au cabinet Lilycare et au provider Lilycare.
- Le referent commission est determine ou l'onboarding echoue de maniere controlee.
- Le parcours BSE Lilycare saute la tarification sans creer un parcours parallele.
- Le role Partenaire reste reutilisable pour de futurs providers.
