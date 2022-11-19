import { assertEquals } from "../deps_test.ts";
import { LabelPlugin } from "./plugin.ts";

const plugin = (await LabelPlugin({
  labels: () => {
    return {
      name: "Anakin",
      "name!": "Luke",
    };
  },
}));

const pluginDescription = plugin.plugin();

Deno.test("Cargo Label Plugin: 'name' should be 'Cargo Label Plugin'", () => {
  assertEquals(plugin.name, "Cargo Label Plugin");
});

Deno.test("Cargo Label Plugin: 'entryPoints' array should be set", () => {
  assertEquals(pluginDescription.entryPoints, {
    "plugin-label": new URL("main.ts", import.meta.url).href,
  });
});

Deno.test("Cargo Label Plugin: plugin() call should return array with 'scripts'", () => {
  assertEquals(pluginDescription.scripts, [
    '<script type="module">import { Label } from "/plugin-label.js";Label({"name!":"Luke"})</script>',
  ]);
});
