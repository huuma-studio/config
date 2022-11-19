import { assertEquals } from "../deps_test.ts";
import { LabelPlugin } from "./plugin.ts";

const plugin = await LabelPlugin({
  labels: () => {
    return {
      name: "Anakin",
      "name!": "Luke",
    };
  },
});

Deno.test("Cargo Label Plugin: 'name' should be 'Cargo Label Plugin'", () => {
  assertEquals(plugin.name, "Cargo Label Plugin");
});

Deno.test("Cargo Label Plugin: 'entryPoints' array should be set", () => {
  assertEquals(plugin.entryPoints, [{
    "plugin-label": new URL("main.ts", import.meta.url).href,
  }]);
});

Deno.test("Cargo Label Plugin: plugin() call should return array with 'scripts'", () => {
  assertEquals(plugin.plugin(), {
    scripts: [
      '<script type="module">import { Label } from "/plugin-label.js";\n\tLabel({"name!":"Luke"})\n\t</script>',
    ],
  });
});
