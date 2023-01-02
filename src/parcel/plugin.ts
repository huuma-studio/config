import { Label, Labels, LabelsOptions } from "../label.ts";
import { assemble, get } from "assemble/mod.ts";

export function LabelPlugin<T extends Labels>(options: LabelsOptions<T>) {
  // Setup Label for the server
  assemble({
    token: "labelOptions",
    value: options,
  });
  assemble({ class: Label, dependencies: ["labelOptions"] });
  assemble({ token: "LabelService", value: get(Label) });

  const config = <Label<T>> get(Label);

  return {
    name: "Cargo Label Plugin",
    plugin() {
      return {
        entryPoints: {
          "plugin-label": new URL("./main.ts", import.meta.url).href,
        },
        scripts: [
          `<script type="module">import { setupLabels } from "/plugin-label.js";setupLabels(${
            JSON.stringify(filterAllowedInBrowser(config.getAll()))
          })</script>`,
        ],
      };
    },
  };
}

/**
 * Function to filter only explicitly allowed labels for the browser.
 * Only labels which are appended with a "!" are used in the browser.
 */
function filterAllowedInBrowser(labels: Labels) {
  const allowedLabels: Labels = {};
  for (const key in labels) {
    const chars = [...key];
    if (chars[chars.length - 1] === "!") {
      if (
        typeof labels[key] === "string" || typeof labels[key] === "number" ||
        typeof labels[key] === "boolean"
      ) {
        allowedLabels[key] = labels[key];
        continue;
      }
      allowedLabels[key] = filterAllowedInBrowser(<Labels> labels[key]);
    }
  }
  return allowedLabels;
}
