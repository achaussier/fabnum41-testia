<!--
Atelier 8 — à joindre : le manifeste avec --file, et chaque capture avec --image, dans l'ordre des étapes

php bin/ia --prompt-file ateliers/prompts/10-guide.md --file docs/build/commande.json --image docs/media/commande-1.png --image docs/media/commande-2.png --image docs/media/commande-3.png --image docs/media/commande-4.png --image docs/media/commande-5.png --out docs/guide/passer-une-commande.md

(une option --image par capture : adaptez la commande au nombre d'étapes de votre manifeste)
-->

Écris une page de guide utilisateur en Markdown pour la boutique en ligne MiniShop.

Tu disposes du manifeste (fichier JSON joint) : le titre du guide et la liste des étapes, chacune avec
son numéro, son titre et le chemin de sa capture. Les captures d'écran sont jointes dans l'ordre des étapes.

Ce que j'attends :
- un titre de page tiré du titre du manifeste, sans le préfixe « Guide : » ;
- une phrase d'introduction : à quoi sert ce guide ;
- une section par étape du manifeste, dans l'ordre, titrée « ## 1. Titre de l'étape » ;
- dans chaque section : deux ou trois phrases qui disent quoi faire et ce qui s'affiche ensuite,
  puis la capture de l'étape ;
- insère chaque capture avec son chemin exact, relatif au dossier docs/guide/ où sera rangée la page :
  « docs/media/commande-1.png » dans le manifeste s'écrit ![texte alternatif](../media/commande-1.png) ;
- un texte alternatif court qui décrit l'écran.

Règles :
- décris uniquement ce qui est VISIBLE sur la capture : libellés des boutons, messages, montants.
  Cite les libellés exactement comme ils sont écrits à l'écran, entre guillemets « » ;
- n'invente aucun bouton, aucune option, aucune étape. Si une capture ne montre pas ce que le titre annonce,
  dis-le dans tes remarques après le bloc de code, au lieu de combler le manque ;
- vouvoiement, phrases courtes, pas de jargon technique (pas de « cliquer sur le lien href », pas de noms de fichiers) ;
- ne cite ni date du jour ni numéro de commande précis : ils changent à chaque commande ;
- n'ajoute ni conclusion commerciale ni section qui ne correspond à aucune étape.
