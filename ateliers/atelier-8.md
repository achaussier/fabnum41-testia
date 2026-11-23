# Atelier 8 — Guide utilisateur et vidéos (50 min)

**Objectif :** produire une documentation illustrée et filmée à partir d'un test E2E, assistée par l'IA.

```bash
git switch -c atelier-8
```

## Étapes

### 1. Comprendre l'outil

Lisez `tests/doc/outils.ts` (les commentaires suffisent) et `tests/doc/catalogue.spec.ts`. Puis lancez :

```bash
npx playwright test --project=doc
```

Ouvrez `docs/build/catalogue.json` et le dossier `docs/media/` : une capture par étape, une vidéo, un manifeste.

### 2. Écrire le test de documentation « passer une commande »

Dans `tests/doc/commande.spec.ts` : un test nommé « Guide : passer une commande », en **5 étapes**, du catalogue à la confirmation.

- à la main, sur le modèle de `catalogue.spec.ts` ;
- ou en faisant convertir `tests/e2e/achat.spec.ts` : la commande complète est en tête de `ateliers/prompts/10a-test-doc.md`.

Relisez les titres des étapes : un utilisateur les comprendrait-il ? Une étape = une action utile, pas un clic.

### 3. Générer la matière brute

```bash
npx playwright test --project=doc
```

✅ *Vous devez voir :* `2 passed`, puis `docs/build/commande.json`, `docs/media/commande-1.png` à `commande-5.png` et `docs/media/commande.webm`.

Ouvrez chaque capture : montre-t-elle bien ce que son titre annonce ?

### 4. Faire rédiger le guide

La commande complète est en tête de `ateliers/prompts/10-guide.md` : une option `--image` par capture, dans l'ordre.

### 5. Relire chaque phrase contre sa capture

Ouvrez `docs/guide/passer-une-commande.md` avec l'aperçu Markdown de VS Code (`Ctrl+Maj+V`).
Pour **chaque phrase** : ce qu'elle dit est-il visible sur la capture juste en dessous ?
Corrigez ou supprimez ce qui ne l'est pas. Les images s'affichent-elles ?

### 6. La vidéo et ses sous-titres

Convertir la vidéo en `.mp4` (lisible partout) :

```bash
ffmpeg -i docs/media/commande.webm -c:v libx264 -preset veryfast -crf 23 docs/media/commande.mp4
```

Fabriquer les sous-titres à partir du manifeste (aucune IA ici) :

```bash
php bin/sous-titres docs/build/commande.json
```

✅ *Vous devez voir :* `✔ docs/media/commande.vtt`. Ouvrez ce fichier : d'où viennent les textes ? Les horaires ?

Ajoutez la vidéo en haut de votre guide : le modèle de balise `<video>` est dans `docs/README.md`.

### 7. La documentation de l'API

```bash
npx @redocly/cli build-docs public/openapi.yaml --output docs/api/index.html
```

Ouvrez `docs/api/index.html` dans le navigateur.

### 8. Vérifier l'ensemble, commiter

Ouvrez `docs/README.md` en aperçu : le guide, la vidéo et la doc de l'API sont-ils accessibles depuis le sommaire ?

```bash
git add tests/doc docs/guide docs/api
```

```bash
git commit -m "doc: guide « passer une commande », documentation de l'API"
```

## C'est réussi si…

- [ ] Un guide d'au moins 5 étapes avec captures
- [ ] Aucune phrase non vérifiable sur une capture
- [ ] Une vidéo `.mp4` avec sous-titres `.vtt`
- [ ] La doc API HTML s'ouvre dans le navigateur

## Si ça coince

| Symptôme | Piste |
|---|---|
| Pas de `docs/build/commande.json` | Le test n'utilise pas `etape()`, ou le fichier ne s'appelle pas `commande.spec.ts` : le nom du manifeste vient du nom du fichier. |
| Le test de doc échoue | C'est d'abord un test E2E : lisez l'erreur comme hier. Tant qu'il échoue, la doc n'est pas à jour. |
| Les captures montrent l'écran d'avant | Il manque une attente à la fin de l'étape : un `expect(…).toBeVisible()` sur ce que la capture doit montrer. |
| Les images ne s'affichent pas dans le guide | Le guide est dans `docs/guide/` : le chemin doit être `../media/commande-1.png`, pas `docs/media/…`. |
| `image introuvable` avec `bin/ia` | Le nombre d'options `--image` dépasse le nombre de captures : adaptez la commande à votre nombre d'étapes. |
| `ffmpeg` : commande introuvable | ffmpeg n'est pas installé : prévenez le formateur. Les sous-titres fonctionnent aussi avec le `.webm`. |
| `ffmpeg` demande s'il doit écraser le fichier | Répondez `y`, ou ajoutez `-y` à la commande. |
| Les sous-titres ne s'affichent pas dans l'aperçu VS Code | L'aperçu Markdown ne lit pas toujours les pistes de sous-titres : ouvrez la page dans un navigateur, ou testez avec un lecteur vidéo. |
| Le guide cite un numéro de commande ou une date | Ils changent à chaque génération : supprimez-les du texte. |
| `docs/media/` n'apparaît pas dans `git status` | Normal : les captures et vidéos ne sont pas versionnées, elles se régénèrent. Qu'est-ce que cela implique pour celui qui lit le guide sur le dépôt ? |
