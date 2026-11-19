# Atelier 2 — Un test E2E du parcours d'achat (45 min)

**Objectif :** automatiser le parcours principal de l'application, de manière lisible et stable.

Commitez votre travail de l'atelier 1, puis :

```bash
git switch -c atelier-2
```

## Étapes

### 1. Découvrir le mode interactif

```bash
npx playwright test --ui
```

Une fenêtre s'ouvre. Lancez le test d'exemple (bouton ▶), puis cliquez sur chaque action dans la chronologie : vous voyez la page avant et après. Fermez la fenêtre.

### 2. Enregistrer le parcours

L'enregistreur a besoin que l'application tourne. Dans un **premier terminal** (s'il ne tourne pas déjà) :

```bash
php -S localhost:8000 -t public
```

Dans un **second terminal** :

```bash
npx playwright codegen http://localhost:8000
```

Deux fenêtres s'ouvrent : le navigateur et l'« Inspector », où le code s'écrit pendant que vous cliquez.
Faites le parcours : 2 produits → panier → code `BIENVENUE10` → Appliquer → Passer la commande → nom, e-mail → Commander.

### 3. Sauver le brouillon

Dans l'Inspector, copiez tout le code (bouton « Copy »). Dans VS Code, créez le fichier `tests/e2e/brouillon.spec.ts`, collez, enregistrez. Fermez les fenêtres de codegen.

Regardez ce brouillon : que lui manque-t-il pour être un vrai test ?

### 4. Faire nettoyer par l'IA

La commande complète est en tête de `ateliers/prompts/03-nettoyer-e2e.md`. Lisez le prompt avant de la lancer : pourquoi joint-on `SPEC.md` et `src/Catalog.php` ?

Une fois `tests/e2e/achat.spec.ts` écrit, **supprimez le brouillon** (sinon Playwright le lance aussi).

### 5. Relire et lancer

Avant de lancer : recalculez vous-même le total des articles et la réduction attendus (prix dans le catalogue, règle dans `SPEC.md`). L'IA a-t-elle les mêmes valeurs ? Y a-t-il des commentaires « À VÉRIFIER » ?

```bash
npx playwright test
```

✅ *Vous devez voir :* `2 passed` (l'exemple et votre parcours).

Il manque une assertion (réduction, total, confirmation) ? Ajoutez-la, à la main ou en redemandant à l'IA.

### 6. Un deuxième scénario, sans enregistrement

Scénario : « un code promo invalide affiche un message d'erreur, et le total ne change pas ».

L'IA ne voit pas l'application : donnez-lui le HTML du panier. Le panier dépend de la session, il faut donc d'abord y mettre un produit (le serveur doit tourner) :

```bash
curl -s -c cookies.txt -d sku=CARNET-A5 http://localhost:8000/
```

```bash
curl -s -b cookies.txt http://localhost:8000/cart.php > cart.html
```

Sous PowerShell, écrivez `curl.exe` à la place de `curl`.

Ouvrez `cart.html` : vous y retrouvez les libellés et les `data-testid`. Écrivez ensuite votre consigne (scénario en français + résultat attendu tiré de `SPEC.md`) :

```bash
php bin/ia "VOTRE SCÉNARIO" --file cart.html --file SPEC.md --out tests/e2e/coupon.spec.ts
```

Le test échoue au premier essai ? C'est fréquent. Lisez l'erreur, puis renvoyez-la à l'IA avec le test.

### 7. Tester la stabilité

```bash
npx playwright test --repeat-each=3
```

✅ *Vous devez voir :* tous les tests passent, 3 fois chacun.

### 8. Nettoyer et commiter

Supprimez `cart.html` et `cookies.txt`, vérifiez avec `git status`, puis :

```bash
git add tests/e2e
```

```bash
git commit -m "tests: parcours d'achat et coupon invalide"
```

### Bonus

Faites proposer par l'IA 3 scénarios à partir de la section « Commande » de `SPEC.md`, puis automatisez-en un.

## C'est réussi si…

- [ ] Deux scénarios verts
- [ ] Aucun `waitForTimeout`
- [ ] Sélecteurs `getByRole`, `getByLabel` ou `getByTestId`
- [ ] Vert 3 fois de suite

## Si ça coince

| Symptôme | Piste |
|---|---|
| codegen ouvre une page d'erreur | Le serveur PHP ne tourne pas (étape 2, premier terminal). |
| `strict mode violation … resolved to 2 elements` | Le sélecteur trouve plusieurs éléments. Lisez la liste dans l'erreur et choisissez un nom plus précis, ou un `getByTestId`. |
| `Timeout … waiting for getByRole(…)` | L'élément n'existe pas sous ce nom : libellé inventé par l'IA ? Comparez avec la page réelle ou `cart.html`. |
| `Expected: "…" Received: "…"` sur un montant | Qui a raison ? Refaites le calcul à la main avec `SPEC.md`. |
| Le test attend un total avec la livraison | `cart-total` est le total des **articles** ; le total à payer est dans `order-total`. Voir `SPEC.md`, section « Panier ». |
| `cart.html` contient « Votre panier est vide » | La première commande `curl` n'a pas été lancée, ou `cookies.txt` n'a pas été créé. |
| Le brouillon passe mais ne vérifie rien | Normal : c'est pour ça qu'on le nettoie puis qu'on le supprime. |
