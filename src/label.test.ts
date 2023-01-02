import { assertEquals } from "std/testing/asserts.ts";
import { Label } from "./label.ts";

Deno.test("Cargo Label: Should throw 'Not setup' error'", () => {
  assertEquals(
    new Label({
      labels: {
        name: "Hello",
        value: 2,
      },
    }).get("value"),
    2,
  );
});
