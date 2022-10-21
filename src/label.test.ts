import {
  assertEquals,
  assertThrows,
  ObjectSchema,
  StringSchema,
} from "./deps_test.ts";
import { label } from "./mod.ts";

Deno.test("Label: Throws error because its not setup", () => {
  assertThrows(() => {
    return label.get<string>("NAME");
  });
});

Deno.test("Label: Variable 'NAME' is undefined", () => {
  label.setup({
    loader: () => {
      return {};
    },
  });
  assertEquals(
    label.get("NAME"),
    undefined,
  );

  label.reset();
});

Deno.test("Label: Variable 'NAME' is equals 'Luke'", () => {
  label.setup({
    loader: () => {
      return { NAME: "Luke" };
    },
  });

  assertEquals(label.get<string>("NAME"), "Luke");

  label.reset();
});

Deno.test("Label: Variable 'NAME' is equals 'Luke' with schema validation", () => {
  const schema = new ObjectSchema({
    NAME: new StringSchema(),
  });

  label.setup({
    schema,
    loader: () => {
      return { NAME: "Luke" };
    },
  });

  assertEquals(label.get<string>("NAME"), "Luke");

  label.reset();
});

Deno.test("Label: Throws error because of failed schema validation", () => {
  const schema = new ObjectSchema({
    NAME: new StringSchema(),
  });

  assertThrows(() => {
    return label.setup({
      schema,
      loader: () => {
        return { NAME: 1 };
      },
    });
  });

  label.reset();
});

Deno.test("Label: Throws error if called multiple times with options param", () => {
  label.setup({
    loader: () => {
      return {};
    },
  });

  assertThrows(() => {
    return label.setup({
      loader: () => {
        return {};
      },
    });
  });

  label.reset();
});
