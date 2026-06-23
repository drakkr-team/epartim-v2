# Socle souscription et statuts

## Objectif

Mettre en place la souscription non finalisee unique par utilisateur et le cycle de statuts metier.

## Decisions metier

- Une souscription non finalisee est unique par utilisateur.
- Une souscription complete ne peut plus etre reprise comme souscription courante.
- Le statut `Souscription approuvee` n'est pas un statut canonique separe.
- La validation interne fait passer la souscription en attente de signatures.

## Capacites attendues

- Creer ou reprendre une souscription non finalisee.
- Afficher la progression des cinq etapes BSE.
- Gerer les transitions principales.
- Bloquer les transitions incoherentes.

## Definition de done

- Un utilisateur retrouve sa souscription courante.
- Les statuts metier sont representes.
- Les transitions interdites sont protegees.
- Le prototype ne depend plus des statuts simplifiés actuels pour le parcours cible.
