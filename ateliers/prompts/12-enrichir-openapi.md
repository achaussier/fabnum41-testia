<!--
Bonus B — fichiers à joindre avec --file : le contrat et les tests d'API dont on tire les exemples

php bin/ia --prompt-file ateliers/prompts/12-enrichir-openapi.md --file public/openapi.yaml --file tests/api/devis.spec.ts --out public/openapi.yaml --force

Commitez AVANT : --force remplace le contrat. Ensuite, contrôlez le résultat :
git diff public/openapi.yaml
npx @redocly/cli lint public/openapi.yaml
npx playwright test --project=api
-->

Le fichier joint public/openapi.yaml décrit l'API MiniShop. Certaines descriptions sont minimales
ou absentes. Complète-le pour qu'un développeur qui découvre l'API la comprenne sans lire le code.

Ce que tu peux ajouter :
- des champs description manquants, en français, courts et précis (opérations, paramètres, propriétés, réponses) ;
- des exemples (example / examples) de requêtes et de réponses, tirés des tests joints :
  reprends uniquement des requêtes et des réponses qui figurent dans ces tests, donc vérifiées ;
- pour les erreurs : un exemple par cas testé, avec le message et le code attendus s'ils sont dans les tests.

Ce que tu ne dois PAS modifier — aucune exception :
- aucun schéma : ni nom de propriété, ni type, ni format, ni liste required, ni minimum / maximum, ni enum ;
- aucun code de réponse : n'en ajoute pas, n'en retire pas ;
- aucune route, aucune méthode, aucun paramètre, aucun réglage de sécurité ;
- la version d'OpenAPI et l'ordre général du fichier.

Règles :
- le résultat doit rester un fichier OpenAPI 3.1 valide, complet, en YAML ;
- en YAML, mets entre guillemets tout texte qui contient « : » ou qui commence par un caractère spécial ;
- va droit au but et reste concis : complète les descriptions manquantes en une ligne, et ajoute au plus
  un exemple par requête et par réponse (la réponse est limitée en longueur : un fichier trop long serait coupé) ;
- montants en centimes (entiers), données fictives (e-mails en example.test) ;
- si un test joint contredit le contrat (champ absent, code différent), ne corrige rien :
  signale-le dans tes remarques après le bloc de code.
