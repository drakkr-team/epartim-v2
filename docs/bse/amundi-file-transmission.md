# Dossier Amundi et transmission

## Objectif

Preparer, controler, transmettre et suivre le dossier Amundi jusqu'au retour OK ou KO.

## Perimetre fonctionnel

- Dossier Amundi.
- XML BSE.
- Documents signes requis.
- Pieces justificatives necessaires.
- Transmission Amundi.
- Erreur d'envoi.
- Retour OK.
- Retour KO.

## Regles importantes

- Le dossier Amundi est distinct du dossier documentaire et de la souscription BSE.
- Il peut etre regenere avant transmission.
- Il doit etre conserve comme preuve apres transmission.
- Une transmission reussie ne complete pas la souscription.
- Seul un retour OK Amundi rend la souscription complete.
- Un retour KO met la souscription en erreur.

## Definition de done

- Le dossier Amundi est prepare.
- Le dossier est controle avant transmission.
- La transmission met a jour le statut.
- Les erreurs d'envoi sont distinguees des retours KO.
- Les retours OK/KO sont traites.
