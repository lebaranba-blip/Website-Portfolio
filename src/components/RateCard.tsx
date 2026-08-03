import { servicesDict } from "@/dictionaries/services"
import { EMAIL, TELEGRAM_HANDLE, SITE_DOMAIN } from "@/lib/constants"

const CSS = `
/* ── Rate card document ────────────────────────────────────────────── */
@page { size: A4 portrait; margin: 0; }

.rc-sheet {
  --rc-bg:     #0B0B0D;
  --rc-text:   #F2EFE9;
  --rc-muted:  rgba(242,239,233,0.52);
  --rc-faint:  rgba(242,239,233,0.34);
  --rc-line:   rgba(255,255,255,0.10);
  --rc-cyan:   #22D3EE;

  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 16mm 17mm 14mm;
  background: var(--rc-bg);
  color: var(--rc-text);
  font-family: var(--font-space-grotesk), sans-serif;
  font-size: 11.5px;
  line-height: 1.5;
  box-sizing: border-box;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* Header */
.rc-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; }
.rc-name {
  font-family: var(--font-display), var(--font-space-grotesk), sans-serif;
  font-weight: 900; font-size: 25px; letter-spacing: -0.03em; line-height: 1;
}
.rc-role {
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--rc-cyan); margin-top: 7px;
}
.rc-head-contacts {
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: 9px; line-height: 1.75; text-align: right; color: var(--rc-faint);
}
.rc-rule { height: 1px; background: var(--rc-line); margin: 14px 0 0; }

/* Title */
.rc-title-row { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-top: 22px; }
.rc-title {
  font-family: var(--font-display), var(--font-space-grotesk), sans-serif;
  font-weight: 900; font-size: 40px; letter-spacing: -0.04em; line-height: 1; margin: 0;
}
.rc-year {
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: 10px; letter-spacing: 0.18em; color: var(--rc-faint);
}
.rc-intro { color: var(--rc-muted); font-size: 11.5px; max-width: 70ch; margin: 10px 0 0; text-wrap: balance; }

/* Rows */
.rc-rows { margin-top: 20px; border-top: 1px solid var(--rc-line); }
.rc-row {
  display: grid;
  grid-template-columns: 22px 1fr auto;
  column-gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--rc-line);
  break-inside: avoid;
  page-break-inside: avoid;
}
.rc-num {
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: 9px; color: var(--rc-faint); padding-top: 4px;
}
.rc-title-s {
  font-family: var(--font-display), var(--font-space-grotesk), sans-serif;
  font-weight: 900; font-size: 16px; letter-spacing: -0.02em; line-height: 1.15; margin: 0;
}
.rc-desc { color: var(--rc-muted); font-size: 11px; line-height: 1.45; margin: 5px 0 0; max-width: 62ch; }
.rc-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
.rc-tag {
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: 8.5px; letter-spacing: 0.03em;
  padding: 3px 9px; border-radius: 100px;
  border: 1px solid var(--rc-line); color: var(--rc-faint);
  white-space: nowrap;
}
.rc-price-col { text-align: right; padding-top: 2px; min-width: 30mm; }
.rc-price {
  font-family: var(--font-display), var(--font-space-grotesk), sans-serif;
  font-weight: 900; font-size: 15.5px; letter-spacing: -0.02em; white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

/* Footer */
.rc-foot { margin-top: 18px; }
.rc-note { color: var(--rc-muted); font-size: 10px; line-height: 1.55; max-width: 92ch; }
.rc-contacts {
  display: flex; flex-wrap: wrap; gap: 26px;
  margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--rc-line);
}
.rc-c-label {
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: 8px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--rc-faint);
}
.rc-c-value { font-size: 11px; font-weight: 600; margin-top: 2px; color: var(--rc-text); }
.rc-c-value a { color: inherit; text-decoration: none; }

/* Screen preview — show the sheet as a document on a dark desk */
@media screen {
  .rc-desk { background: #060607; padding: 32px 16px; min-height: 100vh; }
  .rc-sheet { box-shadow: 0 30px 90px rgba(0,0,0,0.7); }
}
@media screen and (max-width: 230mm) {
  .rc-sheet { width: 100%; min-height: 0; padding: 26px 22px 22px; }
  .rc-title { font-size: 32px; }
  .rc-name { font-size: 21px; }
  .rc-head { flex-direction: column; gap: 12px; }
  .rc-head-contacts { text-align: left; }
  .rc-row { grid-template-columns: 18px 1fr; row-gap: 6px; }
  .rc-price-col { grid-column: 2; text-align: left; min-width: 0; }
}

/* Print — the sheet is the only thing on the page */
@media print {
  html, body { background: #0B0B0D !important; margin: 0 !important; padding: 0 !important; }
  body > *:not(.rc-desk) { display: none !important; }
  .rc-desk { background: none !important; padding: 0 !important; min-height: 0 !important; }
  .rc-sheet { box-shadow: none !important; margin: 0 !important; }
}
`

export default function RateCard({ lang }: { lang: "ru" | "en" }) {
  const t = servicesDict[lang]
  const rc = t.rateCard
  const year = new Date().getFullYear()

  return (
    <div className="rc-desk">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <main className="rc-sheet">

        {/* ── Header ── */}
        <header className="rc-head">
          <div>
            <div className="rc-name">{lang === "ru" ? "Дмитрий Коломиец" : "Dmitry Kolomiets"}</div>
            <div className="rc-role">{rc.role}</div>
          </div>
          <div className="rc-head-contacts">
            <div>{SITE_DOMAIN}</div>
            <div>{TELEGRAM_HANDLE}</div>
            <div>{EMAIL}</div>
          </div>
        </header>
        <div className="rc-rule" />

        {/* ── Title ── */}
        <div className="rc-title-row">
          <h1 className="rc-title">{rc.docTitle}</h1>
          <span className="rc-year">{year}</span>
        </div>
        <p className="rc-intro">{rc.intro}</p>

        {/* ── Services ── */}
        <section className="rc-rows">
          {t.items.map((item) => (
            <div className="rc-row" key={item.num}>
              <span className="rc-num">{item.num}</span>
              <div>
                <h2 className="rc-title-s">{item.title}</h2>
                <p className="rc-desc">{item.desc}</p>
                <div className="rc-tags">
                  {item.tags.map((tag) => (
                    <span className="rc-tag" key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className="rc-price-col">
                <span className="rc-price">{item.price}</span>
              </div>
            </div>
          ))}
        </section>

        {/* ── Footer ── */}
        <footer className="rc-foot">
          <p className="rc-note">{rc.note}</p>
          <div className="rc-contacts">
            <div>
              <div className="rc-c-label">{rc.telegramLabel}</div>
              <div className="rc-c-value">{TELEGRAM_HANDLE}</div>
            </div>
            <div>
              <div className="rc-c-label">{rc.emailLabel}</div>
              <div className="rc-c-value">{EMAIL}</div>
            </div>
            <div>
              <div className="rc-c-label">{rc.siteLabel}</div>
              <div className="rc-c-value">{SITE_DOMAIN}</div>
            </div>
          </div>
        </footer>

      </main>
    </div>
  )
}
