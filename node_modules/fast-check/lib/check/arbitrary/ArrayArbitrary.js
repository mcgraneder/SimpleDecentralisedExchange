"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.array = exports.maxLengthFromMinLength = exports.ArrayArbitrary = void 0;
const Stream_1 = require("../../stream/Stream");
const symbols_1 = require("../symbols");
const Arbitrary_1 = require("./definition/Arbitrary");
const BiasedArbitraryWrapper_1 = require("./definition/BiasedArbitraryWrapper");
const Shrinkable_1 = require("./definition/Shrinkable");
const IntegerArbitrary_1 = require("./IntegerArbitrary");
const LazyIterableIterator_1 = require("../../stream/LazyIterableIterator");
const BuildCompareFilter_1 = require("./helpers/BuildCompareFilter");
class ArrayArbitrary extends Arbitrary_1.Arbitrary {
    constructor(arb, minLength, maxLength, isEqual) {
        super();
        this.arb = arb;
        this.minLength = minLength;
        this.maxLength = maxLength;
        this.isEqual = isEqual;
        this.lengthArb = IntegerArbitrary_1.integer(minLength, maxLength);
        this.preFilter = this.isEqual !== undefined ? BuildCompareFilter_1.buildCompareFilter(this.isEqual) : (tab) => tab;
    }
    static makeItCloneable(vs, shrinkables) {
        vs[symbols_1.cloneMethod] = () => {
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
        return new Shrinkable_1.Shrinkable(vs, () => this.shrinkImpl(items, itemsLengthContext).map((contextualValue) => this.wrapper(contextualValue[0], true, contextualValue[1])));
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
            return Stream_1.Stream.nil();
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
            ? LazyIterableIterator_1.makeLazy(() => this.shrinkImpl(items.slice(1), undefined)
                .filter((contextualValue) => this.minLength <= contextualValue[0].length + 1)
                .map((contextualValue) => [[items[0]].concat(contextualValue[0]), undefined]))
            : Stream_1.Stream.nil()));
    }
    withBias(freq) {
        return BiasedArbitraryWrapper_1.biasWrapper(freq, this, (originalArbitrary) => {
            const lowBiased = new ArrayArbitrary(originalArbitrary.arb.withBias(freq), originalArbitrary.minLength, originalArbitrary.maxLength, originalArbitrary.isEqual);
            const highBiasedArbBuilder = () => {
                return originalArbitrary.minLength !== originalArbitrary.maxLength
                    ? new ArrayArbitrary(originalArbitrary.arb.withBias(freq), originalArbitrary.minLength, originalArbitrary.minLength +
                        Math.floor(Math.log(originalArbitrary.maxLength - originalArbitrary.minLength) / Math.log(2)), originalArbitrary.isEqual)
                    : new ArrayArbitrary(originalArbitrary.arb.withBias(freq), originalArbitrary.minLength, originalArbitrary.maxLength, originalArbitrary.isEqual);
            };
            return BiasedArbitraryWrapper_1.biasWrapper(freq, lowBiased, highBiasedArbBuilder);
        });
    }
}
exports.ArrayArbitrary = ArrayArbitrary;
function maxLengthFromMinLength(minLength) {
    return 2 * minLength + 10;
}
exports.maxLengthFromMinLength = maxLengthFromMinLength;
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
exports.array = array;
