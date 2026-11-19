# Atelier 4 — Détecter une régression visuelle (35 min)

**Objectif :** mettre en place une surveillance visuelle et savoir réagir à une divergence.

```bash
git switch -c atelier-4
```

## Étapes

### 1. Faire écrire les tests visuels

La commande complète est en tête de `ateliers/prompts/04-tests-visuels.md`. Lisez le prompt : quelles pages, quelles options, quelles zones masquées ?

### 2. Premier lancement : rouge, et c'est normal

```bash
npx playwright test tests/e2e/visuel.spec.ts
```

✅ *Vous devez voir :* les tests échouent avec `A snapshot doesn't exist … writing actual`. Playwright vient de créer les images de référence.

Ouvrez le dossier `tests/e2e/visuel.spec.ts-snapshots/` et **regardez chaque image** : c'est vous qui validez qu'elle est correcte.

### 3. Deuxième lancement : vert

```bash
npx playwright test tests/e2e/visuel.spec.ts
```

✅ *Vous devez voir :* `4 passed`.

### 4. Les zones qui changent

Dans les références, repérez les rectangles roses : ce sont les zones masquées. Lesquelles ? Pourquoi celles-là ?
Expérience : retirez un `mask` du test de confirmation, puis lancez deux fois. Que se passe-t-il ? Remettez le masque.

### 5. Commiter les références

```bash
git add tests/e2e
```

```bash
git commit -m "tests: régression visuelle, références"
```

### 6. Créer une régression

Dans `public/style.css`, changez **une** chose visible : la couleur `--primary` des boutons, ou un `padding`.

### 7. Relancer et comparer

```bash
npx playwright test tests/e2e/visuel.spec.ts
```

```bash
npx playwright show-report
```

Dans le rapport, ouvrez un test en échec : onglets **Diff**, **Actual**, **Expected**, et le curseur de comparaison.
Tous les tests ont-ils échoué ? Si une page passe encore malgré votre changement, pourquoi ? (Indice : `maxDiffPixelRatio`.)

### 8. Faire décrire la différence par l'IA

Les trois images sont dans le dossier du test en échec :

```bash
ls test-results
```

Remplacez `DOSSIER` (touche `Tab` pour compléter) :

```bash
php bin/ia --prompt-file ateliers/prompts/06-diff-visuel.md --image test-results/DOSSIER/catalogue-expected.png --image test-results/DOSSIER/catalogue-actual.png --image test-results/DOSSIER/catalogue-diff.png
```

Sa description est-elle exacte ? Son avis (régression ou changement voulu) vous convainc-il ? Que lui manque-t-il pour trancher ?

### 9. Décider

C'est **votre** décision, pas celle de l'IA. Deux issues possibles :

- le changement n'était pas voulu → `git restore public/style.css`, relancer : vert ;
- le changement est voulu → `npx playwright test --update-snapshots`, **regarder les nouvelles références**, puis commiter le CSS et les références ensemble.

Écrivez votre choix et sa raison dans le message de commit.

## C'est réussi si…

- [ ] Une référence par page, versionnée
- [ ] Les zones dynamiques sont masquées
- [ ] Une divergence détectée et expliquée
- [ ] Une décision prise et justifiée

## Si ça coince

| Symptôme | Piste |
|---|---|
| Rouge au deuxième lancement, sans rien avoir changé | Une zone dynamique n'est pas masquée. Regardez l'image **Diff** : où sont les pixels colorés ? |
| Mon changement de CSS n'est pas détecté | Changement trop petit pour la tolérance de 1 % sur cette page. Regardez les autres pages, ou discutez la tolérance. |
| `image introuvable` avec `bin/ia` | `test-results/` est vidé à chaque lancement : relancez le test visuel en échec, puis `bin/ia`. Le nom des images commence par celui donné dans `toHaveScreenshot('….png')`. |
| Les références ont un nom en `-linux`, `-darwin` ou `-win32` | Normal : le rendu dépend du système. Chaque système a ses références. |
| Le test visuel échoue avant la capture | C'est une erreur de parcours (sélecteur, panier vide), pas une différence visuelle : lisez le message comme en atelier 2. |
| J'ai lancé `--update-snapshots` trop vite | `git restore tests/e2e/visuel.spec.ts-snapshots` remet les références commitées. D'où l'intérêt de l'étape 5. |
