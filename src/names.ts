// The names of the themes: a list of words, no drawing. Importing this pulls in none of the drawings.

export const CALENDAR_THEMES = ["pins", "loops", "shadow", "heavy", "cartoon", "flip", "stack", "line", "curl", "soft", "desk", "thin", "frame", "badge", "sun", "roll", "plain", "squircle"] as const;

export type CalendarTheme = (typeof CALENDAR_THEMES)[number];
export const CALENDAR_THEME_LABELS: Record<CalendarTheme, { en: string; ja: string }> = {
  pins: { en: "Pins", ja: "ピン留め" },
  loops: { en: "Loops", ja: "リング綴じ" },
  shadow: { en: "Long shadow", ja: "長い影" },
  heavy: { en: "Heavy", ja: "極太" },
  cartoon: { en: "Cartoon", ja: "マンガ風" },
  flip: { en: "Flip", ja: "フリップ" },
  stack: { en: "Stack", ja: "重ね" },
  line: { en: "Line", ja: "線画" },
  curl: { en: "Curl", ja: "角めくれ" },
  soft: { en: "Soft", ja: "やわらか" },
  desk: { en: "Desk", ja: "月間パッド" },
  thin: { en: "Thin", ja: "細字" },
  frame: { en: "Frame", ja: "四色枠" },
  badge: { en: "Badge", ja: "バッジ" },
  sun: { en: "Sun disc", ja: "日の丸" },
  roll: { en: "Wall roll", ja: "壁掛け日めくり" },
  plain: { en: "Plain", ja: "無地" },
  squircle: { en: "Squircle", ja: "角丸タイル" },
};

/** The ten names of 0.12 and 0.13, still accepted: each reads as the theme that replaced it. */
export const CALENDAR_THEME_ALIASES: Readonly<Record<string, CalendarTheme>> = {
  classic: "pins",
  outline: "line",
  spiral: "loops",
  bold: "heavy",
  tent: "flip",
  curl: "curl",
  pad: "stack",
  minimal: "thin",
  fold: "frame",
  tile: "badge",
};

/** The year is never smaller than this share of the drawing's width (its font size), and keeps this share clear of the bottom of its zone. */
export const CALENDAR_YEAR_MIN = 0.07;
export const CALENDAR_YEAR_CLEAR = 0.03;

/** The named theme (or an older name for one), or null when the word is not one of ours. */
export function calendarThemeOf(name: string | null | undefined): CalendarTheme | null {
  const id = name?.trim().toLowerCase();
  if (!id) return null;
  if ((CALENDAR_THEMES as readonly string[]).includes(id)) return id as CalendarTheme;
  return Object.hasOwn(CALENDAR_THEME_ALIASES, id) ? CALENDAR_THEME_ALIASES[id]! : null;
}
