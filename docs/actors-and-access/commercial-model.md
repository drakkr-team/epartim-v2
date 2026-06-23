# Modele commercial

## Objectif

Reconstruire le modele commercial cible autour des cabinets, reseaux, comptes utilisateurs, roles d'acces, identifiants Amundi et codes apporteur, sans reproduire les ambiguities du prototype.

## Perimetre fonctionnel

- Cabinet comme organisation commerciale de base.
- Reseau comme regroupement optionnel de cabinets.
- Compte utilisateur comme identite de connexion et acteur commercial possible.
- Role d'acces distinct du role commercial et du role Amundi exporte.
- Identifiant conseiller Amundi porte par le compte utilisateur.
- Codes apporteur Amundi pour utilisateurs, cabinets et reseaux.
- Compatibilite stricte du flux apporteur Amundi avec l'existant attendu.
- Migration et coexistence des profils historiques.

## Regles importantes

- Un cabinet ne se connecte pas a la plateforme.
- Tout utilisateur externe est rattache a un cabinet lorsque son role le necessite.
- Un cabinet peut exister sans reseau.
- Le distributeur n'est pas une table metier separee en V2.
- L'acteur commercial d'origine reste le compte utilisateur portant le role approprie.
- Le `amundi_user_id` du compte utilisateur est la reference pour les exports Amundi lorsque ce compte porte commercialement un dossier.
- La V2 peut reconstruire le flux apporteur depuis un modele cible, mais le contenu transmis a Amundi doit rester strictement identique a donnees equivalentes.
- Les codes historiques de profils servent a la migration et a l'audit, pas au vocabulaire metier canonique.

## Decisions deja tranchees

- `Distributeur` est un role d'acces utilisateur rattache a un cabinet, pas une table dediee.
- Le cabinet est l'unite commerciale de base obligatoire.
- Le reseau est optionnel et regroupe des cabinets.
- Le manager reseau reste rattache a un cabinet ; son perimetre reseau est derive du reseau de ce cabinet.
- Les codes Amundi des utilisateurs, cabinets et reseaux doivent etre conserves pour les exports apporteur.
- Le contenu du flux apporteur Amundi doit rester strictement equivalent a l'existant.

## Reste a cadrer

- Inventorier toutes les valeurs historiques de profils et definir leur mapping cible.
- Decider le traitement des profils historiques sans cible claire, notamment `profile_seven`.
- Definir les controles de coherence minimaux sur les codes Amundi manquants ou dupliques.
- Preciser la strategie de migration des cabinets, reseaux et utilisateurs existants.
- Verifier les donnees exactes attendues dans le flux apporteur avec des exemples reels.

## Definition de done

- Le modele Cabinet / Reseau / Utilisateur / Role est documente et implemente.
- Les profils historiques sont mappes ou explicitement exclus.
- Le modele permet de reconstruire le flux apporteur Amundi.
- Les identifiants Amundi utiles sont portes par les bons objets.
- Aucun comportement metier ne depend d'une table Distributeur separee.
