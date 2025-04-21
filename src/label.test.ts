import { StringSchema } from "@huuma/validate/string";
import { ObjectSchema } from "@huuma/validate/object";
import { assertEquals, assertThrows } from "@std/assert";
import { ConfigRegistry } from "./mod.ts";

Deno.test(ConfigRegistry.name, async (t) => {
  await t.step("should equals undefined", () => {
    assertEquals(
      new ConfigRegistry<any>({
        config: {
          name: "Hello",
        },
      }).get("value"),
      undefined,
    );
  });

  await t.step('should equals "Luke"', () => {
    assertEquals(
      new ConfigRegistry({
        config: {
          name: "Luke",
        },
      }).get("name"),
      "Luke",
    );
  });

  await t.step("should validate schema", () => {
    assertEquals(
      new ConfigRegistry({
        schema: new ObjectSchema({
          name: new StringSchema(),
        }),
        config: {
          name: "Luke",
        },
      }).get("name"),
      "Luke",
    );
  });

  await t.step("should throw schema validation error", () => {
    assertThrows(
      () => {
        new ConfigRegistry({
          schema: new ObjectSchema({
            name: new StringSchema(),
          }),
          config: {},
        });
      },
      Error,
      '[{"message":"\\"name\\" is required"},{"message":"\\"name\\" is not type \\"string\\""}]',
    );
  });
});
