import { stringify } from '../../utils/stringify.js';
import { array } from './ArrayArbitrary.js';
import { boolean } from './BooleanArbitrary.js';
import { constant } from './ConstantArbitrary.js';
import { dictionary, toObject } from './DictionaryArbitrary.js';
import { double } from './FloatingPointArbitrary.js';
import { frequency } from './FrequencyArbitrary.js';
import { maxSafeInteger } from './IntegerArbitrary.js';
import { memo } from './MemoArbitrary.js';
import { oneof } from './OneOfArbitrary.js';
import { set } from './SetArbitrary.js';
import { string, unicodeString } from './StringArbitrary.js';
import { tuple } from './TupleArbitrary.js';
import { bigInt } from './BigIntArbitrary.js';
import { date } from './DateArbitrary.js';
import { float32Array, float64Array, int16Array, int32Array, int8Array, uint16Array, uint32Array, uint8Array, uint8ClampedArray, } from './TypedArrayArbitrary.js';
import { sparseArray } from './SparseArrayArbitrary.js';
export function boxArbitrary(arb) {
    return arb.map((v) => {
        switch (typeof v) {
            case 'boolean':
                return new Boolean(v);
            case 'number':
                return new Number(v);
            case 'string':
                return new String(v);
            default:
                return v;
        }
    });
}
class QualifiedObjectConstraints {
    constructor(key, values, maxDepth, maxKeys, withSet, withMap, withObjectString, withNullPrototype, withBigInt, withDate, withTypedArray, withSparseArray) {
        this.key = key;
        this.values = values;
        this.maxDepth = maxDepth;
        this.maxKeys = maxKeys;
        this.withSet = withSet;
        this.withMap = withMap;
        this.withObjectString = withObjectString;
        this.withNullPrototype = withNullPrototype;
        this.withBigInt = withBigInt;
        this.withDate = withDate;
        this.withTypedArray = withTypedArray;
        this.withSparseArray = withSparseArray;
    }
    static defaultValues() {
        return [
            boolean(),
            maxSafeInteger(),
            double({ next: true }),
            string(),
            oneof(string(), constant(null), constant(undefined)),
        ];
    }
    static boxArbitraries(arbs) {
        return arbs.map((arb) => boxArbitrary(arb));
    }
    static boxArbitrariesIfNeeded(arbs, boxEnabled) {
        return boxEnabled ? QualifiedObjectConstraints.boxArbitraries(arbs).concat(arbs) : arbs;
    }
    static from(settings = {}) {
        function orDefault(optionalValue, defaultValue) {
            return optionalValue !== undefined ? optionalValue : defaultValue;
        }
        return new QualifiedObjectConstraints(orDefault(settings.key, string()), QualifiedObjectConstraints.boxArbitrariesIfNeeded(orDefault(settings.values, QualifiedObjectConstraints.defaultValues()), orDefault(settings.withBoxedValues, false)), orDefault(settings.maxDepth, 2), orDefault(settings.maxKeys, 5), orDefault(settings.withSet, false), orDefault(settings.withMap, false), orDefault(settings.withObjectString, false), orDefault(settings.withNullPrototype, false), orDefault(settings.withBigInt, false), orDefault(settings.withDate, false), orDefault(settings.withTypedArray, false), orDefault(settings.withSparseArray, false));
    }
}
const anythingInternal = (constraints) => {
    const arbKeys = constraints.withObjectString
        ? memo((n) => frequency({ arbitrary: constraints.key, weight: 10 }, { arbitrary: anythingArb(n).map((o) => stringify(o)), weight: 1 }))
        : memo(() => constraints.key);
    const arbitrariesForBase = constraints.values;
    const maxDepth = constraints.maxDepth;
    const maxKeys = constraints.maxKeys;
    const entriesOf = (keyArb, valueArb) => set(tuple(keyArb, valueArb), { maxLength: maxKeys, compare: (t1, t2) => t1[0] === t2[0] });
    const mapOf = (ka, va) => entriesOf(ka, va).map((v) => new Map(v));
    const dictOf = (ka, va) => entriesOf(ka, va).map((v) => toObject(v));
    const baseArb = oneof(...arbitrariesForBase);
    const arrayBaseArb = oneof(...arbitrariesForBase.map((arb) => array(arb, { maxLength: maxKeys })));
    const objectBaseArb = (n) => oneof(...arbitrariesForBase.map((arb) => dictOf(arbKeys(n), arb)));
    const setBaseArb = () => oneof(...arbitrariesForBase.map((arb) => set(arb, 0, maxKeys).map((v) => new Set(v))));
    const mapBaseArb = (n) => oneof(...arbitrariesForBase.map((arb) => mapOf(arbKeys(n), arb)));
    const arrayArb = memo((n) => oneof(arrayBaseArb, array(anythingArb(n), { maxLength: maxKeys })));
    const setArb = memo((n) => oneof(setBaseArb(), set(anythingArb(n), 0, maxKeys).map((v) => new Set(v))));
    const mapArb = memo((n) => oneof(mapBaseArb(n), oneof(mapOf(arbKeys(n), anythingArb(n)), mapOf(anythingArb(n), anythingArb(n)))));
    const objectArb = memo((n) => oneof(objectBaseArb(n), dictOf(arbKeys(n), anythingArb(n))));
    const anythingArb = memo((n) => {
        if (n <= 0)
            return oneof(baseArb);
        return oneof(baseArb, arrayArb(), objectArb(), ...(constraints.withMap ? [mapArb()] : []), ...(constraints.withSet ? [setArb()] : []), ...(constraints.withObjectString ? [anythingArb().map((o) => stringify(o))] : []), ...(constraints.withNullPrototype ? [objectArb().map((o) => Object.assign(Object.create(null), o))] : []), ...(constraints.withBigInt ? [bigInt()] : []), ...(constraints.withDate ? [date()] : []), ...(constraints.withTypedArray
            ? [
                oneof(int8Array(), uint8Array(), uint8ClampedArray(), int16Array(), uint16Array(), int32Array(), uint32Array(), float32Array(), float64Array()),
            ]
            : []), ...(constraints.withSparseArray ? [sparseArray(anythingArb())] : []));
    });
    return anythingArb(maxDepth);
};
const objectInternal = (constraints) => {
    return dictionary(constraints.key, anythingInternal(constraints));
};
function anything(constraints) {
    return anythingInternal(QualifiedObjectConstraints.from(constraints));
}
function object(constraints) {
    return objectInternal(QualifiedObjectConstraints.from(constraints));
}
function jsonSettings(stringArbitrary, constraints) {
    const key = stringArbitrary;
    const values = [
        boolean(),
        maxSafeInteger(),
        double({ next: true, noDefaultInfinity: true, noNaN: true }),
        stringArbitrary,
        constant(null),
    ];
    return constraints != null
        ? typeof constraints === 'number'
            ? { key, values, maxDepth: constraints }
            : { key, values, maxDepth: constraints.maxDepth }
        : { key, values };
}
function jsonObject(constraints) {
    return anything(jsonSettings(string(), constraints));
}
function unicodeJsonObject(constraints) {
    return anything(jsonSettings(unicodeString(), constraints));
}
function json(constraints) {
    const arb = constraints != null ? jsonObject(constraints) : jsonObject();
    return arb.map(JSON.stringify);
}
function unicodeJson(constraints) {
    const arb = constraints != null ? unicodeJsonObject(constraints) : unicodeJsonObject();
    return arb.map(JSON.stringify);
}
export { anything, object, jsonObject, unicodeJsonObject, json, unicodeJson };
