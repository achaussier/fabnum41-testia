# MiniShop PHP

Projet fil rouge de la formation **« Tester avec l'IA »** (initiation, 1 jour).

Une petite boutique en ligne — catalogue, panier, coupons de réduction, commande — écrite en
PHP 8.4 **sans framework**, pour se concentrer sur les tests : unitaires (PHPUnit),
de bout en bout et visuels (Playwright).

> **SPEC.md décrit ce que l'application doit faire. C'est elle qui fait foi, pas le code.**

## Prérequis

| Outil | Pour vérifier |
|---|---|
| PHP 8.4 (extensions `curl`, `mbstring`, `dom`) + Composer | `php -v` · `composer -V` |
| Node.js 22 | `node -v` |
| Git | `git --version` |
| Une clé API Anthropic (fournie pendant la formation) | — |

## Installation

```bash
composer install && npm ci && npx playwright install chromium
```

## Lancer l'application

```bash
php -S localhost:8000 -t public
```

Puis ouvrir <http://localhost:8000>. Le panier est conservé en session : aucune base de données.

## Lancer les tests

```bash
vendor/bin/phpunit --testdox     # tests unitaires
npx playwright test              # tests de bout en bout (démarre le serveur PHP tout seul)
npx playwright show-report       # rapport HTML du dernier lancement
```

Au départ, le dépôt ne contient qu'un test d'exemple de chaque sorte : les autres sont à écrire
pendant les ateliers.

## Organisation du projet

```
minishop/
├── public/            pages web : catalogue, panier, commande, confirmation, style.css
├── templates/         en-tête, pied de page et initialisation communs aux pages
├── src/               logique métier
│   ├── PriceCalculator.php    livraison, réduction, total
│   ├── Cart.php               contenu du panier
│   ├── CouponValidator.php    validité des codes promo
│   └── Catalog.php            les 6 produits
├── tests/
│   ├── Unit/          tests PHPUnit
│   └── e2e/           tests Playwright
├── ateliers/          guides des ateliers
│   └── prompts/       prompts prêts à l'emploi (à utiliser avec --prompt-file)
├── bin/ia             script qui appelle l'API Claude
├── SPEC.md            règles métier : la référence
└── REGLES-IA.md       consignes envoyées à l'IA à chaque appel
```

Tous les montants sont en **centimes** (`int`) : 12,90 € = `1290`. Jamais de `float` pour l'argent.

## Utiliser l'IA

Pas d'agent de code ici : on appelle directement l'**API Claude** avec le script `bin/ia`
(PHP, sans dépendance). L'IA ne voit **que** ce que le script lui envoie : la consigne, les
fichiers joints avec `--file`, les images jointes avec `--image`, et `REGLES-IA.md`
(envoyé automatiquement comme consigne système).

### La clé API

```bash
export ANTHROPIC_API_KEY=votre-clé        # Linux, macOS, Git Bash
$env:ANTHROPIC_API_KEY = "votre-clé"      # PowerShell
```

> **Sécurité — la clé est secrète.**
> - Elle reste dans une **variable d'environnement**, jamais dans un fichier du dépôt.
>   Si vous préférez un fichier `.env` (modèle : `.env.example`), il est ignoré par Git :
>   vérifiez-le avec `git status` avant chaque commit.
> - Une clé publiée est utilisée — et facturée — par d'autres. En cas de doute, prévenez le
>   formateur : la clé sera révoquée.
> - Ne joignez jamais de secrets ni de données clients : tout ce que vous envoyez sort de votre poste.
>   `--dry-run` montre exactement ce qui partirait.

### Trois exemples

**1. Poser une question sur le projet**

```bash
php bin/ia "Explique ce projet en 10 lignes" --file README.md --file SPEC.md
```

**2. Générer un fichier de test** à partir d'un prompt fourni (`--out` écrit le premier bloc de
code de la réponse ; il refuse de remplacer un fichier existant sans `--force`)

```bash
php bin/ia --prompt-file ateliers/prompts/01-tests-prix.md \
    --file src/PriceCalculator.php --file SPEC.md \
    --out tests/Unit/PriceCalculatorTest.php
```

**3. Faire analyser des captures** (ici, un test visuel en échec)

```bash
php bin/ia --prompt-file ateliers/prompts/06-diff-visuel.md \
    --image catalogue-expected.png --image catalogue-actual.png --image catalogue-diff.png
```

### À savoir

- `php bin/ia --help` liste les options ; `--dry-run` affiche la requête sans l'envoyer (gratuit, sans clé).
- Aucune mémoire entre deux appels : chaque commande doit joindre tout le contexte utile.
- Le script affiche le nombre de tokens envoyés et reçus : c'est ce qui est facturé.
- `IA_MODEL=claude-haiku-5-5 php bin/ia …` (ou `--model`) change de modèle ; `--no-rules` n'envoie pas `REGLES-IA.md`.
- **Commitez avant de lancer l'IA** : `git restore` annule tout si le résultat ne convient pas.
- Relisez chaque test généré, puis lancez-le : l'IA propose, vous vérifiez, vous décidez.

## Les ateliers

Un guide pas à pas par atelier, avec ce que vous devez voir à chaque étape et un encadré « Si ça coince » :
**[ateliers/README.md](ateliers/README.md)**.

## Les prompts des ateliers

| Fichier | Atelier | Rôle |
|---|---|---|
| `01-tests-prix.md` | 1 | Tests PHPUnit de `shipping()` et `applyCoupon()` à partir de SPEC.md |
| `02-coupons.md` | 1 | Tests de `CouponValidator` avec `#[DataProvider]` |
| `03-nettoyer-e2e.md` | 2 | Transformer la sortie de codegen en test lisible |
| `04-tests-visuels.md` | 4 | Un `toHaveScreenshot` par page, zones dynamiques masquées |
| `05-analyse-echec.md` | 3 | Diagnostiquer un échec : bug de l'appli ou du test ? |
| `06-diff-visuel.md` | 4 | Décrire les différences entre attendu, obtenu et différence |

Chaque fichier commence par la commande complète à lancer. Modifiez-les : notez ce qui marche mieux.
