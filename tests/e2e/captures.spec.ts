import { test, expect } from '@playwright/test';

// Atelier 3 : des captures de documentation, régénérées à chaque lancement dans docs/captures/.
test('capturer chaque page pour la documentation', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Catalogue' })).toBeVisible();
  await page.screenshot({ path: 'docs/captures/catalogue.png', fullPage: true });

  await page.getByRole('button', { name: 'Ajouter Carnet A5' }).click();
  await page.getByRole('link', { name: /Panier/ }).click();
  await expect(page.getByRole('heading', { name: 'Votre panier' })).toBeVisible();
  await page.screenshot({ path: 'docs/captures/panier.png', fullPage: true });

  // Un seul élément : le contenu du panier
  await page.getByTestId('cart').screenshot({ path: 'docs/captures/panier-contenu.png' });

  await page.getByRole('link', { name: 'Passer la commande' }).click();
  await expect(page.getByRole('button', { name: 'Commander' })).toBeVisible();
  await page.screenshot({ path: 'docs/captures/commande.png', fullPage: true });

  await page.getByLabel('Nom').fill('Ada Lovelace');
  await page.getByLabel('E-mail').fill('ada@example.com');
  await page.getByRole('button', { name: 'Commander' }).click();
  await expect(page.getByRole('heading', { name: 'Commande confirmée' })).toBeVisible();
  await page.screenshot({ path: 'docs/captures/confirmation.png', fullPage: true });

  // Joindre une capture au rapport HTML
  await test.info().attach('confirmation', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});
