import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Ajouter Carnet A5' }).click();
  await page.goto('/checkout.php');
});

test('le nom et l’e-mail sont obligatoires', async ({ page }) => {
  await page.getByRole('button', { name: 'Commander' }).click();

  await expect(page.getByText('Le nom est obligatoire')).toBeVisible();
  await expect(page.getByText('L’e-mail est obligatoire')).toBeVisible();
  await expect(page).toHaveURL(/checkout/);
});

test('un e-mail mal formé est refusé', async ({ page }) => {
  await page.getByLabel('Nom').fill('Ada Lovelace');
  await page.getByLabel('E-mail').fill('ada-sans-arobase');
  await page.getByRole('button', { name: 'Commander' }).click();

  await expect(page.getByText('L’e-mail n’est pas valide')).toBeVisible();
  await expect(page.getByLabel('Nom')).toHaveValue('Ada Lovelace');
  await expect(page).toHaveURL(/checkout/);
});
