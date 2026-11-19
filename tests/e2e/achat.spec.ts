import { test, expect } from '@playwright/test';

test('acheter deux produits avec le code BIENVENUE10', async ({ page }) => {
  // 1. Ajouter deux produits depuis le catalogue
  await page.goto('/');
  await page.getByRole('button', { name: 'Ajouter Carnet A5' }).click();
  await page.getByRole('button', { name: 'Ajouter Stylo plume' }).click();

  // 2. Ouvrir le panier : 12,90 € + 24,50 € = 37,40 €
  await page.getByRole('link', { name: 'Panier (2)' }).click();
  await expect(page.getByRole('heading', { name: 'Votre panier' })).toBeVisible();
  await expect(page.getByTestId('cart-total')).toHaveText('37,40 €');

  // 3. Appliquer le code promo : −10 % = −3,74 €
  await page.getByLabel('Code promo').fill('BIENVENUE10');
  await page.getByRole('button', { name: 'Appliquer' }).click();
  await expect(page.getByTestId('cart-discount')).toHaveText('−3,74 €');
  await expect(page.getByTestId('cart-total')).toHaveText('33,66 €');

  // 4. Passer la commande : 33,66 € + 4,90 € de livraison
  await page.getByRole('link', { name: 'Passer la commande' }).click();
  await expect(page.getByTestId('order-total')).toHaveText('38,56 €');
  await page.getByLabel('Nom').fill('Ada Lovelace');
  await page.getByLabel('E-mail').fill('ada@example.com');
  await page.getByRole('button', { name: 'Commander' }).click();

  // 5. Vérifier la confirmation
  await expect(page).toHaveURL(/confirmation/);
  await expect(page.getByRole('heading', { name: 'Commande confirmée' })).toBeVisible();
  await expect(page.getByTestId('order-number')).toHaveText(/^MS-\d{6}$/);
  await expect(page.getByTestId('order-total')).toHaveText('38,56 €');
  await expect(page.getByRole('link', { name: 'Panier (0)' })).toBeVisible();
});
