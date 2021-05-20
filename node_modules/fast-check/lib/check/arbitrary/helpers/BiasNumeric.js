"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bigIntLogLike = exports.integerLogLike = exports.biasNumeric = exports.BiasedNumericArbitrary = void 0;
const Arbitrary_1 = require("../definition/Arbitrary");
class BiasedNumericArbitrary extends Arbitrary_1.Arbitrary {
    constructor(arbCloseToZero, ...arbs) {
        super();
        this.arbCloseToZero = arbCloseToZero;
        this.arbs = arbs;
    }
    generate(mrng) {
        const id = mrng.nextInt(-2 * this.arbs.length, this.arbs.length - 1);
        return id < 0 ? this.arbCloseToZero.generate(mrng) : this.arbs[id].generate(mrng);
    }
}
exports.BiasedNumericArbitrary = BiasedNumericArbitrary;
function biasNumeric(min, max, Ctor, logLike) {
    if (min === max) {
        return new Ctor(min, max, min, max);
    }
    if (min < 0 && max > 0) {
        const logMin = logLike(-min);
        const logMax = logLike(max);
        return new BiasedNumericArbitrary(new Ctor(min, max, -logMin, logMax), new Ctor(min, max, (max - logMax), max), new Ctor(min, max, min, min + logMin));
    }
    const logGap = logLike((max - min));
    const arbCloseToMin = new Ctor(min, max, min, min + logGap);
    const arbCloseToMax = new Ctor(min, max, (max - logGap), max);
    return min < 0
        ? new BiasedNumericArbitrary(arbCloseToMax, arbCloseToMin)
        : new BiasedNumericArbitrary(arbCloseToMin, arbCloseToMax);
}
exports.biasNumeric = biasNumeric;
function integerLogLike(v) {
    return Math.floor(Math.log(v) / Math.log(2));
}
exports.integerLogLike = integerLogLike;
function bigIntLogLike(v) {
    if (v === BigInt(0))
        return BigInt(0);
    return BigInt(v.toString().length);
}
exports.bigIntLogLike = bigIntLogLike;
