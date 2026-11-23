# Atelier 6 — Le contrat OpenAPI (40 min)

**Objectif :** utiliser le contrat pour vérifier la forme des réponses et repérer une documentation qui ment.

```bash
git switch -c atelier-6
```

## Étapes

### 1. Lire le contrat et l'outil

- `public/openapi.yaml` : retrouvez la route `POST /api/orders`, puis le schéma `Order` dans `components/schemas`.
  Quels champs sont obligatoires (`required`) ?
- `tests/api/contrat.ts` (fourni) : les commentaires numérotés décrivent ce que fait `expectConforme`. Que vérifie-t-elle ? Que ne vérifie-t-elle pas ?

### 2. Générer un test de conformité par route

La commande complète est en tête de `ateliers/prompts/08-tests-contrat.md`.

Relisez le fichier généré : y a-t-il bien un test par route **et** par code documenté ? Comparez avec le tableau des routes vu ce matin.

### 3. Lancer

```bash
npx playwright test tests/api/contrat.spec.ts
```

Un écart apparaît entre le contrat et une réponse. Lisez le message : **quel champ, sur quelle route ?**
Vérifiez-le vous-même avec `api.http` ou `curl` : que renvoie réellement l'API ?

### 4. Décider qui a raison

Le test ne dit pas qui a tort : le contrat, ou l'API ? À vous de trancher. Pour décider :

- que dit `SPEC.md` ?
- qui utilise déjà l'API, et sur quoi comptent-ils ? (voir « ce qui casse le contrat » ce matin)
- que coûte chaque correction ?

Écrivez votre décision dans `docs/decisions.md` en suivant le modèle : contexte, options, choix, conséquences.
Vous pouvez demander son avis à l'IA (en joignant le message d'erreur, le contrat et la spec), mais la décision est la vôtre.

### 5. Vérifier le contrat lui-même

```bash
npx @redocly/cli lint public/openapi.yaml
```

✅ *Vous devez voir :* `Your API description is valid`, avec quelques avertissements (`warning`).

Faites-vous expliquer les avertissements. Enregistrez-les dans un fichier, puis :

```bash
npx @redocly/cli lint public/openapi.yaml --format stylish > lint.txt
```

```bash
php bin/ia "Explique chaque avertissement en une phrase simple, et dis s'il faut le corriger dans un projet de formation." --file lint.txt --file public/openapi.yaml
```

Supprimez ensuite `lint.txt`.

### 6. Commiter

```bash
git add tests/api docs/decisions.md
```

```bash
git commit -m "tests: conformité au contrat, décision sur l'écart"
```

### Bonus (avec Docker)

Le serveur PHP doit tourner. Schemathesis lit le contrat et fabrique lui-même des centaines de requêtes :

```bash
docker run --rm --network host ghcr.io/schemathesis/schemathesis:stable run http://localhost:8000/openapi.yaml --url http://localhost:8000 -H "Authorization: Bearer minishop-dev-token" --continue-on-failure
```

- `-H "Authorization: …"` : sans le jeton, toutes les commandes répondent 401 et il n'explore rien derrière ;
- `--continue-on-failure` : sans cette option, il s'arrête au premier écart de chaque route.

(Avec podman, remplacez `docker` par `podman`.)

Triez ce qu'il trouve, écart par écart : retrouvez-vous vos deux découvertes de l'après-midi ?
Lesquels sont de vrais problèmes, lesquels sont des faux positifs (un outil qui ne connaît pas les règles métier) ?

## C'est réussi si…

- [ ] Un test de contrat par route
- [ ] L'écart doc/API est trouvé
- [ ] La décision est écrite et argumentée
- [ ] `lint` ne signale pas d'erreur

## Si ça coince

| Symptôme | Piste |
|---|---|
| `Cannot find module './contrat'` | Le test généré n'est pas dans `tests/api/`, ou l'import est mal écrit : `import { expectConforme } from './contrat';` |
| `… n'existe pas dans le contrat` | Le chemin passé à `expectConforme` ne correspond à aucune route : écrivez-le comme dans `openapi.yaml`, par exemple `/api/orders/{id}`. |
| `le code 4xx n'est pas documenté` | La requête du test ne provoque pas le code prévu. Est-ce le test qui se trompe de requête, ou l'API qui répond un code que le contrat ignore ? |
| Tous les tests de contrat passent | Y a-t-il bien un test pour la **création** et la **lecture** d'une commande (201 et 200) ? |
| L'IA a « corrigé » le test pour qu'il passe | C'est le piège : un test de contrat arrangé ne sert plus à rien. `git restore` et relancez. |
| Le premier lancement de `npx @redocly/cli` est long | Il se télécharge la première fois. C'est normal. |
