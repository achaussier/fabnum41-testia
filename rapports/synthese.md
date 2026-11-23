# Synthèse de recette — MiniShop — 23/11/2026

## Verdict : livraison déconseillée

Trois règles de la spécification ne sont pas respectées, dont deux touchent le prix facturé au client.

**96 tests** exécutés : 91 réussis, 5 échoués, aucun ignoré
(38 tests unitaires dont 1 échec ; 58 tests d'API, de parcours et de documentation dont 4 échecs).

## Ce qui ne fonctionne pas

1. **La livraison est facturée pour une commande de 50,00 € pile.**
   La règle dit « livraison offerte à partir de 50,00 € ». À 50,00 € exactement, le client paie 4,90 € de livraison.
   Tests : « fraisDeLivraison with data set "pile 50 euros" » (attendu 0, obtenu 490) et
   « devis : 50 € pile : livraison offerte » (attendu 50,00 € à payer, obtenu 54,90 €).

2. **L'API de devis accepte une quantité de 0.**
   La règle dit « quantité entre 1 et 10 par produit ». Une demande avec 0 article est acceptée au lieu d'être refusée,
   et un devis de 4,90 € (la livraison seule) est renvoyé.
   Test : « devis refusé : quantité nulle » (refus attendu, demande acceptée).

3. **Une commande passée par l'API ne contient pas la date de création annoncée.**
   La documentation de l'API promet un champ `createdAt` dans chaque commande ; il est absent des réponses.
   Les applications qui utilisent l'API d'après sa documentation ne trouveront pas cette date.
   Tests : « POST /api/orders — 201 respecte le contrat » et « GET /api/orders/{id} — 200 respecte le contrat »
   (message : « /createdAt : champ obligatoire absent »). Cause à analyser : le rapport ne dit pas qui, de l'API ou de sa documentation, doit être corrigé.

## Ce qui fonctionne

Catalogue, panier, codes promo (réduction de 10 %, livraison offerte, code expiré ou inconnu), parcours d'achat complet
dans le navigateur, contrôle du nom et de l'e-mail, accès sécurisé aux commandes de l'API, génération du guide du catalogue.

---

*Exemple de résultat attendu pour l'atelier 7. Chaque chiffre et chaque nom de test a été contrôlé dans
`rapports/unit.xml` et `rapports/e2e.xml`.*
