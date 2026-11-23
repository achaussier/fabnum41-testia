<!--
Atelier 5 — fichiers à joindre avec --file : public/openapi.yaml (la forme) et SPEC.md (le fond)

php bin/ia --prompt-file ateliers/prompts/07-tests-api.md --file public/openapi.yaml --file SPEC.md --out tests/api/devis.spec.ts

Pour une autre route : remplacez « POST /api/quote » ci-dessous et changez le fichier de --out.
-->

Écris des tests Playwright (fixture request, pas de navigateur) pour POST /api/quote,
d'après openapi.yaml (la forme des requêtes et des réponses) et SPEC.md (les règles métier).

Prix utiles du catalogue, en centimes : carnet-a5 = 1290, stylo-plume = 2450, lampe = 5000.

Ce que j'attends :
- un test pour chaque code de réponse documenté dans openapi.yaml pour cette route ;
- pour les réponses 200 : plusieurs paniers (sans coupon, avec chaque coupon valide, autour du seuil de
  livraison offerte), le corps complet vérifié avec toEqual ;
- valeurs attendues calculées depuis SPEC.md, avec le calcul en commentaire sur la même ligne.
  Jamais « au hasard », jamais une valeur que tu ne peux pas justifier par une règle ;
- une table de cas invalides (nom du cas, corps envoyé, code attendu) parcourue par une boucle for,
  qui produit un test par cas : quantité 0, négative, 11, produit inconnu, panier vide, coupon inconnu, coupon expiré ;
- pour chaque erreur : vérifie le code, puis que le corps contient un champ error (message) et un champ code.

Contraintes :
- import { test, expect } from '@playwright/test' ; adresses relatives (baseURL est configuré) ;
- vérifie dans cet ordre : le code, les en-têtes utiles, le corps ;
- noms des tests en français, qui disent le cas et le résultat attendu ;
- données fictives uniquement (e-mails en example.test) ;
- si la route demande un jeton : le projet Playwright « api » l'ajoute déjà à chaque requête.
  N'écris jamais le jeton dans le test ; si tu en as besoin, lis process.env.MINISHOP_API_TOKEN ;
- chaque test crée ses propres données et ne dépend d'aucun autre ;
- teste la RÈGLE, pas l'API : n'adapte aucune valeur attendue à ce que l'API pourrait répondre.
  Si openapi.yaml et SPEC.md se contredisent, écris le test d'après SPEC.md et signale-le en tête du fichier.
