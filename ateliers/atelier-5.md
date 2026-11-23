# Atelier 5 — Explorer et tester l'API (50 min)

**Objectif :** couvrir l'API de MiniShop : succès, erreurs, effets et sécurité.

## Avant de commencer : récupérer la version du jour 2

Commitez ce qui traîne de la veille (`git status`), puis récupérez les nouveautés :

```bash
git fetch
```

Les ateliers d'aujourd'hui réutilisent les tests du jour 1. Le plus simple est de repartir de la branche
`depart-jour-2` : elle contient l'application du jour 2 **et** des tests du jour 1 qui fonctionnent.

```bash
git switch -c atelier-5 origin/depart-jour-2
```

```bash
composer install
```

```bash
npm ci
```

Vérification :

```bash
npx playwright test --project=api
```

✅ *Vous devez voir :* `1 passed`.

> Vous préférez garder **vos** tests du jour 1 ? Voir « Si ça coince », dernière ligne.

## Étapes

### 1. Explorer à la main

Lancez le serveur dans un premier terminal :

```bash
php -S localhost:8000 -t public
```

Dans un second terminal, essayez les 5 routes. Pour chacune, obtenez **un succès et une erreur** :

```bash
curl -s localhost:8000/api/products
```

```bash
curl -i localhost:8000/api/products/licorne
```

`-i` affiche le code et les en-têtes ; `| jq` à la fin d'une commande met le JSON en forme (si `jq` est installé).

Pour les requêtes `POST`, le plus confortable est le fichier `api.http` : ouvrez-le dans VS Code (extension
« REST Client ») et cliquez sur « Send Request » au-dessus de chaque requête.

Ouvrez aussi `SPEC.md`, section « API », et `public/openapi.yaml` : que promet l'API pour chaque route ?

### 2. Un premier test, à la main

Créez `tests/api/produits.spec.ts` et recopiez le test « GET /api/products renvoie le catalogue » vu ce matin
(le code, les en-têtes, le corps). Le fichier `tests/api/exemple.spec.ts` peut vous servir de modèle.

```bash
npx playwright test --project=api
```

✅ *Vous devez voir :* `2 passed`, en moins de deux secondes. Aucun navigateur ne s'est ouvert.

### 3. Générer les tests du devis

La commande complète est en tête de `ateliers/prompts/07-tests-api.md`. Lisez le prompt avant de la lancer :
pourquoi joint-on **deux** fichiers ?

### 4. Relire — avant de lancer

Pour chaque valeur attendue : y a-t-il un calcul en commentaire ? Refaites-le avec `SPEC.md`. Est-il juste ?
Une valeur sans calcul est une valeur à vérifier.

### 5. Lancer, puis compléter la table des cas invalides

```bash
npx playwright test --project=api
```

La table des cas invalides contient-elle bien : quantité 0, quantité 11, produit inconnu, panier vide,
coupon expiré ? Ajoutez les lignes manquantes : un cas = une ligne.

### 6. Un test échoue ?

Lisez le message : quel code était attendu, quel code est arrivé ? Rejouez la requête avec `curl` ou `api.http`.
Puis tranchez avec `SPEC.md` : **bug de l'API ou erreur du test ?**

- Le test contredit la spec : corrigez le test.
- Le test suit la spec : notez le bug (requête, réponse attendue, réponse obtenue) et **n'affaiblissez pas le test**.

### 7. Les effets et la sécurité

Dans un nouveau fichier `tests/api/commandes.spec.ts`, écrivez (à la main, ou avec le prompt 07 adapté à `POST /api/orders`) :

- le scénario chaîné : créer une commande (201), puis la relire avec l'identifiant renvoyé (200) ;
- commande refusée **sans** jeton (401) ;
- commande refusée avec un **faux** jeton (401).

**Le jeton.** Le projet Playwright `api` ajoute déjà le bon jeton à chaque requête (voir `playwright.config.ts`) :
dans le scénario chaîné, vous n'avez rien à écrire. Pour tester le refus, remplacez l'en-tête dans la requête.
Si vous lisez `process.env.MINISHOP_API_TOKEN` dans un test comme sur la diapositive, définissez d'abord la variable
dans votre terminal :

```bash
export MINISHOP_API_TOKEN=minishop-dev-token
```

### 8. Commiter

```bash
git add tests/api
```

```bash
git commit -m "tests: API (produits, devis, commandes, sécurité)"
```

## C'est réussi si…

- [ ] Au moins 10 tests d'API, tous lancés
- [ ] Le bug caché de l'API est trouvé et vous savez l'expliquer
- [ ] Le refus sans jeton (401) est testé
- [ ] Aucun jeton écrit en dur dans les tests

## Si ça coince

| Symptôme | Piste |
|---|---|
| `curl` répond du HTML au lieu de JSON | L'adresse ne commence pas par `/api/`, ou le serveur lancé est celui d'hier : arrêtez-le et relancez-le. |
| Sous PowerShell, `curl` se comporte bizarrement | Écrivez `curl.exe`. Pour les `POST`, préférez `api.http`. |
| Tous mes tests de commande répondent 401 | Le test envoie `Bearer undefined` : `MINISHOP_API_TOKEN` n'est pas définie dans ce terminal. Définissez-la, ou retirez l'en-tête du test (le projet `api` l'ajoute). |
| Le test « sans jeton » répond 201 | L'en-tête du projet n'a pas été remplacé : `headers: { Authorization: '' }` dans la requête. |
| Un test attend 422 et reçoit 404 (ou l'inverse) | Relisez `SPEC.md`, section « API » : les codes ne sont pas les mêmes pour un devis et pour une commande. |
| `toEqual` échoue à cause d'un champ en plus ou en moins | C'est son rôle : la réponse doit être exactement celle attendue. Qui a raison, la spec ou le test ? |
| `aucun bloc de code trouvé` alors que l'IA a répondu du code | La réponse a été coupée : `bin/ia` limite sa longueur. Demandez moins d'un coup (une route, moins de cas), ou ajoutez à la consigne « reste concis ». |
| Un test passe seul mais échoue avec les autres | Il dépend d'un autre test. Chaque test doit créer ses propres données. |
| Je veux garder mes tests du jour 1 | Sur votre dernière branche d'hier : `git merge origin/jour-2`. En cas de conflit (`CONFLICT` sur `.gitignore` ou `playwright.config.ts`), gardez la version du jour 2 : `git checkout --theirs .gitignore playwright.config.ts`, puis `git add .` et `git commit`. Remettez ensuite vos réglages `screenshot`, `video`, `trace` dans le bloc `use` de `playwright.config.ts`. Enfin : `git switch -c atelier-5`. |
