import { test } from '@playwright/test';

test('index page', async ({ page }) => {
	await page.goto('/');
});
