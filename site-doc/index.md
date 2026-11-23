---
title: Accueil
hide:
  - navigation
  - toc
---

<div class="ms-hero" markdown>

# MiniShop, documenté par ses tests

Le guide utilisateur, les vidéos, la référence de l'API et les rapports de ce site ne sont pas écrits à la main :
ils sont produits par les tests automatisés, puis publiés à chaque modification du projet.

[Lire le guide](guide/passer-une-commande.md){ .md-button .md-button--primary }
[Découvrir l'API](api.md){ .md-button }

</div>

## Ce que vous trouverez ici

<div class="ms-cards">
  <a class="ms-card" href="guide/passer-une-commande.html">
    <strong>Guide utilisateur</strong>
    <span>Passer une commande, étape par étape, avec captures d'écran et vidéo sous-titrée.</span>
  </a>
  <a class="ms-card" href="api.html">
    <strong>API</strong>
    <span>Catalogue, devis et commandes : la référence complète, construite depuis le contrat OpenAPI.</span>
  </a>
  <a class="ms-card" href="synthese.html">
    <strong>Synthèse de recette</strong>
    <span>Peut-on livrer ? Le verdict, les problèmes connus et ce qui fonctionne, en une demi-page.</span>
  </a>
  <a class="ms-card" href="rapports.html">
    <strong>Rapports de tests</strong>
    <span>Le détail pour les équipes : rapport Playwright, rapport Allure, tests unitaires.</span>
  </a>
</div>

## Comment ce site est fabriqué

<ol class="ms-steps">
  <li><strong>Tests E2E</strong><br>Des parcours dont chaque étape est nommée pour un utilisateur.</li>
  <li><strong>Matière brute</strong><br>Une capture par étape, une vidéo, la liste des étapes.</li>
  <li><strong>Rédaction</strong><br>L'IA rédige le guide à partir des captures.</li>
  <li><strong>Relecture</strong><br>Un humain vérifie chaque phrase contre sa capture.</li>
  <li><strong>Publication</strong><br>Le site est reconstruit et mis en ligne automatiquement.</li>
</ol>

Si l'application change, soit un test échoue et on le voit, soit le site se régénère avec les nouvelles captures.
Une documentation produite par les tests ne peut pas être fausse longtemps.

!!! note "Une boutique de démonstration"

    MiniShop est le projet fil rouge de la formation « Tester avec l'IA ». Aucune commande n'est réellement expédiée,
    et toutes les données affichées dans les captures et les vidéos sont fictives.
