import { label, Labels } from "../mod.ts";

export function LabelPlugin(state: Labels) {
  label.setup({
    loader() {
      return state;
    },
  });
}
