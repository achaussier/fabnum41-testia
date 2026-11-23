<!--
Atelier 7 — fichiers à joindre avec --file : les rapports JUnit des deux suites, et SPEC.md

php bin/ia --prompt-file ateliers/prompts/09-synthese.md --file rapports/unit.xml --file rapports/e2e.xml --file SPEC.md --out rapports/synthese.md

(les fichiers JUnit sont produits par : vendor/bin/phpunit --log-junit rapports/unit.xml
 et par le reporter junit de Playwright, voir playwright.config.ts)
-->

À partir des rapports de tests joints (format JUnit XML) et de SPEC.md, rédige une synthèse de recette
en Markdown pour un chef de projet qui n'est pas technicien. Il doit pouvoir décider s'il livre.

Plan imposé :

# Synthèse de recette — MiniShop — (date du jour si elle figure dans les rapports)

## Verdict : …
Un seul verdict, choisi parmi ces trois formules exactes :
« livrable », « livrable avec réserves », « livraison déconseillée ».
Une phrase pour le justifier. Puis les chiffres : nombre de tests exécutés, réussis, échoués, ignorés.

## Ce qui ne fonctionne pas
Une entrée numérotée par problème. Pour chacune :
- le problème en termes métier : la règle de SPEC.md qui n'est pas respectée, et ce que l'utilisateur ou le client subit ;
- le nom exact du test en échec, recopié tel quel du rapport, entre guillemets « » ;
- ce que le test attendait et ce qu'il a obtenu, si le message du rapport le dit.

## Ce qui fonctionne
Les grandes fonctions couvertes par des tests réussis, en une ou deux lignes.

Règles :
- chiffres exacts : compte les tests dans les fichiers joints, additionne les suites, n'arrondis pas ;
- n'invente aucune cause : si le rapport ne dit pas pourquoi un test échoue, écris « cause à analyser » ;
- ne minimise pas : un seul test en échec sur une règle de SPEC.md suffit à écarter le verdict « livrable » ;
- plusieurs tests en échec pour la même règle = un seul problème, qui cite tous ces tests ;
- pas de jargon (pas de « assertion », « endpoint », « stack trace ») ; les montants en euros ;
- une demi-page maximum.
