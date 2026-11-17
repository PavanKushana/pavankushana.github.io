// german-check.mjs: compares src/content.js (English) with src/content.de.js (German), so the two can't drift
// apart without anyone noticing. check.mjs runs it first; it can also run on its own:
//
//   node scripts/german-check.mjs
//
// What it checks:
// - both files export the same things, with the same keys and lists of the same length
// - data stays the same in both: links, photo files, ids, shapes, fields, coordinates and so on
// - German texts have no long dashes (Pavan's rule: single hyphens only)
// It also lists English sentences that are word for word the same in the German file (maybe not translated
// yet), but only as a note: names like "Lifeguard-Agent" or "AWS" are meant to stay the same.
import * as english from "../src/content.js";
import * as german from "../src/content.de.js";

// keys whose texts are data, not words: they must be exactly the same in both languages (numbers and
// true/false are always data, see compare())
const DATA_KEYS = new Set([
  "id", "href", "src", "shape", "field", "fields", "place", "photo", "value",
  "email", "github", "githubHandle", "linkedin", "linkedinHandle", "cv", "timeZone", "firstName",
]);

/** Walks both values side by side and collects problems and notes. where: the path, like "projects[0].links[1]". */
function compare(en, de, where, key, problems, notes) {
  if (Array.isArray(en)) {
    if (!Array.isArray(de)) return problems.push(`${where}: a list in English, not in German`);
    if (en.length !== de.length) problems.push(`${where}: ${en.length} items in English, ${de.length} in German`);
    en.forEach((item, i) => i < de.length && compare(item, de[i], `${where}[${i}]`, key, problems, notes));
    return;
  }
  if (en && typeof en === "object") {
    if (!de || typeof de !== "object") return problems.push(`${where}: missing in German`);
    for (const k of Object.keys(en)) {
      if (!(k in de)) problems.push(`${where}.${k}: missing in German`);
      else compare(en[k], de[k], `${where}.${k}`, k, problems, notes);
    }
    for (const k of Object.keys(de)) if (!(k in en)) problems.push(`${where}.${k}: only in German`);
    return;
  }
  if (typeof en !== typeof de) return problems.push(`${where}: a ${typeof en} in English, a ${typeof de} in German`);
  const isData = typeof en !== "string" || DATA_KEYS.has(key) || where === "person.name";
  if (isData) {
    if (en !== de) problems.push(`${where}: "${de}" in German, but "${en}" in English (data must be the same)`);
    return;
  }
  if (typeof de === "string") {
    if (/[–—]/.test(de)) problems.push(`${where}: long dash in the German text (use a single hyphen)`);
    // the same full sentence in both: maybe forgotten. Short names and technical terms are fine.
    if (en === de && en.split(" ").length >= 4) notes.push(`${where}: same in both languages: "${en}"`);
  }
}

/** Compares every export. Returns { problems, notes }. */
export function compareContent() {
  const problems = [];
  const notes = [];
  for (const name of Object.keys(english)) {
    if (!(name in german)) problems.push(`${name}: not in content.de.js`);
    else compare(english[name], german[name], name, name, problems, notes);
  }
  for (const name of Object.keys(german)) if (!(name in english)) problems.push(`${name}: only in content.de.js`);
  return { problems, notes };
}

// run on its own: print the result
if (import.meta.url === `file:///${process.argv[1].replaceAll("\\", "/").replace(/^\//, "")}`) {
  const { problems, notes } = compareContent();
  notes.forEach((note) => console.log(`note: ${note}`));
  if (problems.length) {
    console.log(`${problems.length} problem(s) between content.js and content.de.js:\n- ${problems.join("\n- ")}`);
    process.exitCode = 1;
  } else {
    console.log("content.js and content.de.js match: same layout, same links and data, no long dashes.");
  }
}
