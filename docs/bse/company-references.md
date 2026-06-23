# References entreprise

## Objectif

Construire l'etape References entreprise avec les donnees administratives, bancaires, representant legal, habilitations Amundi et pieces justificatives associees.

## Perimetre fonctionnel

- SIREN, SIRET, code NAF.
- Raison sociale, forme juridique, adresse.
- Effectif et cloture fiscale.
- IBAN et BIC.
- Representant legal.
- Mandataire BSE si le signataire n'apparait pas sur le justificatif legal attendu.
- Habilitations Amundi.
- Pieces justificatives de reference entreprise.

## Regles importantes

- Le representant legal est le signataire BSE par defaut.
- Le mandataire BSE peut signer a sa place si necessaire.
- Les habilitations Amundi donnent acces au portail Amundi apres mise en place du contrat.
- Les niveaux de droit Amundi sont une liste fermee : Comptable, Agir et consulter, Administrer.
- Les pieces justificatives sont distinctes des documents contractuels.

## Definition de done

- Les donnees de reference sont saisissables et sauvegardees.
- Les validations de format sont appliquees.
- Les habilitations Amundi sont gerees.
- Les pieces justificatives attendues sont rattachees.
