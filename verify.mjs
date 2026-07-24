import { chromium } from './node_modules/playwright/index.mjs';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1400, height: 900 });

await page.goto('http://localhost:3000');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(800);
await page.screenshot({ path: '/tmp/blueme-grid-v2.png' });
console.log('Grid screenshot done');

const cards = await page.locator('div.group').count();
console.log(`Cards: ${cards}`);

const text = await page.locator('main').innerText();
console.log('Items:', text.match(/(?:ver\.|Gundam|Macross|すいせい|Saber|Jeanne)/g));

await browser.close();
