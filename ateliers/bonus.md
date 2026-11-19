# Bonus — pour les plus rapides

À faire dans l'ordre que vous voulez. Chaque bonus tient en une consigne à l'IA… et une relecture.

## A — Accessibilité

```bash
npm i -D @axe-core/playwright
```

Faites écrire `tests/e2e/accessibilite.spec.ts` : un test axe-core par page (l'exemple du catalogue est dans le diaporama).
Lancez-le. Pour chaque violation, demandez à l'IA de l'expliquer et de proposer la correction, en joignant le message d'erreur et le fichier concerné (`public/…`, `templates/header.php`, `public/style.css`).

*Attention :* si vous corrigez l'apparence d'une page, que va-t-il arriver à vos tests visuels ? Que faut-il faire alors ?

## B — Réparation assistée

Renommez un bouton dans `public/` (par exemple « Appliquer » → « Valider le code »). Un test E2E casse.
Envoyez à l'IA l'erreur (`error-context.md`), le test et le HTML de la page. Relisez le correctif : corrige-t-il le test, ou affaiblit-il la vérification ?

## C — Mutation automatique

```bash
composer require --dev infection/infection
```

```bash
XDEBUG_MODE=coverage vendor/bin/infection
```

Quel score ? Quels « mutants » ont survécu ? Faites écrire le test qui manque pour l'un d'eux.

## D — Pipeline CI

Faites générer `.github/workflows/tests.yml` : PHPUnit, puis Playwright, et le rapport conservé même en cas d'échec.
Relisez : quelles versions de PHP et de Node ? Que se passe-t-il pour les étapes suivantes si PHPUnit échoue ?

## E — Données de test

Demandez 20 clients fictifs avec des cas tordus (noms accentués, apostrophes, e-mails limites), puis un test qui passe commande pour chacun. Lesquels l'application refuse-t-elle ? Est-ce conforme à `SPEC.md` ?

## F — Comparer les modèles

Rejouez le prompt de l'atelier 1 avec un autre modèle, vers un autre fichier :

```bash
IA_MODEL=claude-haiku-5-5 php bin/ia --prompt-file ateliers/prompts/01-tests-prix.md --file src/PriceCalculator.php --file SPEC.md --out tests/Unit/PriceCalculatorHaikuTest.php
```

Sous PowerShell : `$env:IA_MODEL = "claude-haiku-5-5"` puis la commande `php bin/ia …`.

Comparez : nombre de cas, qualité des noms, écart code / spec signalé ou non, nombre de tokens. Puis supprimez ce fichier : il contient une classe du même nom que la vôtre.
