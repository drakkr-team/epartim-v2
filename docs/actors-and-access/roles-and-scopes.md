# Roles, perimetres et droits

## Objectif

Definir les droits de consultation, d'action et d'administration par role, en s'appuyant sur un perimetre d'acces centralise plutot que sur des conditions dispersees dans chaque domaine.

## Perimetre fonctionnel

- Administrateur.
- Commercial GO/Epartim.
- Manager reseau.
- Distributeur.
- Mandataire entreprise.
- Partenaire.
- Perimetres cabinet, reseau, utilisateur et partenaire.
- Acces aux entreprises, souscriptions, commissions, documents metier et contenus publies.
- Actions sensibles d'administration et actions operationnelles BSE.

## Regles importantes

- Les domaines metier consomment un perimetre d'acces calcule.
- L'administration des comptes, roles, cabinets, reseaux, referents commission et corrections commerciales est reservee aux administrateurs.
- Le Commercial GO/Epartim reprend les droits operationnels historiques du `profile_two`, hors espace d'administration.
- Le Manager reseau supervise son reseau sans administrer les cabinets ou comptes du reseau.
- Le Distributeur agit sur le perimetre cabinet, pas seulement sur ses propres dossiers.
- Le Mandataire entreprise a un perimetre non commercial fortement restreint.
- Le Partenaire est un role generique ; les specificites sont portees par un provider partenaire.
- Les contenus publies sont globaux pour les utilisateurs connectes, avec variations possibles selon le profil.
- Les documents metier heritent en lecture du perimetre de l'objet parent.
- Les actions documentaires sensibles restent separees de la lecture documentaire.
- Les imports et exports operationnels critiques sont des actions d'administration.
- Les bordereaux et factures de consultation suivent le perimetre commission du role.

## Decisions deja tranchees

- L'Administrateur porte l'acces complet existant a l'administration et aux operations.
- L'Administrateur remplace le couple historique `profile_one` / `admin: true` dans le modele cible.
- Le Commercial GO/Epartim reprend les droits du `profile_two` hors ActiveAdmin.
- Le Commercial GO/Epartim peut valider, refuser, envoyer en signature, transmettre a Amundi et suivre les retours BSE.
- Le Commercial GO/Epartim voit les commissions globales, genere les bordereaux et le ZIP global, et peut declencher le recalcul manuel comme dans l'existant.
- Le Commercial GO/Epartim ne gere pas les utilisateurs, roles, cabinets, reseaux, contenus, referents commission, corrections de rattachement ou imports de droits d'entree.
- Le Manager reseau voit les entreprises, souscriptions, commissions, documents et bordereaux des cabinets de son reseau.
- Le Manager reseau peut creer, modifier et demander la validation d'une BSE dans son perimetre reseau.
- Le Manager reseau ne valide pas, ne refuse pas, n'envoie pas en signature et ne transmet pas a Amundi.
- Le Manager reseau n'administre pas les comptes, cabinets ou reseaux.
- Le Distributeur voit et intervient sur le perimetre cabinet partage.
- Le Distributeur peut creer, saisir, modifier et demander la validation d'une BSE dans son cabinet.
- Le Distributeur voit les commissions rattachees a son cabinet et genere le bordereau cabinet autorise.
- Le Mandataire entreprise accede uniquement a ses souscriptions et entreprises explicitement autorisees.
- Le Partenaire a un suivi restreint par dossier ou entreprise autorisee.
- Lilycare est un provider partenaire rattache au cabinet Lilycare.
- L'onboarding Lilycare echoue de maniere controlee si le cabinet Lilycare ou le referent commission explicite est absent.
- Les Mandataires entreprise et Partenaires n'accedent pas aux commissions.
- Les contenus publies restent globaux, avec variations d'affichage ou de categories selon le profil.
- Les documents metier rattaches heritent en lecture du perimetre de la BSE ou de l'entreprise parent.
- Les actions sensibles documentaires, comme l'envoi en signature ou la transmission Amundi, restent reservees aux roles internes habilites.
- Les imports operationnels et exports operationnels critiques sont reserves aux Administrateurs.
- Les exports de consultation, comme les bordereaux et factures, suivent le perimetre metier autorise.
- Les corrections de rattachement commercial et de referent commission sont reservees aux Administrateurs.
- Une correction commerciale impacte les calculs futurs ; les trimestres passes ou courants ne changent que via recalcul manuel explicite.
- Aucun audit fonctionnel dedie n'est obligatoire en V1 pour les corrections sensibles.

## Matrice cible

Colonnes :

- Lecture : consultation de l'objet ou de la liste.
- Creation : creation d'un nouvel objet metier.
- Modification : modification metier ordinaire dans le perimetre autorise.
- Action sensible : validation, refus, signature, transmission, recalcul ou action critique.
- Administration : parametrage, correction sensible, import, export operationnel ou suppression autorisee.
- Perimetre : limite appliquee quand le droit est ouvert.

### Administrateur

| Objet metier | Lecture | Creation | Modification | Action sensible | Administration | Perimetre | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Entreprise Amundi | Oui | Oui | Oui | Oui | Oui | Global | Acces complet, corrections incluses. |
| Souscription BSE | Oui | Oui | Oui | Oui | Oui | Global | Peut valider, refuser, forcer un statut et supprimer si autorise. |
| Documents metier | Oui | Oui | Oui | Oui | Oui | Global | Peut agir sur les documents rattaches et le dossier Amundi. |
| Commissions | Oui | Oui | Oui | Oui | Oui | Global | Peut corriger, importer, recalculer et consulter tous les trimestres. |
| Bordereaux / factures | Oui | Oui | Oui | Oui | Oui | Global | Peut generer unitaire ou ZIP global. |
| Contenus publies | Oui | Oui | Oui | Oui | Oui | Global | Peut publier, de-publier, archiver et administrer. |
| Comptes utilisateurs | Oui | Oui | Oui | Oui | Oui | Global | Creation, invitation, role, cabinet, renvoi d'invitation. |
| Cabinets / reseaux | Oui | Oui | Oui | Oui | Oui | Global | Coordonnees de facturation, codes apporteur et rattachements. |
| Actions Amundi | Oui | Oui | Oui | Oui | Oui | Global | Preparation, transmission, suivi et rattrapage. |
| Imports / exports | Oui | Oui | Oui | Oui | Oui | Global | Imports Amundi, droits d'entree, exports operationnels et CSV admin. |

### Commercial GO/Epartim

| Objet metier | Lecture | Creation | Modification | Action sensible | Administration | Perimetre | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Entreprise Amundi | Oui | Non | Non | Non | Non | Global | Reprise du `profile_two` hors administration. |
| Souscription BSE | Oui | Oui | Oui | Oui | Non | Global | Peut valider, refuser, envoyer en signature et transmettre. |
| Documents metier | Oui | Oui | Oui | Oui | Non | Global | Peut generer, consulter, envoyer en signature et suivre. |
| Commissions | Oui | Non | Non | Oui | Non | Global | Peut consulter et recalculer comme dans l'existant. |
| Bordereaux / factures | Oui | Oui | Non | Oui | Non | Global | Peut generer bordereaux reseau, cabinet et ZIP global. |
| Contenus publies | Oui | Non | Non | Non | Non | Global, variations profil | Peut consulter les contenus internes autorises. |
| Comptes utilisateurs | Profil seulement | Non | Non | Non | Non | Compte courant | Ne gere pas les comptes. |
| Cabinets / reseaux | Oui | Non | Non | Non | Non | Consultation | Ne modifie pas les structures ni la facturation. |
| Actions Amundi | Oui | Oui | Oui | Oui | Non | Global | Peut transmettre et suivre les retours BSE. |
| Imports / exports | Non | Non | Non | Non | Non | Aucun | Pas d'import de droits d'entree ni d'export operationnel admin. |

### Manager reseau

| Objet metier | Lecture | Creation | Modification | Action sensible | Administration | Perimetre | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Entreprise Amundi | Oui | Non | Non | Non | Non | Reseau derive du cabinet | Perimetre des cabinets du reseau. |
| Souscription BSE | Oui | Oui | Oui | Non | Non | Reseau derive du cabinet | Peut demander la validation. |
| Documents metier | Oui | Non | Non | Non | Non | Parent dans le reseau | Lecture heritee de la BSE ou entreprise. |
| Commissions | Oui | Non | Non | Non | Non | Reseau derive du cabinet | Consultation reseau. |
| Bordereaux / factures | Oui | Oui | Non | Non | Non | Reseau derive du cabinet | Peut generer le bordereau reseau autorise. |
| Contenus publies | Oui | Non | Non | Non | Non | Global, variations profil | Contenus globaux connectes. |
| Comptes utilisateurs | Profil seulement | Non | Non | Non | Non | Compte courant | Pas d'administration reseau. |
| Cabinets / reseaux | Oui | Non | Non | Non | Non | Consultation du rattachement | Pas de modification. |
| Actions Amundi | Non | Non | Non | Non | Non | Aucun | Ne transmet pas a Amundi. |
| Imports / exports | Non | Non | Non | Non | Non | Aucun | Hors bordereau de consultation. |

### Distributeur

| Objet metier | Lecture | Creation | Modification | Action sensible | Administration | Perimetre | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Entreprise Amundi | Oui | Non | Non | Non | Non | Cabinet | Portefeuille cabinet partage. |
| Souscription BSE | Oui | Oui | Oui | Non | Non | Cabinet | Peut demander la validation. |
| Documents metier | Oui | Non | Non | Non | Non | Parent dans le cabinet | Lecture heritee de la BSE ou entreprise. |
| Commissions | Oui | Non | Non | Non | Non | Cabinet | Consultation cabinet. |
| Bordereaux / factures | Oui | Oui | Non | Non | Non | Cabinet | Peut generer le bordereau cabinet autorise. |
| Contenus publies | Oui | Non | Non | Non | Non | Global, variations profil | Contenus globaux connectes. |
| Comptes utilisateurs | Profil seulement | Non | Non | Non | Non | Compte courant | Pas de gestion des comptes du cabinet. |
| Cabinets / reseaux | Oui | Non | Non | Non | Non | Consultation du rattachement | Pas de modification. |
| Actions Amundi | Non | Non | Non | Non | Non | Aucun | Ne transmet pas a Amundi. |
| Imports / exports | Non | Non | Non | Non | Non | Aucun | Hors bordereau de consultation. |

### Mandataire entreprise

| Objet metier | Lecture | Creation | Modification | Action sensible | Administration | Perimetre | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Entreprise Amundi | Oui | Non | Non | Non | Non | Autorisation explicite | Suivi de l'entreprise issue du dossier autorise. |
| Souscription BSE | Oui | Oui | Oui | Non | Non | Compte courant ou autorisation explicite | Creation, reprise et completion de ses dossiers. |
| Documents metier | Oui | Non | Non | Non | Non | Parent autorise | Lecture des documents de ses dossiers. |
| Commissions | Non | Non | Non | Non | Non | Aucun | Pas de portefeuille ni commission. |
| Bordereaux / factures | Non | Non | Non | Non | Non | Aucun | Aucun acces. |
| Contenus publies | Oui | Non | Non | Non | Non | Global, variations profil | Contenus globaux connectes. |
| Comptes utilisateurs | Profil seulement | Non | Non | Non | Non | Compte courant | Pas d'administration. |
| Cabinets / reseaux | Non | Non | Non | Non | Non | Aucun | Pas de rattachement commercial. |
| Actions Amundi | Non | Non | Non | Non | Non | Aucun | Ne transmet pas a Amundi. |
| Imports / exports | Non | Non | Non | Non | Non | Aucun | Aucun acces. |

### Partenaire

| Objet metier | Lecture | Creation | Modification | Action sensible | Administration | Perimetre | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Entreprise Amundi | Oui | Non | Non | Non | Non | Autorisation explicite | Suivi des entreprises issues de ses dossiers. |
| Souscription BSE | Oui | Oui | Oui | Non | Non | Compte courant ou autorisation explicite | Le provider peut adapter le parcours. |
| Documents metier | Oui | Non | Non | Non | Non | Parent autorise | Lecture des documents de ses dossiers. |
| Commissions | Non | Non | Non | Non | Non | Aucun | Pas d'acces aux commissions. |
| Bordereaux / factures | Non | Non | Non | Non | Non | Aucun | Aucun acces. |
| Contenus publies | Oui | Non | Non | Non | Non | Global, variations profil | Contenus globaux connectes. |
| Comptes utilisateurs | Profil seulement | Non | Non | Non | Non | Compte courant | Pas d'administration. |
| Cabinets / reseaux | Non | Non | Non | Non | Non | Aucun | Le rattachement provider n'ouvre pas un portefeuille cabinet. |
| Actions Amundi | Non | Non | Non | Non | Non | Aucun | Ne transmet pas a Amundi. |
| Imports / exports | Non | Non | Non | Non | Non | Aucun | Aucun acces. |

## Regles Lilycare

- Lilycare est un provider partenaire, pas un role dedie.
- Un compte Lilycare porte le role Partenaire et le provider Lilycare.
- Le cabinet Lilycare doit exister avant l'onboarding public.
- Le referent commission Lilycare doit etre explicite avant l'onboarding public.
- Si le cabinet Lilycare ou le referent commission est absent, l'onboarding echoue de maniere controlee.
- L'onboarding Lilycare ne cree pas automatiquement le cabinet.
- L'onboarding Lilycare ne cree pas de compte ni de BSE si la configuration obligatoire est absente.
- Le compte Lilycare est rattache au cabinet Lilycare pour les besoins de rattachement et de commissionnement.
- Le compte Lilycare garde un suivi restreint de ses dossiers et entreprises autorisees.
- Lilycare saute l'etape tarification dans le parcours BSE.

## Mapping historique

| Profil historique | Role cible V2 | Commentaire |
| --- | --- | --- |
| `profile_one` | Administrateur | Reprend l'acces complet historique et remplace l'association `profile_one` / `admin: true`. |
| `profile_two` | Commercial GO/Epartim | Reprise des droits hors ActiveAdmin. |
| `profile_three` | Manager reseau | Perimetre derive du reseau du cabinet de l'utilisateur. |
| `profile_five` | Distributeur | Perimetre cabinet partage. |
| `profile_six` | Mandataire entreprise | Perimetre restreint compte courant ou autorisations explicites. |
| `profile_eight` | Partenaire | `partnership_provider = lilycare` devient provider Lilycare. |
| `profile_seven` | Non repris | Ignore en V2, aucun role canonique cible. |

## References a l'existant

- `../go-epargne-entreprise/app/models/user.rb` : mapping historique `profile_one`, `profile_two`, `profile_three`, `profile_five`, `profile_six`, `profile_eight`.
- `../go-epargne-entreprise/config/initializers/active_admin.rb` : acces ActiveAdmin limite a `current_user.admin`.
- `../go-epargne-entreprise/app/admin/users.rb` : administration des comptes, roles, cabinets et invitations.
- `../go-epargne-entreprise/app/admin/firms.rb` : administration des cabinets.
- `../go-epargne-entreprise/app/admin/networks.rb` : administration des reseaux.
- `../go-epargne-entreprise/app/admin/commissions.rb` : import des droits d'entree dans l'administration.
- `../go-epargne-entreprise/app/policies/subscription_policy.rb` : droits BSE par profil historique.
- `../go-epargne-entreprise/app/policies/commission_policy.rb` : perimetres commissions et bordereaux par profil historique.
- `../go-epargne-entreprise/app/policies/document_policy.rb` : documents publies visibles.
- `../go-epargne-entreprise/app/policies/docusign_document_policy.rb` : actions DocuSign plus restrictives.

## Reste a cadrer

- Decider le niveau de trace technique minimal pour les corrections sensibles.
- Identifier les garde-fous UX pour eviter qu'un role externe declenche une action interne.
- Verifier les libelles d'audience des contenus globaux par profil.
- Confirmer les ecrans V2 qui porteront les actions reprises de l'ancien `profile_two`.

## Definition de done

- Une matrice de droits par role, objet, action et perimetre est implementee.
- Les perimetres cabinet, reseau, utilisateur et partenaire sont calcules de maniere centralisee.
- Les actions sensibles sont bloquees pour les roles externes.
- Les contenus publies sont visibles par tous les utilisateurs connectes, avec variations par profil si necessaire.
- Les documents metier suivent le perimetre de leur objet parent en lecture.
- Le mapping des profils historiques vers les roles cibles est documente et applique.
- Les droits repris du projet source sont couverts par des tests de non-regression.
