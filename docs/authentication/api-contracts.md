# Contrats API auth

Les routes existantes sont dans `apps/api/src/features/user_management`.

Les reponses doivent rester JSON et compatibles avec le middleware
`force_json_response`.

## Connexion

`POST /user-management/authentication/login`

Payload :

```json
{
  "uid": "user@example.com",
  "password": "password"
}
```

Reponse succes :

```json
{
  "id": 1,
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "roles": ["distributor"],
  "firm": {
    "id": 10,
    "name": "Cabinet exemple"
  },
  "network": {
    "id": 20,
    "name": "Reseau exemple"
  }
}
```

Erreurs :

- identifiants invalides
- compte invite
- compte desactive
- payload invalide
- rate limit

## Deconnexion

`DELETE /user-management/authentication/logout`

Reponse succes :

```json
null
```

## Demande de reset

`POST /user-management/password/forgot`

Payload :

```json
{
  "email": "user@example.com"
}
```

Reponse succes :

```json
null
```

La reponse est identique si l'email est inconnu, si le compte est invite ou si
le compte est desactive.

## Reset de mot de passe

`POST /user-management/password/reset`

Payload :

```json
{
  "token": "clear-token-from-email",
  "newPassword": "new-password"
}
```

Reponse succes :

```json
null
```

Erreurs :

- token invalide
- token expire
- token deja utilise
- mot de passe invalide

## Changement de mot de passe connecte

`PATCH /user-management/password`

Payload :

```json
{
  "currentPassword": "current-password",
  "newPassword": "new-password"
}
```

Reponse succes :

```json
null
```

Cette route peut rester hors perimetre du premier cycle si le profil reste en
lecture seule stricte.

## Profil

`GET /user-management/profile`

Reponse succes :

```json
{
  "id": 1,
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "mobilePhone": "+33600000000",
  "roles": ["distributor"],
  "firm": {
    "id": 10,
    "name": "Cabinet exemple"
  },
  "network": {
    "id": 20,
    "name": "Reseau exemple"
  }
}
```

## Invitation a ajouter

`POST /admin/users`

Reserve a une action interne.

Payload cible :

```json
{
  "email": "user@example.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "mobilePhone": "+33600000000",
  "roleCodes": ["distributor"],
  "firmId": 10
}
```

## Renvoi d'invitation a ajouter

`POST /admin/users/:id/invitations/resend`

Regle :

- uniquement pour une invitation non acceptee
- revoque l'ancien token actif
- envoie un nouveau lien

## Activation a ajouter

`POST /admin/invitations/accept`

Payload cible :

```json
{
  "token": "clear-token-from-email",
  "password": "new-password"
}
```

Reponse succes :

```json
{
  "id": 1,
  "email": "user@example.com"
}
```

L'activation peut ouvrir automatiquement une session.
