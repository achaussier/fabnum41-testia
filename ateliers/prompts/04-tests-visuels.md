<!--
Atelier 4 — fichiers à joindre avec --file : les pages de public/ et l'en-tête commun

php bin/ia --prompt-file ateliers/prompts/04-tests-visuels.md \
    --file public/index.php --file public/cart.php --file public/checkout.php \
    --file public/confirmation.php --file templates/header.php \
    --out tests/e2e/visuel.spec.ts
-->

Écris des tests de régression visuelle Playwright pour l'application MiniShop,
dans tests/e2e/visuel.spec.ts. Les pages PHP sont jointes : lis-les pour connaître
les libellés, les champs et les data-testid.

Un test par page, avec un seul toHaveScreenshot par test :
1. catalogue (/) → 'catalogue.png' ;
2. panier (/cart.php) avec un « Carnet A5 » dedans → 'panier.png' ;
3. commande (/checkout.php) avec le même panier → 'commande.png' ;
4. confirmation, après avoir commandé avec le nom « Ada Lovelace »
   et l'e-mail « ada@example.com » → 'confirmation.png'.

Options de chaque toHaveScreenshot :
- fullPage: true ;
- maxDiffPixelRatio: 0.01 ;
- mask : les zones qui changent d'un lancement à l'autre, c'est-à-dire
  data-testid="date-du-jour" (sur toutes les pages) et data-testid="order-number"
  (page de confirmation).

Contraintes :
- chaque test prépare lui-même son panier (aucune dépendance entre les tests) ;
- sélecteurs getByRole / getByLabel / getByTestId uniquement ;
- avant chaque capture, attends avec expect qu'un élément caractéristique de la page soit visible ;
- jamais de waitForTimeout ;
- noms des tests en français, sous la forme « catalogue : rendu visuel » ;
- si tu repères dans le HTML une autre zone dynamique, ne la masque pas d'office :
  signale-la dans tes remarques après le bloc de code.
