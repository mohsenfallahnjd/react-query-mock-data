import { useQuery } from "@tanstack/react-query";
import { createFaker } from "./utils";
// Fallback implementation
export function useMockData(schema, options) {
    const count = options?.count ?? 5;
    const isSingle = options?.single ?? false;
    const faker = createFaker(options?.fakerConfig);
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
