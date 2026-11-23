import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  use: {
    baseURL: 'http://localhost:8000',
    // Preuves en cas d'échec (atelier 3)
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  // Les images de référence gardent le même nom qu'au jour 1 (…-chromium-linux.png)
  snapshotPathTemplate: '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}-chromium-{platform}{ext}',
  projects: [
    // Tests d'API : pas de navigateur, le jeton est ajouté à chaque requête
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        extraHTTPHeaders: {
          Authorization: `Bearer ${process.env.MINISHOP_API_TOKEN ?? 'minishop-dev-token'}`,
        },
      },
    },
    // Tests de bout en bout du jour 1
    {
      name: 'e2e',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Chrome'] },
    },
    // Tests qui produisent la documentation : filmés, ralentis, taille fixe
    {
      name: 'doc',
      testDir: './tests/doc',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        video: { mode: 'on', size: { width: 1280, height: 720 } },
        launchOptions: { slowMo: 400 }, // 0,4 s entre actions
        locale: 'fr-FR',
      },
    },
  ],
  // Playwright démarre le serveur PHP tout seul
  webServer: {
    command: 'php -S localhost:8000 -t public',
    url: 'http://localhost:8000',
    reuseExistingServer: !process.env.CI,
    stderr: 'ignore', // le serveur PHP écrit chaque requête dans le terminal : on masque ce bruit
  },
});
