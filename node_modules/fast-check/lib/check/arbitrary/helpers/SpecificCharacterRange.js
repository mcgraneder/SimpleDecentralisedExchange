"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAlphaNumericPercentArb = exports.buildAlphaNumericArb = exports.buildLowerAlphaNumericArb = exports.buildLowerAlphaArb = void 0;
const CharacterArbitrary_1 = require("../CharacterArbitrary");
const FrequencyArbitrary_1 = require("../FrequencyArbitrary");
const MapToConstantArbitrary_1 = require("../MapToConstantArbitrary");
const lowerCaseMapper = { num: 26, build: (v) => String.fromCharCode(v + 0x61) };
const upperCaseMapper = { num: 26, build: (v) => String.fromCharCode(v + 0x41) };
const numericMapper = { num: 10, build: (v) => String.fromCharCode(v + 0x30) };
const percentCharArb = CharacterArbitrary_1.fullUnicode().map((c) => {
    const encoded = encodeURIComponent(c);
    return c !== encoded ? encoded : `%${c.charCodeAt(0).toString(16)}`;
});
const buildLowerAlphaArb = (others) => MapToConstantArbitrary_1.mapToConstant(lowerCaseMapper, { num: others.length, build: (v) => others[v] });
exports.buildLowerAlphaArb = buildLowerAlphaArb;
const buildLowerAlphaNumericArb = (others) => MapToConstantArbitrary_1.mapToConstant(lowerCaseMapper, numericMapper, { num: others.length, build: (v) => others[v] });
exports.buildLowerAlphaNumericArb = buildLowerAlphaNumericArb;
const buildAlphaNumericArb = (others) => MapToConstantArbitrary_1.mapToConstant(lowerCaseMapper, upperCaseMapper, numericMapper, { num: others.length, build: (v) => others[v] });
exports.buildAlphaNumericArb = buildAlphaNumericArb;
const buildAlphaNumericPercentArb = (others) => FrequencyArbitrary_1.frequency({
    weight: 10,
    arbitrary: exports.buildAlphaNumericArb(others),
}, {
    weight: 1,
    arbitrary: percentCharArb,
});
exports.buildAlphaNumericPercentArb = buildAlphaNumericPercentArb;
