<!--
Atelier 1 — fichiers à joindre avec --file : src/CouponValidator.php, src/Coupon.php,
src/InvalidCouponException.php et SPEC.md

php bin/ia --prompt-file ateliers/prompts/02-coupons.md --file src/CouponValidator.php --file src/Coupon.php --file src/InvalidCouponException.php --file SPEC.md --out tests/Unit/CouponValidatorTest.php
-->

Écris des tests PHPUnit 13 pour la méthode validate() de src/CouponValidator.php (fichier joint).

Règle métier (section « Livraison et coupons » de SPEC.md) :
- BIENVENUE10 : coupon valide, −10 % sur le sous-total ;
- LIVRAISON : coupon valide, livraison offerte ;
- les codes sont insensibles à la casse et aux espaces autour (" bienvenue10 " est valide) ;
- NOEL2025 : coupon expiré → exception avec le message « Ce code a expiré » ;
- code inconnu → exception avec le message « Code promo invalide ».

Cas à couvrir, regroupés dans des #[DataProvider] avec un nom par cas :
- codes valides : BIENVENUE10, LIVRAISON ;
- minuscules et casse mélangée ;
- espaces avant et après ;
- code expiré (y compris en minuscules) ;
- code inconnu ;
- chaîne vide et chaîne ne contenant que des espaces.

Contraintes :
- un DataProvider pour les codes acceptés, un autre pour les codes refusés
  (code saisi + message attendu) ;
- pour les codes acceptés, vérifie le coupon obtenu (code normalisé, réduction, livraison offerte) ;
- pour les codes refusés, vérifie la classe de l'exception ET son message exact ;
- assertSame, noms en français ;
- n'utilise que des méthodes et des propriétés présentes dans les fichiers joints ;
- teste la RÈGLE, pas le code. Si le code la contredit, écris quand même le test
  d'après la règle et signale l'écart dans un commentaire en tête du fichier.
