import { fa, Faker, type LocaleDefinition } from "@faker-js/faker";

export type BasePrimitiveType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "image"
  | "price"
  | "uuid"
  | "name"
  | "phone"
  | "email"
  | "text"
  | "address"
  | "url";

export type PrimitiveType<T extends string = never> = BasePrimitiveType | T;

export type PrimitiveMap<T extends string = never> = {
  [K in PrimitiveType<T>]: K extends "number" | "price" ? number : string;
};

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P] extends object ? Mutable<T[P]> : T[P];
};

type _SchemaToType<T, C extends string = never> = T extends keyof PrimitiveMap<C>
  ? PrimitiveMap<C>[T]
  : T extends readonly [infer U]
    ? _SchemaToType<U, C>[]
    : T extends object
      ? { [K in keyof T]: _SchemaToType<T[K], C> }
      : never;

export type SchemaToType<T, C extends string = never> = _SchemaToType<Mutable<T>, C>;

export type Schema<C extends string = never> = PrimitiveType<C> | { [key: string]: Schema<C> } | readonly Schema<C>[];

export interface FakerConfig<C extends string = never> {
  primitiveTypes: PrimitiveType<C>[];
  generateMockValue: (type: PrimitiveType<C>, faker: Faker) => string | number | boolean | Date | null;
  locale?: LocaleDefinition | LocaleDefinition[];
}

const defaultConfig: FakerConfig = {
  primitiveTypes: [
    "string",
    "number",
    "boolean",
    "date",
    "image",
    "price",
    "uuid",
    "name",
    "phone",
    "email",
    "text",
    "address",
    "url",
  ],
  locale: fa,
  generateMockValue: (type: PrimitiveType, faker: Faker): string | number | boolean | Date | null => {
    switch (type) {
      case "string":
        return faker.lorem.words(2);
      case "number":
        return faker.number.int({ min: 1, max: 100 });
      case "boolean":
        return faker.datatype.boolean();
      case "date":
        return faker.date.recent().toISOString();
      case "image":
        return faker.image.urlPicsumPhotos();
      case "price":
        return faker.commerce.price({ min: 5, max: 500, dec: 2 });
      case "uuid":
        return faker.string.uuid();
      case "name":
        return faker.person.fullName();
      case "phone":
        return faker.phone.number();
      case "email":
        return faker.internet.email();
      case "text":
        return faker.lorem.text();
      case "address":
        return faker.location.streetAddress();
      case "url":
        return faker.internet.url();
      default:
        console.warn(`Unknown schema type: ${type}`);
        return null;
    }
  },
};

export function createFaker<C extends string = never>(config: Partial<FakerConfig<C>> = {}) {
  const finalConfig: FakerConfig<C> = {
    ...defaultConfig,
    ...config,
    primitiveTypes: [
      ...new Set([...defaultConfig.primitiveTypes, ...(config.primitiveTypes || [])]),
    ] as PrimitiveType<C>[],
    generateMockValue: (type: PrimitiveType<C>, faker: Faker) => {
      // First try the custom generator if provided
      if (config.generateMockValue) {
        const customValue = config.generateMockValue(type, faker);
        if (customValue !== null) {
          return customValue;
        }
      }
      // Fall back to default generator
      return defaultConfig.generateMockValue(type as PrimitiveType, faker);
    },
  };

  // Create a new faker instance with the specified locale
  const fakerInstance = new Faker({ locale: finalConfig.locale! });

  function generateMockFromSchema(schema: Schema<C>): any {
    if (typeof schema === "string") {
      if (!finalConfig.primitiveTypes.includes(schema as PrimitiveType<C>)) {
        console.warn(`Unknown schema type: ${schema}`);
        return null;
      }
      return finalConfig.generateMockValue(schema as PrimitiveType<C>, fakerInstance);
    }

    if (Array.isArray(schema)) {
      const elementSchema = schema[0];
      const arrayLength = fakerInstance.number.int({ min: 2, max: 5 });

      return Array.from({ length: arrayLength }, () => generateMockFromSchema(elementSchema));
    }

    if (typeof schema === "object" && schema !== null) {
      const result: Record<string, any> = {};
      for (const key in schema as { [key: string]: Schema<C> }) {
        result[key] = generateMockFromSchema((schema as Record<string, Schema<C>>)[key]);
      }
      return result;
    }

    return null;
  }

  return {
    generateMockFromSchema,
    config: finalConfig,
    faker: fakerInstance,
  };
}

// For backward compatibility
export const generateMockFromSchema = createFaker().generateMockFromSchema;
