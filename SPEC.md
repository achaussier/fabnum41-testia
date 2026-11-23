# SPEC — MiniShop

Ce document décrit ce que l'application **doit** faire. **Il fait foi** : si le code se comporte
autrement, c'est le code qui a tort.

Tous les montants sont manipulés en **centimes** (`int`) : 12,90 € = `1290`.
Ils sont affichés au format français : `12,90 €`.

## Livraison et coupons

- Livraison **offerte à partir de 50,00 €** de sous-total (après coupon). Sinon **4,90 €**.
- `BIENVENUE10` : −10 % sur le sous-total, arrondi au centime inférieur
  (la réduction est arrondie : 12,95 € donne 1,29 € de réduction, soit 11,66 € à payer).
- `LIVRAISON` : livraison offerte quel que soit le montant.
- Codes insensibles à la casse et aux espaces autour (`" bienvenue10 "` est valide).
- `NOEL2025` : coupon **expiré** → message « Ce code a expiré ».
- Code inconnu → message « Code promo invalide ».
- Un seul coupon par commande.

## Panier

- Quantité entre 1 et 10 par produit ; une quantité ≤ 0 lève une `InvalidArgumentException`.
- Ajouter un produit déjà présent augmente sa quantité (sans dépasser 10).
- La page du panier affiche, dans cet ordre : la réduction (si un coupon est appliqué), le **total des articles**
  (après réduction, hors livraison), la livraison, puis le **total à payer** (articles + livraison).

## Commande

- Champs obligatoires : nom, e-mail (format valide).
- Page de confirmation avec un **numéro de commande aléatoire** et la **date du jour**.

## API

L'application expose aussi une API JSON sous `/api`. Sa forme exacte (champs, types) est décrite dans
`public/openapi.yaml` ; ses règles sont les mêmes que celles de la boutique, ci-dessus.

### Règles générales

- Les réponses sont en JSON (`Content-Type: application/json; charset=utf-8`).
- Les montants sont des entiers, en **centimes**.
- Une erreur a toujours la forme `{"error": "message lisible", "code": "identifiant_court"}`,
  sans détail technique (ni trace, ni chemin de fichier).
- Dans l'API, les références de produits s'écrivent en minuscules (`carnet-a5`) ; la casse est ignorée.

### Catalogue

- `GET /api/products` : la liste des produits, chacun avec `sku`, `name`, `price`, `stock` → **200**.
- `GET /api/products/{sku}` : un produit → **200** ; référence inconnue → **404**.

### Devis

`POST /api/quote` calcule le prix d'un panier sans rien enregistrer. Corps : `{lines: [{sku, qty}], coupon?}`.

- Réponse **200** : `{subtotal, discount, shipping, total}`.
  - `subtotal` : somme des lignes ; `discount` : réduction du coupon ;
    `shipping` : livraison (règles de la section « Livraison et coupons ») ; `total` = `subtotal` − `discount` + `shipping`.
  - Exemple : 2 Carnets A5 avec `BIENVENUE10` → `{"subtotal": 2580, "discount": 258, "shipping": 490, "total": 2812}`.
- Produit inconnu → **404**.
- Coupon expiré → **410**.
- Données refusées → **422** : panier vide, quantité hors de l'intervalle 1 à 10, coupon inconnu.

### Commandes

Les deux routes de commande exigent un jeton : en-tête `Authorization: Bearer <jeton>`.
Sans jeton ou avec un mauvais jeton → **401**. Ce contrôle a lieu **avant** tout autre : un corps vide sans jeton donne 401, pas 422.

- `POST /api/orders` enregistre une commande. Corps : `{customer: {name, email}, lines, coupon?}`.
  - Réponse **201**, avec l'en-tête `Location: /api/orders/{id}` et le corps `{id, status, total, createdAt}`
    (`status` vaut `"confirmed"`, `total` est calculé comme pour un devis, `createdAt` est la date de création).
  - Données refusées → **422** : nom vide, e-mail invalide, et tout ce qui est refusé pour un devis
    (panier vide, quantité hors de 1 à 10, produit inconnu, coupon inconnu ou expiré).
- `GET /api/orders/{id}` relit une commande → **200** ; identifiant inconnu → **404**.

## Classes concernées

| Règle | Classe | Méthodes |
|---|---|---|
| Livraison, réduction, total | `MiniShop\PriceCalculator` | `shipping()`, `applyCoupon()`, `total()` |
| Validité d'un code promo | `MiniShop\CouponValidator` | `validate()` |
| Contenu du panier | `MiniShop\Cart` | `add()`, `remove()`, `lines()`, `subtotal()` |
| API JSON | `public/api/index.php`, `MiniShop\Api\…` | contrat : `public/openapi.yaml` |
