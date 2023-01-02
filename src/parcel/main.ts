import { Label, Labels } from "../mod.ts";
import { assemble, get } from "assemble/mod.ts";

export function setupLabels(state: Labels) {
  assemble({ token: "labelOptions", value: state });
  assemble({ class: Label, dependencies: ["labelOptions"] });
  assemble({ token: "LabelService", value: get(Label) });
}
