import {
  assertEquals,
  assertRejects,
  assertThrows,
  ObjectSchema,
  StringSchema,
} from "./deps_test.ts";
import { label } from "./mod.ts";

Deno.test("Cargo Label: Should throw 'Not setup' error'", () => {
  assertThrows(
    () => {
      return label.get("NAME");
    },
    Error,
    "Cargo Label not yet setup",
  );
});

Deno.test("Cargo Label: Variable 'NAME' should be undefined", async () => {
  await label.setup({
    labels: () => {
      return {};
    },
  });
  assertEquals(
    label.get("NAME"),
    undefined,
  );

  label.reset();
});

Deno.test("Cargo Label: Variable 'NAME' should be equals 'Luke'", async () => {
  await label.setup({
    labels: () => {
      return { NAME: "Luke" };
    },
  });

  assertEquals(label.get("NAME"), "Luke");

  label.reset();
});

Deno.test("Cargo Label: Variable 'NAME' should be equals 'Luke' with schema validation", async () => {
  const schema = new ObjectSchema({
    NAME: new StringSchema(),
  });

  await label.setup({
    schema,
    labels: () => {
      return { NAME: "Luke" };
    },
  });

  assertEquals(label.get<string>("NAME"), "Luke");

  label.reset();
});

Deno.test("Cargo Label: Should reject with 'schema validation failed' error", async () => {
  const schema = new ObjectSchema({
    NAME: new StringSchema(),
  });

  await assertRejects(
    async () => {
      return await label.setup({
        schema,
        labels: () => {
          return { NAME: 1 };
        },
      });
    },
    Error,
    JSON.stringify([{ "message": '"NAME" is not type "string"' }]),
  );

  label.reset();
});

Deno.test("Cargo Label: Should reject with  error 'Called multiples times' error", async () => {
  await label.setup({
    labels: () => {
      return {};
    },
  });

  await assertRejects(
    async () => {
      return await label.setup({
        labels: () => {
          return {};
        },
      });
    },
    Error,
    "Cargo Label allowed to setup options only once.",
  );

  label.reset();
});
