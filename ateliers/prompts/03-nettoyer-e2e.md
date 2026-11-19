<!--
Atelier 2 — fichiers à joindre avec --file : le brouillon enregistré par codegen,
plus SPEC.md (les règles) et src/Catalog.php (les prix) pour que l'IA puisse calculer les montants attendus.
Sans eux, elle ne peut pas deviner les montants : elle laissera des « À VÉRIFIER ».

php bin/ia --prompt-file ateliers/prompts/03-nettoyer-e2e.md \
    --file tests/e2e/brouillon.spec.ts --file SPEC.md --file src/Catalog.php \
    --out tests/e2e/achat.spec.ts
-->

Le fichier joint tests/e2e/brouillon.spec.ts est un enregistrement brut produit par
`npx playwright codegen`. Transforme-le en un test Playwright lisible.

Ce que j'attends :
- un nom de test explicite, en français, qui décrit le parcours ;
- des adresses relatives : la configuration définit baseURL, donc page.goto('/')
  et pas d'adresse en dur ;
- garde les sélecteurs enregistrés quand ce sont des getByRole / getByLabel / getByTestId ;
  remplace les sélecteurs CSS ou XPath par des sélecteurs accessibles ;
- supprime les clics et actions inutiles enregistrés par erreur ;
- un commentaire court par étape du parcours ;
- ajoute des assertions :
  - le total des articles du panier (data-testid="cart-total" : après réduction, hors livraison) ;
  - la ligne de réduction quand un code promo est appliqué (data-testid="cart-discount") ;
  - la confirmation : le texte « Commande confirmée » et un numéro de commande
    visible (data-testid="order-number").

Contraintes :
- jamais de waitForTimeout : utilise les assertions expect, qui attendent toutes seules ;
- un await devant chaque action et chaque assertion ;
- calcule les montants attendus à partir de SPEC.md et des prix des fichiers joints ;
  si un montant ne peut pas être déduit, mets un commentaire « À VÉRIFIER » sur la ligne
  au lieu d'inventer une valeur ;
- n'invente aucun sélecteur ni aucun libellé absent du brouillon.
