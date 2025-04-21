import { ObjectSchema } from "@huuma/validate/object";

export interface ConfigOptions<T extends Config> {
  config: T;
  // deno-lint-ignore no-explicit-any
  schema?: ObjectSchema<Record<string, any>>;
}

export type Config = {
  [key: string]: string | number | boolean | Config;
};

export class ConfigRegistry<T extends Config> {
  private readonly config = new Map();
  constructor(options: ConfigOptions<T>) {
    if (options.schema instanceof ObjectSchema) {
      const { errors } = options.schema.validate(options.config);
      if (errors?.length) {
        throw Error(JSON.stringify(errors));
      }
    }

    for (const label in options.config) {
      this.config.set(label, options.config[label]);
    }
  }
  get<R extends keyof T>(name: R): T[R] {
    return <T[R]> this.config.get(<R> name);
  }
  getAll(): T {
    return <T> Object.fromEntries(this.config);
  }
}
