# Solutions des ateliers du jour 2

Une correction possible de chaque atelier. Ce sont des exemples : les tests générés pendant la
formation seront différents, et c'est normal.

| Branche | Contient |
|---|---|
| `depart-jour-2` | le point de départ : l'application du jour 2 et des tests du jour 1 |
| `solution-atelier-5` | les tests d'API |
| `solution-atelier-6` | + les tests de contrat et la décision |
| `solution-atelier-7` | + les tests enrichis, les rapports et la synthèse |
| `solution-atelier-8` | + le test de documentation, le guide et la doc de l'API |
| `solutions-jour-2` | tout, plus le workflow de publication (bonus D) |

Chaque branche contient les précédentes. Ce fichier décrit ce que contient **la branche où vous êtes**.

```bash
composer install && npm ci && npx playwright install chromium
vendor/bin/phpunit --testdox     # 1 échec attendu : « pile 50 euros » (jour 1)
npx playwright test              # échecs attendus : voir ci-dessous
```

## Les défauts volontaires

| | Défaut | Où le voit-on ? |
|---|---|---|
| Jour 1 | Livraison facturée à 50,00 € pile (`>` au lieu de `>=` dans `PriceCalculator::shipping()`) | unit : « pile 50 euros » ; api : « devis : 50 € pile : livraison offerte » |
| Jour 2 — bug | `POST /api/quote` accepte une quantité de 0 et répond 200 au lieu de 422 | api : « devis refusé : quantité nulle » |
| Jour 2 — contrat | `openapi.yaml` promet `createdAt` (obligatoire) dans une commande, l'API renvoie `created_at` | contrat : les deux tests qui reçoivent une commande (201 et 200) |

Aucun n'est corrigé sur ces branches : les tests rouges en sont la preuve.

## Atelier 5 — Tests d'API

Fichiers : `tests/api/produits.spec.ts`, `devis.spec.ts`, `devis-erreurs.spec.ts`, `commandes.spec.ts`, `securite.spec.ts`.

### Le bug : quantité 0 acceptée

`SPEC.md` : « Quantité entre 1 et 10 par produit » ; section « API » : quantité hors de 1 à 10 → **422**.

```bash
curl -s -X POST localhost:8000/api/quote -H "Content-Type: application/json" -d '{"lines":[{"sku":"carnet-a5","qty":0}]}'
```

```json
{"subtotal":0,"discount":0,"shipping":490,"total":490}
```

L'API répond 200 et facture 4,90 € de livraison pour un panier sans article. Les quantités négatives et
supérieures à 10 sont, elles, bien refusées. Dans `src/Api/QuoteService.php`, la borne basse du contrôle est
`$qty < 0` au lieu de `$qty < 1`. Le même défaut existe pour `POST /api/orders`, qui applique les mêmes règles.

Comment le trouver : la table des cas invalides, ligne « quantité nulle » (`devis-erreurs.spec.ts`).
Le piège à montrer : un test dont la valeur attendue est recopiée de la réponse de l'API attend 200… et passe.

### Le bug du jour 1, vu par l'API

« devis : 50 € pile : livraison offerte » échoue aussi : le devis réutilise `PriceCalculator`.
Un seul bug, deux tests rouges (un unitaire, un d'API) : utile pour la synthèse de l'atelier 7.

### Le jeton

Aucun test n'écrit le jeton : le projet `api` de `playwright.config.ts` l'ajoute à chaque requête.
Les tests de `securite.spec.ts` le remplacent par une valeur vide ou fausse.

Attention à la diapositive « Un scénario chaîné » : `process.env.MINISHOP_API_TOKEN` n'est défini que si on
l'exporte dans le terminal. Sinon le test envoie `Bearer undefined` et reçoit 401.
