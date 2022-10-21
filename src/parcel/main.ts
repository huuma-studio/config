import { label } from "../mod.ts";

export function LabelPlugin(state: Record<string, unknown>) {
  label.setup({
    loader() {
      return state;
    },
  });
}
