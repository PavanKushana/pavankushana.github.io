// check.mjs: tests the built site in real Chrome, in both themes. It serves dist/, opens the page at a laptop
// size and a phone size, scrolls through it (so every scroll animation runs), saves screenshots of each
// section in screenshots/, tries the theme switch, the skill filter, the interview and a case study, checks
// that nothing is wider than the screen and that "reduce motion" shows everything, and fails on any error.
//
//   npm run build && npm run check
import { mkdir } from "node:fs/promises";
import { preview } from "vite";
import puppeteer from "puppeteer-core";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const SECTIONS = ["top", "about", "journey", "work", "skills", "interview", "moments", "contact"];
const RUNS = [
  { name: "desktop-light", width: 1440, height: 900, mobile: false, theme: "light" },
  { name: "desktop-dark", width: 1440, height: 900, mobile: false, theme: "dark" },
  { name: "phone-light", width: 390, height: 844, mobile: true, theme: "light" },
  { name: "phone-dark", width: 390, height: 844, mobile: true, theme: "dark" },
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

const server = await preview({ preview: { port: 4327, strictPort: true } });
const url = "http://localhost:4327/";
await mkdir("screenshots", { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--use-angle=swiftshader"] });
const problems = [];

try {
  for (const run of RUNS) {
    const page = await browser.newPage();
    await page.setViewport({ width: run.width, height: run.height, isMobile: run.mobile, hasTouch: run.mobile });
    page.on("pageerror", (error) => problems.push(`[${run.name}] page error: ${error.message}`));
    page.on("console", (message) => {
      if (message.type() === "error") problems.push(`[${run.name}] console: ${message.text()}`);
    });
    // the theme is chosen the way a returning visitor's would be: from localStorage, before the page loads
    await page.evaluateOnNewDocument((theme) => localStorage.setItem("theme", theme), run.theme);
    await page.goto(url, { waitUntil: "networkidle0" });
    await wait(3000); // the hero's entrance and the shapes falling
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    if (theme !== run.theme) problems.push(`[${run.name}] theme is ${theme}`);
    await page.screenshot({ path: `screenshots/${run.name}-0-first-screen.png` });
    await scrollThrough(page);

    for (const [i, id] of SECTIONS.entries()) {
      const section = await page.$(`#${id}`);
      if (!section) {
        problems.push(`[${run.name}] missing section #${id}`);
        continue;
      }
      await section.scrollIntoView();
      await wait(800);
      // pinned sections are taller than the screen: a shot of what's on screen tells more
      if (id === "journey" || id === "work") await page.screenshot({ path: `screenshots/${run.name}-${i + 1}-${id}.png` });
      else await section.screenshot({ path: `screenshots/${run.name}-${i + 1}-${id}.png` });
    }

    // the skill filter: "AI" leaves only the AI tiles
    await (await page.$("#skills")).scrollIntoView();
    await page.evaluate(() => [...document.querySelectorAll(".chip")].find((chip) => chip.textContent.trim() === "AI").click());
    await wait(1000);
    const tiles = await page.$$eval(".tile:not(.is-hidden)", (nodes) => nodes.map((node) => node.className));
    if (!tiles.length || tiles.some((name) => !name.includes("tile--ai"))) problems.push(`[${run.name}] skill filter: ${tiles.length} tiles, not only AI`);

    // the interview: ask a question, wait for the answer to stream in
    await page.evaluate(() => document.querySelector(".question").click());
    await wait(4500);
    const lastAnswer = await page.$$eval(".msg--me p", (nodes) => nodes.at(-1)?.textContent ?? "");
    if (!lastAnswer.includes("working student")) problems.push(`[${run.name}] interview: no answer (${lastAnswer.slice(0, 40)})`);
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

  // the theme switch button: light -> dark, and the choice is remembered
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluateOnNewDocument(() => localStorage.setItem("theme", "light"));
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.click(".toggle");
  await wait(1200);
  const after = await page.evaluate(() => [document.documentElement.dataset.theme, localStorage.getItem("theme")]);
  if (after.join() !== "dark,dark") problems.push(`theme switch: ${after.join()}`);
  await page.close();

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
} finally {
  await browser.close();
  server.httpServer.close();
}

if (problems.length) {
  console.log(`${problems.length} problem(s):\n- ${problems.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log("all good: both themes, laptop and phone, filter, interview, case study, theme switch, reduced motion. Screenshots in screenshots/");
}
