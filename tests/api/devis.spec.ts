import { test, expect } from '@playwright/test';

// Prix du catalogue (centimes) : carnet-a5 = 1290, stylo-plume = 2450, crayons = 450, lampe = 5000.
// Règles (SPEC.md) : livraison offerte à partir de 5000 après coupon, sinon 490 ;
// BIENVENUE10 = −10 % arrondi au centime inférieur ; LIVRAISON = livraison offerte.

const devis = [
  {
    nom: '1 carnet, sans coupon',
    corps: { lines: [{ sku: 'carnet-a5', qty: 1 }] },
    attendu: {
      subtotal: 1290, // 1 × 12,90 €
      discount: 0,    // pas de coupon
      shipping: 490,  // sous 50 € : livraison payante
      total: 1780,    // 1290 + 490
    },
  },
  {
    nom: '2 carnets avec BIENVENUE10',
    corps: { lines: [{ sku: 'carnet-a5', qty: 2 }], coupon: 'BIENVENUE10' },
    attendu: {
      subtotal: 2580, // 2 × 12,90 €
      discount: 258,  // −10 %
      shipping: 490,  // 2322 après coupon, sous 50 € : livraison payante
      total: 2812,    // 2580 − 258 + 490
    },
  },
  {
    nom: 'le code promo accepte minuscules et espaces',
    corps: { lines: [{ sku: 'carnet-a5', qty: 2 }], coupon: ' bienvenue10 ' },
    attendu: { subtotal: 2580, discount: 258, shipping: 490, total: 2812 }, // même calcul que ci-dessus
  },
  {
    nom: '1 carnet avec LIVRAISON',
    corps: { lines: [{ sku: 'carnet-a5', qty: 1 }], coupon: 'LIVRAISON' },
    attendu: {
      subtotal: 1290, // 1 × 12,90 €
      discount: 0,    // LIVRAISON ne réduit pas le prix
      shipping: 0,    // livraison offerte par le coupon
      total: 1290,
    },
  },
  {
    nom: '3 stylos plume : au-dessus de 50 €, livraison offerte',
    corps: { lines: [{ sku: 'stylo-plume', qty: 3 }] },
    attendu: {
      subtotal: 7350, // 3 × 24,50 €
      discount: 0,
      shipping: 0,    // 73,50 € ≥ 50 €
      total: 7350,
    },
  },
  {
    nom: '50 € pile : livraison offerte',
    corps: { lines: [{ sku: 'lampe', qty: 1 }] },
    attendu: {
      subtotal: 5000, // 1 × 50,00 €
      discount: 0,
      shipping: 0,    // « à partir de 50,00 € » : 50,00 € compris
      total: 5000,
    },
  },
  {
    nom: 'le seuil de livraison s’applique après le coupon',
    corps: { lines: [{ sku: 'lampe', qty: 1 }, { sku: 'crayons', qty: 1 }], coupon: 'BIENVENUE10' },
    attendu: {
      subtotal: 5450, // 50,00 € + 4,50 €
      discount: 545,  // −10 %
      shipping: 490,  // 49,05 € après coupon, sous 50 € : livraison payante
      total: 5395,    // 5450 − 545 + 490
    },
  },
  {
    nom: 'la réduction est arrondie au centime inférieur',
    corps: { lines: [{ sku: 'stylo-plume', qty: 1 }, { sku: 'crayons', qty: 1 }, { sku: 'carnet-a5', qty: 1 }], coupon: 'BIENVENUE10' },
    attendu: {
      subtotal: 4190, // 24,50 € + 4,50 € + 12,90 €
      discount: 419,  // 10 % de 4190 = 419
      shipping: 490,  // 37,71 € après coupon
      total: 4261,    // 4190 − 419 + 490
    },
  },
];

for (const cas of devis) {
  test(`devis : ${cas.nom}`, async ({ request }) => {
    const reponse = await request.post('/api/quote', { data: cas.corps });

    expect(reponse.status()).toBe(200);
    expect(reponse.headers()['content-type']).toContain('application/json');
    expect(await reponse.json()).toEqual(cas.attendu);
  });
}
