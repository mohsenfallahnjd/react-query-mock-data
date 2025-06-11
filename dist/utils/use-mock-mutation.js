import { useMutation } from "@tanstack/react-query";
import { createFaker } from "./utils";
export function useMockMutation(schema, options) {
    const faker = createFaker(options?.fakerConfig);
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
