var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { array } from './ArrayArbitrary.js';
import { double, float } from './FloatingPointArbitrary.js';
import { integer } from './IntegerArbitrary.js';
function typedIntArrayBuilder(constraints, defaultMin, defaultMax, TypedArrayClass, arbitraryBuilder) {
    const generatorName = TypedArrayClass.name;
    const { min = defaultMin, max = defaultMax } = constraints, arrayConstraints = __rest(constraints, ["min", "max"]);
    if (min > max) {
        throw new Error(`Invalid range passed to ${generatorName}: min must be lower than or equal to max`);
    }
    if (min < defaultMin) {
        throw new Error(`Invalid min value passed to ${generatorName}: min must be greater than or equal to ${defaultMin}`);
    }
    if (max > defaultMax) {
        throw new Error(`Invalid max value passed to ${generatorName}: max must be lower than or equal to ${defaultMax}`);
    }
    return array(arbitraryBuilder({ min, max }), arrayConstraints).map((data) => TypedArrayClass.from(data));
}
export function int8Array(constraints = {}) {
    return typedIntArrayBuilder(constraints, -128, 127, Int8Array, integer);
}
export function uint8Array(constraints = {}) {
    return typedIntArrayBuilder(constraints, 0, 255, Uint8Array, integer);
}
export function uint8ClampedArray(constraints = {}) {
    return typedIntArrayBuilder(constraints, 0, 255, Uint8ClampedArray, integer);
}
export function int16Array(constraints = {}) {
    return typedIntArrayBuilder(constraints, -32768, 32767, Int16Array, integer);
}
export function uint16Array(constraints = {}) {
    return typedIntArrayBuilder(constraints, 0, 65535, Uint16Array, integer);
}
export function int32Array(constraints = {}) {
    return typedIntArrayBuilder(constraints, -0x80000000, 0x7fffffff, Int32Array, integer);
}
export function uint32Array(constraints = {}) {
    return typedIntArrayBuilder(constraints, 0, 0xffffffff, Uint32Array, integer);
}
export function float32Array(constraints = {}) {
    return array(float(Object.assign(Object.assign({}, constraints), { next: true })), constraints).map((data) => Float32Array.from(data));
}
export function float64Array(constraints = {}) {
    return array(double(Object.assign(Object.assign({}, constraints), { next: true })), constraints).map((data) => Float64Array.from(data));
}
