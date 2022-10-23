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
	Label(${JSON.stringify(options.loader())})
	<script>`,
        ],
      };
    },
  };
}
