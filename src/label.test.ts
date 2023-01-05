import { ObjectSchema, StringSchema } from "inspect/mod.ts";
import { assertEquals, assertThrows } from "std/testing/asserts.ts";
import { Label } from "./label.ts";

Deno.test(Label.name, async (t) => {
  await t.step("should equals undefined", () => {
    assertEquals(
      new Label<any>({
        labels: {
          name: "Hello",
        },
      }).get("value"),
      undefined,
    );
  });

  await t.step('should equals "Luke"', () => {
    assertEquals(
      new Label({
        labels: {
          name: "Luke",
        },
      }).get("name"),
      "Luke",
    );
  });

  await t.step("should validate schema", () => {
    assertEquals(
      new Label({
        schema: new ObjectSchema({
          name: new StringSchema(),
        }),
        labels: {
          name: "Luke",
        },
      }).get("name"),
      "Luke",
    );
  });

  await t.step("should throw schema validation error", () => {
    assertThrows(
      () => {
        new Label({
          schema: new ObjectSchema({
            name: new StringSchema(),
          }),
          labels: {},
        });
      },
      Error,
      '[{"message":"\\"name\\" is required"},{"message":"\\"name\\" is not type \\"string\\""}]',
    );
  });
});
