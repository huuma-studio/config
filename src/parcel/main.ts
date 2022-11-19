import { label, Labels } from "../mod.ts";

export function Label(state: Labels) {
  label.setup({
    labels: state,
  });
}
