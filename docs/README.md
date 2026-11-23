# Documentation de MiniShop

Cette documentation est **produite à partir des tests**. Presque rien n'est écrit à la main :
si l'application change, on relance les tests et la documentation se régénère.

## Sommaire

| Document | Où | Comment il est produit |
|---|---|---|
| Guide utilisateur | [guide/](guide/) | tests de `tests/doc/` → captures et manifeste → rédaction par l'IA (prompt 10) |
| Documentation de l'API | [api/index.html](api/index.html) | `public/openapi.yaml` → Redocly |
| Matrice de traçabilité | [tracabilite.md](tracabilite.md) | `SPEC.md` + liste des tests → IA (prompt 13) |
| Décisions | [decisions.md](decisions.md) | écrit à la main (atelier 6) |

> Le guide, la documentation de l'API et la matrice **n'existent pas encore** : ils sont à générer pendant
> les ateliers 6 et 8. Les liens ci-dessus fonctionneront ensuite.

## Générer la documentation

```bash
npx playwright test --project=doc
```

Chaque test de `tests/doc/` produit :

- `docs/media/<nom>-<n>.png` : une capture par étape ;
- `docs/media/<nom>.webm` : la vidéo du parcours ;
- `docs/build/<nom>.json` : le manifeste (titres, captures, instants).

`docs/media/` et `docs/build/` ne sont pas versionnés : ils se régénèrent à chaque lancement.
`docs/guide/` et `docs/api/` se versionnent.

Sous-titres de la vidéo (aucune IA) :

```bash
php bin/sous-titres docs/build/catalogue.json
```

Documentation de l'API :

```bash
npx @redocly/cli build-docs public/openapi.yaml --output docs/api/index.html
```

## Intégrer une vidéo sous-titrée dans une page du guide

Une balise `<video>` se place directement dans le Markdown. Exemple à copier dans une page de
`docs/guide/` (les chemins partent de ce dossier), après avoir converti la vidéo en `.mp4` et
généré le fichier `.vtt` :

<!--
<video controls width="960" src="../media/commande.mp4">
  <track kind="captions" srclang="fr" label="Français" default src="../media/commande.vtt">
</video>
-->

Tout ce qui est filmé peut être publié : n'utilisez que des données fictives dans les tests de documentation.
