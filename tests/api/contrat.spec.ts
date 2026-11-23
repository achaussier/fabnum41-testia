import { test, expect } from '@playwright/test';
import { expectConforme } from './contrat';

// Un test par route et par code documenté dans public/openapi.yaml.
// On ne vérifie pas les valeurs ici, seulement la FORME des réponses.

const alice = { name: 'Alice Martin', email: 'alice@example.test' };
const unCarnet = [{ sku: 'carnet-a5', qty: 1 }];
const sansJeton = { Authorization: '' };

test('GET /api/products — 200 respecte le contrat', async ({ request }) => {
  const r = await request.get('/api/products');
  expect(r.status()).toBe(200);
  await expectConforme(r, 'GET', '/api/products');
});

test('GET /api/products/{sku} — 200 respecte le contrat', async ({ request }) => {
  const r = await request.get('/api/products/carnet-a5');
  expect(r.status()).toBe(200);
  await expectConforme(r, 'GET', '/api/products/{sku}');
});

test('GET /api/products/{sku} — 404 respecte le contrat', async ({ request }) => {
  const r = await request.get('/api/products/licorne');
  expect(r.status()).toBe(404);
  await expectConforme(r, 'GET', '/api/products/{sku}');
});

test('POST /api/quote — 200 respecte le contrat', async ({ request }) => {
  const r = await request.post('/api/quote', { data: { lines: unCarnet } });
  expect(r.status()).toBe(200);
  await expectConforme(r, 'POST', '/api/quote');
});

test('POST /api/quote — 404 respecte le contrat', async ({ request }) => {
  const r = await request.post('/api/quote', { data: { lines: [{ sku: 'licorne', qty: 1 }] } });
  expect(r.status()).toBe(404);
  await expectConforme(r, 'POST', '/api/quote');
});

test('POST /api/quote — 410 respecte le contrat', async ({ request }) => {
  const r = await request.post('/api/quote', { data: { lines: unCarnet, coupon: 'NOEL2025' } });
  expect(r.status()).toBe(410);
  await expectConforme(r, 'POST', '/api/quote');
});

test('POST /api/quote — 422 respecte le contrat', async ({ request }) => {
  const r = await request.post('/api/quote', { data: { lines: [] } });
  expect(r.status()).toBe(422);
  await expectConforme(r, 'POST', '/api/quote');
});

test('POST /api/orders — 201 respecte le contrat', async ({ request }) => {
  const r = await request.post('/api/orders', { data: { customer: alice, lines: unCarnet } });
  expect(r.status()).toBe(201);
  await expectConforme(r, 'POST', '/api/orders');
});

test('POST /api/orders — 401 respecte le contrat', async ({ request }) => {
  const r = await request.post('/api/orders', { headers: sansJeton, data: {} });
  expect(r.status()).toBe(401);
  await expectConforme(r, 'POST', '/api/orders');
});

test('POST /api/orders — 422 respecte le contrat', async ({ request }) => {
  const r = await request.post('/api/orders', { data: { customer: { ...alice, email: 'pas-un-e-mail' }, lines: unCarnet } });
  expect(r.status()).toBe(422);
  await expectConforme(r, 'POST', '/api/orders');
});

test('GET /api/orders/{id} — 200 respecte le contrat', async ({ request }) => {
  // On crée d'abord la commande à relire.
  const creation = await request.post('/api/orders', { data: { customer: alice, lines: unCarnet } });
  const { id } = await creation.json();

  const r = await request.get(`/api/orders/${id}`);
  expect(r.status()).toBe(200);
  await expectConforme(r, 'GET', '/api/orders/{id}');
});

test('GET /api/orders/{id} — 401 respecte le contrat', async ({ request }) => {
  const r = await request.get('/api/orders/peu-importe', { headers: sansJeton });
  expect(r.status()).toBe(401);
  await expectConforme(r, 'GET', '/api/orders/{id}');
});

test('GET /api/orders/{id} — 404 respecte le contrat', async ({ request }) => {
  const r = await request.get('/api/orders/inconnue');
  expect(r.status()).toBe(404);
  await expectConforme(r, 'GET', '/api/orders/{id}');
});
