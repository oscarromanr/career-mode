import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'test/browser',
  timeout: 60000,
  retries: 0,
  workers: 1,
  use: {
    baseURL: 'http://localhost:4173',
    viewport: { width: 1280, height: 720 },
  },
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 60000,
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
