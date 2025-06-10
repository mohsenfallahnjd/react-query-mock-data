import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { createFaker, type SchemaToType, type Schema, type FakerConfig } from "./utils";

type MockMutationOptions<C extends string = never> = {
  delay?: number; // milliseconds to wait before resolving
  single?: boolean;
  count?: number;
  fakerConfig?: Partial<FakerConfig<C>>; // optional faker configuration
};

// Infer from schema (primary signature)
export function useMockMutation<
  S extends Schema<C>,
  C extends string = never,
  T = SchemaToType<S, C>,
  IsSingle extends boolean | undefined = false,
>(
  schema: S,
  options?: MockMutationOptions<C> & { single?: IsSingle }
): UseMutationResult<IsSingle extends true ? T : T[], Error>;

export function useMockMutation<C extends string = never>(
  schema: Schema<C>,
  options?: MockMutationOptions<C>
): UseMutationResult<unknown, Error> {
  const faker = createFaker<C>(options?.fakerConfig);

  return useMutation({
    mutationKey: ["mockMutation", schema, options?.delay, options?.single, options?.count, options?.fakerConfig],
    mutationFn: async () => {
      const delay = options?.delay ?? 300;
      await new Promise((res) => setTimeout(res, delay));

      if (options?.single) {
        return faker.generateMockFromSchema(schema);
      }
      return Array.from({ length: options?.count ?? 5 }, () => faker.generateMockFromSchema(schema));
    },
  });
}
