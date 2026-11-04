// make-og.mjs: saves scripts/og-image.html as public/og-image.png (1200x630), the picture shown when the
// site's link is shared on LinkedIn, WhatsApp and others. Run it again after changing the HTML.
//
//   node scripts/make-og.mjs
import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--allow-file-access-from-files"], // the page loads the fonts from node_modules
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
await page.goto(new URL("./og-image.html", import.meta.url).href, { waitUntil: "networkidle0" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "public/og-image.png" });
await browser.close();
console.log("saved public/og-image.png");
