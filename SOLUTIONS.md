# Solutions des ateliers

Une correction possible de chaque atelier. Ce sont des exemples : les tests générés pendant la
formation seront différents, et c'est normal.

| Branche | Contient |
|---|---|
| `solution-atelier-1` | les tests unitaires |
| `solution-atelier-2` | + les tests E2E |
| `solution-atelier-3` | + la configuration des preuves et les captures |
| `solution-atelier-4` | + les tests visuels et leurs références |
| `solutions` | tout, plus les bonus accessibilité et CI |

Chaque branche contient les précédentes. Ce fichier décrit ce que contient **la branche où vous êtes**.

```bash
composer install && npm ci && npx playwright install chromium
vendor/bin/phpunit --testdox     # 1 échec attendu (voir atelier 1)
npx playwright test
```

## Atelier 1 — Tests unitaires

Fichiers : `tests/Unit/PriceCalculatorTest.php`, `CouponValidatorTest.php`, `CartTest.php`
(`#[DataProvider]` nommés, `assertSame`).

### Le bug volontaire

`SPEC.md` : « Livraison **offerte à partir de 50,00 €** de sous-total ».

`src/PriceCalculator.php` :

```php
if ($subtotal > self::FREE_SHIPPING_FROM) {   // devrait être >=
    return 0;
}
```

Un panier de **50,00 € pile** paie donc 4,90 € de livraison, contrairement à la spec.
On le voit aussi dans l'application : ajouter la « Lampe de bureau » (50,00 €) seule au panier.

Dans `PriceCalculatorTest.php`, le cas `'pile 50 euros' => [5000, 0]` suit la spec :
**il échoue, et c'est le résultat attendu** de l'atelier.

```
✘ Frais de livraison with pile·50·euros
  Failed asserting that 490 is identical to 0.
```

- Le code n'est volontairement pas corrigé : le test rouge est la preuve du bug.
- Correction (si on veut voir le test repasser au vert) : remplacer `>` par `>=`.
- Le piège à montrer : un test généré **à partir du code, sans la spec**, attend `490` pour `5000`.
  Il est vert… et il verrouille le bug.

### Casser exprès (partie B)

Les trois modifications proposées dans le guide font chacune échouer 3 ou 4 tests supplémentaires.

## Atelier 2 — Parcours d'achat

Fichiers : `tests/e2e/achat.spec.ts` (parcours complet avec `BIENVENUE10`), `coupon.spec.ts`
(code inconnu, code expiré, `LIVRAISON`), `commande.spec.ts` (champs obligatoires, e-mail mal formé).

Calcul du parcours : 12,90 € + 24,50 € = 37,40 € ; réduction de 10 % = 3,74 € ; total des articles 33,66 € ;
livraison 4,90 € ; total à payer 38,56 €.

`data-testid="cart-total"` affiche le **total des articles** (après réduction, hors livraison).
La livraison et le total à payer sont dans `cart-shipping` et `order-total`.
