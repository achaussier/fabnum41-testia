<!--
Atelier 6 — fichiers à joindre avec --file : le contrat, l'outil de validation fourni, et SPEC.md

php bin/ia --prompt-file ateliers/prompts/08-tests-contrat.md --file public/openapi.yaml --file tests/api/contrat.ts --file SPEC.md --out tests/api/contrat.spec.ts
-->

Écris des tests de conformité au contrat pour l'API MiniShop, dans tests/api/contrat.spec.ts.

Le fichier joint tests/api/contrat.ts fournit la fonction
expectConforme(reponse, methode, chemin) : elle vérifie que le code de la réponse est documenté
dans openapi.yaml pour cette route, et que le corps JSON respecte le schéma prévu.

Ce que j'attends :
- un test par route ET par code de réponse documenté dans openapi.yaml (toutes les routes, tous les codes) ;
- dans chaque test : la requête qui provoque ce code, une assertion sur le code attendu,
  puis await expectConforme(reponse, 'MÉTHODE', '/chemin/du/contrat') ;
- pour les routes avec un paramètre, passe le chemin tel qu'il est écrit dans le contrat
  (par exemple '/api/orders/{id}') ;
- pour relire une commande (200), crée-la d'abord dans le même test et réutilise son identifiant.

Contraintes :
- import { test, expect } from '@playwright/test' et import { expectConforme } from './contrat' ;
- noms des tests en français, sous la forme « GET /api/products/{sku} — 404 respecte le contrat » ;
- le projet Playwright « api » ajoute déjà le jeton à chaque requête. Pour provoquer un 401,
  remplace l'en-tête : headers: { Authorization: '' }. N'écris jamais le jeton dans un test ;
- données fictives uniquement (e-mails en example.test), références de produits en minuscules (carnet-a5) ;
- chaque test crée ses propres données ;
- ne vérifie pas les valeurs calculées ici : ces tests portent sur la FORME des réponses ;
- ne modifie ni openapi.yaml ni contrat.ts, et n'« arrange » aucun test pour le faire passer :
  si une réponse ne respecte pas le contrat, le test doit échouer.
