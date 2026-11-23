# Bonus du jour 2 — pour les plus rapides

## A — Matrice de traçabilité

Quelles règles de `SPEC.md` ne sont couvertes par aucun test ? Les commandes sont en tête de `ateliers/prompts/13-trace.md`.
Contrôlez trois lignes au hasard : les tests cités existent-ils ? Vérifient-ils vraiment la règle ? Puis écrivez un des tests manquants.

## B — Doc API enrichie

Commitez, puis lancez le prompt 12 (commande en tête de `ateliers/prompts/12-enrichir-openapi.md`).
Contrôlez ensuite, dans cet ordre : `git diff public/openapi.yaml` (un schéma a-t-il changé ?), le lint, les tests de contrat.

## C — Sous-titres reformulés

Les deux commandes sont en tête de `ateliers/prompts/11-sous-titres.md`. Comparez le `.vtt` avant et après :
qu'est-ce qui a changé ? Qu'est-ce qui ne doit **pas** changer ?

## D — Publication en CI

Faites générer un workflow `.github/workflows/doc.yml` qui lance tous les tests, produit les rapports et la documentation,
et les conserve en artefacts. Relisez : que se passe-t-il si un test échoue ? La doc est-elle quand même publiée ? Est-ce souhaitable ?

## E — Notes de version

```bash
git log --oneline > rapports/historique.txt
```

Joignez cet historique et votre synthèse de recette, et demandez des notes de version pour les **utilisateurs** de la boutique.
Tout ce qui est annoncé est-il vrai ? Les problèmes connus y figurent-ils ?

## F — Schemathesis (avec Docker)

La commande est dans le guide de l'atelier 6. Triez ce qu'il trouve : vrai problème, écart de contrat, ou faux positif ?
