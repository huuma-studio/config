import { assertEquals } from "std/testing/asserts.ts";
import { LabelPlugin } from "./plugin.ts";

const Plugin = (LabelPlugin({
  labels: {
    name: "Anakin",
    "name!": "Luke",
  },
}));
const plugin = Plugin.plugin();

Deno.test("Cargo Label Plugin: 'name' should be 'Cargo Label Plugin'", () => {
  assertEquals(Plugin.name, "Cargo Label Plugin");
});

Deno.test("Cargo Label Plugin: 'entryPoints' array should be set", () => {
  assertEquals(plugin.entryPoints, {
    "plugin-label": new URL("main.ts", import.meta.url).href,
  });
});

Deno.test("Cargo Label Plugin: plugin() call should return array with 'scripts'", () => {
  assertEquals(plugin.scripts, [
    '<script type="module">import { Label } from "/plugin-label.js";Label({"name!":"Luke"})</script>',
  ]);
});
