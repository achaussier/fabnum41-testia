<!--
Atelier 8 — fichiers à joindre avec --file : un test E2E du jour 1, l'outil fourni et l'exemple fourni

php bin/ia --prompt-file ateliers/prompts/10a-test-doc.md --file tests/e2e/achat.spec.ts --file tests/doc/outils.ts --file tests/doc/catalogue.spec.ts --out tests/doc/commande.spec.ts
-->

Le fichier joint tests/e2e/achat.spec.ts est un test de bout en bout. Convertis-le en test de
documentation, dans tests/doc/commande.spec.ts, sur le modèle de tests/doc/catalogue.spec.ts (joint).

Un test de documentation est un test ordinaire dont chaque étape passe par la fonction
etape(page, titre, action) de tests/doc/outils.ts (jointe) : elle exécute l'action, prend une capture
de la page et note l'étape. Le titre de chaque étape deviendra un titre du guide utilisateur
et un sous-titre de la vidéo.

Ce que j'attends :
- un seul test, nommé « Guide : passer une commande » ;
- entre 4 et 7 étapes, qui couvrent tout le parcours du test d'origine, jusqu'à la confirmation ;
- une étape = UNE action utile pour l'utilisateur, visible à l'écran à la fin de l'étape
  (regroupe saisie et clic d'un même formulaire ; ne fais pas une étape par clic) ;
- des titres compréhensibles par un utilisateur, à l'infinitif, sans terme technique :
  « Ajouter le Carnet A5 au panier », pas « Cliquer sur le bouton submit » ;
- à la fin de chaque étape, une assertion expect qui attend que l'écran soit dans l'état à montrer
  (la capture est prise juste après).

Contraintes :
- import { test, expect } from '@playwright/test' et import { etape } from './outils' ;
- garde les sélecteurs du test d'origine (getByRole, getByLabel, getByTestId), n'en invente aucun ;
- jamais de waitForTimeout ;
- données fictives : tout ce qui est saisi sera filmé et publié (nom inventé, e-mail en example.test) ;
- garde une assertion sur le montant final : cela reste un vrai test.
