import { test, expect } from '@playwright/test';

// Le jeton est ajouté à chaque requête par le projet « api » (playwright.config.ts).
const alice = { name: 'Alice Martin', email: 'alice@example.test' };

test('commande : créer puis relire', async ({ request }) => {
  // 1. Créer
  const creation = await request.post('/api/orders', {
    data: { customer: alice, lines: [{ sku: 'carnet-a5', qty: 2 }], coupon: 'BIENVENUE10' },
  });
  expect(creation.status()).toBe(201);
  const commande = await creation.json();
  expect(commande).toMatchObject({
    id: expect.any(String),
    status: 'confirmed',
    total: 2812, // 2 × 12,90 € − 10 % + 4,90 € de livraison
  });
  expect(creation.headers()['location']).toBe(`/api/orders/${commande.id}`);

  // 2. Relire avec l'identifiant renvoyé : la commande existe vraiment
  const lecture = await request.get(`/api/orders/${commande.id}`);
  expect(lecture.status()).toBe(200);
  expect(await lecture.json()).toMatchObject({ id: commande.id, status: 'confirmed', total: 2812 });
});

test('commande : deux commandes ont des identifiants différents', async ({ request }) => {
  const data = { customer: alice, lines: [{ sku: 'carnet-a5', qty: 1 }] };

  const premiere = await (await request.post('/api/orders', { data })).json();
  const seconde = await (await request.post('/api/orders', { data })).json();

  expect(premiere.id).not.toBe(seconde.id);
});

test('commande : identifiant inconnu → 404', async ({ request }) => {
  const reponse = await request.get('/api/orders/inconnue');

  expect(reponse.status()).toBe(404);
  expect(await reponse.json()).toEqual({ error: expect.any(String), code: expect.any(String) });
});

// Pour une commande, tout ce qui est refusé donne 422 (SPEC.md, section « API »).
const commandesRefusees = [
  { nom: 'nom vide', corps: { customer: { ...alice, name: '' }, lines: [{ sku: 'carnet-a5', qty: 1 }] } },
  { nom: 'e-mail invalide', corps: { customer: { ...alice, email: 'alice-sans-arobase' }, lines: [{ sku: 'carnet-a5', qty: 1 }] } },
  { nom: 'client absent', corps: { lines: [{ sku: 'carnet-a5', qty: 1 }] } },
  { nom: 'panier vide', corps: { customer: alice, lines: [] } },
  { nom: 'quantité > 10', corps: { customer: alice, lines: [{ sku: 'carnet-a5', qty: 11 }] } },
  { nom: 'produit inconnu', corps: { customer: alice, lines: [{ sku: 'xyz', qty: 1 }] } },
  { nom: 'coupon expiré', corps: { customer: alice, lines: [{ sku: 'carnet-a5', qty: 1 }], coupon: 'NOEL2025' } },
];

for (const cas of commandesRefusees) {
  test(`commande refusée : ${cas.nom}`, async ({ request }) => {
    const reponse = await request.post('/api/orders', { data: cas.corps });

    expect(reponse.status()).toBe(422);
    expect(await reponse.json()).toEqual({ error: expect.any(String), code: expect.any(String) });
  });
}
