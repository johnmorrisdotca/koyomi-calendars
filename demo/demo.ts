// The demo page: a stage where the page turns, the 18 designs, the code to copy, and the month pages. Every choice is kept in the address.
import { createAddressState } from "@johnmorrisdotca/kazoku-ui/address-state";
import { CALENDAR_FLIP_LABELS, CALENDAR_FLIPS, flipCalendar, nextDay, previousDay } from "../src/animate.ts";
import type { CalendarFlip, FlipDate } from "../src/animate.ts";
import { CALENDAR_PRESETS, CALENDAR_THEME_LABELS, CALENDAR_THEMES, calendarIcon, calendarPresetOf } from "../src/index.ts";
import type { CalendarIconOptions, CalendarTheme } from "../src/index.ts";
import { MONTH_DESIGN_LABELS, MONTH_DESIGNS, monthCalendar } from "../src/month.ts";
import { PRESET_NAMES, WORDS, type Lang } from "../scripts/words.ts";

const lang: Lang = document.documentElement.lang === "ja" ? "ja" : "en";
const say = WORDS[lang];
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const two = (n: number) => String(n).padStart(2, "0");
const iso = (d: FlipDate) => `${String(d.year).padStart(4, "0")}-${two(d.month)}-${two(d.day)}`;
function parse(text: string | null): FlipDate | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text ?? "");
  if (!m) return null;
  const d = { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };
  const real = new Date(Date.UTC(2000, d.month - 1, d.day));
  real.setUTCFullYear(d.year);
  return real.getUTCMonth() === d.month - 1 && real.getUTCDate() === d.day && d.year >= 1 ? d : null;
}
const today = (): FlipDate => {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
};

const address = createAddressState({ delay: 0, defaults: { theme: "squircle", flip: "tear-down", housing: "square", rings: "0", turn: "0", week: "sunday", notes: "1" } });
let shown: FlipDate = parse(address.get("date")) ?? today();
const scheme = (): "light" | "dark" => {
  const forced = document.documentElement.dataset.theme;
  return forced === "dark" || forced === "light" ? forced : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};
const theme = (): CalendarTheme => (CALENDAR_THEMES as readonly string[]).includes(address.get("theme") ?? "") ? (address.get("theme") as CalendarTheme) : "squircle";
const flip = (): CalendarFlip => ((CALENDAR_FLIPS as readonly string[]).includes(address.get("flip") ?? "") ? address.get("flip") : "tear-down") as CalendarFlip;
const turns = [0, -8, 8, -15];
const look = () => ({ housing: address.get("housing") === "circle" ? ("circle" as const) : undefined, rings: address.get("rings") === "1" ? true : undefined, turn: turns.includes(Number(address.get("turn"))) && Number(address.get("turn")) !== 0 ? Number(address.get("turn")) : undefined });

function options(d: FlipDate, t: CalendarTheme, extra: Partial<CalendarIconOptions> = {}): CalendarIconOptions {
  const l = look();
  const out: CalendarIconOptions = { theme: t, ...d, locale: lang, scheme: scheme(), size: 220, ...extra };
  if (l.housing) out.housing = l.housing;
  if (l.rings) out.rings = true;
  if (l.turn) out.turn = l.turn;
  return out;
}

// ----- the choices -----
function seg(id: string, items: ReadonlyArray<readonly [string, string]>, key: string): void {
  const host = $(id);
  host.replaceChildren(...items.map(([value, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.value = value;
    button.textContent = label;
    button.addEventListener("click", () => address.set(key, value));
    return button;
  }));
}
seg("seg-flip", CALENDAR_FLIPS.map((f) => [f, CALENDAR_FLIP_LABELS[f][lang]] as const), "flip");
seg("seg-housing", [["square", say.square], ["circle", say.circle]], "housing");
seg("seg-rings", [["0", say.off], ["1", say.on]], "rings");
seg("seg-turn", turns.map((t) => [String(t), t === 0 ? "0°" : `${t > 0 ? "+" : "−"}${Math.abs(t)}°`] as const), "turn");
seg("seg-week", [["sunday", say.sunday], ["monday", say.monday]], "week");
seg("seg-notes", [["0", say.off], ["1", say.on]], "notes");
const presetHost = $("seg-preset");
presetHost.replaceChildren(...Object.keys(CALENDAR_PRESETS).map((name) => {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.preset = name;
  button.textContent = PRESET_NAMES[name]![lang];
  button.addEventListener("click", () => {
    const p = CALENDAR_PRESETS[calendarPresetOf(name)!] as { housing?: string; rings?: boolean; turn?: number };
    address.setMany({ housing: p.housing ?? "square", rings: p.rings ? "1" : "0", turn: String(p.turn ?? 0) });
  });
  return button;
}));

function pressed(): void {
  const mark = (id: string, value: string) => $(id).querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.value === value)));
  mark("seg-flip", flip());
  mark("seg-housing", address.get("housing") ?? "square");
  mark("seg-rings", address.get("rings") ?? "0");
  mark("seg-turn", String(address.get("turn") ?? "0"));
  mark("seg-week", address.get("week") ?? "sunday");
  mark("seg-notes", address.get("notes") ?? "1");
  const l = look();
  presetHost.querySelectorAll("button").forEach((b) => {
    const p = CALENDAR_PRESETS[b.dataset.preset as keyof typeof CALENDAR_PRESETS] as { housing?: string; rings?: boolean; turn?: number };
    b.setAttribute("aria-pressed", String((p.housing ?? "square") === (l.housing ?? "square") && (p.rings ?? false) === (l.rings ?? false) && (p.turn ?? 0) === (l.turn ?? 0)));
  });
}

// ----- the stage -----
const stage = $("stage");
const dateField = $<HTMLInputElement>("date");
let busy: Promise<unknown> = Promise.resolve();
function drawStage(): void {
  stage.innerHTML = calendarIcon(options(shown, theme()));
  dateField.value = iso(shown);
}
function turnTo(to: FlipDate): void {
  const from = shown;
  shown = to;
  address.set("date", iso(to) === iso(today()) ? null : iso(to));
  dateField.value = iso(to);
  const t = theme();
  busy = flipCalendar(stage, { render: (d) => calendarIcon(options(d, t)), from, to, animation: flip(), motion: "auto" });
  void busy.then(() => { stage.dataset.shown = iso(shown); });
  drawCodes();
  drawGallery();
  drawMonths();
}
$("prev").addEventListener("click", () => turnTo(previousDay(shown)));
$("next").addEventListener("click", () => turnTo(nextDay(shown)));
dateField.addEventListener("change", () => {
  const d = parse(dateField.value);
  if (d) turnTo(d);
});

// ----- the gallery: every design, light and dark -----
function drawGallery(): void {
  const host = $("gallery");
  const active = theme();
  host.replaceChildren(...CALENDAR_THEMES.map((t) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tile";
    button.dataset.theme = t;
    button.setAttribute("aria-pressed", String(t === active));
    const half = (s: "light" | "dark") => `<span class="half ${s}">${calendarIcon(options(shown, t, { scheme: s, size: 80 }))}</span>`;
    button.innerHTML = `<span class="pair">${half("light")}${half("dark")}</span><span class="name">${CALENDAR_THEME_LABELS[t][lang]}</span>`;
    button.addEventListener("click", () => address.set("theme", t));
    return button;
  }));
}

// ----- the code to copy -----
function drawCodes(): void {
  const t = theme();
  const l = look();
  const extra = [l.housing ? `housing: "circle"` : "", l.rings ? "rings: true" : "", l.turn ? `turn: ${l.turn}` : ""].filter(Boolean);
  const args = [`month: ${shown.month}`, `day: ${shown.day}`, `year: ${shown.year}`, ...extra, `scheme: "${scheme()}"`].join(", ");
  $("code-draw").textContent = `import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars/themes/${t}";\n\nelement.innerHTML = calendarIcon({ ${args} });`;
  const to = nextDay(shown);
  $("code-turn").textContent = `import { flipCalendar, nextDay } from "@johnmorrisdotca/koyomi-calendars/animate";\nimport { calendarIcon } from "@johnmorrisdotca/koyomi-calendars/themes/${t}";\n\nconst from = { year: ${shown.year}, month: ${shown.month}, day: ${shown.day} };\nawait flipCalendar(element, {\n  render: (d) => calendarIcon({ ...d${extra.length ? `, ${extra.join(", ")}` : ""} }),\n  from,\n  to: nextDay(from), // ${iso(to)}\n  animation: "${flip()}",\n});`;
}
document.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const text = $(`code-${button.dataset.copy}`).textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = say.copied;
    } catch {
      const range = document.createRange();
      range.selectNodeContents($(`code-${button.dataset.copy}`));
      getSelection()?.removeAllRanges();
      getSelection()?.addRange(range);
      button.textContent = say.copied;
    }
    setTimeout(() => (button.textContent = say.copy), 1500);
  });
});

// ----- the month pages -----
function drawMonths(): void {
  const monday = address.get("week") === "monday";
  const withNotes = address.get("notes") !== "0";
  const notes: Record<string, string> = {};
  if (withNotes) for (const [day, text] of Object.entries(say.sampleNotes)) notes[`${two(shown.month)}-${day}`] = text;
  $("months").replaceChildren(...MONTH_DESIGNS.map((design) => {
    const figure = document.createElement("figure");
    figure.dataset.design = design;
    figure.innerHTML = `${monthCalendar({ year: shown.year, month: shown.month, design, weekStart: monday ? "monday" : "sunday", locale: lang, scheme: scheme(), size: 360, notes })}<figcaption>${MONTH_DESIGN_LABELS[design][lang]}</figcaption>`;
    return figure;
  }));
}

// ----- keep everything in step -----
function everything(): void {
  pressed();
  drawGallery();
  drawCodes();
  drawMonths();
}
address.subscribe(({ key }) => {
  if (key === "theme" || key === "housing" || key === "rings" || key === "turn") {
    drawStage();
  }
  if (key === "date") {
    const d = parse(address.get("date"));
    if (d && iso(d) !== iso(shown)) { shown = d; drawStage(); }
  }
  everything();
});
new MutationObserver(() => { drawStage(); everything(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { drawStage(); everything(); });
drawStage();
everything();
stage.dataset.shown = iso(shown);
