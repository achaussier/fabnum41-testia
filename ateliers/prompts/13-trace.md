<!--
Bonus A — fichiers à joindre avec --file : SPEC.md, la liste des tests Playwright et celle des tests PHPUnit

npx playwright test --list --reporter=list > rapports/liste-tests.txt
vendor/bin/phpunit --testdox-html rapports/unit.html

php bin/ia --prompt-file ateliers/prompts/13-trace.md --file SPEC.md --file rapports/liste-tests.txt --file rapports/unit.html --out docs/tracabilite.md

La matrice porte sur les règles de la boutique. Pour la section « API » de SPEC.md, relancez vers un autre fichier
en ajoutant une consigne (bin/ia limite la longueur des réponses : tout traiter d'un coup est trop long) :

php bin/ia "Cette fois, traite uniquement la section « API » de SPEC.md, une ligne par route et par code de réponse." --prompt-file ateliers/prompts/13-trace.md --file SPEC.md --file rapports/liste-tests.txt --out docs/tracabilite-api.md
(--reporter=list est important : sans lui, une fois le rapport JUnit configuré, la commande --list
 remplace rapports/e2e.xml par une liste de tests « ignorés ».)
-->

À partir de SPEC.md et des deux listes de tests jointes (Playwright et PHPUnit), établis la matrice
de traçabilité du projet MiniShop : quelles règles de la spec sont vérifiées par quels tests ?

Format : un document Markdown.

# Matrice de traçabilité — MiniShop

Un tableau à trois colonnes : « Règle de SPEC.md », « Tests », « Couverte ? ».
- Une ligne par puce des sections « Livraison et coupons », « Panier » et « Commande » de SPEC.md,
  dans l'ordre de la spec, résumée en quelques mots. Ne découpe pas une puce en plusieurs lignes.
  Laisse de côté la section « API » (elle fera l'objet d'une autre matrice).
- Colonne « Tests » : les tests qui vérifient cette règle, avec leur nom exact recopié des listes,
  précédé de leur famille (unit, api, e2e, doc). « — » s'il n'y en a aucun.
  Trois tests au maximum par règle, les plus directs ; s'il y en a d'autres, ajoute « + N autres ».
- Colonne « Couverte ? » : « Oui », « Partiel » ou « Non ».
  « Partiel » = un test touche la règle sans la vérifier entièrement (par exemple un seul côté d'une limite).

Puis une section « ## Règles non couvertes » : la liste des règles « Non » et « Partiel », avec pour
chacune le test qu'il faudrait écrire, en une ligne.

Règles :
- va droit au but : commence directement par le document, sans analyse préalable ; reste compact
  (la réponse est limitée en longueur : un tableau trop détaillé serait coupé) ;
- ne te fie qu'aux noms des tests : tu ne vois pas leur code. Dans le doute, écris « Partiel » et dis pourquoi ;
- n'invente aucun test : chaque nom cité doit figurer mot pour mot dans les listes jointes ;
- un test en échec compte comme un test existant : la matrice dit ce qui est vérifié, pas ce qui fonctionne ;
- n'invente aucune règle absente de SPEC.md.
