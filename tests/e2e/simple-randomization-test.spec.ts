import { test, expect } from '@playwright/test';
import { setupFreshTest } from './helpers';

test.describe('Simple Randomization Test', () => {
  test.beforeEach(async ({ page }) => {
    await setupFreshTest(page);
  });

  test.skip('answer shuffling demonstrates the bug', async ({ page }) => {
    // Go to IPC area and enable answer shuffling
    await page.getByRole('button', { name: /Introducción al Pensamiento Científico/ }).click();
    await page.getByRole('button', { name: 'Aleatorio' }).click(); // Enable answer shuffling
    await page.getByRole('button', { name: 'Todas las preguntas' }).click();

    // Log all visible buttons before waiting for 'A'
    const allButtons = await page.locator('button').allInnerTexts();
    console.log('All visible buttons before waiting for A:', allButtons);
    // Wait for the quiz to load
    await page.waitForSelector('text=A');

    // Get the first option text (button A) - first attempt
    let firstOptionButton1;
    try {
      firstOptionButton1 = await page.getByRole('button', { name: 'A', exact: true });
    } catch (e) {
      console.log('Failed to find button A. Current URL:', page.url());
      const html = await page.content();
      console.log('Current page HTML:', html);
      throw e;
    }
    const firstOptionText1 = await firstOptionButton1.innerText();

    // Go back to start a new quiz
    await page.getByRole('button', { name: 'Options' }).click();
    await page.getByRole('button', { name: 'Volver a empezar' }).first().click();
    await page.getByRole('button', { name: 'Todas las preguntas' }).click();
    // Log all visible buttons before waiting for 'A' (second attempt)
    const allButtons2 = await page.locator('button').allInnerTexts();
    console.log('All visible buttons before waiting for A (second attempt):', allButtons2);
    await page.waitForSelector('text=A');

    // Get the first option text (button A) - second attempt
    let firstOptionButton2;
    try {
      firstOptionButton2 = await page.getByRole('button', { name: 'A', exact: true });
    } catch (e) {
      console.log('Failed to find button A (second attempt). Current URL:', page.url());
      const html = await page.content();
      console.log('Current page HTML (second attempt):', html);
      throw e;
    }
    const firstOptionText2 = await firstOptionButton2.innerText();

    console.log('First attempt first option:', firstOptionText1);
    console.log('Second attempt first option:', firstOptionText2);

    // If shuffling works, these should be different
    expect(firstOptionText1).not.toBe(firstOptionText2); // This should fail, showing the bug
  });

  test('question order demonstrates the bug', async ({ page }) => {
    // Go to IPC area and select random order
    await page.getByRole('button', { name: /Introducción al Pensamiento Científico/ }).click();
    await page.getByRole('button', { name: 'Orden aleatorio' }).click();
    await page.getByRole('button', { name: 'Todas las preguntas' }).click();

    // Log all visible .question-text elements before waiting
    const allQuestions = await page.locator('.question-text').allInnerTexts();
    console.log('All .question-text before waiting:', allQuestions);
    // Wait for the quiz to load
    await page.waitForSelector('.question-text');

    // Get the first question number - first attempt
    let questionElement1;
    let questionText1;
    try {
      questionElement1 = await page.locator('.question-text').first();
      questionText1 = await questionElement1.innerText();
    } catch (e) {
      console.log('Failed to find .question-text (first attempt). Current URL:', page.url());
      const html = await page.content();
      console.log('Current page HTML (first attempt):', html);
      throw e;
    }
    const match1 = questionText1.match(/^(\d+)\./);
    const firstQuestionNum1 = match1 ? parseInt(match1[1], 10) : null;

    // Go back to start a new quiz
    await page.getByRole('button', { name: 'Options' }).click();
    await page.getByRole('button', { name: 'Volver a empezar' }).first().click();
    await page.getByRole('button', { name: 'Todas las preguntas' }).click();
    // Log all visible .question-text elements before waiting (second attempt)
    const allQuestions2 = await page.locator('.question-text').allInnerTexts();
    console.log('All .question-text before waiting (second attempt):', allQuestions2);
    await page.waitForSelector('.question-text');

    // Get the first question number - second attempt
    let questionElement2;
    let questionText2;
    try {
      questionElement2 = await page.locator('.question-text').first();
      questionText2 = await questionElement2.innerText();
    } catch (e) {
      console.log('Failed to find .question-text (second attempt). Current URL:', page.url());
      const html = await page.content();
      console.log('Current page HTML (second attempt):', html);
      throw e;
    }
    const match2 = questionText2.match(/^(\d+)\./);
    const firstQuestionNum2 = match2 ? parseInt(match2[1], 10) : null;

    console.log('First attempt first question:', firstQuestionNum1);
    console.log('Second attempt first question:', firstQuestionNum2);

    // If randomization works, these should be different
    expect(firstQuestionNum1).not.toBe(firstQuestionNum2); // This should fail, showing the bug
  });
});
