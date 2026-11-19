import { test, expect, type Page } from '@playwright/test';

// Options communes : toute la page, 1 % de pixels différents toléré.
const options = { fullPage: true, maxDiffPixelRatio: 0.01 };

async function panierAvecUnCarnet(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Ajouter Carnet A5' }).click();
  await expect(page.getByRole('link', { name: 'Panier (1)' })).toBeVisible();
}

test('catalogue : rendu visuel', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Catalogue' })).toBeVisible();

  await expect(page).toHaveScreenshot('catalogue.png', {
    ...options,
    mask: [page.getByTestId('date-du-jour')],
  });
});

test('panier : rendu visuel', async ({ page }) => {
  await panierAvecUnCarnet(page);
  await page.goto('/cart.php');
  await expect(page.getByRole('heading', { name: 'Votre panier' })).toBeVisible();

  await expect(page).toHaveScreenshot('panier.png', {
    ...options,
    mask: [page.getByTestId('date-du-jour')],
  });
});

test('commande : rendu visuel', async ({ page }) => {
  await panierAvecUnCarnet(page);
  await page.goto('/checkout.php');
  await expect(page.getByRole('button', { name: 'Commander' })).toBeVisible();

  await expect(page).toHaveScreenshot('commande.png', {
    ...options,
    mask: [page.getByTestId('date-du-jour')],
  });
});

test('confirmation : rendu visuel', async ({ page }) => {
  await panierAvecUnCarnet(page);
  await page.goto('/checkout.php');
  await page.getByLabel('Nom').fill('Ada Lovelace');
  await page.getByLabel('E-mail').fill('ada@example.com');
  await page.getByRole('button', { name: 'Commander' }).click();
  await expect(page.getByRole('heading', { name: 'Commande confirmée' })).toBeVisible();

  await expect(page).toHaveScreenshot('confirmation.png', {
    ...options,
    mask: [page.getByTestId('date-du-jour'), page.getByTestId('order-number')],
  });
});
