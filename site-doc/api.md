---
title: API
---

# L'API de MiniShop

L'API donne accès au catalogue, calcule des devis et enregistre des commandes. Elle échange du JSON,
et tous les montants sont des entiers en **centimes** : 12,90 € s'écrit `1290`.

| Route | Rôle | Jeton |
|---|---|---|
| `GET /api/products` | Liste du catalogue | Non |
| `GET /api/products/{sku}` | Un produit | Non |
| `POST /api/quote` | Calculer un devis (panier + coupon) | Non |
| `POST /api/orders` | Passer une commande | Oui |
| `GET /api/orders/{id}` | Relire une commande | Oui |

Le jeton se transmet dans l'en-tête `Authorization: Bearer <jeton>`.

```bash
curl -s -X POST http://localhost:8000/api/quote \
  -H "Content-Type: application/json" \
  -d '{"lines":[{"sku":"carnet-a5","qty":2}],"coupon":"BIENVENUE10"}'
```

```json
{"subtotal":2580,"discount":258,"shipping":490,"total":2812}
```

## Référence complète

La référence ci-dessous est construite à partir du contrat `openapi.yaml`, lui-même vérifié par les tests de contrat.

<p>
  <a class="md-button md-button--primary" href="reference-api/index.html" target="_blank">Ouvrir la référence en pleine page</a>
  <a class="md-button" href="reference-api/openapi.yaml">Télécharger le contrat OpenAPI</a>
</p>

<iframe class="ms-frame" src="reference-api/index.html" title="Référence de l'API MiniShop"></iframe>
