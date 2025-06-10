import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { createFaker, type Schema, type SchemaToType, type FakerConfig } from "./utils";

type MockOptions<C extends string = never> = {
  count?: number; // how many items to generate
  single?: boolean; // whether to return a single object
  fakerConfig?: Partial<FakerConfig<C>>; // optional faker configuration
};

// Infer from schema (primary signature)
export function useMockData<
  S extends Schema<C>,
  C extends string = never,
  T = SchemaToType<S, C>,
  IsSingle extends boolean | undefined = false,
>(schema: S, options?: MockOptions<C> & { single?: IsSingle }): UseQueryResult<IsSingle extends true ? T : T[], Error>;

// Fallback implementation
export function useMockData<C extends string = never>(
  schema: Schema<C>,
  options?: MockOptions<C>
): UseQueryResult<unknown, Error> {
  const count = options?.count ?? 5;
  const isSingle = options?.single ?? false;
  const faker = createFaker<C>(options?.fakerConfig);

  return useQuery({
    queryKey: ["mockData", schema, count, isSingle, options?.fakerConfig],
    queryFn: () => {
      if (isSingle) {
        return faker.generateMockFromSchema(schema);
      }
      return Array.from({ length: count }, () => faker.generateMockFromSchema(schema));
    },
  });
}
