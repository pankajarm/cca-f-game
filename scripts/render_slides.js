// Render every slide of the given lessons to PNG with Playwright, for scripts/build_videos.py.
//   node scripts/render_slides.js <outDir> <baseUrl> <lessonId> [<lessonId> ...]
// Writes <outDir>/<lessonId>/slide-NN.png at 1920x1080 (1280x720 CSS px at 1.5x) and notes.json,
// the narration for each slide, taken from the same deck the site shows.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const [outDir, base, ...ids] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5 });
  for (const id of ids) {
    await page.goto(`${base}/learn/deck.html?render=1&id=${id}`);
    await page.evaluate(() => document.fonts && document.fonts.ready);
    const n = await page.evaluate(() => window.slideCount);
    fs.mkdirSync(path.join(outDir, id), { recursive: true });
    const notes = await page.evaluate(() => Learn.deck(lesson).map(s => s.note || ''));
    fs.writeFileSync(path.join(outDir, id, 'notes.json'), JSON.stringify(notes, null, 1));
    for (let i = 0; i < n; i++) {
      await page.evaluate(k => window.showSlide(k), i);
      await page.waitForTimeout(60);
      await page.screenshot({ path: path.join(outDir, id, `slide-${String(i).padStart(2, '0')}.png`) });
    }
    console.log(id, n);
  }
  await browser.close();
})();
