import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function aucuneViolation(page: Page) {
  const resultats = await new AxeBuilder({ page }).analyze();
  expect(resultats.violations).toEqual([]);
}

async function panierAvecUnCarnet(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Ajouter Carnet A5' }).click();
  await expect(page.getByRole('link', { name: 'Panier (1)' })).toBeVisible();
}

test('catalogue : pas de problème d’accessibilité', async ({ page }) => {
  await page.goto('/');
  await aucuneViolation(page);
});

test('panier : pas de problème d’accessibilité', async ({ page }) => {
  await panierAvecUnCarnet(page);
  await page.goto('/cart.php');
  await aucuneViolation(page);
});

test('commande : pas de problème d’accessibilité', async ({ page }) => {
  await panierAvecUnCarnet(page);
  await page.goto('/checkout.php');
  await aucuneViolation(page);
});

test('confirmation : pas de problème d’accessibilité', async ({ page }) => {
  await panierAvecUnCarnet(page);
  await page.goto('/checkout.php');
  await page.getByLabel('Nom').fill('Ada Lovelace');
  await page.getByLabel('E-mail').fill('ada@example.com');
  await page.getByRole('button', { name: 'Commander' }).click();
  await expect(page.getByRole('heading', { name: 'Commande confirmée' })).toBeVisible();
  await aucuneViolation(page);
});
