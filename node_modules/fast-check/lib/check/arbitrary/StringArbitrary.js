"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64String = exports.hexaString = exports.fullUnicodeString = exports.unicodeString = exports.string16bits = exports.asciiString = exports.string = exports.stringOf = void 0;
const ArrayArbitrary_1 = require("./ArrayArbitrary");
const CharacterArbitrary_1 = require("./CharacterArbitrary");
function StringArbitrary(charArb, ...args) {
    const arrayArb = args[0] !== undefined
        ? typeof args[0] === 'number'
            ? typeof args[1] === 'number'
                ? ArrayArbitrary_1.array(charArb, { minLength: args[0], maxLength: args[1] })
                : ArrayArbitrary_1.array(charArb, { maxLength: args[0] })
            : ArrayArbitrary_1.array(charArb, args[0])
        : ArrayArbitrary_1.array(charArb);
    return arrayArb.map((tab) => tab.join(''));
}
function Base64StringArbitrary(unscaledMinLength, unscaledMaxLength) {
    const minLength = unscaledMinLength + 3 - ((unscaledMinLength + 3) % 4);
    const maxLength = unscaledMaxLength - (unscaledMaxLength % 4);
    if (minLength > maxLength)
        throw new Error('Minimal length should be inferior or equal to maximal length');
    if (minLength % 4 !== 0)
        throw new Error('Minimal length of base64 strings must be a multiple of 4');
    if (maxLength % 4 !== 0)
        throw new Error('Maximal length of base64 strings must be a multiple of 4');
    return StringArbitrary(CharacterArbitrary_1.base64(), { minLength, maxLength }).map((s) => {
        switch (s.length % 4) {
            case 0:
                return s;
            case 3:
                return `${s}=`;
            case 2:
                return `${s}==`;
            default:
                return s.slice(1);
        }
    });
}
function stringOf(charArb, ...args) {
    return StringArbitrary(charArb, ...args);
}
exports.stringOf = stringOf;
function string(...args) {
    return StringArbitrary(CharacterArbitrary_1.char(), ...args);
}
exports.string = string;
function asciiString(...args) {
    return StringArbitrary(CharacterArbitrary_1.ascii(), ...args);
}
exports.asciiString = asciiString;
function string16bits(...args) {
    return StringArbitrary(CharacterArbitrary_1.char16bits(), ...args);
}
exports.string16bits = string16bits;
function unicodeString(...args) {
    return StringArbitrary(CharacterArbitrary_1.unicode(), ...args);
}
exports.unicodeString = unicodeString;
function fullUnicodeString(...args) {
    return StringArbitrary(CharacterArbitrary_1.fullUnicode(), ...args);
}
exports.fullUnicodeString = fullUnicodeString;
function hexaString(...args) {
    return StringArbitrary(CharacterArbitrary_1.hexa(), ...args);
}
exports.hexaString = hexaString;
function base64String(...args) {
    if (args[0] !== undefined) {
        if (typeof args[0] === 'number') {
            if (typeof args[1] === 'number') {
                return Base64StringArbitrary(args[0], args[1]);
            }
            else {
                return Base64StringArbitrary(0, args[0]);
            }
        }
        else {
            const minLength = args[0].minLength !== undefined ? args[0].minLength : 0;
            const maxLength = args[0].maxLength !== undefined ? args[0].maxLength : ArrayArbitrary_1.maxLengthFromMinLength(minLength);
            return Base64StringArbitrary(minLength, maxLength);
        }
    }
    return Base64StringArbitrary(0, ArrayArbitrary_1.maxLengthFromMinLength(0));
}
exports.base64String = base64String;
