import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const ANALYSIS_DIR = join(process.cwd(), 'analysis');
mkdirSync(ANALYSIS_DIR, { recursive: true });

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Navigate to a content-rich page
  console.log('Navigating to Apify docs...');
  await page.goto('https://docs.apify.com/platform/actors', { waitUntil: 'networkidle', timeout: 30000 });

  // Screenshot full page
  await page.screenshot({ path: join(ANALYSIS_DIR, 'apify-actors-full.png'), fullPage: true });
  console.log('Full page screenshot saved');

  // Try to find and screenshot callouts/admonitions
  const admonitions = await page.$$('.theme-admonition, .admonition, .alert, [class*="admonition"]');
  console.log(`Found ${admonitions.length} admonitions`);
  for (let i = 0; i < Math.min(admonitions.length, 5); i++) {
    try {
      await admonitions[i].screenshot({ path: join(ANALYSIS_DIR, `callout-${i}.png`) });
      console.log(`Callout ${i} screenshot saved`);
    } catch (e) {
      console.log(`Could not screenshot callout ${i}: ${e.message}`);
    }
  }

  // Try to find code blocks
  const codeBlocks = await page.$$('pre, .prism-code, [class*="codeBlock"]');
  console.log(`Found ${codeBlocks.length} code blocks`);
  for (let i = 0; i < Math.min(codeBlocks.length, 3); i++) {
    try {
      await codeBlocks[i].screenshot({ path: join(ANALYSIS_DIR, `codeblock-${i}.png`) });
      console.log(`Codeblock ${i} screenshot saved`);
    } catch (e) {
      console.log(`Could not screenshot codeblock ${i}: ${e.message}`);
    }
  }

  // Try to find tabs
  const tabs = await page.$$('.tabs-container, [class*="tabs"], [role="tablist"]');
  console.log(`Found ${tabs.length} tab groups`);
  for (let i = 0; i < Math.min(tabs.length, 2); i++) {
    try {
      await tabs[i].screenshot({ path: join(ANALYSIS_DIR, `tabs-${i}.png`) });
      console.log(`Tabs ${i} screenshot saved`);
    } catch (e) {
      console.log(`Could not screenshot tabs ${i}: ${e.message}`);
    }
  }

  // Try to find details/accordion
  const details = await page.$$('details, [class*="details"], [class*="collapsible"]');
  console.log(`Found ${details.length} details elements`);
  for (let i = 0; i < Math.min(details.length, 2); i++) {
    try {
      await details[i].screenshot({ path: join(ANALYSIS_DIR, `details-${i}.png`) });
      console.log(`Details ${i} screenshot saved`);
    } catch (e) {
      console.log(`Could not screenshot details ${i}: ${e.message}`);
    }
  }

  // Extract CSS values
  console.log('Extracting CSS values...');
  const styles = await page.evaluate(() => {
    const result = {};

    // Callout/admonition styles
    const admonition = document.querySelector('.theme-admonition, .admonition, .alert, [class*="admonition"]');
    if (admonition) {
      const cs = getComputedStyle(admonition);
      result.callout = {
        borderLeft: cs.borderLeft,
        backgroundColor: cs.backgroundColor,
        padding: cs.padding,
        borderRadius: cs.borderRadius,
        fontSize: cs.fontSize,
        color: cs.color,
        margin: cs.margin
      };
    }

    // Code block styles
    const pre = document.querySelector('pre');
    if (pre) {
      const cs = getComputedStyle(pre);
      result.codeBlock = {
        backgroundColor: cs.backgroundColor,
        borderRadius: cs.borderRadius,
        padding: cs.padding,
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        border: cs.border,
        color: cs.color
      };
    }

    // Tab styles
    const tabList = document.querySelector('[role="tablist"]');
    if (tabList) {
      const cs = getComputedStyle(tabList);
      result.tabList = {
        borderBottom: cs.borderBottom,
        gap: cs.gap
      };
      const activeTab = tabList.querySelector('[aria-selected="true"], .tabs__item--active');
      if (activeTab) {
        const tcs = getComputedStyle(activeTab);
        result.activeTab = {
          color: tcs.color,
          borderBottom: tcs.borderBottom,
          fontWeight: tcs.fontWeight,
          padding: tcs.padding,
          fontSize: tcs.fontSize
        };
      }
    }

    // Details styles
    const det = document.querySelector('details');
    if (det) {
      const cs = getComputedStyle(det);
      result.details = {
        border: cs.border,
        padding: cs.padding,
        borderRadius: cs.borderRadius,
        backgroundColor: cs.backgroundColor
      };
    }

    return result;
  });

  writeFileSync(join(ANALYSIS_DIR, 'extracted-styles.json'), JSON.stringify(styles, null, 2));
  console.log('Extracted styles saved to analysis/extracted-styles.json');
  console.log(JSON.stringify(styles, null, 2));

  await browser.close();
  console.log('Done!');
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
