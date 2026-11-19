# Atelier 0 — Prise en main du projet (20 min)

**Objectif :** avoir un poste prêt et comprendre ce que fait l'application avant de la tester.

## Étapes

### 1. Récupérer le projet

```bash
git clone [url du dépôt] minishop
```

```bash
cd minishop
```

### 2. Installer les dépendances

```bash
composer install
```

```bash
npm ci
```

```bash
npx playwright install chromium
```

✅ *Vous devez voir :* aucune ligne en rouge. Deux nouveaux dossiers existent : `vendor/` et `node_modules/`.

### 3. Lancer l'application

```bash
php -S localhost:8000 -t public
```

✅ *Vous devez voir :* `Development Server (http://localhost:8000) started`. Ouvrez <http://localhost:8000> : le catalogue s'affiche avec 6 produits.

> Ce terminal reste occupé par le serveur. **Ouvrez un deuxième terminal** pour la suite (dans VS Code : le bouton « + » du panneau Terminal).

### 4. Faire un achat à la main

Ajoutez 2 produits, ouvrez le panier, saisissez le code `BIENVENUE10`, passez la commande.

Notez sur papier, pour plus tard : le prix des deux produits, la réduction affichée, la livraison, le total à payer.

### 5. Lire SPEC.md

Ouvrez `SPEC.md` et notez **3 règles** qui vous semblent importantes. Pour chacune : comment la vérifieriez-vous à la main ?

### 6. Lancer les tests d'exemple

```bash
vendor/bin/phpunit
```

✅ *Vous devez voir :* `OK (1 test, 1 assertion)`.

```bash
npx playwright test
```

✅ *Vous devez voir :* `1 passed`.

### 7. Premier appel à l'IA

Définissez la clé fournie par le formateur (dans **ce** terminal) :

```bash
export ANTHROPIC_API_KEY=votre-clé
```

Regardez d'abord ce qui partirait, sans rien envoyer :

```bash
php bin/ia "Explique ce projet en 10 lignes" --file README.md --file SPEC.md --dry-run
```

Puis envoyez pour de vrai :

```bash
php bin/ia "Explique ce projet en 10 lignes" --file README.md --file SPEC.md
```

✅ *Vous devez voir :* une réponse en français, puis une ligne `ℹ tokens : … envoyés, … reçus`.

**À observer dans le `--dry-run` :** où se trouve le contenu de `REGLES-IA.md` ? Où sont vos deux fichiers ? L'IA voit-elle le code de `src/` ?

## C'est réussi si…

- [ ] L'appli s'affiche dans le navigateur
- [ ] Les deux suites de tests sont vertes
- [ ] `bin/ia` répond (et `--dry-run` montre la requête)
- [ ] Vous savez expliquer 3 règles de SPEC.md

## Si ça coince

| Symptôme | Piste |
|---|---|
| `Address already in use` au lancement du serveur | Un serveur tourne déjà sur le port 8000 (un autre terminal ?). Fermez-le, ou utilisez celui qui tourne. |
| `vendor/bin/phpunit : No such file` | `composer install` n'a pas été lancé, ou pas à la racine du projet. |
| Sous Windows, `vendor/bin/phpunit` n'est pas reconnu | Essayez `php vendor/bin/phpunit`. |
| Playwright : `Executable doesn't exist` | `npx playwright install chromium` |
| `✘ ANTHROPIC_API_KEY n'est pas définie` | La clé n'est pas définie dans ce terminal. Sous PowerShell : `$env:ANTHROPIC_API_KEY = "votre-clé"` |
| `l'API a répondu 401` | Clé mal copiée (espace, guillemet en trop). |
| `fichier introuvable` | Vous n'êtes pas à la racine du projet : `pwd` doit se terminer par `minishop`. |
