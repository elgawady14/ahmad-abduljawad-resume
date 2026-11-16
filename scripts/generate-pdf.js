#!/usr/bin/env node
/**
 * generate-pdf.js — HTML → PDF exporter for the résumé editions.
 *
 * Produces ONE continuous-scroll page per edition (no page breaks), sized to
 * the full content height, matching the live web design 1:1.
 *
 * Two outputs per edition:
 *   - the screen PDF (default): ONE continuous-scroll page, 1:1 with the web.
 *   - the A4 print PDF (--a4): real A4 pages at full type size, tuned for
 *     colour printing (clean white paper, deeper ink, no stranded headings).
 *     Written next to the screen PDF as …_A4_Print.pdf.
 *
 * Usage:
 *   node scripts/generate-pdf.js              # screen PDFs, every edition
 *   node scripts/generate-pdf.js root swiss   # only the named editions
 *   node scripts/generate-pdf.js --a4         # A4 print PDFs, every edition
 *   node scripts/generate-pdf.js --a4 ios     # A4 print PDF, one edition
 *
 * See PDF_CONVERSION.md for the full guide (setup, why each setting exists,
 * how to add a new edition, troubleshooting).
 */

const path = require('path');
const fs = require('fs');

let puppeteer;
try {
  // Prefer a local install (puppeteer or puppeteer-core, either works).
  puppeteer = require('puppeteer-core');
} catch (_) {
  try {
    puppeteer = require('puppeteer');
  } catch (_) {
    console.error(
      '\nMissing dependency. Install one of:\n' +
      '  npm i -D puppeteer-core   (then set CHROME_PATH, see below)\n' +
      '  npm i -D puppeteer        (downloads its own Chromium)\n'
    );
    process.exit(1);
  }
}

const ROOT = path.resolve(__dirname, '..');
const MM = 96 / 25.4;          // CSS px per millimetre at 96 dpi
const PAGE_W_MM = 210;         // A4 width — the visual width of every page

/**
 * Locate a Chrome/Chromium executable.
 * Priority: $CHROME_PATH → puppeteer's bundled browser → system Google Chrome.
 */
function resolveChrome() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  try {
    const p = puppeteer.executablePath();
    if (p && fs.existsSync(p)) return p;
  } catch (_) { /* puppeteer-core has no bundled browser */ }
  const fallbacks = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ];
  for (const p of fallbacks) if (fs.existsSync(p)) return p;
  return undefined; // let puppeteer try its own default
}

/**
 * One entry per édition.
 *   id      cli selector
 *   html    source file (relative to repo root)
 *   pdf     output file (relative to repo root)
 *   media   'print' or 'screen' — which stylesheet to render with
 *   margin  millimetres of whitespace kept around the continuous page
 *
 * media: most editions use their @media print styling ('print'). The terminal
 * edition's print styling collapses its layout, so it renders with 'screen'.
 */
const EDITIONS = [
  { id: 'root',      html: 'index.html',                            pdf: 'Ahmad_Founding_CTO_Resume.pdf',                                    media: 'print',  margin: 0, loc: true },
  { id: 'editorial', html: 'versions/2026-06-editorial/index.html', pdf: 'versions/2026-06-editorial/Ahmad_iOS_TechLead_Resume.pdf', media: 'print',  margin: 0, loc: true },
  { id: 'terminal',  html: 'versions/2026-06-terminal/index.html',  pdf: 'versions/2026-06-terminal/Ahmad_iOS_TechLead_Resume.pdf',  media: 'screen', margin: 9 },
  { id: 'swiss',     html: 'versions/2026-06-swiss/index.html',     pdf: 'versions/2026-06-swiss/Ahmad_iOS_TechLead_Resume.pdf',     media: 'print',  margin: 8, loc: true },

  // Target editions (Editorial design, retargeted content) — 2026-07
  // Two families: one iOS resume, one Mobile resume. Each exports Riyadh + Cairo.
  { id: 'ios',    html: 'versions/2026-07-ios/index.html',    pdf: 'versions/2026-07-ios/Ahmad_iOS_Resume.pdf',       media: 'print', margin: 0, loc: true },
  { id: 'mobile', html: 'versions/2026-07-mobile/index.html', pdf: 'versions/2026-07-mobile/Ahmad_Mobile_Resume.pdf', media: 'print', margin: 0, loc: true },

  // Leadership editions (Editorial design) — 2026-08. One independent file per title.
  { id: 'cto',              html: 'versions/2026-08-cto/index.html',              pdf: 'versions/2026-08-cto/Ahmad_CTO_Resume.pdf',                           media: 'print', margin: 0, loc: true },
  { id: 'engineering-lead', html: 'versions/2026-08-engineering-lead/index.html', pdf: 'versions/2026-08-engineering-lead/Ahmad_Engineering_Lead_Resume.pdf', media: 'print', margin: 0, loc: true },
  { id: 'technical-lead',   html: 'versions/2026-08-technical-lead/index.html',   pdf: 'versions/2026-08-technical-lead/Ahmad_Technical_Lead_Resume.pdf',     media: 'print', margin: 0, loc: true },
  { id: 'founding-cto',     html: 'versions/2026-08-founding-cto/index.html',     pdf: 'versions/2026-08-founding-cto/Ahmad_Founding_CTO_Resume.pdf',         media: 'print', margin: 0, loc: true },

  // Individual-contributor editions (Editorial design) — 2026-10.
  { id: 'senior-software-engineer', html: 'versions/2026-10-senior-software-engineer/index.html', pdf: 'versions/2026-10-senior-software-engineer/Ahmad_Senior_Software_Engineer_Resume.pdf', media: 'print', margin: 0, loc: true },
  { id: 'fullstack-engineer',       html: 'versions/2026-10-fullstack-engineer/index.html',       pdf: 'versions/2026-10-fullstack-engineer/Ahmad_Fullstack_Engineer_Resume.pdf',             media: 'print', margin: 0, loc: true },

  // Terminal-design twins (linked from each editorial edition's "live interactive" CTA).
  { id: 'ios-terminal',    html: 'versions/2026-07-ios-terminal/index.html',    pdf: 'versions/2026-07-ios-terminal/Ahmad_iOS_Terminal_Resume.pdf',       media: 'screen', margin: 9 },
  { id: 'mobile-terminal', html: 'versions/2026-07-mobile-terminal/index.html', pdf: 'versions/2026-07-mobile-terminal/Ahmad_Mobile_Terminal_Resume.pdf', media: 'screen', margin: 9 },
  { id: 'cto-terminal',              html: 'versions/2026-08-cto-terminal/index.html',              pdf: 'versions/2026-08-cto-terminal/Ahmad_CTO_Terminal_Resume.pdf',                           media: 'screen', margin: 9 },
  { id: 'engineering-lead-terminal', html: 'versions/2026-08-engineering-lead-terminal/index.html', pdf: 'versions/2026-08-engineering-lead-terminal/Ahmad_Engineering_Lead_Terminal_Resume.pdf', media: 'screen', margin: 9 },
  { id: 'technical-lead-terminal',   html: 'versions/2026-08-technical-lead-terminal/index.html',   pdf: 'versions/2026-08-technical-lead-terminal/Ahmad_Technical_Lead_Terminal_Resume.pdf',     media: 'screen', margin: 9 },
  { id: 'founding-cto-terminal',     html: 'versions/2026-08-founding-cto-terminal/index.html',     pdf: 'versions/2026-08-founding-cto-terminal/Ahmad_Founding_CTO_Terminal_Resume.pdf',         media: 'screen', margin: 9 },
  { id: 'senior-software-engineer-terminal', html: 'versions/2026-10-senior-software-engineer-terminal/index.html', pdf: 'versions/2026-10-senior-software-engineer-terminal/Ahmad_Senior_Software_Engineer_Terminal_Resume.pdf', media: 'screen', margin: 9 },
  { id: 'fullstack-engineer-terminal',       html: 'versions/2026-10-fullstack-engineer-terminal/index.html',       pdf: 'versions/2026-10-fullstack-engineer-terminal/Ahmad_Fullstack_Engineer_Terminal_Resume.pdf',             media: 'screen', margin: 9 },
];

async function exportEdition(browser, job) {
  const page = await browser.newPage();
  const mPx = Math.round(job.margin * MM);
  const contentW = Math.round(PAGE_W_MM * MM) - 2 * mPx; // printable width in px

  // Render at the printable width with the edition's stylesheet.
  await page.emulateMediaType(job.media);
  await page.setViewport({ width: contentW, height: 1123, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(ROOT, job.html) + (job.locParam ? '?loc=' + job.locParam : ''), { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 500)); // let fonts / reveal styles settle

  // Measure the full content height, then make Chrome size a SINGLE page that
  // tall via an injected @page rule. Letting Chrome own the page size (with
  // preferCSSPageSize) is what produces a correct continuous page — forcing
  // height through page.pdf({height}) mis-lays-out the content.
  const contentH = await page.evaluate((mm, pageWmm) => {
    // 'screen'-media exports (the terminal editions) don't get the print
    // stylesheet, so two of its rules have to be applied by hand here:
    //   - hide the floating Print button, which was otherwise baked into the
    //     bottom-right of the page;
    //   - force the reveal animations to their end state. .rv/.reveal start at
    //     opacity:0 and fade in over .6s with delays up to .4s, so the fixed
    //     wait below was racing them — lose that race and the exported page is
    //     blank apart from its chrome.
    const overrides = document.createElement('style');
    overrides.textContent =
      '.fab, .toolbar { display: none !important; }' +
      '.rv, .reveal { opacity: 1 !important; transform: none !important; animation: none !important; }';
    document.head.appendChild(overrides);

    const h = Math.ceil(document.documentElement.getBoundingClientRect().height);
    const style = document.createElement('style');
    style.textContent =
      '@page{ size: ' + pageWmm + 'mm ' + (h + 2 * mm) + 'px; margin: ' + mm + 'mm !important; }';
    document.head.appendChild(style);
    return h;
  }, job.margin, PAGE_W_MM);

  await page.pdf({
    path: path.join(ROOT, job.pdf),
    printBackground: true,
    preferCSSPageSize: true,
  });

  // Report dimensions + a 1-page sanity check.
  const raw = fs.readFileSync(path.join(ROOT, job.pdf), 'latin1');
  const boxes = [...raw.matchAll(/MediaBox\s*\[([^\]]+)\]/g)].map((m) => m[1].trim());
  const ok = boxes.length === 1 ? '✓' : '⚠ expected 1 page';
  console.log(`  ${job.id.padEnd(10)} → ${job.pdf}`);
  console.log(`             pages=${boxes.length} ${ok}  box=[${boxes[0]}]  contentH=${contentH}px`);
  await page.close();
}

/* ------------------------------------------------------------------------
 * A4 print mode (--a4)
 *
 * The screen PDF is one very tall page, so a printer shrinks it onto a single
 * sheet. The A4 print PDF paginates the same content onto real A4 pages at
 * full size and re-tunes the colours for paper:
 *   - white paper, no grain/scanline texture (texture prints muddy, and most
 *     printers can't print to the edge, which would frame a tinted page);
 *   - darker secondary text and hairlines so they survive the printer;
 *   - long entries may continue onto the next page, but single bullets,
 *     cards and headings are never split or stranded;
 *   - the page padding repeats on every page (box-decoration-break: clone).
 *
 * Each design family gets its own override sheet:
 *   editorial — rendered with its own @media print rules (they keep the full
 *               15px type scale), plus the overrides below;
 *   swiss / terminal — their @media print rules shrink type to 9px to force a
 *               single page, so they render from the screen layout instead,
 *               laid out at A4_LAYOUT_W px and scaled onto the page. The dark
 *               terminal theme is swapped for a light editor theme: a dark
 *               page floods ink and prints heavy.
 * ---------------------------------------------------------------------- */
const A4_PAD_MM = 13;          // inner page padding, top/bottom, every page
const A4_LAYOUT_W = 940;       // CSS px the screen-layout designs are laid out at

const A4_COMMON = `
  .toolbar, .fab { display: none !important; }
  .rv, .reveal { opacity: 1 !important; transform: none !important; animation: none !important; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
`;

const A4_CSS = {
  editorial: `
  @page { size: A4; margin: 0; }
  html, body, .sheet { background: #fff !important; }
  .sheet { padding: ${A4_PAD_MM}mm 14mm !important;
           box-decoration-break: clone; -webkit-box-decoration-break: clone; }
  .sheet::after { display: none !important; }
  :root { --ink: #111; --ink-2: #2e2b26; --ink-3: #5a554b;
          --accent: #a3231c; --accent-d: #7a1914; --ochre: #9a6418;
          --line: rgba(17,17,17,.22); --line-2: rgba(17,17,17,.38);
          --paper: #fff; --paper-2: #f6f1e6; }
  .proj, .proj:hover { background: #fff !important; }
  .portrait img, .portrait:hover img { filter: none !important; }
  .section, .entry, .xp { break-inside: auto !important; }
  .entry ul li, .entry p, .proj, .entry .title, .entry .org { break-inside: avoid; }
  .entry .what > .title, .entry .what > .org { break-after: avoid; }
  .entry { orphans: 3; widows: 3; }
  .entry ul li:last-child { break-before: avoid; }
  .stats + .section { break-before: page; }   /* page 1 = masthead cover */
  .colophon { break-before: avoid; break-inside: avoid; margin-top: 22px !important; padding-top: 12px !important; }
`,
  swiss: `
  @page { size: A4; margin: 0; }
  html, body { background: #fff !important; padding: 0 !important; }
  .sheet { max-width: none !important; border: none !important; box-shadow: none !important;
           background: #fff !important; padding: ${A4_PAD_MM}mm 14mm !important;
           box-decoration-break: clone; -webkit-box-decoration-break: clone; }
  :root { --paper: #fff; --ink-2: #2f2f29; --ink-3: #5a5a52; --hair: #b9b9b0; }
  .photo img { mix-blend-mode: normal !important; filter: none !important; }
  .photo::after { opacity: 0 !important; }
  .section, .lower { break-inside: auto !important; }
  .job, .proj, .fcat, .skill, .hon .it, .rec .blk { break-inside: avoid; }
  .s-h { break-after: avoid; }
  .foot { break-before: avoid; break-inside: avoid; }
`,
  terminal: `
  @page { size: A4; margin: 0; }
  :root { --bg: #fff; --bg-2: #f6f8fa; --bg-3: #eef2f6; --bg-hi: #eaeef2;
          --line: #d8dee4; --line-2: #c2cad3;
          --fg: #1f2328; --fg-dim: #4b5560; --fg-faint: #66707b;
          --green: #1a7f37; --amber: #9a6700; --cyan: #0969da; --magenta: #8250df;
          --red: #cf222e; --blue: #0550ae; }
  html, body { background: #fff !important; padding: 0 !important; }
  .win { max-width: none !important; border: none !important; border-radius: 0 !important;
         box-shadow: none !important; overflow: visible !important;
         padding: ${A4_PAD_MM}mm 0 !important;
         box-decoration-break: clone; -webkit-box-decoration-break: clone; }
  .win::before { display: none !important; }
  .titlebar { background: #f6f8fa !important; border: 1px solid var(--line); border-radius: 8px 8px 0 0; margin: 0 14mm; }
  .tabs { background: #f6f8fa !important; margin: 0 14mm; border: 1px solid var(--line); border-top: none; }
  .tab.on { background: #fff !important; }
  .pane { padding-left: 14mm !important; padding-right: 14mm !important; }
  h1, .stat .v, .job-top .role, .card h3, .blk .deg { color: #0d1117 !important; }
  .job-top .now { color: #fff !important; }
  .portrait img { filter: none !important; mix-blend-mode: normal !important; }
  .statusbar { background: #f6f8fa !important; color: var(--fg-dim) !important;
               margin: 0 14mm; border: 1px solid var(--line); border-radius: 0 0 8px 8px; }
  .statusbar .seg.accent { color: #fff !important; }
  .sec, .cols { break-inside: auto !important; }
  .job li, .card, .fcat, .skill, .blk, .hon .h-item { break-inside: avoid; }
  .job-top { break-after: avoid; }
  .sec-h { break-after: avoid; }
  .statusbar { break-before: avoid; break-inside: avoid; }
  .pane { padding-bottom: 14px !important; }
`,
};

/** Which override sheet an edition takes. */
function designOf(job) {
  if (job.id === 'swiss') return 'swiss';
  return job.media === 'screen' ? 'terminal' : 'editorial';
}

async function exportA4(browser, job) {
  const design = designOf(job);
  const editorial = design === 'editorial';
  const layoutW = editorial ? Math.round(PAGE_W_MM * MM) : A4_LAYOUT_W;
  const out = job.pdf.replace(/\.pdf$/, '_A4_Print.pdf');

  const page = await browser.newPage();
  await page.emulateMediaType(editorial ? 'print' : 'screen');
  // deviceScaleFactor 2: anything Chrome rasterises (blend modes, filters)
  // comes out at print density instead of 96 dpi.
  await page.setViewport({ width: layoutW, height: 1123, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(ROOT, job.html) + (job.locParam ? '?loc=' + job.locParam : ''), { waitUntil: 'networkidle0' });
  await page.addStyleTag({ content: A4_COMMON + A4_CSS[design] });
  await new Promise((r) => setTimeout(r, 500)); // fonts / layout settle

  const pdfOpts = {
    printBackground: true,
    ...(editorial
      ? { preferCSSPageSize: true }
      : { format: 'A4', margin: { top: 0, right: 0, bottom: 0, left: 0 },
          scale: Math.round(PAGE_W_MM * MM) / layoutW }),
  };
  const countPages = (buf) => (Buffer.from(buf).toString('latin1').match(/MediaBox/g) || []).length;

  // The footer strip (colophon / status bar) is decoration. If it would be the
  // only thing on the last page, leave it out rather than print a blank sheet.
  const FOOTER = '.colophon, .foot, .statusbar';
  const withFooter = countPages(await page.pdf(pdfOpts));
  const hide = await page.addStyleTag({ content: FOOTER + ' { display: none !important; }' });
  const withoutFooter = countPages(await page.pdf(pdfOpts));
  const footerKept = withoutFooter === withFooter;
  if (footerKept) await hide.evaluate((el) => el.remove());
  await page.pdf({ ...pdfOpts, path: path.join(ROOT, out) });

  const raw = fs.readFileSync(path.join(ROOT, out), 'latin1');
  const pages = (raw.match(/MediaBox/g) || []).length;
  console.log(`  ${job.id.padEnd(10)} → ${out}  (A4 × ${pages}, ${design}${footerKept ? '' : ', footer dropped'})`);
  await page.close();
}

(async () => {
  const args = process.argv.slice(2);
  const a4 = args.includes('--a4');
  const wanted = args.filter((a) => a !== '--a4');
  const run = a4 ? exportA4 : exportEdition;
  const jobs = wanted.length ? EDITIONS.filter((e) => wanted.includes(e.id)) : EDITIONS;
  if (!jobs.length) {
    console.error('No matching editions. Valid ids: ' + EDITIONS.map((e) => e.id).join(', '));
    process.exit(1);
  }

  const executablePath = resolveChrome();
  console.log('Chrome: ' + (executablePath || '(puppeteer default)'));
  const browser = await puppeteer.launch({ executablePath, headless: 'new' });
  console.log('Generating ' + jobs.length + ' edition(s)' + (a4 ? ' as A4 print PDFs' : '') + ':');
  for (const job of jobs) {
    if (job.loc) {
      // Location-aware editions export a Riyadh (default name) and a Cairo PDF.
      await run(browser, { ...job, locParam: 'riyadh' });
      await run(browser, {
        ...job,
        locParam: 'cairo',
        pdf: job.pdf.replace(/_Resume\.pdf$/, '_Cairo_Resume.pdf'),
      });
    } else {
      await run(browser, job);
    }
  }
  await browser.close();
  console.log('Done.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
