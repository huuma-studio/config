import type { ObjectSchema } from "inspect/schemas/object.ts";

export interface LabelsOptions<T extends Labels> {
  labels: T;
  schema?: ObjectSchema<Record<string, any>>;
}

export type Labels = {
  [key: string]: string | number | boolean | Labels;
};

export class Label<T extends Labels> {
  private readonly labels = new Map();
  constructor(options: LabelsOptions<T>) {
    if (typeof options.schema?.validate === "function") {
      const { errors } = options.schema.validate(options.labels);
      if (errors.length) {
        throw Error(JSON.stringify(errors));
      }
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
