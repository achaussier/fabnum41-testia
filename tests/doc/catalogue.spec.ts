import { test, expect } from '@playwright/test';
import { etape } from './outils';

// Un test de documentation : un test E2E dont les étapes sont nommées pour un utilisateur.
// Chaque etape() exécute l'action, prend une capture et note l'étape dans docs/build/catalogue.json.
test('Guide : consulter le catalogue', async ({ page }) => {
  await etape(page, 'Ouvrir le catalogue', async () => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Catalogue' })).toBeVisible();
  });

  await etape(page, 'Ajouter le Carnet A5 au panier', async () => {
    await page.getByRole('button', { name: 'Ajouter Carnet A5' }).click();
    await expect(page.getByRole('link', { name: 'Panier (1)' })).toBeVisible();
  });
});
