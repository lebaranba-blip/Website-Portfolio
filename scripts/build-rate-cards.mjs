/**
 * Renders /rate-card-ru and /rate-card-en to public/rate-card-{ru,en}.pdf
 *
 * The pages are the single source of truth — they read prices straight from
 * src/dictionaries/services.ts, so changing a price on the site and re-running
 * this script is the whole update flow. The PDFs are never edited by hand.
 *
 * Usage:  npm run dev   (in another terminal)
 *         npm run rate-card
 */
import puppeteer from "puppeteer"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { existsSync, statSync } from "node:fs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")
const OUT_DIR = join(ROOT, "public")
const BASE = process.env.RATE_CARD_BASE_URL || "http://localhost:3000"

const TARGETS = [
  { route: "/rate-card-ru", file: "rate-card-ru.pdf" },
  { route: "/rate-card-en", file: "rate-card-en.pdf" },
]

async function assertServer() {
  try {
    const res = await fetch(BASE, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
  } catch (err) {
    console.error(
      `\n  Cannot reach ${BASE} — start the site first:\n` +
      `    npm run dev\n` +
      `  then re-run:  npm run rate-card\n` +
      `  (or set RATE_CARD_BASE_URL to a deployed URL)\n`
    )
    console.error(`  ${err.message}\n`)
    process.exit(1)
  }
}

const run = async () => {
  await assertServer()

  const browser = await puppeteer.launch({ headless: true })
  try {
    for (const { route, file } of TARGETS) {
      const page = await browser.newPage()
      await page.setViewport({ width: 1240, height: 1754 })
      await page.goto(`${BASE}${route}`, { waitUntil: "networkidle0", timeout: 60000 })

      // let the shared preloader finish and webfonts settle
      await new Promise((r) => setTimeout(r, 2200))
      try { await page.evaluateHandle("document.fonts.ready") } catch {}

      await page.emulateMediaType("print")

      const out = join(OUT_DIR, file)
      await page.pdf({
        path: out,
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
      })

      const pages = await page.evaluate(() => {
        const sheet = document.querySelector(".rc-sheet")
        return sheet ? Math.ceil(sheet.getBoundingClientRect().height / 1123) : 0
      })
      const kb = existsSync(out) ? Math.round(statSync(out).size / 1024) : 0
      console.log(`  ${file.padEnd(20)} ${String(kb).padStart(4)} KB   ~${pages} page(s)`)
      await page.close()
    }
  } finally {
    await browser.close()
  }
  console.log("\n  Rate cards rebuilt from the live pages.\n")
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
