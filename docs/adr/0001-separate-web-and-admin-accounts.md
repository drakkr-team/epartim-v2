# Separer les comptes web et admin

Les applications web et admin utilisent des comptes, guards et sessions d'authentification distincts. Ce choix remplace le role `administrator` porte par un compte web afin qu'une autorisation metier ne puisse jamais ouvrir l'administration ; une meme adresse e-mail peut representer deux comptes independants.
