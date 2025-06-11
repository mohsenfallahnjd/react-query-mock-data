import { Faker, type LocaleDefinition } from "@faker-js/faker";
export type BasePrimitiveType = "string" | "number" | "boolean" | "date" | "image" | "price" | "uuid" | "name" | "phone" | "email" | "text" | "address" | "url";
export type PrimitiveType<T extends string = never> = BasePrimitiveType | T;
export type PrimitiveMap<T extends string = never> = {
    [K in PrimitiveType<T>]: K extends "number" | "price" ? number : string;
};
export type Mutable<T> = {
    -readonly [P in keyof T]: T[P] extends object ? Mutable<T[P]> : T[P];
};
type _SchemaToType<T, C extends string = never> = T extends keyof PrimitiveMap<C> ? PrimitiveMap<C>[T] : T extends readonly [infer U] ? _SchemaToType<U, C>[] : T extends object ? {
    [K in keyof T]: _SchemaToType<T[K], C>;
} : never;
export type SchemaToType<T, C extends string = never> = _SchemaToType<Mutable<T>, C>;
export type Schema<C extends string = never> = PrimitiveType<C> | {
    [key: string]: Schema<C>;
} | readonly Schema<C>[];
export interface FakerConfig<C extends string = never> {
    primitiveTypes: PrimitiveType<C>[];
    generateMockValue: (type: PrimitiveType<C>, faker: Faker) => string | number | boolean | Date | null;
    locale?: LocaleDefinition | LocaleDefinition[];
}
export declare function createFaker<C extends string = never>(config?: Partial<FakerConfig<C>>): {
    generateMockFromSchema: (schema: Schema<C>) => any;
    config: FakerConfig<C>;
    faker: Faker;
};
export declare const generateMockFromSchema: (schema: Schema<never>) => any;
export {};
