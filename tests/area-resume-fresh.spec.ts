import { test, expect } from '@playwright/test';
import { setupFreshTest } from './helpers';

test.describe('Resume Quiz Fresh Experience', () => {
  test.beforeEach(async ({ page }) => {
    await setupFreshTest(page);
  });

  test('Clicking area resumes at last question if progress exists', async ({ page }) => {
  // Go to Lógica I, answer 2 questions
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: /Lógica I/ }).waitFor({ timeout: 15000 });
  await page.getByRole('button', { name: /Lógica I/ }).click({ timeout: 10000 });
  await page.getByText('Orden secuencial').click({ timeout: 10000 });
  await page.getByRole('button', { name: 'Todas las preguntas' }).click({ timeout: 10000 });
  
  // Wait for quiz to load and answer 2 questions
  await page.waitForSelector('text=V', { timeout: 10000 });
  for (let i = 0; i < 2; i++) {
    await page.getByRole('button', { name: 'V', exact: true }).click({ timeout: 10000 });
    await page.getByRole('button', { name: 'Continuar' }).click({ timeout: 10000 });
    if (i < 1) await page.waitForSelector('text=V', { timeout: 10000 });
  }
  
  await page.getByRole('button', { name: 'Options' }).click({ timeout: 10000 });
  await page.getByRole('button', { name: 'Cambiar área' }).first().click({ timeout: 10000 });
  await page.getByText(/Introducción al Pensamiento Científico/).waitFor({ timeout: 10000 });
  await page.getByRole('button', { name: /Introducción al Pensamiento Científico/ }).click({ timeout: 10000 });
  await page.getByRole('button', { name: 'Todas las preguntas' }).click({ timeout: 10000 });
  await page.getByRole('button', { name: 'A', exact: true }).click({ timeout: 10000 });
  
  await page.getByRole('button', { name: 'Options' }).click({ timeout: 10000 });
  await page.getByRole('button', { name: 'Cambiar área' }).first().click({ timeout: 10000 });
  await page.getByRole('button', { name: /Lógica I/ }).waitFor({ timeout: 10000 });
  await page.getByRole('button', { name: /Lógica I/ }).click({ timeout: 10000 });
  
  // Wait for page to load completely
  await page.waitForSelector('text=❓', { timeout: 10000 });
  
  // Should resume at question 3 (index 2)
  const isVisible = await page.getByText(/3\./).first().isVisible();
  expect(isVisible).toBe(true);
}, 30000);

  test('Clicking "Todas las preguntas" always starts fresh', async ({ page }) => {
  // Go to IPC, answer 2 questions
  await page.getByRole('button', { name: /Introducción al Pensamiento Científico/ }).click();
  await page.getByText('Orden secuencial').click();
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  for (let i = 0; i < 2; i++) {
    await page.getByRole('button', { name: 'A', exact: true }).click();
    await page.getByRole('button', { name: 'Continuar' }).click();
  }
  // Go back to menu
  await page.getByRole('button', { name: 'Options' }).click();
  await page.getByRole('button', { name: 'Volver a empezar' }).first().click();
  // Click "Todas las preguntas" again
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  // Should be on question 1
  //await expect(page.getByText(/1\./)).toBeVisible();
  const isVisible = await page.getByText(/1\./).first().isVisible();
  expect(isVisible).toBe(true);
});});