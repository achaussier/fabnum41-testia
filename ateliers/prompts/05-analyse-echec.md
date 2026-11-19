<!--
Atelier 3 — à joindre : le message d'erreur et le test avec --file, la capture avec --image.
Après un échec, Playwright range tout dans test-results/<dossier-du-test>/ :
error-context.md (le message d'erreur) et test-failed-1.png (la capture).

php bin/ia --prompt-file ateliers/prompts/05-analyse-echec.md --file test-results/<dossier-du-test>/error-context.md --file tests/e2e/achat.spec.ts --file SPEC.md --image test-results/<dossier-du-test>/test-failed-1.png

(variante : coller dans un fichier erreur.txt le message du terminal, ou le contenu du bouton
« Copy prompt » du rapport HTML, et le joindre avec --file erreur.txt)
-->

Ce test Playwright échoue. Voici le message d'erreur, le test et la capture au moment de
l'échec.

1. Explique ce qui s'est passé, simplement.
2. Est-ce un bug de l'application ou une erreur dans le test ? Justifie avec ce que
   tu vois dans la capture.
3. Propose une correction, sans waitForTimeout et sans affaiblir l'assertion.

Si les éléments fournis ne suffisent pas pour trancher, dis-le et indique ce qu'il
faudrait vérifier dans la trace.
