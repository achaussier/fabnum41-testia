# Atelier 7 — Rapports et synthèse IA (35 min)

**Objectif :** produire les rapports adaptés à chaque lecteur à partir d'un seul lancement.

```bash
git switch -c atelier-7
```

## Étapes

### 1. Enrichir deux tests E2E

Dans `tests/e2e/achat.spec.ts` et un autre test de votre choix, ajoutez (modèle : la diapositive « Étapes, étiquettes et annotations ») :

- des `test.step('…', async () => { … })` autour de chaque étape du parcours, avec des noms écrits pour être lus ;
- un `tag` (par exemple `@critique`) ;
- une `annotation` de type `exigence` qui cite la section de `SPEC.md` vérifiée.

À la main, ou avec l'IA : à vous d'écrire la consigne. Dans ce cas, vérifiez avec `git diff` qu'elle n'a changé **ni les actions ni les assertions**.

```bash
npx playwright test --project=e2e
```

✅ *Vous devez voir :* les mêmes tests qu'avant, toujours verts.

### 2. Configurer les rapports

Dans `playwright.config.ts`, complétez `reporter` avec les quatre lignes vues ce matin : `list`, `html`, `junit` (vers `rapports/e2e.xml`) et `allure-playwright`.

### 3. Tout lancer, une seule fois

```bash
vendor/bin/phpunit --log-junit rapports/unit.xml --testdox-html rapports/unit.html
```

```bash
npx playwright test
```

Des tests échouent : c'est attendu, ce sont les bugs que vous avez trouvés. Vérifiez que les fichiers sont là :

```bash
ls rapports allure-results
```

✅ *Vous devez voir :* `e2e.xml`, `unit.xml`, `unit.html` dans `rapports/`, et de nombreux fichiers dans `allure-results/`.

### 4. Le rapport HTML — pour le développeur

```bash
npx playwright show-report
```

Dans la barre de recherche, tapez `@critique`. Ouvrez un test enrichi : retrouvez ses étapes. (`Ctrl+C` pour arrêter.)

### 5. Le rapport Allure — pour l'équipe qualité

```bash
npx allure generate ./allure-results
```

```bash
npx allure open ./allure-report
```

Parcourez-le : qu'y trouve-t-on de plus que dans le rapport HTML ? Ouvrez aussi `rapports/unit.html` dans le navigateur.

### 6. La synthèse — pour le chef de projet

La commande complète est en tête de `ateliers/prompts/09-synthese.md`.

### 7. Vérifier la synthèse

Ouvrez `rapports/synthese.md` et contrôlez **tout** :

- chaque chiffre : comparez avec la dernière ligne de PHPUnit et de Playwright dans le terminal ;
- chaque nom de test cité : existe-t-il, mot pour mot ? (`grep "nom du test" rapports/*.xml`)
- chaque cause annoncée : est-elle dans le rapport, ou l'IA l'a-t-elle imaginée ?
- le verdict : le signeriez-vous ?

Corrigez ce qui est faux, à la main.

### 8. Commiter

`rapports/`, `allure-results/` et `allure-report/` ne sont pas versionnés (pourquoi ?). On commite la configuration et les tests enrichis :

```bash
git add playwright.config.ts tests/e2e
```

```bash
git commit -m "tests: étapes, étiquettes, rapports JUnit et Allure"
```

## C'est réussi si…

- [ ] Trois rapports générés (HTML, JUnit, Allure)
- [ ] Une synthèse avec un verdict clair
- [ ] Tous les chiffres de la synthèse sont justes
- [ ] Les deux bugs trouvés ce matin y figurent

## Si ça coince

| Symptôme | Piste |
|---|---|
| `rapports/e2e.xml` n'existe pas | La ligne `junit` manque dans `reporter`, ou le fichier de configuration n'est pas enregistré. |
| `allure-results/` est vide ou absent | La ligne `['allure-playwright']` manque dans `reporter`. Relancez ensuite `npx playwright test`. |
| `allure generate` ne trouve rien | Lancez la commande depuis la racine du projet, après `npx playwright test`. |
| Le rapport Allure mélange plusieurs lancements | `allure-results/` s'accumule d'un lancement à l'autre. Supprimez le dossier pour repartir de zéro. |
| `fichier trop gros (> 200 Ko)` avec `bin/ia` | Un des fichiers JUnit est trop gros. Regardez ce qui le gonfle. |
| La synthèse annonce un total faux | Fréquent : l'IA compte mal. Corrigez à la main, ou relancez en donnant les totaux dans la consigne. |
| La synthèse ne cite qu'un bug | Les deux fichiers JUnit étaient-ils joints ? L'un des bugs est dans les tests unitaires, l'autre dans les tests d'API. |
| Après `test.step`, un test ne passe plus | Une variable déclarée dans une étape n'existe pas dans la suivante : déclarez-la avant les étapes. |
