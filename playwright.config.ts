import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:8000',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // Playwright démarre le serveur PHP tout seul
  webServer: {
    command: 'php -S localhost:8000 -t public',
    url: 'http://localhost:8000',
    reuseExistingServer: !process.env.CI,
    stderr: 'ignore', // le serveur PHP écrit chaque requête dans le terminal : on masque ce bruit
  },
});
