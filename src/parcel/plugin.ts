import { label, Labels, LabelsOptions } from "../label.ts";

export async function LabelPlugin<T extends Labels>(options: LabelsOptions<T>) {
  // Setup Label for the server
  await label.setup(options);

  return {
    name: "Cargo Label Plugin",
    plugin() {
      return {
        entryPoints: {
          "plugin-label": new URL("./main.ts", import.meta.url).href,
        },
        scripts: [
          `<script type="module">import { Label } from "/plugin-label.js";Label(${
            JSON.stringify(filterAllowedInBrowser(label.getAll()))
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
