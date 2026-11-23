<!--
Bonus A — fichiers à joindre avec --file : SPEC.md, la liste des tests Playwright et celle des tests PHPUnit

npx playwright test --list > rapports/liste-tests.txt
vendor/bin/phpunit --testdox-html rapports/unit.html

php bin/ia --prompt-file ateliers/prompts/13-trace.md --file SPEC.md --file rapports/liste-tests.txt --file rapports/unit.html --out docs/tracabilite.md
-->

À partir de SPEC.md et des deux listes de tests jointes (Playwright et PHPUnit), établis la matrice
de traçabilité du projet MiniShop : quelles règles de la spec sont vérifiées par quels tests ?

Format : un document Markdown.

# Matrice de traçabilité — MiniShop

Un tableau à trois colonnes : « Règle de SPEC.md », « Tests », « Couverte ? ».
- Une ligne par règle de SPEC.md : découpe chaque puce de la spec en règles vérifiables une à une
  (sections « Livraison et coupons », « Panier », « Commande », « API »), dans l'ordre de la spec.
- Colonne « Tests » : les tests qui vérifient cette règle, avec leur nom exact recopié des listes,
  précédé de leur famille (unit, api, e2e, doc). « — » s'il n'y en a aucun.
- Colonne « Couverte ? » : « Oui », « Partiel » ou « Non ».
  « Partiel » = un test touche la règle sans la vérifier entièrement (par exemple un seul côté d'une limite).

Puis une section « ## Règles non couvertes » : la liste des règles « Non » et « Partiel », avec pour
chacune le test qu'il faudrait écrire, en une ligne.

Règles :
- ne te fie qu'aux noms des tests : tu ne vois pas leur code. Dans le doute, écris « Partiel » et dis pourquoi ;
- n'invente aucun test : chaque nom cité doit figurer mot pour mot dans les listes jointes ;
- un test en échec compte comme un test existant : la matrice dit ce qui est vérifié, pas ce qui fonctionne ;
- n'invente aucune règle absente de SPEC.md.
