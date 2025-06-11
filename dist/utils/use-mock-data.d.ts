import { type UseQueryResult } from "@tanstack/react-query";
import { type Schema, type SchemaToType, type FakerConfig } from "./utils";
type MockOptions<C extends string = never> = {
    count?: number;
    single?: boolean;
    fakerConfig?: Partial<FakerConfig<C>>;
};
export declare function useMockData<S extends Schema<C>, C extends string = never, T = SchemaToType<S, C>, IsSingle extends boolean | undefined = false>(schema: S, options?: MockOptions<C> & {
    single?: IsSingle;
}): UseQueryResult<IsSingle extends true ? T : T[], Error>;
export {};
