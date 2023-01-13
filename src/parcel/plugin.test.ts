import { get } from "assemble/mod.ts";
import { assertEquals } from "std/testing/asserts.ts";
import { Label } from "../label.ts";
import { LabelPlugin } from "./plugin.ts";

const configLabels = {
  name: "Anakin",
  "name!": "Luke",
};

const Plugin = LabelPlugin({
  labels: configLabels,
});

const plugin = Plugin.plugin();

Deno.test(LabelPlugin.name, async (t) => {
  await t.step('should have name "Cargo Label Plugin"', () => {
    assertEquals(Plugin.name, "Cargo Label Plugin");
  });

  await t.step("should have all expected props", () => {
    assertEquals(plugin.entryPoints, {
      "plugin-label": new URL("main.ts", import.meta.url).href,
    });
    assertEquals(plugin.scripts, [
      '<script type="module">import { setupLabels } from "/plugin-label.js";setupLabels({"name!":"Luke"})</script>',
    ]);
  });

  await t.step("should have access to label in Cargo Assemble", () => {
    assertEquals(
      get<Label<typeof configLabels>>("LabelService").get("name!"),
      "Luke",
    );
    assertEquals(get<Label<typeof configLabels>>(Label).get("name"), "Anakin");
  });
});
