import { BaseSchema } from "./deps.ts";

const envVars = new Map();
let isSetup = false;

export interface LabelOptions {
  loader: () => Record<string, unknown>;
  schema?: BaseSchema;
}

export const label = {
  get,
  setup,
  reset,
};

function get<T>(search: string): T {
  if (!isSetup) {
    throw Error("Cargo Label not yet setup");
  }
  return envVars.get(search);
}

function setup(options: LabelOptions) {
  if (isSetup) {
    throw new Error("Cargo Label allowed to setup options only once.");
  }

  const config = options.loader() || {};

  if (typeof options.schema?.validate === "function") {
    const { errors } = options.schema.validate(config);
    if (errors.length) {
      throw Error(JSON.stringify(errors));
    }
  }

  for (const key in config) {
    envVars.set(key, config[key]);
  }

  isSetup = true;
}

function reset() {
  envVars.clear();
  isSetup = false;
}
