# Atelier 1 — Tests unitaires générés par l'IA (55 min)

## Partie A — Générer des tests (25 min)

**Objectif :** obtenir des tests unitaires utiles pour `PriceCalculator`, en s'appuyant sur la spec.

### 1. Créer une branche

```bash
git switch -c atelier-1
```

### 2. Lire avant de générer

Ouvrez `src/PriceCalculator.php` et la section « Livraison et coupons » de `SPEC.md`.
Ouvrez aussi `ateliers/prompts/01-tests-prix.md` : retrouvez-y les 6 ingrédients d'un bon prompt vus ce matin.

### 3. Générer

```bash
php bin/ia --prompt-file ateliers/prompts/01-tests-prix.md --file src/PriceCalculator.php --file SPEC.md --out tests/Unit/PriceCalculatorTest.php
```

✅ *Vous devez voir :* la réponse de l'IA, puis `✔ fichier écrit : tests/Unit/PriceCalculatorTest.php`.

### 4. Relire — avant de lancer quoi que ce soit

Ouvrez le fichier généré. Pour **chaque** cas du `#[DataProvider]` :

- D'où vient la valeur attendue : de `SPEC.md`, ou du code ?
- Le nom du cas dit-il ce qui est vérifié ?
- Y a-t-il un commentaire en tête du fichier ? Que dit-il ?

Lisez aussi les remarques de l'IA, affichées dans le terminal après le bloc de code.

### 5. Lancer

```bash
vendor/bin/phpunit --testdox
```

Lisez le résultat dans l'ordre : quel test, valeur attendue, valeur obtenue, ligne.

### 6. Un test est rouge ?

Ne demandez rien à l'IA tout de suite. Posez-vous la question : **qui a raison, le test ou le code ?** L'arbitre est `SPEC.md`.

- Si le test contredit la spec : le test est faux, corrigez-le.
- Si le test suit la spec : le code est faux. **Notez-le** (quelle entrée, quel résultat attendu, quel résultat obtenu) et **ne touchez pas au test** pour le faire passer.

### 7. Commiter

Le fichier de test est nouveau : il faut l'ajouter avant de commiter.

```bash
git add tests/Unit
```

```bash
git commit -m "tests: PriceCalculator"
```

### C'est réussi si…

- [ ] Au moins 6 cas, dont les valeurs limites
- [ ] Les tests utilisent `assertSame` et un `#[DataProvider]`
- [ ] Le bug caché est détecté et vous savez l'expliquer en une phrase
- [ ] Chaque test a été relu avant le commit

---

## Partie B — Vérifier que les tests servent à quelque chose (30 min)

**Objectif :** prouver que les tests détectent vraiment les erreurs, et combler les trous.

### 1. Mesurer la couverture

```bash
XDEBUG_MODE=coverage vendor/bin/phpunit --coverage-text --colors=never > couverture.txt
```

Sous PowerShell : `$env:XDEBUG_MODE = "coverage"` puis `vendor/bin/phpunit --coverage-text --colors=never | Out-File -Encoding utf8 couverture.txt`

Ouvrez `couverture.txt` : quelles méthodes de `PriceCalculator` ne sont pas couvertes à 100 % ?

### 2. Faire compléter par l'IA

Écrivez votre propre consigne. Elle doit dire : quel fichier compléter, de **garder les tests existants**, et de n'ajouter des tests que pour ce qui n'est pas couvert. Pour tester une méthode qui reçoit un `Cart`, l'IA doit voir `Cart.php` et `Catalog.php`.

```bash
php bin/ia "VOTRE CONSIGNE" --file couverture.txt --file tests/Unit/PriceCalculatorTest.php --file src/PriceCalculator.php --file src/Cart.php --file src/Catalog.php --file src/Coupon.php --file SPEC.md --out tests/Unit/PriceCalculatorTest.php --force
```

Vérifiez ensuite avec `git diff` que vos anciens tests sont toujours là, puis relancez PHPUnit.

### 3. Casser exprès le code

Faites **une** modification dans `src/`, relancez les tests, observez, puis annulez. Trois idées :

- dans `PriceCalculator::applyCoupon()`, remplacez `100` par `10` ;
- dans `PriceCalculator::shipping()`, remplacez `return self::SHIPPING_COST;` par `return 0;` ;
- dans `PriceCalculator::applyCoupon()`, remplacez `return $subtotal - $discount;` par `return $subtotal;`.

```bash
vendor/bin/phpunit
```

✅ *Vous devez voir :* au moins un test **de plus** en échec à chaque modification. Si rien ne change, il manque un test : faites-le écrire.

Après chaque essai, annulez :

```bash
git restore src/
```

### 4. Recommencer avec CouponValidator

La commande complète est en tête de `ateliers/prompts/02-coupons.md`. Relisez, lancez, commitez comme en partie A.

### 5. Faire relire par l'IA

```bash
php bin/ia "Signale les assertions faibles ou redondantes" --file tests/Unit/CouponValidatorTest.php
```

Êtes-vous d'accord avec chaque remarque ? Corrigez ce qui le mérite, à la main ou avec l'IA.

### 6. Nettoyer et commiter

`couverture.txt` est un fichier de travail : supprimez-le avant de commiter.

```bash
git status
```

### C'est réussi si…

- [ ] 3 modifications volontaires détectées par les tests
- [ ] Tests de `CouponValidator` avec `#[DataProvider]`
- [ ] Au moins une assertion faible repérée et corrigée
- [ ] Tout est vert (sauf le bug signalé), commit fait

## Si ça coince

| Symptôme | Piste |
|---|---|
| `… existe déjà : relancez avec --force` | `--out` refuse d'écraser un fichier. Ajoutez `--force` si vous voulez vraiment le remplacer (après un commit !). |
| `aucun bloc de code trouvé` | L'IA a répondu par du texte sans code. Lisez sa réponse : elle demande souvent un fichier manquant. |
| `Class "MiniShop\…" not found` dans un test | Il manque un `use` en haut du fichier, ou l'IA a inventé une classe. Existe-t-elle dans `src/` ? |
| `Call to undefined method` | Méthode inventée par l'IA (piège n° 4). Joignez le fichier de la classe concernée et relancez. |
| `No code coverage driver available` | Xdebug n'est pas installé : prévenez le formateur, et passez à l'étape 3 en attendant. |
| Tous les tests sont verts à la partie A | Reprenez les valeurs limites une par une : la valeur attendue vient-elle de la spec, ou du code ? Votre commande joignait-elle bien `SPEC.md` ? |
| `git commit` répond `nothing added to commit` | Le fichier est nouveau : `git add tests/Unit` d'abord. |
