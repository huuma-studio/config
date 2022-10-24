import { BaseSchema } from "../deps.ts";
import { label, Labels } from "../label.ts";

export function LabelPlugin(options: {
  schema?: BaseSchema;
  loader(): Labels;
}) {
  // Setup Label for the server
  label.setup(options);

  return {
    name: "Label",
    entryPoints: [{
      "plugin-label": new URL("./main.ts", import.meta.url).href,
    }],
    plugin() {
      return {
        scripts: [
          `<script type="module">import { Label } from "/plugin-label.js";
	Label(${JSON.stringify(filterAllowedInBrowser(options.loader()))})
	</script>`,
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
        break;
      }
      allowedLabels[key] = filterAllowedInBrowser(<Labels> labels[key]);
    }
  }
  return allowedLabels;
}
