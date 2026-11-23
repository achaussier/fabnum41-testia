<!--
Atelier 8 (bonus C) — fichier à joindre avec --file : le manifeste

php bin/ia --prompt-file ateliers/prompts/11-sous-titres.md --file docs/build/commande.json --out docs/build/commande-sous-titres.txt

Puis, pour fabriquer le .vtt avec ces textes (les horaires viennent toujours du manifeste) :

php bin/sous-titres docs/build/commande.json --depuis docs/build/commande-sous-titres.txt
-->

Le manifeste joint décrit les étapes d'une vidéo de démonstration de la boutique MiniShop.
Reformule le titre de chaque étape en un sous-titre naturel, comme le dirait une voix qui commente la vidéo.

Format de la réponse, à respecter strictement :
- exactement une ligne par étape, dans l'ordre du manifeste : autant de lignes que d'étapes ;
- uniquement le texte du sous-titre : pas de numéro, pas d'horaire, pas de tiret, pas de guillemets, pas de ligne vide.

Règles :
- 60 caractères maximum par ligne ;
- une phrase simple à la deuxième personne du pluriel ou à l'impersonnel : « Ajoutez le carnet à votre panier » ;
- garde le sens de l'étape : n'ajoute aucune action, aucun détail absent du titre ;
- garde tels quels les noms de produits et les codes (Carnet A5, BIENVENUE10).
