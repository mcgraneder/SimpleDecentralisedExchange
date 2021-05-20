"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailAddress = void 0;
const ArrayArbitrary_1 = require("./ArrayArbitrary");
const SpecificCharacterRange_1 = require("./helpers/SpecificCharacterRange");
const HostArbitrary_1 = require("./HostArbitrary");
const StringArbitrary_1 = require("./StringArbitrary");
const TupleArbitrary_1 = require("./TupleArbitrary");
function emailAddress() {
    const others = ['!', '#', '$', '%', '&', "'", '*', '+', '-', '/', '=', '?', '^', '_', '`', '{', '|', '}', '~'];
    const atextArb = SpecificCharacterRange_1.buildLowerAlphaNumericArb(others);
    const localPartArb = ArrayArbitrary_1.array(StringArbitrary_1.stringOf(atextArb, { minLength: 1, maxLength: 10 }), { minLength: 1, maxLength: 5 })
        .map((a) => a.join('.'))
        .filter((lp) => lp.length <= 64);
    return TupleArbitrary_1.tuple(localPartArb, HostArbitrary_1.domain()).map(([lp, d]) => `${lp}@${d}`);
}
exports.emailAddress = emailAddress;
