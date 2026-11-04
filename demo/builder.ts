// The builder page: choose an icon or a month, see it, copy the code. Every choice is kept in the address, so a link opens the same setup.
import { createAddressState } from "@johnmorrisdotca/kazoku-ui/address-state";
import "@johnmorrisdotca/kazoku-ui/embed-panel/define";
import type { EmbedChangeDetail, EmbedPanelElement } from "@johnmorrisdotca/kazoku-ui/embed-panel/element";
import { CALENDAR_PRESETS, CALENDAR_THEME_LABELS, CALENDAR_THEMES, calendarIcon, calendarPresetOf } from "../src/index.ts";
import type { CalendarIconOptions, CalendarTheme } from "../src/index.ts";
import { MONTH_DESIGN_LABELS, MONTH_DESIGNS, monthCalendar } from "../src/month.ts";
import { PRESET_NAMES, WORDS, type Lang } from "../scripts/words.ts";
import { embedCode, fileCode, frameCode, iconDraw, iconQuery, monthDraw, monthQuery, frameAddress, type Draw, type IconChoice, type MonthChoice } from "./embed-code.ts";

const lang: Lang = document.documentElement.lang === "ja" ? "ja" : "en";
const say = WORDS[lang];
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const address = createAddressState({
  delay: 0,
  defaults: { what: "icon", theme: "squircle", scheme: "light", preset: "flat", rings: "0", housing: "square", turn: "0", size: "160", locale: lang, design: "poster", week: "sunday", notes: "1", format: "module" },
});
const get = (key: string): string => address.get(key) ?? "";
const is = (key: string, ...values: string[]) => values.includes(get(key));
const today = new Date();
const date = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
const turns = [0, -8, 8, -15];
const root = lang === "ja" ? "../" : "";
const panel = $<EmbedPanelElement>("embed-panel");
const ICON_KINDS = ["module", "alone", "file", "html", "react", "vue", "angular", "svelte", "iframe"];
const MONTH_KINDS = ["module", "file", "html", "react", "vue", "angular", "svelte", "iframe"];

type Pairs = ReadonlyArray<readonly [string, string]>;
interface Control { key: string; label: string; items: Pairs; when?: () => boolean; set?: (value: string) => void }

const iconControls: Control[] = [
  { key: "theme", label: say.design, items: CALENDAR_THEMES.map((t) => [t, CALENDAR_THEME_LABELS[t][lang]] as const) },
  { key: "scheme", label: say.builderScheme, items: [["light", say.light], ["dark", say.dark]] },
  { key: "preset", label: say.preset, items: Object.keys(CALENDAR_PRESETS).map((name) => [name, PRESET_NAMES[name]![lang]] as const), set: (name) => {
    const p = CALENDAR_PRESETS[calendarPresetOf(name)!] as { housing?: string; rings?: boolean; turn?: number };
    address.setMany({ preset: name, housing: p.housing ?? "square", rings: p.rings ? "1" : "0", turn: String(p.turn ?? 0) });
  } },
  { key: "housing", label: say.housing, items: [["square", say.square], ["circle", say.circle]] },
  { key: "rings", label: say.rings, items: [["0", say.off], ["1", say.on]] },
  { key: "turn", label: say.turn, items: turns.map((t) => [String(t), t === 0 ? "0°" : `${t > 0 ? "+" : "−"}${Math.abs(t)}°`] as const) },
  { key: "locale", label: say.builderLanguage, items: [["en", say.langEn], ["ja", say.langJa]] },
];
const monthControls: Control[] = [
  { key: "design", label: say.design, items: MONTH_DESIGNS.map((d) => [d, MONTH_DESIGN_LABELS[d][lang]] as const) },
  { key: "scheme", label: say.builderScheme, items: [["light", say.light], ["dark", say.dark]] },
  { key: "week", label: say.weekStart, items: [["sunday", say.sunday], ["monday", say.monday]] },
  { key: "locale", label: say.builderLanguage, items: [["en", say.langEn], ["ja", say.langJa]] },
  { key: "notes", label: say.notes, items: [["0", say.off], ["1", say.on]] },
];

function drawChoices(): void {
  const list = is("what", "month") ? monthControls : iconControls;
  $("controls").replaceChildren(...list.map((control) => {
    const row = document.createElement("div");
    row.className = "fam-row";
    const label = document.createElement("span");
    label.className = "fam-label";
    label.textContent = control.label;
    const group = document.createElement("span");
    group.className = "fam-seg";
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", control.label);
    group.dataset.key = control.key;
    group.replaceChildren(...control.items.map(([value, text]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.value = value;
      button.textContent = text;
      button.setAttribute("aria-pressed", String(get(control.key) === value));
      button.addEventListener("click", () => (control.set ? control.set(value) : address.set(control.key, value)));
      return button;
    }));
    row.append(label, group);
    return row;
  }));
}
function drawWhat(): void {
  const host = $("seg-what");
  host.replaceChildren(...([["icon", say.builderIcon], ["month", say.builderMonth]] as const).map(([value, text]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.value = value;
    button.textContent = text;
    button.setAttribute("aria-pressed", String(get("what") === value));
    button.addEventListener("click", () => address.set("what", value));
    return button;
  }));
}
const scheme = (): "light" | "dark" => (get("scheme") === "dark" ? "dark" : "light");
const theme = (): CalendarTheme => ((CALENDAR_THEMES as readonly string[]).includes(get("theme")) ? (get("theme") as CalendarTheme) : "squircle");
function iconOptions(): CalendarIconOptions {
  const options: CalendarIconOptions = { theme: theme(), ...date, scheme: scheme(), size: Number(get("size")) || 160 };
  if (get("locale") === "ja") options.locale = "ja";
  if (get("housing") === "circle") options.housing = "circle";
  if (get("rings") === "1") options.rings = true;
  const turn = Number(get("turn"));
  if (turns.includes(turn) && turn !== 0) options.turn = turn;
  return options;
}
const monthNotes = (): Record<string, string> => {
  const notes: Record<string, string> = {};
  if (get("notes") !== "0") for (const [day, text] of Object.entries(say.sampleNotes)) notes[`${String(date.month).padStart(2, "0")}-${day}`] = text;
  return notes;
};

function drawStage(): void {
  $("stage").innerHTML = is("what", "month")
    ? monthCalendar({ year: date.year, month: date.month, design: get("design") as never, weekStart: get("week") === "monday" ? "monday" : "sunday", locale: get("locale"), scheme: scheme(), size: 320, notes: monthNotes() })
    : calendarIcon(iconOptions());
}

const iconChoice = (): IconChoice => {
  const o = iconOptions();
  return { theme: theme(), ...date, scheme: scheme(), size: o.size ?? 160, ...(o.locale ? { locale: "ja" as const } : {}), ...(o.housing ? { housing: "circle" as const } : {}), ...(o.rings ? { rings: true } : {}), ...(o.turn ? { turn: o.turn } : {}) };
};
const monthChoice = (): MonthChoice => ({
  year: date.year,
  month: date.month,
  design: get("design"),
  scheme: scheme(),
  ...(get("locale") === "ja" ? { locale: "ja" as const } : {}),
  ...(get("week") === "monday" ? { monday: true } : {}),
  ...(get("notes") !== "0" ? { note: { key: `${String(date.month).padStart(2, "0")}-07`, text: "Dentist 14:00" } } : {}),
});
const draw = (): Draw => (is("what", "month") ? monthDraw(monthChoice()) : iconDraw(iconChoice(), false));

panel.docsHref = lang === "ja" ? "../docs/ja/index.html" : "docs/index.html";
panel.labels = { module: say.fmtModule, alone: say.fmtAlone, file: say.fmtFile };
panel.generate = ({ kind, size, preview }) => {
  if (kind === "iframe") return frameCode(is("what", "month") ? monthQuery(monthChoice()) : iconQuery(iconChoice(), false), say.title, size, preview, root);
  if (kind === "file") return fileCode(is("what", "month") ? monthDraw(monthChoice()) : iconDraw(iconChoice(), false));
  if (kind === "alone") return embedCode("module", iconDraw(iconChoice(), true)) ?? "";
  return embedCode(kind, draw()) ?? "";
};
panel.preview = ({ kind }) => {
  if (kind === "iframe") return undefined;
  const box = document.createElement("div");
  box.style.cssText = `width: ${is("what", "month") ? 320 : panel.size}px; line-height: 0`;
  box.innerHTML = is("what", "month") ? monthCalendar({ year: date.year, month: date.month, design: get("design") as never, weekStart: get("week") === "monday" ? "monday" : "sunday", locale: get("locale"), scheme: scheme(), size: 320, notes: monthNotes() }) : calendarIcon({ ...iconOptions(), size: panel.size });
  box.querySelector("svg")?.setAttribute("style", "display: block; width: 100%; height: auto");
  return box;
};
panel.credits = say.credit;
panel.note = ({ kind }) => (kind === "iframe" && is("what", "month") && get("notes") !== "0" ? say.frameNoNotes : "");
panel.addEventListener("kazoku-embedchange", (event) => {
  const { kind, size, reason } = (event as CustomEvent<EmbedChangeDetail>).detail;
  if (reason === "init") return;
  address.setMany({ format: kind, size: String(size) });
});

function drawPanel(): void {
  const month = is("what", "month");
  const kinds = month ? MONTH_KINDS : ICON_KINDS;
  if (panel.kinds.join(" ") !== kinds.join(" ")) panel.kinds = kinds;
  panel.toggleAttribute("no-size", month);
  const format = kinds.includes(get("format")) ? get("format") : "module";
  if (panel.kind !== format) panel.kind = format;
  if (!month && panel.size !== Number(get("size"))) panel.size = Number(get("size"));
  panel.openHref = frameAddress(root, month ? monthQuery(monthChoice()) : iconQuery(iconChoice(), false));
  panel.update();
}

function everything(): void {
  drawWhat();
  drawChoices();
  drawStage();
  drawPanel();
}
address.subscribe(() => everything());
everything();
