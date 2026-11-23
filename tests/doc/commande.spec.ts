import { test, expect } from '@playwright/test';
import { etape } from './outils';

// Données fictives : tout ce qui est saisi ici est filmé et publié dans le guide.
test('Guide : passer une commande', async ({ page }) => {
  await etape(page, 'Ouvrir le catalogue', async () => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Catalogue' })).toBeVisible();
  });

  await etape(page, 'Ajouter le Carnet A5 au panier', async () => {
    await page.getByRole('button', { name: 'Ajouter Carnet A5' }).click();
    await expect(page.getByRole('link', { name: 'Panier (1)' })).toBeVisible();
  });

  await etape(page, 'Appliquer le code BIENVENUE10', async () => {
    await page.getByRole('link', { name: /Panier/ }).click();
    await page.getByLabel('Code promo').fill('BIENVENUE10');
    await page.getByRole('button', { name: 'Appliquer' }).click();
    await expect(page.getByTestId('cart-discount')).toHaveText('−1,29 €'); // −10 % de 12,90 €
  });

  await etape(page, 'Saisir ses coordonnées', async () => {
    await page.getByRole('link', { name: 'Passer la commande' }).click();
    await page.getByLabel('Nom').fill('Camille Dupont');
    await page.getByLabel('E-mail').fill('camille@example.test');
    await expect(page.getByTestId('order-total')).toHaveText('16,51 €'); // 12,90 − 1,29 + 4,90 de livraison
  });

  await etape(page, 'Valider la commande', async () => {
    await page.getByRole('button', { name: 'Commander' }).click();
    await expect(page.getByRole('heading', { name: 'Commande confirmée' })).toBeVisible();
  });
});
