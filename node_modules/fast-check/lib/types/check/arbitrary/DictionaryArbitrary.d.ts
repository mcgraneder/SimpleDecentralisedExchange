import { Arbitrary } from './definition/Arbitrary';
/**
 * For dictionaries with keys produced by `keyArb` and values from `valueArb`
 *
 * @param keyArb - Arbitrary used to generate the keys of the object
 * @param valueArb - Arbitrary used to generate the values of the object
 *
 * @remarks Since 1.0.0
 * @public
 */
declare function dictionary<T>(keyArb: Arbitrary<string>, valueArb: Arbitrary<T>): Arbitrary<Record<string, T>>;
export { dictionary };
