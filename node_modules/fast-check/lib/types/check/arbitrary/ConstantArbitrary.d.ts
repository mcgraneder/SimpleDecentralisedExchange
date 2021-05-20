import { Arbitrary } from './definition/Arbitrary';
/**
 * For `value`
 * @param value - The value to produce
 * @remarks Since 0.0.1
 * @public
 */
declare function constant<T>(value: T): Arbitrary<T>;
/**
 * For `value`
 * @param value - The value to produce
 * @remarks Since 1.8.0
 * @public
 */
declare function clonedConstant<T>(value: T): Arbitrary<T>;
/**
 * For one `...values` values - all equiprobable
 *
 * **WARNING**: It expects at least one value, otherwise it should throw
 *
 * @param values - Constant values to be produced (all values shrink to the first one)
 *
 * @remarks Since 0.0.12
 * @public
 */
declare function constantFrom<TArgs extends any[] | [any]>(...values: TArgs): Arbitrary<TArgs[number]>;
export { clonedConstant, constant, constantFrom };
