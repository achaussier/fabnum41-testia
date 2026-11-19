import { test, expect } from '@playwright/test';

// Test d'exemple : il vérifie que Playwright est bien installé
// et montre la forme d'un test de bout en bout.
test('ajouter un produit au panier', async ({ page }) => {
  // 1. Aller sur le catalogue
  await page.goto('/');

  // 2. Cliquer sur « Ajouter » pour le carnet
  await page.getByRole('button', { name: 'Ajouter Carnet A5' }).click();

  // 3. Ouvrir le panier
  await page.getByRole('link', { name: /Panier/ }).click();

  // 4. Vérifier ce qui s'affiche
  await expect(page.getByRole('heading', { name: 'Votre panier' })).toBeVisible();
  await expect(page.getByTestId('cart-total')).toHaveText('12,90 €');
});
