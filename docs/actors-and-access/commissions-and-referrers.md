# Commissions et referents

## Objectif

Fiabiliser le commissionnement en distinguant l'origine commerciale, le beneficiaire de commission, le referent commission, les taux applicables et l'historique des commissions calculees.

## Perimetre fonctionnel

- Utilisateur commercial d'origine.
- Utilisateur beneficiaire de commission.
- Referent commission.
- Rattachement commercial de l'entreprise Amundi.
- Taux de commission par utilisateur.
- Taux negocies par entreprise.
- Commission trimestrielle comme fait historique.
- Correction du beneficiaire au niveau Entreprise Amundi.
- Recalcul manuel explicite.

## Regles importantes

- Une commission trimestrielle est un fait historise.
- La commission conserve le beneficiaire, le cabinet, le reseau et les taux applicables au moment du calcul.
- Le referent commission est une relation de commissionnement, pas un role d'acces.
- Si un referent commission existe, il devient le beneficiaire de commission par defaut.
- En l'absence de referent, le beneficiaire correspond a l'utilisateur commercial d'origine.
- Les taux negocies sur l'entreprise sont prioritaires sur les taux utilisateur.
- Les taux utilisateur applicables sont ceux du beneficiaire de commission.
- Les corrections commerciales ne recalculent pas automatiquement les trimestres deja calcules.

## Decisions deja tranchees

- Le referent commission s'applique par defaut des qu'il existe, pas seulement pour Lilycare.
- Le beneficiaire peut etre corrige par l'Administrateur au niveau Entreprise Amundi.
- Une correction au niveau Entreprise Amundi s'applique aux calculs futurs.
- Les trimestres passes ou courant ne changent que via un recalcul manuel explicite.
- Les commissions restent visibles au Distributeur sur son perimetre cabinet.
- Le Manager reseau voit les commissions de son reseau.
- Le Mandataire entreprise et le Partenaire ne consultent pas les commissions.
- La robustesse vient de l'historisation et des corrections controlees, pas d'une table Distributeur separee.

## Reste a cadrer

- Definir le modele exact de stockage des snapshots de commission.
- Preciser les champs historises obligatoires : beneficiaire, cabinet, reseau, taux, montants et origine commerciale.
- Definir l'interface de correction du beneficiaire au niveau Entreprise Amundi.
- Definir le parcours de recalcul manuel et ses garde-fous.
- Verifier les impacts sur bordereaux, factures et exports existants.

## Definition de done

- Le calcul de commission resout explicitement l'utilisateur beneficiaire.
- Les commissions calculees ne dependent pas dynamiquement du compte utilisateur courant.
- Les changements de cabinet, reseau, referent ou taux ne reecrivent pas l'historique.
- Un Administrateur peut corriger le beneficiaire futur d'une entreprise.
- Un recalcul manuel peut appliquer volontairement une correction a un trimestre cible.
