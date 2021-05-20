import { Arbitrary } from './definition/Arbitrary';
import { DoubleNextConstraints } from './DoubleNextArbitrary';
import { FloatNextConstraints } from './FloatNextArbitrary';
/**
 * Constraints to be applied on typed arrays for integer values
 * @remarks Since 2.9.0
 * @public
 */
export declare type IntArrayConstraints = {
    /**
     * Lower bound of the generated array size
     * @remarks Since 2.9.0
     */
    minLength?: number;
    /**
     * Upper bound of the generated array size
     * @remarks Since 2.9.0
     */
    maxLength?: number;
    /**
     * Lower bound for the generated int (included)
     * @defaultValue smallest possible value for this type
     * @remarks Since 2.9.0
     */
    min?: number;
    /**
     * Upper bound for the generated int (included)
     * @defaultValue highest possible value for this type
     * @remarks Since 2.9.0
     */
    max?: number;
};
/**
 * For Int8Array
 * @remarks Since 2.9.0
 * @public
 */
export declare function int8Array(constraints?: IntArrayConstraints): Arbitrary<Int8Array>;
/**
 * For Uint8Array
 * @remarks Since 2.9.0
 * @public
 */
export declare function uint8Array(constraints?: IntArrayConstraints): Arbitrary<Uint8Array>;
/**
 * For Uint8ClampedArray
 * @remarks Since 2.9.0
 * @public
 */
export declare function uint8ClampedArray(constraints?: IntArrayConstraints): Arbitrary<Uint8ClampedArray>;
/**
 * For Int16Array
 * @remarks Since 2.9.0
 * @public
 */
export declare function int16Array(constraints?: IntArrayConstraints): Arbitrary<Int16Array>;
/**
 * For Uint16Array
 * @remarks Since 2.9.0
 * @public
 */
export declare function uint16Array(constraints?: IntArrayConstraints): Arbitrary<Uint16Array>;
/**
 * For Int32Array
 * @remarks Since 2.9.0
 * @public
 */
export declare function int32Array(constraints?: IntArrayConstraints): Arbitrary<Int32Array>;
/**
 * For Uint32Array
 * @remarks Since 2.9.0
 * @public
 */
export declare function uint32Array(constraints?: IntArrayConstraints): Arbitrary<Uint32Array>;
/**
 * Constraints to be applied on {@link float32Array}
 * @remarks Since 2.9.0
 * @public
 */
export declare type Float32ArrayConstraints = {
    /**
     * Lower bound of the generated array size
     * @remarks Since 2.9.0
     */
    minLength?: number;
    /**
     * Upper bound of the generated array size
     * @remarks Since 2.9.0
     */
    maxLength?: number;
} & FloatNextConstraints;
/**
 * For Float32Array
 * @remarks Since 2.9.0
 * @public
 */
export declare function float32Array(constraints?: Float32ArrayConstraints): Arbitrary<Float32Array>;
/**
 * Constraints to be applied on {@link float64Array}
 * @remarks Since 2.9.0
 * @public
 */
export declare type Float64ArrayConstraints = {
    /**
     * Lower bound of the generated array size
     * @remarks Since 2.9.0
     */
    minLength?: number;
    /**
     * Upper bound of the generated array size
     * @remarks Since 2.9.0
     */
    maxLength?: number;
} & DoubleNextConstraints;
/**
 * For Float64Array
 * @remarks Since 2.9.0
 * @public
 */
export declare function float64Array(constraints?: Float64ArrayConstraints): Arbitrary<Float64Array>;
