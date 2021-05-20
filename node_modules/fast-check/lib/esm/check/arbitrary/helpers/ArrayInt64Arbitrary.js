import { stream, Stream } from '../../../stream/Stream.js';
import { ArbitraryWithContextualShrink } from '../definition/ArbitraryWithContextualShrink.js';
import { biasWrapper } from '../definition/BiasedArbitraryWrapper.js';
import { Shrinkable } from '../definition/Shrinkable.js';
import { add64, halve64, isEqual64, isStrictlyNegative64, isStrictlyPositive64, isZero64, logLike64, substract64, Unit64, Zero64, } from './ArrayInt64.js';
import { BiasedNumericArbitrary } from './BiasNumeric.js';
class ArrayInt64Arbitrary extends ArbitraryWithContextualShrink {
    constructor(min, max, genMin, genMax) {
        super();
        this.min = min;
        this.max = max;
        this.genMin = genMin;
        this.genMax = genMax;
        this.biasedArrayInt64Arbitrary = null;
    }
    wrapper(value, context) {
        return new Shrinkable(value, () => this.contextualShrink(value, context).map(([v, nextContext]) => this.wrapper(v, nextContext)));
    }
    generate(mrng) {
        const uncheckedValue = mrng.nextArrayInt(this.genMin, this.genMax);
        if (uncheckedValue.data.length === 1) {
            uncheckedValue.data.unshift(0);
        }
        return this.wrapper(uncheckedValue, undefined);
    }
    shrinkArrayInt64(value, target, tryTargetAsap) {
        const realGap = substract64(value, target);
        function* shrinkGen() {
            let previous = tryTargetAsap ? undefined : target;
            const gap = tryTargetAsap ? realGap : halve64(realGap);
            for (let toremove = gap; !isZero64(toremove); toremove = halve64(toremove)) {
                const next = substract64(value, toremove);
                yield [next, previous];
                previous = next;
            }
        }
        return stream(shrinkGen());
    }
    contextualShrink(current, context) {
        if (!ArrayInt64Arbitrary.isValidContext(current, context)) {
            const target = this.defaultTarget();
            return this.shrinkArrayInt64(current, target, true);
        }
        if (this.isLastChanceTry(current, context)) {
            return Stream.of([context, undefined]);
        }
        return this.shrinkArrayInt64(current, context, false);
    }
    shrunkOnceContext() {
        return this.defaultTarget();
    }
    defaultTarget() {
        if (!isStrictlyPositive64(this.min) && !isStrictlyNegative64(this.max)) {
            return Zero64;
        }
        return isStrictlyNegative64(this.min) ? this.max : this.min;
    }
    isLastChanceTry(current, context) {
        if (isZero64(current)) {
            return false;
        }
        if (current.sign === 1) {
            return isEqual64(current, add64(context, Unit64)) && isStrictlyPositive64(substract64(current, this.min));
        }
        else {
            return isEqual64(current, substract64(context, Unit64)) && isStrictlyNegative64(substract64(current, this.max));
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
        if (isEqual64(this.min, this.max)) {
            this.biasedArrayInt64Arbitrary = this;
            return this;
        }
        const minStrictlySmallerZero = isStrictlyNegative64(this.min);
        const maxStrictlyGreaterZero = isStrictlyPositive64(this.max);
        if (minStrictlySmallerZero && maxStrictlyGreaterZero) {
            const logMin = logLike64(this.min);
            const logMax = logLike64(this.max);
            this.biasedArrayInt64Arbitrary = new BiasedNumericArbitrary(new ArrayInt64Arbitrary(this.min, this.max, logMin, logMax), new ArrayInt64Arbitrary(this.min, this.max, substract64(this.max, logMax), this.max), new ArrayInt64Arbitrary(this.min, this.max, this.min, substract64(this.min, logMin)));
        }
        else {
            const logGap = logLike64(substract64(this.max, this.min));
            const arbCloseToMin = new ArrayInt64Arbitrary(this.min, this.max, this.min, add64(this.min, logGap));
            const arbCloseToMax = new ArrayInt64Arbitrary(this.min, this.max, substract64(this.max, logGap), this.max);
            this.biasedArrayInt64Arbitrary = minStrictlySmallerZero
                ? new BiasedNumericArbitrary(arbCloseToMax, arbCloseToMin)
                : new BiasedNumericArbitrary(arbCloseToMin, arbCloseToMax);
        }
        return this.biasedArrayInt64Arbitrary;
    }
    withBias(freq) {
        return biasWrapper(freq, this, (originalArbitrary) => originalArbitrary.pureBiasedArbitrary());
    }
}
export function arrayInt64(min, max) {
    return new ArrayInt64Arbitrary(min, max, min, max);
}
