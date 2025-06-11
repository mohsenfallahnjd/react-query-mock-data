import { type UseMutationResult } from "@tanstack/react-query";
import { type SchemaToType, type Schema, type FakerConfig } from "./utils";
type MockMutationOptions<C extends string = never> = {
    delay?: number;
    single?: boolean;
    count?: number;
    fakerConfig?: Partial<FakerConfig<C>>;
};
export declare function useMockMutation<S extends Schema<C>, C extends string = never, T = SchemaToType<S, C>, IsSingle extends boolean | undefined = false>(schema: S, options?: MockMutationOptions<C> & {
    single?: IsSingle;
}): UseMutationResult<IsSingle extends true ? T : T[], Error>;
export {};
