# Guides des ateliers

Un guide par atelier, à suivre dans l'ordre. Le but est que vous **cherchiez**, pas que vous restiez bloqué.

| Guide | Durée | On repart avec… |
|---|---|---|
| [Atelier 0 — Prise en main](atelier-0.md) | 20 min | un poste prêt, l'appli qui tourne |
| [Atelier 1 — Tests unitaires](atelier-1.md) | 55 min | des tests relus, vérifiés |
| [Atelier 2 — Test E2E du parcours d'achat](atelier-2.md) | 45 min | deux scénarios Playwright stables |
| [Atelier 3 — Captures, vidéos, traces](atelier-3.md) | 25 min | savoir enquêter sur un échec |
| [Atelier 4 — Régression visuelle](atelier-4.md) | 35 min | des références, une divergence détectée |
| [Bonus](bonus.md) | — | pour les plus rapides |

## Comment lire un guide

- Chaque étape donne la commande à lancer, puis **ce que vous devez voir**. Si vous voyez autre chose, lisez l'encadré « Si ça coince » en bas du guide avant d'appeler à l'aide.
- Les guides ne donnent pas les réponses : ni le code des tests, ni ce que vous devez découvrir.
- Toutes les commandes se lancent **depuis la racine du projet** et tiennent sur une seule ligne : copiez-les en entier.

## Les trois réflexes de la journée

1. **Commiter avant de lancer l'IA.** Si le résultat ne convient pas : `git restore .` et on recommence.
2. **Relire avant de lancer, lancer avant d'accepter.** Un test généré n'est qu'une proposition.
3. **Un test rouge n'est pas forcément un mauvais test.** Avant de le modifier, comparez avec `SPEC.md` : c'est elle qui fait foi.

## Vraiment bloqué ?

Dans l'ordre :

1. Relire le message d'erreur en entier (la réponse y est souvent).
2. L'encadré « Si ça coince » du guide.
3. Demander à l'IA : `php bin/ia "Explique cette erreur et comment la corriger" --file erreur.txt` (collez l'erreur dans `erreur.txt`).
4. Votre voisin, puis le formateur.
5. En dernier recours, les branches de solution. Il y en a une par atelier, et chacune contient aussi les précédentes :

| Branche | Contient |
|---|---|
| `solution-atelier-1` | les tests unitaires |
| `solution-atelier-2` | + les tests E2E |
| `solution-atelier-3` | + la configuration des preuves et les captures |
| `solution-atelier-4` | + les tests visuels et leurs références |
| `solutions` | tout, plus les bonus accessibilité et CI |

Regarder un fichier de solution sans quitter votre travail :

```bash
git show origin/solution-atelier-1:tests/Unit/PriceCalculatorTest.php
```

Voir tout ce qu'une solution ajoute :

```bash
git diff --stat main origin/solution-atelier-2
```

Vous n'avez pas fini un atelier et le suivant commence ? Commitez votre travail, puis repartez de la solution précédente :

```bash
git switch -c atelier-3 origin/solution-atelier-2
```

## Si la clé API n'est plus reconnue

La variable `ANTHROPIC_API_KEY` ne vit que dans le terminal où vous l'avez définie. Nouveau terminal = il faut la redéfinir :

```bash
export ANTHROPIC_API_KEY=votre-clé
```

Sous PowerShell : `$env:ANTHROPIC_API_KEY = "votre-clé"`
