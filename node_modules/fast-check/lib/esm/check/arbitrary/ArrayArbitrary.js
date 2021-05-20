import { Stream } from '../../stream/Stream.js';
import { cloneMethod } from '../symbols.js';
import { Arbitrary } from './definition/Arbitrary.js';
import { biasWrapper } from './definition/BiasedArbitraryWrapper.js';
import { Shrinkable } from './definition/Shrinkable.js';
import { integer } from './IntegerArbitrary.js';
import { makeLazy } from '../../stream/LazyIterableIterator.js';
import { buildCompareFilter } from './helpers/BuildCompareFilter.js';
export class ArrayArbitrary extends Arbitrary {
    constructor(arb, minLength, maxLength, isEqual) {
        super();
        this.arb = arb;
        this.minLength = minLength;
        this.maxLength = maxLength;
        this.isEqual = isEqual;
        this.lengthArb = integer(minLength, maxLength);
        this.preFilter = this.isEqual !== undefined ? buildCompareFilter(this.isEqual) : (tab) => tab;
    }
    static makeItCloneable(vs, shrinkables) {
        vs[cloneMethod] = () => {
            const cloned = [];
            for (let idx = 0; idx !== shrinkables.length; ++idx) {
                cloned.push(shrinkables[idx].value);
            }
            this.makeItCloneable(cloned, shrinkables);
            return cloned;
        };
        return vs;
    }
    canAppendItem(items, newItem) {
        if (this.isEqual === undefined) {
            return true;
        }
        for (let idx = 0; idx !== items.length; ++idx) {
            if (this.isEqual(items[idx].value_, newItem.value_)) {
                return false;
            }
        }
        return true;
    }
    wrapper(itemsRaw, shrunkOnce, itemsRawLengthContext) {
        const items = shrunkOnce ? this.preFilter(itemsRaw) : itemsRaw;
        let cloneable = false;
        const vs = [];
        for (let idx = 0; idx !== items.length; ++idx) {
            const s = items[idx];
            cloneable = cloneable || s.hasToBeCloned;
            vs.push(s.value);
        }
        if (cloneable) {
            ArrayArbitrary.makeItCloneable(vs, items);
        }
        const itemsLengthContext = itemsRaw.length === items.length && itemsRawLengthContext !== undefined
            ? itemsRawLengthContext
            : shrunkOnce
                ? this.lengthArb.shrunkOnceContext()
                : undefined;
        return new Shrinkable(vs, () => this.shrinkImpl(items, itemsLengthContext).map((contextualValue) => this.wrapper(contextualValue[0], true, contextualValue[1])));
    }
    generate(mrng) {
        const targetSizeShrinkable = this.lengthArb.generate(mrng);
        const targetSize = targetSizeShrinkable.value;
        let numSkippedInRow = 0;
        const items = [];
        while (items.length < targetSize && numSkippedInRow < this.maxLength) {
            const current = this.arb.generate(mrng);
            if (this.canAppendItem(items, current)) {
                numSkippedInRow = 0;
                items.push(current);
            }
            else {
                numSkippedInRow += 1;
            }
        }
        return this.wrapper(items, false, undefined);
    }
    shrinkImpl(items, itemsLengthContext) {
        if (items.length === 0) {
            return Stream.nil();
        }
        return (this.lengthArb
            .contextualShrink(items.length, itemsLengthContext)
            .map((contextualValue) => {
            return [
                items.slice(items.length - contextualValue[0]),
                contextualValue[1],
            ];
        })
            .join(items[0].shrink().map((v) => [[v].concat(items.slice(1)), undefined]))
            .join(items.length > this.minLength
            ? makeLazy(() => this.shrinkImpl(items.slice(1), undefined)
                .filter((contextualValue) => this.minLength <= contextualValue[0].length + 1)
                .map((contextualValue) => [[items[0]].concat(contextualValue[0]), undefined]))
            : Stream.nil()));
    }
    withBias(freq) {
        return biasWrapper(freq, this, (originalArbitrary) => {
            const lowBiased = new ArrayArbitrary(originalArbitrary.arb.withBias(freq), originalArbitrary.minLength, originalArbitrary.maxLength, originalArbitrary.isEqual);
            const highBiasedArbBuilder = () => {
                return originalArbitrary.minLength !== originalArbitrary.maxLength
                    ? new ArrayArbitrary(originalArbitrary.arb.withBias(freq), originalArbitrary.minLength, originalArbitrary.minLength +
                        Math.floor(Math.log(originalArbitrary.maxLength - originalArbitrary.minLength) / Math.log(2)), originalArbitrary.isEqual)
                    : new ArrayArbitrary(originalArbitrary.arb.withBias(freq), originalArbitrary.minLength, originalArbitrary.maxLength, originalArbitrary.isEqual);
            };
            return biasWrapper(freq, lowBiased, highBiasedArbBuilder);
        });
    }
}
export function maxLengthFromMinLength(minLength) {
    return 2 * minLength + 10;
}
function array(arb, ...args) {
    if (args[0] === undefined)
        return new ArrayArbitrary(arb, 0, maxLengthFromMinLength(0));
    if (typeof args[0] === 'object') {
        const minLength = args[0].minLength || 0;
        const specifiedMaxLength = args[0].maxLength;
        const maxLength = specifiedMaxLength !== undefined ? specifiedMaxLength : maxLengthFromMinLength(minLength);
        return new ArrayArbitrary(arb, minLength, maxLength);
    }
    if (args[1] !== undefined)
        return new ArrayArbitrary(arb, args[0], args[1]);
    return new ArrayArbitrary(arb, 0, args[0]);
}
export { array };
