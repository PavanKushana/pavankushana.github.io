// check.mjs: tests the built site in real Chrome, in both themes and both languages. It first compares the
// English and German content files (german-check.mjs), then serves dist/, opens the page at a laptop size and a
// phone size, scrolls through it (so every scroll animation runs), saves screenshots of each section in
// screenshots/, tries the theme switch, the language switch, the skill filter, the interview and a case study,
// checks that a German browser gets German, that nothing is wider than the screen, that the top bar fits at
// every width, that "reduce motion" shows everything, that the German page has no English left on it, and fails
// on any error.
//
//   npm run build && npm run check
import { mkdir } from "node:fs/promises";
import { preview } from "vite";
import puppeteer from "puppeteer-core";
import * as english from "../src/content.js";
import * as german from "../src/content.de.js";
import { compareContent } from "./german-check.mjs";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const SECTIONS = ["top", "about", "journey", "work", "skills", "interview", "moments", "contact"];
const CONTENT = { en: english, de: german };
// a few words of the first interview answer, to see that it arrived (in the run's language)
const FIRST_ANSWER = { en: "working student", de: "Werkstudentenstelle" };
// English words that belong on the German page: the language switch names English in English, on purpose
const ALLOWED_ON_GERMAN_PAGE = ["English"];
const RUNS = [
  { name: "desktop-light", width: 1440, height: 900, mobile: false, theme: "light", lang: "en" },
  { name: "desktop-dark", width: 1440, height: 900, mobile: false, theme: "dark", lang: "en" },
  { name: "phone-light", width: 390, height: 844, mobile: true, theme: "light", lang: "en" },
  { name: "phone-dark", width: 390, height: 844, mobile: true, theme: "dark", lang: "en" },
  { name: "desktop-light-de", width: 1440, height: 900, mobile: false, theme: "light", lang: "de" },
  { name: "phone-dark-de", width: 390, height: 844, mobile: true, theme: "dark", lang: "de" },
];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Scrolls to the bottom in small steps, so each scroll animation starts, then back to the top. */
async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.5);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    window.scrollTo(0, 0);
  });
  await wait(1200);
}

/** Every text a visitor can meet on the page right now: what's on screen plus what screen readers and tooltips say. */
function pageWords(page) {
  return page.evaluate(() => {
    const attributes = [...document.querySelectorAll("[aria-label], [title], [alt], [placeholder]")]
      .flatMap((el) => ["aria-label", "title", "alt", "placeholder"].map((name) => el.getAttribute(name)).filter(Boolean));
    return [document.title, document.body.innerText, ...attributes].join("\n");
  });
}

/**
 * The English texts that must not show on the German page: every English text whose German twin (same place in
 * content.de.js) is different. One that also appears inside some German text (like "AI" in "Global AI
 * Hackathon") is left out, because it's allowed there.
 */
function englishOnly() {
  const pairs = [];
  const walk = (en, de) => {
    if (typeof en === "string") {
      if (typeof de === "string" && en !== de && en.trim().length > 1) pairs.push(en);
    } else if (en && typeof en === "object" && de && typeof de === "object") {
      for (const key of Object.keys(en)) walk(en[key], de[key]);
    }
  };
  walk(english, german);
  const germanTexts = [];
  const collect = (value) => {
    if (typeof value === "string") germanTexts.push(value);
    else if (value && typeof value === "object") Object.values(value).forEach(collect);
  };
  collect(german);
  // texts with {name} parts are checked by their fixed words before the first {
  return [...new Set(pairs)]
    .map((text) => text.split("{")[0].trim())
    .filter((text) => text.length > 1 && !germanTexts.some((de) => de.includes(text)) && !ALLOWED_ON_GERMAN_PAGE.includes(text));
}

/** True if a text appears in the page's words as whole words ("Copy" must not match "Copyright"). */
function containsWords(words, text) {
  const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^\\p{L}])${escaped}($|[^\\p{L}])`, "u").test(words);
}

const { problems: contentProblems, notes: contentNotes } = compareContent();
const problems = [...contentProblems.map((problem) => `[content.de.js] ${problem}`)];

const server = await preview({ preview: { port: 4327, strictPort: true } });
const url = "http://localhost:4327/";
await mkdir("screenshots", { recursive: true });
// --lang=en-US: this test browser is an English one on any computer (German browsers are tried on their own below)
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--use-angle=swiftshader", "--lang=en-US"] });

try {
  for (const run of RUNS) {
    const words = CONTENT[run.lang];
    const page = await browser.newPage();
    await page.setViewport({ width: run.width, height: run.height, isMobile: run.mobile, hasTouch: run.mobile });
    page.on("pageerror", (error) => problems.push(`[${run.name}] page error: ${error.message}`));
    page.on("console", (message) => {
      if (message.type() === "error") problems.push(`[${run.name}] console: ${message.text()}`);
    });
    // the site always opens in light, even when the system is set to dark; the dark runs use the switch
    await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "dark" }]);
    await page.goto(run.lang === "de" ? `${url}?lang=de` : url, { waitUntil: "networkidle0" });
    const opened = await page.evaluate(() => document.documentElement.dataset.theme);
    if (opened !== "light") problems.push(`[${run.name}] opened in ${opened}, not light`);
    const lang = await page.evaluate(() => document.documentElement.lang);
    if (lang !== run.lang) problems.push(`[${run.name}] the page says lang="${lang}", not "${run.lang}"`);
    if (run.theme === "dark") await page.click(".toggle");
    await wait(3000); // the hero's entrance and the shapes falling
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    if (theme !== run.theme) problems.push(`[${run.name}] theme is ${theme}`);
    await page.screenshot({ path: `screenshots/${run.name}-0-first-screen.png` });
    await scrollThrough(page);

    for (const [i, id] of SECTIONS.entries()) {
      const section = await page.$(`#${id}`);
      if (!section) {
        // Moments is hidden for now (App.jsx), so it's only missing, not broken
        if (id !== "moments") problems.push(`[${run.name}] missing section #${id}`);
        continue;
      }
      await section.scrollIntoView();
      await wait(800);
      // pinned sections are taller than the screen: a shot of what's on screen tells more
      if (id === "journey" || id === "work") await page.screenshot({ path: `screenshots/${run.name}-${i + 1}-${id}.png` });
      else await section.screenshot({ path: `screenshots/${run.name}-${i + 1}-${id}.png` });
    }

    // the skill filter: "AI" ("KI" in German) leaves only the AI tiles
    const aiLabel = words.filters.find(({ id }) => id === "ai").label;
    await (await page.$("#skills")).scrollIntoView();
    await page.evaluate((label) => [...document.querySelectorAll(".chip")].find((chip) => chip.textContent.trim() === label).click(), aiLabel);
    await wait(1000);
    const tiles = await page.$$eval(".tile:not(.is-hidden)", (nodes) => nodes.map((node) => node.className));
    if (!tiles.length || tiles.some((name) => !name.includes("tile--ai"))) problems.push(`[${run.name}] skill filter: ${tiles.length} tiles, not only AI`);

    // the interview: ask a question, wait for the answer to stream in
    await page.evaluate(() => document.querySelector(".question").click());
    await wait(4500);
    const lastAnswer = await page.$$eval(".msg--me p", (nodes) => nodes.at(-1)?.textContent ?? "");
    if (!lastAnswer.includes(FIRST_ANSWER[run.lang])) problems.push(`[${run.name}] interview: no answer (${lastAnswer.slice(0, 40)})`);
    await (await page.$("#interview")).scrollIntoView();
    await wait(500);
    await page.screenshot({ path: `screenshots/${run.name}-9-interview-used.png` });

    // a case study: open it, look, close it with Escape
    await page.evaluate(() => document.querySelector(".poster__open").click());
    await wait(1200);
    if (!(await page.$(".case"))) problems.push(`[${run.name}] case study didn't open`);
    else {
      await page.screenshot({ path: `screenshots/${run.name}-10-case-study.png` });
      await page.keyboard.press("Escape");
      await wait(900);
      if (await page.$(".case")) problems.push(`[${run.name}] case study didn't close`);
    }

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 1) problems.push(`[${run.name}] page is ${overflow}px wider than the screen`);
    await page.close();
  }

  // the theme switch button: light -> dark for this visit, and the next visit opens in light again
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.click(".toggle");
  await wait(1200);
  const switched = await page.evaluate(() => document.documentElement.dataset.theme);
  if (switched !== "dark") problems.push(`theme switch: ${switched}`);
  await page.reload({ waitUntil: "networkidle0" });
  const reopened = await page.evaluate(() => document.documentElement.dataset.theme);
  if (reopened !== "light") problems.push(`after a reload the site opened in ${reopened}, not light`);
  await page.close();

  // the language switch in the top bar: EN -> DE -> EN without a reload, and ?lang=de keeps it for a reload
  const lang = await browser.newPage();
  await lang.setViewport({ width: 1440, height: 900 });
  lang.on("pageerror", (error) => problems.push(`[language switch] page error: ${error.message}`));
  await lang.goto(url, { waitUntil: "networkidle0" });
  await wait(2500);
  const state = () => lang.evaluate(() => ({
    lang: document.documentElement.lang, search: location.search, title: document.title,
    intro: document.querySelector(".hero__intro").textContent,
  }));
  await lang.click('.nav__lang button[lang="de"]');
  await wait(800);
  let now = await state();
  if (now.lang !== "de" || now.search !== "?lang=de" || now.intro !== german.hero.intro || now.title !== german.ui.pageTitle) {
    problems.push(`[language switch] to German: ${JSON.stringify(now).slice(0, 160)}`);
  }
  // after a switch every part must still show once it scrolls in (nothing stuck invisible)
  await scrollThrough(lang);
  await lang.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await wait(1500);
  const stuck = await lang.$$eval("[data-reveal]", (nodes) => nodes.filter((node) => getComputedStyle(node).opacity === "0").length);
  if (stuck) problems.push(`[language switch] ${stuck} parts stayed invisible after switching to German`);
  await lang.reload({ waitUntil: "networkidle0" });
  now = await state();
  if (now.lang !== "de") problems.push(`[language switch] a reload with ?lang=de opened in ${now.lang}`);
  await lang.evaluate(() => window.scrollTo(0, 0));
  await wait(600);
  await lang.click('.nav__lang button[lang="en"]');
  await wait(800);
  now = await state();
  if (now.lang !== "en" || now.search !== "" || now.intro !== english.hero.intro || now.title !== english.ui.pageTitle) {
    problems.push(`[language switch] back to English: ${JSON.stringify(now).slice(0, 160)}`);
  }
  await lang.close();

  // on a small phone the switch is in the menu
  const phone = await browser.newPage();
  await phone.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await phone.goto(url, { waitUntil: "networkidle0" });
  await wait(1500);
  await phone.click(".nav__menu");
  await wait(700);
  // the menu must cover the screen under the bar (it was squeezed into the bar until 17 Nov, see Nav.jsx)
  const sheet = await phone.evaluate(() => ({ height: document.querySelector(".nav__sheet").getBoundingClientRect().height, screen: innerHeight }));
  if (sheet.height < sheet.screen - 100) problems.push(`[phone menu] the menu is ${Math.round(sheet.height)}px tall, not the whole screen`);
  await phone.screenshot({ path: "screenshots/phone-menu-language.png" });
  await phone.click('.nav__sheet-lang button[lang="de"]');
  await wait(700);
  const phoneLang = await phone.evaluate(() => document.documentElement.lang);
  if (phoneLang !== "de") problems.push(`[phone menu] the language switch in the menu gave lang="${phoneLang}"`);
  await phone.screenshot({ path: "screenshots/phone-menu-language-de.png" });
  await phone.close();

  // a browser set to German opens the site in German without ?lang=; picking English then sticks for a reload
  // (?lang=en), and picking German again cleans the address. A browser that lists English before German stays
  // English. (The browser's languages are faked before the page loads, as a German visitor's would be.)
  for (const [languages, expected] of [[["de-DE", "de", "en-US", "en"], "de"], [["en-US", "en", "de-DE", "de"], "en"]]) {
    const who = `[browser ${languages[0]}]`;
    const visitor = await browser.newPage();
    await visitor.setViewport({ width: 1440, height: 900 });
    await visitor.evaluateOnNewDocument((list) => {
      Object.defineProperty(navigator, "languages", { get: () => list });
      Object.defineProperty(navigator, "language", { get: () => list[0] });
    }, languages);
    visitor.on("pageerror", (error) => problems.push(`${who} page error: ${error.message}`));
    const read = () => visitor.evaluate(() => ({ lang: document.documentElement.lang, search: location.search,
      title: document.title, intro: document.querySelector(".hero__intro").textContent }));
    await visitor.goto(url, { waitUntil: "networkidle0" });
    await wait(1500);
    let seen = await read();
    if (seen.lang !== expected || seen.intro !== CONTENT[expected].hero.intro || seen.title !== CONTENT[expected].ui.pageTitle) {
      problems.push(`${who} opened in ${seen.lang} ("${seen.intro.slice(0, 30)}..."), expected ${expected}`);
    }
    if (expected === "de") {
      await visitor.click('.nav__lang button[lang="en"]');
      await wait(800);
      seen = await read();
      if (seen.lang !== "en" || seen.search !== "?lang=en") problems.push(`${who} picking English gave ${JSON.stringify(seen).slice(0, 120)}`);
      await visitor.reload({ waitUntil: "networkidle0" });
      await wait(1000);
      seen = await read();
      if (seen.lang !== "en" || seen.intro !== english.hero.intro) problems.push(`${who} after picking English, a reload opened in ${seen.lang}`);
      await visitor.evaluate(() => window.scrollTo(0, 0));
      await wait(400);
      await visitor.click('.nav__lang button[lang="de"]');
      await wait(800);
      seen = await read();
      if (seen.lang !== "de" || seen.search !== "" || seen.intro !== german.hero.intro) {
        problems.push(`${who} back to German gave ${JSON.stringify(seen).slice(0, 120)}`);
      }
    }
    await visitor.close();
  }

  // the top bar fits at every width, in both languages: no overflow, the name on one line, links clear of the buttons
  for (const code of ["en", "de"]) {
    for (const width of [360, 390, 600, 768, 901, 960, 1024, 1041, 1100, 1180, 1280]) {
      const bar = await browser.newPage();
      await bar.setViewport({ width, height: 800, isMobile: width < 700, hasTouch: width < 700 });
      await bar.goto(code === "de" ? `${url}?lang=de` : url, { waitUntil: "networkidle0" });
      await wait(300);
      const fit = await bar.evaluate(() => {
        const box = (selector) => {
          const r = document.querySelector(selector)?.getBoundingClientRect();
          return r && r.width ? r : null;
        };
        const inner = document.querySelector(".nav__inner");
        const links = box(".nav__links");
        const end = box(".nav__end");
        return { overflow: inner.scrollWidth - inner.clientWidth, brand: box(".nav__brand").height,
          clash: Boolean(links && end && links.right > end.left) };
      });
      if (fit.overflow > 0 || fit.clash || fit.brand > 40) problems.push(`[top bar ${code} ${width}px] ${JSON.stringify(fit)}`);
      await bar.close();
    }
  }

  // visitors who turned animations off: everything visible straight away
  const calm = await browser.newPage();
  await calm.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await calm.setViewport({ width: 1440, height: 900 });
  calm.on("pageerror", (error) => problems.push(`[reduced motion] page error: ${error.message}`));
  await calm.goto(url, { waitUntil: "networkidle0" });
  await wait(1500);
  const hidden = await calm.$$eval("[data-reveal]", (nodes) => nodes.filter((node) => getComputedStyle(node).opacity === "0").length);
  if (hidden) problems.push(`[reduced motion] ${hidden} parts stay hidden`);
  await calm.screenshot({ path: "screenshots/reduced-motion-full.png", fullPage: true });
  await calm.close();

  // the German page has no English left on it: everything on the page, every interview answer and every case
  // study (reduced motion, so the answers appear at once)
  const scan = await browser.newPage();
  await scan.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await scan.setViewport({ width: 1440, height: 900 });
  scan.on("pageerror", (error) => problems.push(`[German scan] page error: ${error.message}`));
  await scan.goto(`${url}?lang=de`, { waitUntil: "networkidle0" });
  await wait(1000);
  const seen = [await pageWords(scan)];
  for (let i = 0; i < german.interview.length; i += 1) {
    await scan.evaluate((n) => document.querySelectorAll(".question")[n].click(), i);
    await wait(150);
  }
  seen.push(await pageWords(scan));
  for (let i = 0; i < german.projects.length; i += 1) {
    await scan.evaluate((n) => document.querySelectorAll(".poster__open")[n].click(), i);
    await wait(400);
    seen.push(await pageWords(scan));
    await scan.keyboard.press("Escape");
    await wait(400);
  }
  await scan.close();
  const germanPage = seen.join("\n");
  const leftovers = englishOnly().filter((text) => containsWords(germanPage, text));
  leftovers.forEach((text) => problems.push(`[German scan] English text on the German page: "${text.slice(0, 80)}"`));
} finally {
  await browser.close();
  server.httpServer.close();
}

if (contentNotes.length) console.log(`(${contentNotes.length} names are the same in English and German, as meant: node scripts/german-check.mjs lists them)`);
if (problems.length) {
  console.log(`${problems.length} problem(s):\n- ${problems.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log("all good: English and German, both themes, laptop and phone, filter, interview, case study, theme " +
    "and language switch, German browsers get German, top bar at every width, reduced motion, no English left " +
    "on the German page. " +
    "Screenshots in screenshots/");
}
