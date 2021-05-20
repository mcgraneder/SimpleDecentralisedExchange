"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hostUserInfo = exports.domain = exports.filterInvalidSubdomainLabel = void 0;
const ArrayArbitrary_1 = require("./ArrayArbitrary");
const SpecificCharacterRange_1 = require("./helpers/SpecificCharacterRange");
const OptionArbitrary_1 = require("./OptionArbitrary");
const StringArbitrary_1 = require("./StringArbitrary");
const TupleArbitrary_1 = require("./TupleArbitrary");
function filterInvalidSubdomainLabel(subdomainLabel) {
    if (subdomainLabel.length > 63) {
        return false;
    }
    return (subdomainLabel.length < 4 ||
        subdomainLabel[0] !== 'x' ||
        subdomainLabel[1] !== 'n' ||
        subdomainLabel[2] !== '-' ||
        subdomainLabel[3] !== '-');
}
exports.filterInvalidSubdomainLabel = filterInvalidSubdomainLabel;
function subdomainLabel() {
    const alphaNumericArb = SpecificCharacterRange_1.buildLowerAlphaNumericArb([]);
    const alphaNumericHyphenArb = SpecificCharacterRange_1.buildLowerAlphaNumericArb(['-']);
    return TupleArbitrary_1.tuple(alphaNumericArb, OptionArbitrary_1.option(TupleArbitrary_1.tuple(StringArbitrary_1.stringOf(alphaNumericHyphenArb, { maxLength: 61 }), alphaNumericArb)))
        .map(([f, d]) => (d === null ? f : `${f}${d[0]}${d[1]}`))
        .filter(filterInvalidSubdomainLabel);
}
function domain() {
    const alphaNumericArb = SpecificCharacterRange_1.buildLowerAlphaArb([]);
    const publicSuffixArb = StringArbitrary_1.stringOf(alphaNumericArb, { minLength: 2, maxLength: 10 });
    return (TupleArbitrary_1.tuple(ArrayArbitrary_1.array(subdomainLabel(), { minLength: 1, maxLength: 5 }), publicSuffixArb)
        .map(([mid, ext]) => `${mid.join('.')}.${ext}`)
        .filter((d) => d.length <= 255));
}
exports.domain = domain;
function hostUserInfo() {
    const others = ['-', '.', '_', '~', '!', '$', '&', "'", '(', ')', '*', '+', ',', ';', '=', ':'];
    return StringArbitrary_1.stringOf(SpecificCharacterRange_1.buildAlphaNumericPercentArb(others));
}
exports.hostUserInfo = hostUserInfo;
