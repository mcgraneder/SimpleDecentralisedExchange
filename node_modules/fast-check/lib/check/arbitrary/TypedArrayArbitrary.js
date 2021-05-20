"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.float64Array = exports.float32Array = exports.uint32Array = exports.int32Array = exports.uint16Array = exports.int16Array = exports.uint8ClampedArray = exports.uint8Array = exports.int8Array = void 0;
const ArrayArbitrary_1 = require("./ArrayArbitrary");
const FloatingPointArbitrary_1 = require("./FloatingPointArbitrary");
const IntegerArbitrary_1 = require("./IntegerArbitrary");
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
    return ArrayArbitrary_1.array(arbitraryBuilder({ min, max }), arrayConstraints).map((data) => TypedArrayClass.from(data));
}
function int8Array(constraints = {}) {
    return typedIntArrayBuilder(constraints, -128, 127, Int8Array, IntegerArbitrary_1.integer);
}
exports.int8Array = int8Array;
function uint8Array(constraints = {}) {
    return typedIntArrayBuilder(constraints, 0, 255, Uint8Array, IntegerArbitrary_1.integer);
}
exports.uint8Array = uint8Array;
function uint8ClampedArray(constraints = {}) {
    return typedIntArrayBuilder(constraints, 0, 255, Uint8ClampedArray, IntegerArbitrary_1.integer);
}
exports.uint8ClampedArray = uint8ClampedArray;
function int16Array(constraints = {}) {
    return typedIntArrayBuilder(constraints, -32768, 32767, Int16Array, IntegerArbitrary_1.integer);
}
exports.int16Array = int16Array;
function uint16Array(constraints = {}) {
    return typedIntArrayBuilder(constraints, 0, 65535, Uint16Array, IntegerArbitrary_1.integer);
}
exports.uint16Array = uint16Array;
function int32Array(constraints = {}) {
    return typedIntArrayBuilder(constraints, -0x80000000, 0x7fffffff, Int32Array, IntegerArbitrary_1.integer);
}
exports.int32Array = int32Array;
function uint32Array(constraints = {}) {
    return typedIntArrayBuilder(constraints, 0, 0xffffffff, Uint32Array, IntegerArbitrary_1.integer);
}
exports.uint32Array = uint32Array;
function float32Array(constraints = {}) {
    return ArrayArbitrary_1.array(FloatingPointArbitrary_1.float(Object.assign(Object.assign({}, constraints), { next: true })), constraints).map((data) => Float32Array.from(data));
}
exports.float32Array = float32Array;
function float64Array(constraints = {}) {
    return ArrayArbitrary_1.array(FloatingPointArbitrary_1.double(Object.assign(Object.assign({}, constraints), { next: true })), constraints).map((data) => Float64Array.from(data));
}
exports.float64Array = float64Array;
