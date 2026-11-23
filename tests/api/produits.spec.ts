import { test, expect } from '@playwright/test';

test('GET /api/products renvoie le catalogue', async ({ request }) => {
  const reponse = await request.get('/api/products');

  // 1. Le code
  expect(reponse.status()).toBe(200);

  // 2. Les en-têtes
  expect(reponse.headers()['content-type']).toContain('application/json');

  // 3. Le corps : 6 produits, chacun avec ses 4 champs
  const produits = await reponse.json();
  expect(produits).toHaveLength(6);
  for (const produit of produits) {
    expect(produit).toEqual({
      sku: expect.any(String),
      name: expect.any(String),
      price: expect.any(Number),
      stock: expect.any(Number),
    });
  }
});

test('GET /api/products/{sku} renvoie le Carnet A5 à 12,90 €', async ({ request }) => {
  const reponse = await request.get('/api/products/carnet-a5');

  expect(reponse.status()).toBe(200);
  expect(await reponse.json()).toMatchObject({ sku: 'carnet-a5', name: 'Carnet A5', price: 1290 });
});

test('GET /api/products/{sku} ignore la casse de la référence', async ({ request }) => {
  const reponse = await request.get('/api/products/CARNET-A5');

  expect(reponse.status()).toBe(200);
  expect(await reponse.json()).toMatchObject({ sku: 'carnet-a5' });
});

test('GET /api/products/{sku} répond 404 pour un produit inconnu', async ({ request }) => {
  const reponse = await request.get('/api/products/licorne');

  expect(reponse.status()).toBe(404);
  expect(await reponse.json()).toEqual({ error: expect.any(String), code: expect.any(String) });
});
