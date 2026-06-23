# Validation interne

## Objectif

Permettre la soumission d'une souscription BSE a validation interne, puis la validation ou le refus par GO/Epartim.

## Perimetre fonctionnel

- Demande de validation.
- Validation interne.
- Refus avec motif.
- Correction apres refus.
- Passage en attente de signatures.

## Regles importantes

- Toutes les etapes applicables doivent etre valides avant soumission.
- Seuls les roles internes autorises peuvent valider ou refuser.
- Une souscription refusee ne redevient pas automatiquement non finalisee.
- Une validation interne fait passer la souscription en attente de signatures.

## Definition de done

- Le souscripteur peut demander la validation.
- Les internes peuvent valider ou refuser.
- Les statuts sont coherents.
- Le refus rend les corrections attendues identifiables.
