"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayInt64 = void 0;
const Stream_1 = require("../../../stream/Stream");
const ArbitraryWithContextualShrink_1 = require("../definition/ArbitraryWithContextualShrink");
const BiasedArbitraryWrapper_1 = require("../definition/BiasedArbitraryWrapper");
const Shrinkable_1 = require("../definition/Shrinkable");
const ArrayInt64_1 = require("./ArrayInt64");
const BiasNumeric_1 = require("./BiasNumeric");
class ArrayInt64Arbitrary extends ArbitraryWithContextualShrink_1.ArbitraryWithContextualShrink {
    constructor(min, max, genMin, genMax) {
        super();
        this.min = min;
        this.max = max;
        this.genMin = genMin;
        this.genMax = genMax;
        this.biasedArrayInt64Arbitrary = null;
    }
    wrapper(value, context) {
        return new Shrinkable_1.Shrinkable(value, () => this.contextualShrink(value, context).map(([v, nextContext]) => this.wrapper(v, nextContext)));
    }
    generate(mrng) {
        const uncheckedValue = mrng.nextArrayInt(this.genMin, this.genMax);
        if (uncheckedValue.data.length === 1) {
            uncheckedValue.data.unshift(0);
        }
        return this.wrapper(uncheckedValue, undefined);
    }
    shrinkArrayInt64(value, target, tryTargetAsap) {
        const realGap = ArrayInt64_1.substract64(value, target);
        function* shrinkGen() {
            let previous = tryTargetAsap ? undefined : target;
            const gap = tryTargetAsap ? realGap : ArrayInt64_1.halve64(realGap);
            for (let toremove = gap; !ArrayInt64_1.isZero64(toremove); toremove = ArrayInt64_1.halve64(toremove)) {
                const next = ArrayInt64_1.substract64(value, toremove);
                yield [next, previous];
                previous = next;
            }
        }
        return Stream_1.stream(shrinkGen());
    }
    contextualShrink(current, context) {
        if (!ArrayInt64Arbitrary.isValidContext(current, context)) {
            const target = this.defaultTarget();
            return this.shrinkArrayInt64(current, target, true);
        }
        if (this.isLastChanceTry(current, context)) {
            return Stream_1.Stream.of([context, undefined]);
        }
        return this.shrinkArrayInt64(current, context, false);
    }
    shrunkOnceContext() {
        return this.defaultTarget();
    }
    defaultTarget() {
        if (!ArrayInt64_1.isStrictlyPositive64(this.min) && !ArrayInt64_1.isStrictlyNegative64(this.max)) {
            return ArrayInt64_1.Zero64;
        }
        return ArrayInt64_1.isStrictlyNegative64(this.min) ? this.max : this.min;
    }
    isLastChanceTry(current, context) {
        if (ArrayInt64_1.isZero64(current)) {
            return false;
        }
        if (current.sign === 1) {
            return ArrayInt64_1.isEqual64(current, ArrayInt64_1.add64(context, ArrayInt64_1.Unit64)) && ArrayInt64_1.isStrictlyPositive64(ArrayInt64_1.substract64(current, this.min));
        }
        else {
            return ArrayInt64_1.isEqual64(current, ArrayInt64_1.substract64(context, ArrayInt64_1.Unit64)) && ArrayInt64_1.isStrictlyNegative64(ArrayInt64_1.substract64(current, this.max));
        }
    }
    static isValidContext(_current, context) {
        if (context === undefined) {
            return false;
        }
        if (typeof context !== 'object' || context === null || !('sign' in context) || !('data' in context)) {
            throw new Error(`Invalid context type passed to ArrayInt64Arbitrary (#1)`);
        }
        return true;
    }
    pureBiasedArbitrary() {
        if (this.biasedArrayInt64Arbitrary != null) {
            return this.biasedArrayInt64Arbitrary;
        }
        if (ArrayInt64_1.isEqual64(this.min, this.max)) {
            this.biasedArrayInt64Arbitrary = this;
            return this;
        }
        const minStrictlySmallerZero = ArrayInt64_1.isStrictlyNegative64(this.min);
        const maxStrictlyGreaterZero = ArrayInt64_1.isStrictlyPositive64(this.max);
        if (minStrictlySmallerZero && maxStrictlyGreaterZero) {
            const logMin = ArrayInt64_1.logLike64(this.min);
            const logMax = ArrayInt64_1.logLike64(this.max);
            this.biasedArrayInt64Arbitrary = new BiasNumeric_1.BiasedNumericArbitrary(new ArrayInt64Arbitrary(this.min, this.max, logMin, logMax), new ArrayInt64Arbitrary(this.min, this.max, ArrayInt64_1.substract64(this.max, logMax), this.max), new ArrayInt64Arbitrary(this.min, this.max, this.min, ArrayInt64_1.substract64(this.min, logMin)));
        }
        else {
            const logGap = ArrayInt64_1.logLike64(ArrayInt64_1.substract64(this.max, this.min));
            const arbCloseToMin = new ArrayInt64Arbitrary(this.min, this.max, this.min, ArrayInt64_1.add64(this.min, logGap));
            const arbCloseToMax = new ArrayInt64Arbitrary(this.min, this.max, ArrayInt64_1.substract64(this.max, logGap), this.max);
            this.biasedArrayInt64Arbitrary = minStrictlySmallerZero
                ? new BiasNumeric_1.BiasedNumericArbitrary(arbCloseToMax, arbCloseToMin)
                : new BiasNumeric_1.BiasedNumericArbitrary(arbCloseToMin, arbCloseToMax);
        }
        return this.biasedArrayInt64Arbitrary;
    }
    withBias(freq) {
        return BiasedArbitraryWrapper_1.biasWrapper(freq, this, (originalArbitrary) => originalArbitrary.pureBiasedArbitrary());
    }
}
function arrayInt64(min, max) {
    return new ArrayInt64Arbitrary(min, max, min, max);
}
exports.arrayInt64 = arrayInt64;
