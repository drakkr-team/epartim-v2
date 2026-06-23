# KYC

## Objectif

Construire l'etape KYC pour identifier les beneficiaires effectifs, dirigeants, actionnaires principaux et procurations.

## Perimetre fonctionnel

- Personnes physiques.
- Personnes morales.
- Roles KYC : beneficiaire effectif, dirigeant, actionnaire principal, procuration.
- Pourcentages de detention.
- Pieces KYC.

## Regles importantes

- Une personne physique exige les informations d'identite et la piece associee.
- Une personne morale exige un justificatif legal adapte.
- Les donnees de naissance ne s'appliquent pas aux personnes morales.
- La somme des pourcentages de detention ne peut pas depasser 100 %.
- La fonction est requise sauf cas documente pour l'actionnaire principal.

## Definition de done

- Les personnes KYC peuvent etre ajoutees, modifiees et supprimees.
- Les controles de coherence sont appliques.
- Les pieces KYC sont rattachees aux bonnes personnes.
- L'etape peut etre validee ou bloquee selon les erreurs.
