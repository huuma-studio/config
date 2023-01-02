import { Label, Labels } from "../mod.ts";
import { assemble, get } from "assemble/mod.ts";

export function setupLabels(options: Labels) {
  assemble({
    token: "labelOptions",
    value: { labels: options },
  });
  assemble({ class: Label, dependencies: ["labelOptions"] });
  assemble({ token: "LabelService", value: get(Label) });
}
