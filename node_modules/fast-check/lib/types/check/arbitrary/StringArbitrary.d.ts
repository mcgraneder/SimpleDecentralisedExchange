import { Arbitrary } from './definition/Arbitrary';
/**
 * Constraints to be applied on arbitraries for strings
 * @remarks Since 2.4.0
 * @public
 */
export interface StringSharedConstraints {
    /**
     * Lower bound of the generated string length (included)
     * @remarks Since 2.4.0
     */
    minLength?: number;
    /**
     * Upper bound of the generated string length (included)
     * @remarks Since 2.4.0
     */
    maxLength?: number;
}
/**
 * For strings using the characters produced by `charArb`
 *
 * @param charArb - Arbitrary able to generate random strings (possibly multiple characters)
 *
 * @remarks Since 1.1.3
 * @public
 */
declare function stringOf(charArb: Arbitrary<string>): Arbitrary<string>;
/**
 * For strings using the characters produced by `charArb`
 *
 * @param charArb - Arbitrary able to generate random strings (possibly multiple characters)
 * @param maxLength - Upper bound of the generated string length
 *
 * @deprecated
 * Superceded by `fc.stringOf(charArb, {maxLength})` - see {@link https://github.com/dubzzz/fast-check/issues/992 | #992}.
 * Ease the migration with {@link https://github.com/dubzzz/fast-check/tree/main/codemods/unify-signatures | our codemod script}.
 *
 * @remarks Since 1.1.3
 * @public
 */
declare function stringOf(charArb: Arbitrary<string>, maxLength: number): Arbitrary<string>;
/**
 * For strings using the characters produced by `charArb`
 *
 * @param charArb - Arbitrary able to generate random strings (possibly multiple characters)
 * @param minLength - Lower bound of the generated string length
 * @param maxLength - Upper bound of the generated string length
 *
 * @deprecated
 * Superceded by `fc.stringOf(charArb, {minLength, maxLength})` - see {@link https://github.com/dubzzz/fast-check/issues/992 | #992}.
 * Ease the migration with {@link https://github.com/dubzzz/fast-check/tree/main/codemods/unify-signatures | our codemod script}.
 *
 * @remarks Since 1.1.3
 * @public
 */
declare function stringOf(charArb: Arbitrary<string>, minLength: number, maxLength: number): Arbitrary<string>;
/**
 * For strings using the characters produced by `charArb`
 *
 * @param charArb - Arbitrary able to generate random strings (possibly multiple characters)
 * @param constraints - Constraints to apply when building instances
 *
 * @remarks Since 2.4.0
 * @public
 */
declare function stringOf(charArb: Arbitrary<string>, constraints: StringSharedConstraints): Arbitrary<string>;
/**
 * For strings of {@link char}
 * @remarks Since 0.0.1
 * @public
 */
declare function string(): Arbitrary<string>;
/**
 * For strings of {@link char}
 *
 * @param maxLength - Upper bound of the generated string length
 *
 * @deprecated
 * Superceded by `fc.string({maxLength})` - see {@link https://github.com/dubzzz/fast-check/issues/992 | #992}.
 * Ease the migration with {@link https://github.com/dubzzz/fast-check/tree/main/codemods/unify-signatures | our codemod script}.
 *
 * @remarks Since 0.0.1
 * @public
 */
declare function string(maxLength: number): Arbitrary<string>;
/**
 * For strings of {@link char}
 *
 * @param minLength - Lower bound of the generated string length
 * @param maxLength - Upper bound of the generated string length
 *
 * @deprecated
 * Superceded by `fc.string({minLength, maxLength})` - see {@link https://github.com/dubzzz/fast-check/issues/992 | #992}.
 * Ease the migration with {@link https://github.com/dubzzz/fast-check/tree/main/codemods/unify-signatures | our codemod script}.
 *
 * @remarks Since 0.0.11
 * @public
 */
declare function string(minLength: number, maxLength: number): Arbitrary<string>;
/**
 * For strings of {@link char}
 *
 * @param constraints - Constraints to apply when building instances
 *
 * @remarks Since 2.4.0
 * @public
 */
declare function string(constraints: StringSharedConstraints): Arbitrary<string>;
/**
 * For strings of {@link ascii}
 * @remarks Since 0.0.1
 * @public
 */
declare function asciiString(): Arbitrary<string>;
/**
 * For strings of {@link ascii}
 *
 * @param maxLength - Upper bound of the generated string length
 *
 * @deprecated
 * Superceded by `fc.asciiString({maxLength})` - see {@link https://github.com/dubzzz/fast-check/issues/992 | #992}.
 * Ease the migration with {@link https://github.com/dubzzz/fast-check/tree/main/codemods/unify-signatures | our codemod script}.
 *
 * @remarks Since 0.0.1
 * @public
 */
declare function asciiString(maxLength: number): Arbitrary<string>;
/**
 * For strings of {@link ascii}
 *
 * @param minLength - Lower bound of the generated string length
 * @param maxLength - Upper bound of the generated string length
 *
 * @deprecated
 * Superceded by `fc.asciiString({minLength, maxLength})` - see {@link https://github.com/dubzzz/fast-check/issues/992 | #992}.
 * Ease the migration with {@link https://github.com/dubzzz/fast-check/tree/main/codemods/unify-signatures | our codemod script}.
 *
 * @remarks Since 0.0.11
 * @public
 */
declare function asciiString(minLength: number, maxLength: number): Arbitrary<string>;
/**
 * For strings of {@link ascii}
 *
 * @param constraints - Constraints to apply when building instances
 *
 * @remarks Since 2.4.0
 * @public
 */
declare function asciiString(constraints: StringSharedConstraints): Arbitrary<string>;
/**
 * For strings of {@link char16bits}
 * @remarks Since 0.0.11
 * @public
 */
declare function string16bits(): Arbitrary<string>;
/**
 * For strings of {@link char16bits}
 *
 * @param maxLength - Upper bound of the generated string length
 *
 * @deprecated
 * Superceded by `fc.string16bits({maxLength})` - see {@link https://github.com/dubzzz/fast-check/issues/992 | #992}.
 * Ease the migration with {@link https://github.com/dubzzz/fast-check/tree/main/codemods/unify-signatures | our codemod script}.
 *
 * @remarks Since 0.0.11
 * @public
 */
declare function string16bits(maxLength: number): Arbitrary<string>;
/**
 * For strings of {@link char16bits}
 *
 * @param minLength - Lower bound of the generated string length
 * @param maxLength - Upper bound of the generated string length
 *
 * @deprecated
 * Superceded by `fc.string16bits({minLength, maxLength})` - see {@link https://github.com/dubzzz/fast-check/issues/992 | #992}.
 * Ease the migration with {@link https://github.com/dubzzz/fast-check/tree/main/codemods/unify-signatures | our codemod script}.
 *
 * @remarks Since 0.0.11
 * @public
 */
declare function string16bits(minLength: number, maxLength: number): Arbitrary<string>;
/**
 * For strings of {@link char16bits}
 *
 * @param constraints - Constraints to apply when building instances
 *
 * @remarks Since 2.4.0
 * @public
 */
declare function string16bits(constraints: StringSharedConstraints): Arbitrary<string>;
/**
 * For strings of {@link unicode}
 * @remarks Since 0.0.11
 * @public
 */
declare function unicodeString(): Arbitrary<string>;
/**
 * For strings of {@link unicode}
 *
 * @param maxLength - Upper bound of the generated string length
 *
 * @deprecated
 * Superceded by `fc.unicodeString({maxLength})` - see {@link https://github.com/dubzzz/fast-check/issues/992 | #992}.
 * Ease the migration with {@link https://github.com/dubzzz/fast-check/tree/main/codemods/unify-signatures | our codemod script}.
 *
 * @remarks Since 0.0.11
 * @public
 */
declare function unicodeString(maxLength: number): Arbitrary<string>;
/**
 * For strings of {@link unicode}
 *
 * @param minLength - Lower bound of the generated string length
 * @param maxLength - Upper bound of the generated string length
 *
 * @deprecated
 * Superceded by `fc.unicodeString({minLength, maxLength})` - see {@link https://github.com/dubzzz/fast-check/issues/992 | #992}.
 * Ease the migration with {@link https://github.com/dubzzz/fast-check/tree/main/codemods/unify-signatures | our codemod script}.
 *
 * @remarks Since 0.0.11
 * @public
 */
declare function unicodeString(minLength: number, maxLength: number): Arbitrary<string>;
/**
 * For strings of {@link unicode}
 *
 * @param constraints - Constraints to apply when building instances
 *
 * @remarks Since 2.4.0
 * @public
 */
declare function unicodeString(constraints: StringSharedConstraints): Arbitrary<string>;
/**
 * For strings of {@link fullUnicode}
 * @remarks Since 0.0.11
 * @public
 */
declare function fullUnicodeString(): Arbitrary<string>;
/**
 * For strings of {@link fullUnicode}
 *
 * @param maxLength - Upper bound of the generated string length
 *
 * @deprecated
 * Superceded by `fc.fullUnicodeString({maxLength})` - see {@link https://github.com/dubzzz/fast-check/issues/992 | #992}.
 * Ease the migration with {@link https://github.com/dubzzz/fast-check/tree/main/codemods/unify-signatures | our codemod script}.
 *
 * @remarks Since 0.0.11
 * @public
 */
declare function fullUnicodeString(maxLength: number): Arbitrary<string>;
/**
 * For strings of {@link fullUnicode}
 *
 * @param minLength - Lower bound of the generated string length
 * @param maxLength - Upper bound of the generated string length
 *
 * @deprecated
 * Superceded by `fc.fullUnicodeString({minLength, maxLength})` - see {@link https://github.com/dubzzz/fast-check/issues/992 | #992}.
 * Ease the migration with {@link https://github.com/dubzzz/fast-check/tree/main/codemods/unify-signatures | our codemod script}.
 *
 * @remarks Since 0.0.11
 * @public
 */
declare function fullUnicodeString(minLength: number, maxLength: number): Arbitrary<string>;
/**
 * For strings of {@link fullUnicode}
 *
 * @param constraints - Constraints to apply when building instances
 *
 * @remarks Since 2.4.0
 * @public
 */
declare function fullUnicodeString(constraints: StringSharedConstraints): Arbitrary<string>;
/**
 * For strings of {@link hexa}
 * @remarks Since 0.0.1
 * @public
 */
declare function hexaString(): Arbitrary<string>;
/**
 * For strings of {@link hexa}
 *
 * @param maxLength - Upper bound of the generated string length
 *
 * @deprecated
 * Superceded by `fc.hexaString({maxLength})` - see {@link https://github.com/dubzzz/fast-check/issues/992 | #992}.
 * Ease the migration with {@link https://github.com/dubzzz/fast-check/tree/main/codemods/unify-signatures | our codemod script}.
 *
 * @remarks Since 0.0.1
 * @public
 */
declare function hexaString(maxLength: number): Arbitrary<string>;
/**
 * For strings of {@link hexa}
 *
 * @param minLength - Lower bound of the generated string length
 * @param maxLength - Upper bound of the generated string length
 *
 * @deprecated
 * Superceded by `fc.hexaString({minLength, maxLength})` - see {@link https://github.com/dubzzz/fast-check/issues/992 | #992}.
 * Ease the migration with {@link https://github.com/dubzzz/fast-check/tree/main/codemods/unify-signatures | our codemod script}.
 *
 * @remarks Since 0.0.11
 * @public
 */
declare function hexaString(minLength: number, maxLength: number): Arbitrary<string>;
/**
 * For strings of {@link hexa}
 *
 * @param constraints - Constraints to apply when building instances
 *
 * @remarks Since 2.4.0
 * @public
 */
declare function hexaString(constraints: StringSharedConstraints): Arbitrary<string>;
/**
 * For base64 strings
 *
 * A base64 string will always have a length multiple of 4 (padded with =)
 *
 * @remarks Since 0.0.1
 * @public
 */
declare function base64String(): Arbitrary<string>;
/**
 * For base64 strings
 *
 * A base64 string will always have a length multiple of 4 (padded with =)
 *
 * @param maxLength - Upper bound of the generated string length
 *
 * @deprecated
 * Superceded by `fc.base64String({maxLength})` - see {@link https://github.com/dubzzz/fast-check/issues/992 | #992}.
 * Ease the migration with {@link https://github.com/dubzzz/fast-check/tree/main/codemods/unify-signatures | our codemod script}.
 *
 * @remarks Since 0.0.1
 * @public
 */
declare function base64String(maxLength: number): Arbitrary<string>;
/**
 * For base64 strings
 *
 * A base64 string will always have a length multiple of 4 (padded with =)
 *
 * @param minLength - Lower bound of the generated string length
 * @param maxLength - Upper bound of the generated string length
 *
 * @deprecated
 * Superceded by `fc.base64String({minLength, maxLength})` - see {@link https://github.com/dubzzz/fast-check/issues/992 | #992}.
 * Ease the migration with {@link https://github.com/dubzzz/fast-check/tree/main/codemods/unify-signatures | our codemod script}.
 *
 * @remarks Since 0.0.11
 * @public
 */
declare function base64String(minLength: number, maxLength: number): Arbitrary<string>;
/**
 * For base64 strings
 *
 * A base64 string will always have a length multiple of 4 (padded with =)
 *
 * @param constraints - Constraints to apply when building instances
 *
 * @remarks Since 2.4.0
 * @public
 */
declare function base64String(constraints: StringSharedConstraints): Arbitrary<string>;
export { stringOf, string, asciiString, string16bits, unicodeString, fullUnicodeString, hexaString, base64String };
