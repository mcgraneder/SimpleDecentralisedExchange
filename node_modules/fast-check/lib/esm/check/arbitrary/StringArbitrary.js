import { array, maxLengthFromMinLength } from './ArrayArbitrary.js';
import { ascii, base64, char, char16bits, fullUnicode, hexa, unicode } from './CharacterArbitrary.js';
function StringArbitrary(charArb, ...args) {
    const arrayArb = args[0] !== undefined
        ? typeof args[0] === 'number'
            ? typeof args[1] === 'number'
                ? array(charArb, { minLength: args[0], maxLength: args[1] })
                : array(charArb, { maxLength: args[0] })
            : array(charArb, args[0])
        : array(charArb);
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
    return StringArbitrary(base64(), { minLength, maxLength }).map((s) => {
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
function string(...args) {
    return StringArbitrary(char(), ...args);
}
function asciiString(...args) {
    return StringArbitrary(ascii(), ...args);
}
function string16bits(...args) {
    return StringArbitrary(char16bits(), ...args);
}
function unicodeString(...args) {
    return StringArbitrary(unicode(), ...args);
}
function fullUnicodeString(...args) {
    return StringArbitrary(fullUnicode(), ...args);
}
function hexaString(...args) {
    return StringArbitrary(hexa(), ...args);
}
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
            const maxLength = args[0].maxLength !== undefined ? args[0].maxLength : maxLengthFromMinLength(minLength);
            return Base64StringArbitrary(minLength, maxLength);
        }
    }
    return Base64StringArbitrary(0, maxLengthFromMinLength(0));
}
export { stringOf, string, asciiString, string16bits, unicodeString, fullUnicodeString, hexaString, base64String };
