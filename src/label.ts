import { BaseSchema } from "./deps.ts";

export interface LabelsOptions<T extends Labels> {
  labels: LabelsInitialization<T>;
  schema?: BaseSchema;
}

type LabelsInitialization<T extends Labels> =
  | (() => Promise<T>)
  | (() => T)
  | T;

export type Labels = {
  [key: string]: string | number | boolean | Labels;
};

export type Label<T extends Labels> = {
  get<R extends keyof T>(name: R): T[R];
  setup(options: LabelsOptions<T>): Promise<void>;
  getAll(): T;
  reset(): void;
};

const labelsCache = new Map<string, unknown>();
let isSetup = false;

export const label = {
  get,
  setup,
  getAll,
  reset,
};

function get<T>(name: string): T {
  if (!isSetup) {
    throw Error("Cargo Label not yet setup");
  }
  return <T> labelsCache.get(name);
}

function getAll<T extends Labels>(): T {
  return <T> Object.fromEntries(labelsCache);
}

async function setup<T extends Labels>(
  options: LabelsOptions<T>,
): Promise<void> {
  if (isSetup) {
    throw new Error("Cargo Label allowed to setup options only once.");
  }

  const labels = await initializeLabels(options.labels) || {};

  if (typeof options.schema?.validate === "function") {
    const { errors } = options.schema.validate(labels);
    if (errors.length) {
      throw Error(JSON.stringify(errors));
    }
  }

  for (const key in labels) {
    labelsCache.set(key, labels[key]);
  }

  isSetup = true;
}

function reset() {
  labelsCache.clear();
  isSetup = false;
}

function initializeLabels<T extends Labels>(
  labelsInitialization: LabelsInitialization<T>,
): Promise<T> {
  if (typeof labelsInitialization === "function") {
    const labels = labelsInitialization();
    if (labels instanceof Promise) {
      return labels;
    }
    return Promise.resolve(labels);
  }
  return Promise.resolve(labelsInitialization);
}
