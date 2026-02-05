import { expect, test } from '@playwright/test';

test('home loads and command palette opens with keyboard', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.keyboard.press('Control+k');
  await expect(page.getByRole('dialog', { name: 'Command palette' })).toBeVisible();
});

test('projects deep link shows sentinel card', async ({ page }) => {
  await page.goto('/#projects');
  await expect(page.locator('#project-sentinel')).toBeVisible();
});

test('anomaly deep link opens with interactive model toggle', async ({ page }) => {
  await page.goto('/#projects?project=anomaly');

  const tab = page.getByRole('tab', { name: 'One-Class SVM' });
  await tab.click();
  await expect(tab).toHaveAttribute('aria-selected', 'true');
});
