import { BaseSchema } from "../deps.ts";
import { label } from "../label.ts";

export function LabelPlugin(options: {
  schema?: BaseSchema;
  loader(): Record<string, unknown>;
}) {
  label.setup(options);

  return {
    name: "Label",
    entryPoints: [new URL("./main.ts", import.meta.url).href],
    plugin(entryPoints: string[]) {
      return {
        scripts: [`import { Label } from "${entryPoints[0]}";
	LabelPlugin(${JSON.stringify(options.loader())})
	`],
      };
    },
  };
}
