import { test, expect } from '@playwright/test';

const A5 = 'carnet-a5';

// Un cas = une ligne. Les codes viennent de SPEC.md, section « API ».
const casInvalides = [
  { nom: 'sku inconnu', corps: { lines: [{ sku: 'xyz', qty: 1 }] }, code: 404 },
  { nom: 'coupon expiré', corps: { lines: [{ sku: A5, qty: 1 }], coupon: 'NOEL2025' }, code: 410 },
  { nom: 'coupon inconnu', corps: { lines: [{ sku: A5, qty: 1 }], coupon: 'SOLDES50' }, code: 422 },
  { nom: 'quantité nulle', corps: { lines: [{ sku: A5, qty: 0 }] }, code: 422 },
  { nom: 'quantité négative', corps: { lines: [{ sku: A5, qty: -1 }] }, code: 422 },
  { nom: 'quantité > 10', corps: { lines: [{ sku: A5, qty: 11 }] }, code: 422 },
  { nom: 'quantité en texte', corps: { lines: [{ sku: A5, qty: 'deux' }] }, code: 422 },
  { nom: 'panier vide', corps: { lines: [] }, code: 422 },
  { nom: 'champ lines absent', corps: {}, code: 422 },
];

for (const cas of casInvalides) {
  test(`devis refusé : ${cas.nom}`, async ({ request }) => {
    const reponse = await request.post('/api/quote', { data: cas.corps });

    expect(reponse.status()).toBe(cas.code);

    // Une erreur a toujours la même forme, sans détail technique.
    const erreur = await reponse.json();
    expect(erreur).toEqual({ error: expect.any(String), code: expect.any(String) });
    expect(erreur.error).not.toMatch(/\.php|Stack trace|Exception/);
  });
}
