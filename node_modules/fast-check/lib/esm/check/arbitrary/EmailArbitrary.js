import { array } from './ArrayArbitrary.js';
import { buildLowerAlphaNumericArb } from './helpers/SpecificCharacterRange.js';
import { domain } from './HostArbitrary.js';
import { stringOf } from './StringArbitrary.js';
import { tuple } from './TupleArbitrary.js';
export function emailAddress() {
    const others = ['!', '#', '$', '%', '&', "'", '*', '+', '-', '/', '=', '?', '^', '_', '`', '{', '|', '}', '~'];
    const atextArb = buildLowerAlphaNumericArb(others);
    const localPartArb = array(stringOf(atextArb, { minLength: 1, maxLength: 10 }), { minLength: 1, maxLength: 5 })
        .map((a) => a.join('.'))
        .filter((lp) => lp.length <= 64);
    return tuple(localPartArb, domain()).map(([lp, d]) => `${lp}@${d}`);
}
