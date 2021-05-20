import { ArbitraryWithContextualShrink } from './definition/ArbitraryWithContextualShrink';
/**
 * For signed bigint of n bits
 *
 * Generated values will be between -2^(n-1) (included) and 2^(n-1) (excluded)
 *
 * @param n - Maximal number of bits of the generated bigint
 *
 * @remarks Since 1.9.0
 * @public
 */
declare function bigIntN(n: number): ArbitraryWithContextualShrink<bigint>;
/**
 * For unsigned bigint of n bits
 *
 * Generated values will be between 0 (included) and 2^n (excluded)
 *
 * @param n - Maximal number of bits of the generated bigint
 *
 * @remarks Since 1.9.0
 * @public
 */
declare function bigUintN(n: number): ArbitraryWithContextualShrink<bigint>;
/**
 * Constraints to be applied on {@link bigInt}
 * @remarks Since 2.6.0
 * @public
 */
export interface BigIntConstraints {
    /**
     * Lower bound for the generated bigints (eg.: -5n, 0n, BigInt(Number.MIN_SAFE_INTEGER))
     * @remarks Since 2.6.0
     */
    min?: bigint;
    /**
     * Upper bound for the generated bigints (eg.: -2n, 2147483647n, BigInt(Number.MAX_SAFE_INTEGER))
     * @remarks Since 2.6.0
     */
    max?: bigint;
}
/**
 * For bigint
 * @remarks Since 1.9.0
 * @public
 */
declare function bigInt(): ArbitraryWithContextualShrink<bigint>;
/**
 * For bigint between min (included) and max (included)
 *
 * @param min - Lower bound for the generated bigints (eg.: -5n, 0n, BigInt(Number.MIN_SAFE_INTEGER))
 * @param max - Upper bound for the generated bigints (eg.: -2n, 2147483647n, BigInt(Number.MAX_SAFE_INTEGER))
 *
 * @remarks Since 1.9.0
 * @public
 */
declare function bigInt(min: bigint, max: bigint): ArbitraryWithContextualShrink<bigint>;
/**
 * For bigint between min (included) and max (included)
 *
 * @param constraints - Constraints to apply when building instances
 *
 * @remarks Since 2.6.0
 * @public
 */
declare function bigInt(constraints: BigIntConstraints): ArbitraryWithContextualShrink<bigint>;
/**
 * Constraints to be applied on {@link bigUint}
 * @remarks Since 2.6.0
 * @public
 */
export interface BigUintConstraints {
    /**
     * Upper bound for the generated bigints (eg.: 2147483647n, BigInt(Number.MAX_SAFE_INTEGER))
     * @remarks Since 2.6.0
     */
    max?: bigint;
}
/**
 * For positive bigint
 * @remarks Since 1.9.0
 * @public
 */
declare function bigUint(): ArbitraryWithContextualShrink<bigint>;
/**
 * For positive bigint between 0 (included) and max (included)
 *
 * @param max - Upper bound for the generated bigint
 *
 * @remarks Since 1.9.0
 * @public
 */
declare function bigUint(max: bigint): ArbitraryWithContextualShrink<bigint>;
/**
 * For positive bigint between 0 (included) and max (included)
 *
 * @param constraints - Constraints to apply when building instances
 *
 * @remarks Since 2.6.0
 * @public
 */
declare function bigUint(constraints: BigUintConstraints): ArbitraryWithContextualShrink<bigint>;
export { bigIntN, bigUintN, bigInt, bigUint };
