import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Chaque test prépare son propre panier
  await page.goto('/');
  await page.getByRole('button', { name: 'Ajouter Carnet A5' }).click();
  await page.goto('/cart.php');
});

test('un code promo inconnu affiche un message d’erreur', async ({ page }) => {
  await page.getByLabel('Code promo').fill('SOLDES50');
  await page.getByRole('button', { name: 'Appliquer' }).click();

  await expect(page.getByRole('alert')).toHaveText('Code promo invalide');
  await expect(page.getByTestId('cart-discount')).toHaveCount(0);
  await expect(page.getByTestId('cart-total')).toHaveText('12,90 €');
});

test('un code promo expiré affiche un message d’erreur', {
  tag: ['@e2e', '@coupons'],
  annotation: { type: 'exigence', description: 'SPEC.md › Livraison et coupons › NOEL2025 expiré' },
}, async ({ page }) => {
  await test.step('Saisir le code expiré NOEL2025', async () => {
    await page.getByLabel('Code promo').fill('NOEL2025');
    await page.getByRole('button', { name: 'Appliquer' }).click();
  });

  await test.step('Vérifier le message « Ce code a expiré »', async () => {
    await expect(page.getByRole('alert')).toHaveText('Ce code a expiré');
  });

  await test.step('Vérifier que le total n’a pas changé : 12,90 €', async () => {
    await expect(page.getByTestId('cart-total')).toHaveText('12,90 €');
  });
});

test('le code LIVRAISON offre la livraison', async ({ page }) => {
  await expect(page.getByTestId('cart-shipping')).toHaveText('4,90 €');

  await page.getByLabel('Code promo').fill(' livraison ');
  await page.getByRole('button', { name: 'Appliquer' }).click();

  await expect(page.getByTestId('cart-shipping')).toHaveText('Offerte');
  await expect(page.getByTestId('order-total')).toHaveText('12,90 €');
});
