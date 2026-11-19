<!--
Atelier 4 — à joindre avec --image, dans cet ordre : attendu, obtenu, différence
(les trois fichiers sont dans test-results/ après un test visuel en échec)

php bin/ia --prompt-file ateliers/prompts/06-diff-visuel.md --image test-results/<dossier-du-test>/catalogue-expected.png --image test-results/<dossier-du-test>/catalogue-actual.png --image test-results/<dossier-du-test>/catalogue-diff.png

(on peut ajouter le résultat de « git diff public/style.css » dans un fichier joint avec --file)
-->

Un test de régression visuelle Playwright a échoué. Les trois images jointes sont :
- « -expected » : la référence, validée auparavant ;
- « -actual » : la capture obtenue aujourd'hui ;
- « -diff » : l'image de différence, où les pixels qui ont changé sont colorés.

1. Décris les différences zone par zone (en-tête, contenu, boutons, pied de page…) :
   ce qui a changé de couleur, de taille, de position ou de texte.
   Ne décris que ce que tu vois réellement dans les images.
2. Dis si cela ressemble plutôt à une régression (changement accidentel) ou à un
   changement voulu, et explique les indices qui te font pencher d'un côté.
3. Indique ce qu'il faudrait vérifier pour en être sûr (git diff, demande d'origine…).

Termine en rappelant que la décision de mettre à jour la référence
(--update-snapshots) ou de corriger le code appartient à l'humain : tu donnes
un avis, pas une décision.
