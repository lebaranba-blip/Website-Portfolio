/**
 * Screenshot workflow — для визуального контроля изменений
 *
 * Использование:
 *   node scripts/screenshot.js              — полная страница (hero + works + about + footer)
 *   node scripts/screenshot.js hero         — только hero
 *   node scripts/screenshot.js works        — только секция works
 *   node scripts/screenshot.js about        — только секция about
 *   node scripts/screenshot.js footer       — только footer
 *   node scripts/screenshot.js all          — все секции по отдельности
 */

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const BASE_URL = "http://localhost:3000";
const OUT_DIR = path.join(__dirname, "..", "screenshots");

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const SECTIONS = {
  hero:   { url: "/",         selector: "#hero",    name: "hero" },
  works:  { url: "/#works",   selector: "#works",   name: "works" },
  about:  { url: "/#about",   selector: "#about",   name: "about" },
  footer: { url: "/#contact", selector: "#contact", name: "footer" },
};

const VIEWPORTS = [
  { width: 1440, height: 900,  label: "desktop" },
  { width: 390,  height: 844,  label: "mobile"  },
];

// deviceScaleFactor: 1 keeps files small enough for Read tool (<2000px tall)

async function screenshot(target = "full") {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const results = [];

  for (const viewport of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: 1 });

    // Disable animations for stable screenshots
    await page.addStyleTag({
      content: `*, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-delay: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }`,
    });

    if (target === "all") {
      // Screenshot each section separately
      for (const [key, section] of Object.entries(SECTIONS)) {
        await page.goto(`${BASE_URL}${section.url}`, { waitUntil: "networkidle2", timeout: 15000 });
        await page.waitForSelector(section.selector, { timeout: 5000 }).catch(() => {});
        await new Promise(r => setTimeout(r, 600));

        const el = await page.$(section.selector);
        if (el) {
          const ts = Date.now();
          const file = path.join(OUT_DIR, `${key}-${viewport.label}-${ts}.png`);
          await el.screenshot({ path: file });
          results.push(file);
          console.log(`✓ ${key} (${viewport.label}) → screenshots/${path.basename(file)}`);
        }
      }
    } else if (target === "full") {
      await page.goto(BASE_URL, { waitUntil: "networkidle2", timeout: 15000 });
      await new Promise(r => setTimeout(r, 800));
      const ts = Date.now();
      const file = path.join(OUT_DIR, `full-${viewport.label}-${ts}.png`);
      await page.screenshot({ path: file, fullPage: true });
      results.push(file);
      console.log(`✓ full page (${viewport.label}) → screenshots/${path.basename(file)}`);
    } else if (SECTIONS[target]) {
      const section = SECTIONS[target];
      await page.goto(`${BASE_URL}${section.url}`, { waitUntil: "networkidle2", timeout: 15000 });
      await page.waitForSelector(section.selector, { timeout: 5000 }).catch(() => {});
      await new Promise(r => setTimeout(r, 600));

      const el = await page.$(section.selector);
      if (el) {
        const ts = Date.now();
        const file = path.join(OUT_DIR, `${target}-${viewport.label}-${ts}.png`);
        await el.screenshot({ path: file });
        results.push(file);
        console.log(`✓ ${target} (${viewport.label}) → screenshots/${path.basename(file)}`);
      } else {
        console.warn(`⚠ selector "${section.selector}" not found`);
      }
    } else {
      console.error(`Unknown target: "${target}". Use: full | all | hero | works | about | footer`);
      process.exit(1);
    }

    await page.close();
  }

  await browser.close();

  console.log(`\nDone. ${results.length} screenshot(s) saved to screenshots/`);
  return results;
}

const target = process.argv[2] || "full";
screenshot(target).catch(err => {
  console.error("Error:", err.message);
  console.error("Make sure the dev server is running: npm run dev");
  process.exit(1);
});
