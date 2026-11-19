# Atelier 3 — Captures, vidéos, traces (25 min)

**Objectif :** savoir enquêter sur un test qui échoue sans avoir été devant l'écran.

```bash
git switch -c atelier-3
```

## Étapes

### 1. Activer les preuves

Dans `playwright.config.ts`, ajoutez dans le bloc `use` les trois réglages vus ce matin : `screenshot`, `video`, `trace`, avec des valeurs qui ne gardent les fichiers **qu'en cas d'échec**.

### 2. Faire échouer exprès un test

Dans `tests/e2e/achat.spec.ts`, changez le total attendu (par exemple 1 € de plus).

### 3. Lancer et ouvrir le rapport

```bash
npx playwright test
```

```bash
npx playwright show-report
```

✅ *Vous devez voir :* le rapport dans le navigateur, avec un test en échec. (`Ctrl+C` dans le terminal pour arrêter le rapport.)

### 4. Enquêter dans le rapport

Cliquez sur le test en échec, puis ouvrez dans l'ordre : la **capture**, la **vidéo**, la **trace**.
Dans la trace : retrouvez l'action qui échoue, et regardez la page à ce moment-là. Quelle valeur est affichée ?

### 5. Faire analyser par l'IA

Les preuves sont dans `test-results/`, un dossier par test en échec :

```bash
ls test-results
```

Dans ce dossier : `test-failed-1.png` (la capture) et `error-context.md` (le message d'erreur, préparé par Playwright). Remplacez `DOSSIER` par le nom affiché :

```bash
php bin/ia --prompt-file ateliers/prompts/05-analyse-echec.md --file test-results/DOSSIER/error-context.md --file tests/e2e/achat.spec.ts --file SPEC.md --image test-results/DOSSIER/test-failed-1.png
```

Astuce : tapez le début du nom du dossier puis la touche `Tab`, le terminal complète.

L'IA conclut-elle « bug de l'application » ou « erreur du test » ? **Vérifiez sa conclusion dans la trace** avant de modifier quoi que ce soit.

### 6. Remettre le test en état

```bash
git restore tests/e2e/achat.spec.ts
```

```bash
npx playwright test
```

✅ *Vous devez voir :* tout est vert. Et `test-results/` ? Regardez ce qu'il contient maintenant.

### 7. Des captures pour la documentation

Faites écrire par l'IA un test `tests/e2e/captures.spec.ts` qui parcourt l'application et enregistre une capture de chaque page (catalogue, panier, commande, confirmation) dans `docs/captures/`. À vous d'écrire la consigne et de choisir les fichiers à joindre : que doit voir l'IA pour connaître les libellés des pages ?

✅ *Vous devez voir :* 4 images dans `docs/captures/`. Ouvrez-les.

### 8. Le poids des vidéos

Passez `video: 'on'`, relancez, puis regardez la taille de `test-results/` (`du -sh test-results`, ou clic droit → Propriétés). Remettez ensuite la valeur précédente.

### 9. Commiter

```bash
git add playwright.config.ts tests/e2e
```

```bash
git commit -m "tests: preuves en cas d'échec, captures de documentation"
```

## C'est réussi si…

- [ ] Vous retrouvez capture, vidéo et trace d'un échec
- [ ] Le diagnostic de l'IA est vérifié dans la trace
- [ ] Les captures de documentation sont générées
- [ ] Vous savez pourquoi on ne garde pas toutes les vidéos

## Si ça coince

| Symptôme | Piste |
|---|---|
| Pas de capture ni de vidéo dans le rapport | Les trois réglages sont-ils bien **dans** le bloc `use: { … }` ? Fichier enregistré ? |
| `image introuvable ou format non géré` | `test-results/` est **vidé à chaque lancement** de Playwright. Relancez le test en échec, puis `bin/ia` juste après. |
| Le nom du dossier contient des accents ou des espaces | Utilisez la touche `Tab` pour le compléter, ou mettez le chemin entre guillemets. |
| `show-report` ne rend pas la main | C'est normal, il sert le rapport. `Ctrl+C` pour l'arrêter. |
| Les captures de `docs/captures/` apparaissent dans `git status` | À vous de décider : les versionner, ou les ajouter à `.gitignore`. Elles changent à chaque lancement (pourquoi ?). |
