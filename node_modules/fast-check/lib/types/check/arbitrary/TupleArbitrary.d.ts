import { Arbitrary } from './definition/Arbitrary';
/**
 * For tuples produced by the provided `arbs`
 *
 * @param arbs - Ordered list of arbitraries
 *
 * @deprecated Switch to {@link tuple} instead
 * @remarks Since 1.0.0
 * @public
 */
declare function genericTuple<Ts extends unknown[]>(arbs: {
    [K in keyof Ts]: Arbitrary<Ts[K]>;
}): Arbitrary<Ts>;
/**
 * For tuples produced using the provided `arbs`
 *
 * @param arbs - Ordered list of arbitraries
 *
 * @remarks Since 0.0.1
 * @public
 */
declare function tuple<Ts extends unknown[]>(...arbs: {
    [K in keyof Ts]: Arbitrary<Ts[K]>;
}): Arbitrary<Ts>;
export { genericTuple, tuple };
