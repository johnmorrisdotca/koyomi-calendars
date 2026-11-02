// What this package holds the same way as every package of the family: the shared template, the README writer and the shared stylesheet.
// scripts/family-template.mjs is the family's file with ONE addition, this package's row in FAMILY and FAMILY_PITCH: until the family sweep adopts it
// everywhere, the hash below is of this copy. family-readme.mjs and family.css are byte for byte the family's.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";

interface Template {
  FAMILY: { id: string; name: string; kana: string }[];
  FAMILY_PITCH: Record<string, string>;
  FAMILY_NOT_ON_NPM: string[];
}
interface Writer {
  familyBlockOf(readme: string): string | null;
  familyReadmeBlock(id: string): string;
}
const template = (await import(new URL("../scripts/family-template.mjs", import.meta.url).href)) as Template;
const writer = (await import(new URL("../scripts/family-readme.mjs", import.meta.url).href)) as Writer;
const sha = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
const read = (path: string) => readFileSync(path, "utf8").replace(/\r\n/g, "\n");
const id = (JSON.parse(read("package.json")) as { name: string }).name.replace(/^@[^/]+\//, "");

test("the shared files are the ones recorded", () => {
  assert.equal(sha("scripts/family-template.mjs"), "9944c298ea76780697e5619d733f4a45bd09278331eefbc92b7d7c3e2a12f9b1");
  assert.equal(sha("scripts/family-readme.mjs"), "6752eaa287a9007af87d9019e4cee4c36fe1d79b60bf24478e7851ebe75138c4");
  const [first, ...rest] = read("demo/family.css").split("\n");
  assert.ok(first!.includes("cbbb1efab9ff5f56b07623c244c194f827e286cdc82def61abc0d13599a340b8"), "the stylesheet names its own hash");
  assert.equal(createHash("sha256").update(rest.join("\n")).digest("hex"), "cbbb1efab9ff5f56b07623c244c194f827e286cdc82def61abc0d13599a340b8");
});

test("this package is in the family, last, with its Japanese name and a line on it", () => {
  const own = template.FAMILY.at(-1)!;
  assert.deepEqual(own, { id, name: "Koyomi Calendars", kana: "暦" });
  assert.match(template.FAMILY_PITCH[id] ?? "", /^[^A-Z.].*[^.]$/);
  assert.ok(!template.FAMILY_NOT_ON_NPM.includes(id));
  assert.deepEqual(Object.keys(template.FAMILY_PITCH).sort(), template.FAMILY.map((one) => one.id).sort());
});

test("the README's family block is the one the writer makes", () => {
  assert.equal(writer.familyBlockOf(read("README.md")), writer.familyReadmeBlock(id));
});
