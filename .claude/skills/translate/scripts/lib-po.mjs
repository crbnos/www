// Shared .po parsing helpers for the /translate skill.
// A .po entry is: optional comment lines (#...), a msgid (one or more quoted
// lines), then a msgstr (one or more quoted lines). Values are the quoted
// segments concatenated, with PO escape sequences decoded.

const UNESCAPE = { '"': '"', "\\": "\\", n: "\n", t: "\t", r: "\r" };

export function unescapePo(s) {
  return s.replace(/\\(["\\ntr])/g, (_m, c) => UNESCAPE[c]);
}

export function escapePo(s) {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\t/g, "\\t")
    .replace(/\r/g, "\\r");
}

function stripQuotes(q) {
  const m = q.match(/^"([\s\S]*)"$/);
  return m ? m[1] : "";
}

// Parse into { lines, entries }. Each entry: { comments[], msgid, msgstr,
// msgstrLineIndex, msgstrLineCount }. Line indices point into `lines` so a
// caller can rewrite a msgstr in place and re-join.
export function parsePo(text) {
  const lines = text.split("\n");
  const entries = [];
  let i = 0;
  while (i < lines.length) {
    const comments = [];
    while (i < lines.length && lines[i].startsWith("#")) comments.push(lines[i++]);
    if (i >= lines.length) break;
    if (!lines[i].startsWith("msgid ")) {
      i++;
      continue;
    }
    const msgidQ = [lines[i].slice("msgid ".length)];
    i++;
    while (i < lines.length && lines[i].startsWith('"')) msgidQ.push(lines[i++]);
    if (i >= lines.length || !lines[i].startsWith("msgstr ")) continue;
    const msgstrLineIndex = i;
    const msgstrQ = [lines[i].slice("msgstr ".length)];
    i++;
    while (i < lines.length && lines[i].startsWith('"')) msgstrQ.push(lines[i++]);
    entries.push({
      comments,
      msgid: msgidQ.map((q) => unescapePo(stripQuotes(q))).join(""),
      msgstr: msgstrQ.map((q) => unescapePo(stripQuotes(q))).join(""),
      msgstrLineIndex,
      msgstrLineCount: msgstrQ.length,
    });
  }
  return { lines, entries };
}

// English display names for every locale this site ships (see lingui.config.js
// `locales` and app/lib/locale.ts `supportedLanguages`). Used to tell the
// translator subagent which language to produce. `nl` is present as a catalog
// on disk even though it's not in the runtime supportedLanguages list.
export const LANGUAGE_LABELS = {
  en: "English",
  es: "Spanish",
  de: "German",
  fr: "French",
  it: "Italian",
  ja: "Japanese",
  zh: "Chinese (Simplified)",
  pl: "Polish",
  pt: "Portuguese",
  ru: "Russian",
  hi: "Hindi",
  tr: "Turkish",
  ko: "Korean",
  nl: "Dutch",
};

// Discover locale codes straight from disk — every locales/<code>/www.po is a
// target so no shipped catalog is left half-filled. Keeps the skill in sync
// with whatever `lingui extract` produced without a second source of truth.
export function readLocaleConfig(localesDir, { readdirSync, existsSync }) {
  const codes = readdirSync(localesDir).filter((d) =>
    existsSync(`${localesDir}/${d}/www.po`),
  );
  return { codes, labels: LANGUAGE_LABELS };
}
