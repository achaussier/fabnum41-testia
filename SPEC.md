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

## Classes concernées

| Règle | Classe | Méthodes |
|---|---|---|
| Livraison, réduction, total | `MiniShop\PriceCalculator` | `shipping()`, `applyCoupon()`, `total()` |
| Validité d'un code promo | `MiniShop\CouponValidator` | `validate()` |
| Contenu du panier | `MiniShop\Cart` | `add()`, `remove()`, `lines()`, `subtotal()` |
