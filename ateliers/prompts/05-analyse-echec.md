<!--
Atelier 3 — à joindre : le message d'erreur et le test avec --file, la capture avec --image

php bin/ia --prompt-file ateliers/prompts/05-analyse-echec.md \
    --file erreur.txt --file tests/e2e/achat.spec.ts \
    --image test-results/<dossier-du-test>/test-failed-1.png

(erreur.txt : collez-y le message d'erreur du terminal, ou le contenu du bouton
« Copy prompt » du rapport HTML. On peut aussi joindre SPEC.md.)
-->

Ce test Playwright échoue. Voici le message d'erreur, le test et la capture au moment de
l'échec.

1. Explique ce qui s'est passé, simplement.
2. Est-ce un bug de l'application ou une erreur dans le test ? Justifie avec ce que
   tu vois dans la capture.
3. Propose une correction, sans waitForTimeout et sans affaiblir l'assertion.

Si les éléments fournis ne suffisent pas pour trancher, dis-le et indique ce qu'il
faudrait vérifier dans la trace.
