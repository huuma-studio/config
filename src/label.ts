import { ObjectSchema } from "inspect/mod.ts";

export interface LabelsOptions<T extends Labels> {
  labels: T;
  schema?: ObjectSchema;
}

export type Labels = {
  [key: string]: string | number | boolean | Labels;
};

export class Label<T extends Labels> {
  private readonly labels = new Map();
  constructor(options: LabelsOptions<T>) {
    if (options.schema instanceof ObjectSchema) {
      options.schema;
    }
    for (const label in options.labels) {
      this.labels.set(label, options.labels[label]);
    }
  }
  get<R extends keyof T>(name: R): T[R] {
    return <T[R]> this.labels.get(<R> name);
  }
  getAll(): T {
    return <T> Object.fromEntries(this.labels);
  }
}
