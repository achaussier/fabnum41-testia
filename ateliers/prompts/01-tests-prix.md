<!--
Atelier 1 — fichiers à joindre avec --file : src/PriceCalculator.php et SPEC.md

php bin/ia --prompt-file ateliers/prompts/01-tests-prix.md --file src/PriceCalculator.php --file SPEC.md --out tests/Unit/PriceCalculatorTest.php

(pour aller plus loin : joindre aussi src/Coupon.php, l'IA verra alors la vraie classe)
-->

Écris des tests PHPUnit 13 pour les méthodes shipping() et applyCoupon()
de src/PriceCalculator.php (fichier joint).

Règle métier (section « Livraison et coupons » de SPEC.md) :
- livraison offerte à partir de 50,00 € (5000 centimes) de sous-total (après coupon) ;
- sinon, livraison à 4,90 € (490 centimes) ;
- BIENVENUE10 : −10 % sur le sous-total, arrondi au centime inférieur
  (la réduction est arrondie : 1295 donne 129 de réduction, soit 1166) ;
- LIVRAISON : livraison offerte quel que soit le montant (le sous-total ne change pas) ;
- sans coupon, le sous-total ne change pas.

Cas à couvrir :
- shipping() : 0, 4999, 5000, 5001 et un gros panier ;
- applyCoupon() : sans coupon (null), BIENVENUE10 sur un montant rond,
  BIENVENUE10 sur un montant qui oblige à arrondir, LIVRAISON.

Un coupon se construit ainsi (classe MiniShop\Coupon, non jointe) :
- new Coupon('BIENVENUE10', percentOff: 10)
- new Coupon('LIVRAISON', freeShipping: true)

Utilise un #[DataProvider] avec un nom par cas (clés du tableau en français).

Contraintes :
- assertSame, montants en centimes, noms en français ;
- n'utilise que des méthodes et des constructeurs présents dans les fichiers joints ;
- teste la RÈGLE, pas le code. Si le code la contredit, écris quand même le test
  d'après la règle et signale l'écart dans un commentaire en tête du fichier.
