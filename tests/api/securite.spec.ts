import { test, expect } from '@playwright/test';

// Le projet « api » ajoute le bon jeton à chaque requête : ici, on le remplace exprès.
const sansJeton = { Authorization: '' };
const fauxJeton = { Authorization: 'Bearer faux-jeton' };

test('commande refusée sans jeton', async ({ request }) => {
  // Corps vide exprès : le 401 doit arriver avant la validation (sinon ce serait 422).
  const reponse = await request.post('/api/orders', { headers: sansJeton, data: {} });

  expect(reponse.status()).toBe(401);
  expect(await reponse.json()).toEqual({ error: expect.any(String), code: expect.any(String) });
});

test('commande refusée avec un faux jeton', async ({ request }) => {
  const reponse = await request.post('/api/orders', { headers: fauxJeton, data: {} });

  expect(reponse.status()).toBe(401);
});

test('lecture d’une commande refusée sans jeton', async ({ request }) => {
  // On crée une vraie commande, pour être sûr que le refus ne vient pas d'un identifiant inconnu.
  const creation = await request.post('/api/orders', {
    data: { customer: { name: 'Alice Martin', email: 'alice@example.test' }, lines: [{ sku: 'carnet-a5', qty: 1 }] },
  });
  const { id } = await creation.json();

  const reponse = await request.get(`/api/orders/${id}`, { headers: sansJeton });

  expect(reponse.status()).toBe(401);
});

test('lecture d’une commande refusée avec un faux jeton', async ({ request }) => {
  const reponse = await request.get('/api/orders/peu-importe', { headers: fauxJeton });

  expect(reponse.status()).toBe(401);
});

test('le catalogue et le devis restent accessibles sans jeton', async ({ request }) => {
  const catalogue = await request.get('/api/products', { headers: sansJeton });
  const devis = await request.post('/api/quote', { headers: sansJeton, data: { lines: [{ sku: 'carnet-a5', qty: 1 }] } });

  expect(catalogue.status()).toBe(200);
  expect(devis.status()).toBe(200);
});
