import { test, expect } from '@playwright/test';

// Test d'exemple : la fixture « request » remplace « page ». Pas de navigateur ici.
test('GET /api/products/carnet-a5 renvoie le Carnet A5', async ({ request }) => {
  const reponse = await request.get('/api/products/carnet-a5');

  // 1. Le code
  expect(reponse.status()).toBe(200);

  // 2. Les en-têtes
  expect(reponse.headers()['content-type']).toContain('application/json');

  // 3. Le corps : 12,90 € = 1290 centimes
  expect(await reponse.json()).toMatchObject({ sku: 'carnet-a5', name: 'Carnet A5', price: 1290 });
});
