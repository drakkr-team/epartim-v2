# BSE et rattachement commercial

## Objectif

Separer clairement le createur applicatif d'une souscription, son rattachement commercial, les autorisations de suivi et l'heritage vers l'entreprise Amundi.

## Perimetre fonctionnel

- Createur de souscription BSE.
- Rattachement commercial de la souscription.
- Correction administrative du rattachement commercial.
- Heritage commercial BSE vers Entreprise Amundi.
- Autorisation de suivi pour mandataire entreprise.
- Autorisation de suivi pour partenaire.
- Documents metier rattaches aux souscriptions et entreprises.
- Cycle de vie entre souscription BSE et entreprise Amundi.

## Regles importantes

- Le compte createur courant reste l'association applicative principale de la souscription.
- Le rattachement commercial sert au portefeuille, au futur rattachement de l'entreprise Amundi et au commissionnement.
- Par defaut, la BSE est creee sans selection obligatoire d'un autre acteur commercial.
- Le rattachement commercial initial est le compte createur courant.
- L'administration peut corriger le rattachement commercial sans perdre le createur initial.
- Une entreprise Amundi issue d'une BSE herite du rattachement commercial de la BSE, sauf correction explicite.
- Les documents metier en lecture suivent le perimetre de la BSE ou de l'entreprise parent.

## Decisions deja tranchees

- La creation BSE reste fluide : pas de selection obligatoire d'un porteur commercial a la creation.
- Le compte createur courant est toujours associe a la BSE.
- Le createur sert a l'historique, a la reprise de parcours, aux notifications et aux droits de modification.
- Le rattachement commercial peut etre corrige par l'administration.
- La correction ne reecrit pas silencieusement les commissions historiques.
- Le Mandataire entreprise garde un suivi restreint de ses souscriptions et entreprises issues de ses BSE.
- Le Partenaire Lilycare garde un suivi restreint des entreprises issues de ses BSE.
- Les actions sensibles BSE restent reservees aux profils internes autorises.

## Reste a cadrer

- Definir le modele de donnees exact pour representer createur, rattachement commercial et autorisations de suivi.
- Preciser les transitions entre BSE complete et Entreprise Amundi rattachee.
- Definir comment une correction de rattachement commercial est affichee et controlee dans l'administration.
- Decider si une correction de rattachement BSE avant transmission peut etre separee de la correction Entreprise Amundi.
- Lister les notifications qui restent liees au createur plutot qu'au rattachement commercial.

## Definition de done

- Une BSE peut etre creee par le compte courant sans selection commerciale supplementaire.
- Le createur et le rattachement commercial sont representes sans ambiguite.
- L'administration peut corriger le rattachement commercial.
- Une entreprise Amundi issue d'une BSE herite du rattachement commercial attendu.
- Les mandataires et partenaires conservent un suivi restreint de leurs dossiers sans acces portefeuille.
