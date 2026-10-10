import { test, expect } from '@playwright/test';

test('App loads successfully', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/PromptGuard/i);
});

test('Navigate to playground and run custom scenario', async ({ page }) => {
  await page.goto('/playground');
  
  // Select custom scenario
  await page.waitForSelector('text=Custom Manual Benchmark', { state: 'attached', timeout: 30000 });
  await page.click('text=Custom Manual Benchmark');
  
  // Enter target agent id
  await page.fill('input[placeholder="e.g. agent_123"]', 'agent-test-1');
  
  // Enter tool name
  await page.fill('input[placeholder="e.g. export_credentials"]', 'search_demo_records');
  
  // Enter tool args
  await page.fill('textarea[placeholder=\'{"key": "value"}\']', '{"query": "support"}');
  
  // Run
  await page.click('button:has-text("Run Simulation")');
  
  // Check results inspector
  await expect(page.locator('text=Execution Status: EXECUTED_IN_SIMULATION')).toBeVisible({ timeout: 10000 });
});

test('Navigate to Evaluation Lab', async ({ page }) => {
  await page.goto('/evaluations');
  await expect(page.locator('text=Evaluation Lab')).toBeVisible();
});
