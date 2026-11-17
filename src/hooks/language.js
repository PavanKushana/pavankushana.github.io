// language.js: English and German. A visitor whose browser is set to German gets the German words
// (content.de.js), everyone else English (content.js); the EN/DE switch in the top bar (on small phones: in the
// menu) changes it without a reload. A choice is kept in the address (?lang=de or ?lang=en), so a reload or a
// shared link opens in the same language. Like the theme, nothing is saved in the browser. Pavan can send
// https://pavankushana.com/?lang=de to German readers whatever their browser says.
import { createContext, createElement, useCallback, useContext, useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as english from "../content";
import * as german from "../content.de";

const CONTENT = { en: english, de: german };

// true: a visitor whose browser is set to German gets German first (only when the address has no ?lang=).
// false: everyone gets English first. (The small script in index.html's <head> follows the browser the same
// way, to set <html lang> before the first paint; if this is ever set to false, take that part out there too.)
const FOLLOW_BROWSER = true;

/**
 * The language the browser asks for: the first of its languages that is German or English, so someone whose
 * list is "English, then German" gets English, and "German, then English" gets German. Anything else: English.
 */
function browserLanguage() {
  for (const code of navigator.languages || [navigator.language || ""]) {
    const name = String(code).toLowerCase();
    if (name === "de" || name.startsWith("de-")) return "de";
    if (name === "en" || name.startsWith("en-")) return "en";
  }
  return "en";
}

/** The language a visitor gets when the address doesn't say: the browser's (if on), else English. */
function defaultLanguage() {
  return FOLLOW_BROWSER ? browserLanguage() : "en";
}

/** Which language to open in: ?lang=de or ?lang=en in the address wins, then the default. */
function firstLanguage() {
  const asked = new URLSearchParams(window.location.search).get("lang");
  if (asked === "de" || asked === "en") return asked;
  return defaultLanguage();
}

/**
 * Writes a choice into the address, without a reload or a new history step: ?lang=de or ?lang=en, or nothing
 * when it's the visitor's default anyway (so most addresses stay clean). A German browser that picks English
 * gets ?lang=en, so a reload doesn't switch it back to German.
 */
function rememberInAddress(lang) {
  const url = new URL(window.location.href);
  if (lang === defaultLanguage()) url.searchParams.delete("lang");
  else url.searchParams.set("lang", lang);
  window.history.replaceState(window.history.state, "", url);
}

/** Puts {name} values into a text: fill("Hi, I'm {name}", { name: "Pavan" }) -> "Hi, I'm Pavan". */
export function fill(text, values) {
  return text.replace(/\{(\w+)\}/g, (whole, key) => (key in values ? String(values[key]) : whole));
}

/**
 * Parts that fade in on scroll start hidden (.js-motion [data-reveal] in global.css) and are shown by GSAP the
 * first time they scroll into view (App.jsx). If switching the language ever gives React a new element for one
 * of them, GSAP has never seen it and it would stay invisible: show those straight away. (Each list uses its
 * position as React key, so normally the same elements stay and only their words change.)
 */
function showUnseenParts() {
  document.querySelectorAll("[data-reveal]").forEach((element) => {
    if (element.style.opacity === "" && !element.classList.contains("is-in")) {
      element.classList.add("is-in");
      element.style.opacity = "1";
    }
  });
}

const LanguageContext = createContext(null);

/** Holds the language for the whole page. Wraps <App /> in main.jsx. */
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(firstLanguage);
  const [switched, setSwitched] = useState(false); // false until the visitor uses the switch

  /** Switches to "en" or "de". */
  const setLanguage = useCallback((next) => {
    if (next !== "en" && next !== "de") return;
    setSwitched(true);
    setLang(next);
    rememberInAddress(next);
  }, []);

  // after every change: tell the browser and screen readers the language, translate the tab title, and measure
  // the scroll animations again (German lines are longer, so the pinned sections change height)
  useEffect(() => {
    const { ui } = CONTENT[lang];
    document.documentElement.lang = lang;
    document.title = ui.pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", ui.pageDescription);
    if (!switched) return undefined;
    const frame = requestAnimationFrame(() => {
      showUnseenParts();
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(frame);
  }, [lang, switched]);

  return createElement(LanguageContext.Provider, { value: { lang, content: CONTENT[lang], setLanguage } }, children);
}

/** The words for the current language: the same names as content.js exports (hero, about, ui...). */
export function useContent() {
  return useContext(LanguageContext).content;
}

/** The current language ("en" or "de") and setLanguage("de") to switch. */
export function useLanguage() {
  const { lang, setLanguage } = useContext(LanguageContext);
  return { lang, setLanguage };
}
